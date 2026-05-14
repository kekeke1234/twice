const C_KEYWORDS = [
  'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
  'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if',
  'int', 'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static',
  'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while'
];

const C_TYPES = ['int', 'char', 'float', 'double', 'void', 'long', 'short', 'unsigned', 'signed'];

export function validateCCode(code) {
  const errors = [];

  if (!code || code.trim().length === 0) {
    return [{ line: 0, message: 'error: empty input file' }];
  }

  const lines = code.split('\n');
  let hasMain = false;

  for (let i = 0; i < lines.length; i++) {
    if (/^\s*int\s+main\s*\(/.test(lines[i])) {
      hasMain = true;
      break;
    }
  }

  if (!hasMain) {
    errors.push({ line: 0, message: 'gcc: fatal error: no main function defined' });
    errors.push({ line: 0, message: 'compilation terminated.' });
    return errors;
  }

  const linesData = lines.map((line, idx) => ({
    number: idx + 1,
    text: line,
    trimmed: line.trim(),
    tokens: tokenizeLine(line)
  }));

  for (const lineData of linesData) {
    checkLineForErrors(lineData, linesData, errors);
  }

  checkGlobalSyntax(code, errors);

  if (errors.length === 0) {
    return [{ line: 0, message: 'Compilation successful. No errors.' }];
  }

  return errors.slice(0, 20);
}

function tokenizeLine(line) {
  const tokens = [];
  let i = 0;
  let current = '';
  let inString = false;
  let inChar = false;

  while (i < line.length) {
    const ch = line[i];
    const nextCh = line[i + 1];

    if (inString) {
      if (ch === '"' && line[i - 1] !== '\\') {
        tokens.push({ type: 'STRING', value: current + ch });
        current = '';
        inString = false;
      } else {
        current += ch;
      }
      i++;
      continue;
    }

    if (inChar) {
      if (ch === "'" && line[i - 1] !== '\\') {
        tokens.push({ type: 'CHAR', value: current + ch });
        current = '';
        inChar = false;
      } else {
        current += ch;
      }
      i++;
      continue;
    }

    if (ch === '"') {
      if (current.trim()) tokens.push({ type: 'CODE', value: current.trim() });
      current = '';
      inString = true;
      i++;
      continue;
    }

    if (ch === "'") {
      if (current.trim()) tokens.push({ type: 'CODE', value: current.trim() });
      current = '';
      inChar = true;
      i++;
      continue;
    }

    if (ch === '/' && nextCh === '/') {
      if (current.trim()) tokens.push({ type: 'CODE', value: current.trim() });
      current = '';
      tokens.push({ type: 'COMMENT', value: line.slice(i) });
      break;
    }

    if (ch === '/' && nextCh === '*') {
      if (current.trim()) tokens.push({ type: 'CODE', value: current.trim() });
      current = '';
      const end = line.indexOf('*/', i + 2);
      const blockComment = end === -1 ? line.slice(i) : line.slice(i, end + 2);
      tokens.push({ type: 'COMMENT', value: blockComment });
      i = end === -1 ? line.length : end + 2;
      continue;
    }

    if (ch === '#') {
      if (current.trim()) tokens.push({ type: 'CODE', value: current.trim() });
      current = '';
      let end = i;
      while (end < line.length && line[end] !== '\n') end++;
      tokens.push({ type: 'PREPROC', value: line.slice(i, end).trim() });
      i = end;
      continue;
    }

    if (/\s/.test(ch)) {
      if (current.trim()) {
        tokens.push({ type: 'CODE', value: current.trim() });
        current = '';
      }
      i++;
      continue;
    }

    if (';{},'.includes(ch)) {
      if (current.trim()) tokens.push({ type: 'CODE', value: current.trim() });
      current = '';
      tokens.push({ type: 'DELIM', value: ch });
      i++;
      continue;
    }

    current += ch;
    i++;
  }

  if (current.trim()) {
    tokens.push({ type: 'CODE', value: current.trim() });
  }

  return tokens;
}

function checkLineForErrors(lineData, allLines, errors) {
  const { number, trimmed, tokens } = lineData;

  if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('#')) {
    return;
  }

  const codeTokens = tokens.filter(t => t.type === 'CODE' || t.type === 'DELIM');

  if (codeTokens.length === 0) return;

  const lastToken = codeTokens[codeTokens.length - 1];

  if (lastToken.type === 'DELIM' && lastToken.value === ';') {
    return;
  }

  if (lastToken.type === 'DELIM' && (lastToken.value === '{' || lastToken.value === '}')) {
    return;
  }

  if (isControlStructure(trimmed)) {
    return;
  }

  const needsSemicolon = statementNeedsSemicolon(trimmed, codeTokens, lastToken);

  if (needsSemicolon) {
    const token = trimmed.split(/\s+/).pop();
    errors.push({
      line: number,
      message: `error: expected ';' after '${token}'`
    });
  }
}

