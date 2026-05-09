export function validateCCode(code) {
  const errors = []

  if (!code || code.trim().length === 0) {
    return [{ line: 0, message: 'error: no input file (empty code)' }]
  }

  const lines = code.split('\n')

  if (!/#include\s*<[^>]+>/.test(code)) {
    errors.push({ line: 0, message: "warning: missing #include <stdio.h> or other headers" })
  }

  if (!/int\s+main\s*\(/.test(code)) {
    errors.push({ line: 0, message: 'error: no main() function found' })
    return errors
  }

  let braceCount = 0
  for (let i = 0; i < code.length; i++) {
    if (code[i] === '{') braceCount++
    if (code[i] === '}') braceCount--
  }
  if (braceCount > 0) {
    const errLine = findLine(lines, '{', true)
    errors.push({ line: errLine, message: 'error: expected \'}\' at end of input (unclosed block)' })
    return errors
  }
  if (braceCount < 0) {
    const errLine = findLine(lines, '}', true)
    errors.push({ line: errLine, message: 'error: unexpected \'}\' (extra closing brace)' })
    return errors
  }

  const parenStack = []
  for (let i = 0; i < code.length; i++) {
    if (code[i] === '(') parenStack.push(i)
    if (code[i] === ')') {
      if (parenStack.length === 0) {
        errors.push({ line: lineAt(lines, i), message: 'error: unexpected \')\' (extra closing parenthesis)' })
        return errors
      }
      parenStack.pop()
    }
  }
  if (parenStack.length > 0) {
    const idx = parenStack[parenStack.length - 1]
    errors.push({ line: lineAt(lines, idx), message: 'error: expected \')\' (unclosed parenthesis)' })
    return errors
  }

  const mainBody = extractMainBody(code)
  if (mainBody) {
    const stmts = splitStatements(mainBody, lines)
    for (const stmt of stmts) {
      if (!stmt.text.trim()) continue
      if (isBlockOrControl(stmt.text)) continue
      if (stmt.text.trim().startsWith('//') || stmt.text.trim().startsWith('/*')) continue
      if (isDeclaration(stmt.text)) continue
      if (isStdCall(stmt.text)) continue

      if (!stmt.text.trim().endsWith(';') && !stmt.text.trim().endsWith('}') && !stmt.text.trim().endsWith('{')) {
        errors.push({ line: stmt.line, message: 'error: expected \';\' before \'}\' (missing semicolon)' })
        return errors
      }
    }

    const unknownCalls = findUnknownCalls(mainBody)
    for (const call of unknownCalls) {
      errors.push({ line: call.line, message: `warning: implicit declaration of function '${call.name}'` })
    }
  }

  return errors
}

function findLine(lines, char, last) {
  for (let i = 0; i < lines.length; i++) {
    if (last && lines[i].includes(char)) return i + 1
    if (!last && lines[i].includes(char)) return i + 1
  }
  return 0
}

function lineAt(lines, pos) {
  let count = 0
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length + 1
    if (count > pos) return i + 1
  }
  return lines.length
}

function extractMainBody(code) {
  const match = code.match(/int\s+main\s*\([^)]*\)\s*\{([\s\S]*)\}/)
  return match ? match[1] : ''
}

const STD_FUNCTIONS = ['printf', 'scanf', 'puts', 'gets', 'fopen', 'fclose', 'fgets', 'fprintf', 'fscanf',
  'malloc', 'calloc', 'realloc', 'free', 'sizeof', 'exit', 'return', 'abs', 'rand', 'srand',
  'strlen', 'strcpy', 'strcmp', 'strcat', 'strncpy', 'strncmp', 'memset', 'memcpy',
  'atoi', 'atof', 'sprintf', 'sscanf']

function findUnknownCalls(body) {
  const calls = []
  if (!body) return calls
  const funcCallRegex = /\b([a-zA-Z_]\w*)\s*\(/g
  let match
  while ((match = funcCallRegex.exec(body)) !== null) {
    const name = match[1]
    if (name === 'if' || name === 'while' || name === 'for' || name === 'switch' || name === 'return') continue
    if (STD_FUNCTIONS.includes(name)) continue
    const before = body.substring(0, match.index)
    const lineBreaks = (before.match(/\n/g) || []).length + 1
    if (!calls.find(c => c.name === name)) {
      calls.push({ name, line: lineBreaks + 1 })
    }
  }
  return calls
}

function isBlockOrControl(stmt) {
  const t = stmt.trim()
  return /^(if|else|while|for|do|switch|case|default)\b/.test(t) || t === '{' || t === '}'
}

function isDeclaration(stmt) {
  return /^(int|char|float|double|long|short|unsigned|signed|void|struct|typedef|const|static)\b/.test(stmt.trim())
}

function isStdCall(stmt) {
  return /^(printf|scanf|puts|gets|return|exit)\s*\(/.test(stmt.trim()) || /^\/\//.test(stmt.trim())
}

function splitStatements(body, allLines) {
  const stmts = []
  let depth = 0
  let current = ''
  let startLine = 0
  let lineCount = 0
  for (let i = 0; i < body.length; i++) {
    const ch = body[i]
    if (ch === '\n') lineCount++
    if (ch === '{') { if (depth === 0 && current.trim()) stmts.push({ text: current, line: startLine }); depth++; current = ''; continue }
    if (ch === '}') { depth--; if (current.trim()) stmts.push({ text: current, line: startLine }); if (depth === 0) { current = ''; startLine = lineCount + 1 }; continue }
    if (depth > 0) continue
    if (ch === ';') { stmts.push({ text: current + ';', line: startLine }); current = ''; startLine = lineCount + 1; continue }
    if (current === '' && ch !== ' ' && ch !== '\t') startLine = lineCount + 1
    current += ch
  }
  if (current.trim()) stmts.push({ text: current, line: startLine })
  return stmts
}