function isControlStructure(text) {
  const trimmed = text.trim();
  return /^(if|else|while|for|do|switch|case|default)\b/.test(trimmed) ||
         trimmed.endsWith('{') || trimmed.endsWith('}');
}

function statementNeedsSemicolon(text, codeTokens, lastToken) {
  const trimmed = text.trim();

  if (!trimmed) return false;

  if (lastToken.type === 'DELIM' && lastToken.value === ';') return false;

  if (lastToken.type === 'DELIM' && (lastToken.value === '{' || lastToken.value === '}')) return false;

  if (trimmed.startsWith('if ') || trimmed.startsWith('while ') ||
      trimmed.startsWith('for ') || trimmed.startsWith('switch ') ||
      trimmed.startsWith('do ') || trimmed.startsWith('else')) {
    return false;
  }

  const statementStarters = [
    'int ', 'char ', 'float ', 'double ', 'void ', 'long ',
    'short ', 'unsigned ', 'signed ', 'struct ', 'typedef ',
    'enum ', 'union ', 'const ', 'static ', 'extern ',
    'return ', 'break ', 'continue ', 'goto '
  ];

  for (const starter of statementStarters) {
    if (trimmed.startsWith(starter)) {
      if (trimmed.endsWith(')') && !trimmed.includes('{')) {
        return false;
      }
      return true;
    }
  }

  if (trimmed.startsWith('printf ') || trimmed.startsWith('scanf ') ||
      trimmed.startsWith('malloc ') || trimmed.startsWith('free ')) {
    return true;
  }

  if (trimmed.includes('=') && !trimmed.includes('==') && !trimmed.includes('!=') &&
      !trimmed.includes('<=') && !trimmed.includes('>=')) {
    const hasFunctionCall = /[a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*\)\s*$/.test(trimmed);
    if (!hasFunctionCall) return true;
  }

  if (trimmed.includes('++') || trimmed.includes('--')) {
    return true;
  }

  return false;
}

function checkGlobalSyntax(code, errors) {
  let braceCount = 0;
  let parenCount = 0;
  let inString = false;
  let inChar = false;
  let inComment = false;
  let inBlockComment = false;

  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    const prev = code[i - 1] || '';

    if (inBlockComment) {
      if (ch === '*' && code[i + 1] === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    if (inComment) {
      if (ch === '\n') inComment = false;
      continue;
    }

    if (inString) {
      if (ch === '"' && prev !== '\\') inString = false;
      continue;
    }

    if (inChar) {
      if (ch === "'" && prev !== '\\') inChar = false;
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === "'") {
      inChar = true;
      continue;
    }

    if (ch === '/' && code[i + 1] === '/') {
      inComment = true;
      continue;
    }

    if (ch === '/' && code[i + 1] === '*') {
      inBlockComment = true;
      continue;
    }

    if (ch === '{') braceCount++;
    if (ch === '}') braceCount--;
    if (ch === '(') parenCount++;
    if (ch === ')') parenCount--;
  }

  if (braceCount > 0) {
    errors.push({ line: 0, message: 'error: expected declaration or statement at end of input' });
  }
  if (braceCount < 0) {
    errors.push({ line: 0, message: 'error: expected \'}\' before end of file' });
  }
  if (parenCount > 0) {
    errors.push({ line: 0, message: 'error: expected \')\' before \';\'' });
  }
  if (parenCount < 0) {
    errors.push({ line: 0, message: 'error: expected \'(\' before \')\'' });
  }
}

export function formatGCCError(error) {
  return error.message;
}

export function getCompilerInfo() {
  return {
    name: 'GCC',
    version: '11.4.0',
    target: 'x86_64-linux-gnu',
    compilerFlags: ['-Wall', '-Wextra', '-std=c11']
  };
}
