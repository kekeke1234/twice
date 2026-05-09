export function validateCCode(code) {
  const errors = []

  if (!code || code.trim().length === 0) {
    return [{ line: 0, message: 'error: no input file (empty code)' }]
  }

  if (!/int\s+main\s*\(/.test(code)) {
    errors.push({ line: 0, message: 'error: no main() function found' })
    return errors
  }

  if (!/#include\s*<[^>]+>/.test(code)) {
    errors.push({ line: 0, message: "warning: missing #include <stdio.h> or other headers" })
  }

  let lineNum = 1
  const lineToPos = [0]
  for (let i = 0; i < code.length; i++) {
    if (code[i] === '\n') {
      lineNum++
      lineToPos.push(i + 1)
    }
  }

  let braceCount = 0
  let parenCount = 0
  let inString = false
  let inComment = false
  let inBlockComment = false

  for (let i = 0; i < code.length; i++) {
    const ch = code[i]
    const prev = i > 0 ? code[i - 1] : ''

    if (inBlockComment) {
      if (ch === '*' && code[i + 1] === '/') {
        inBlockComment = false
        i++
      }
      continue
    }

    if (inComment) {
      if (ch === '\n') inComment = false
      continue
    }

    if (ch === '"' && prev !== '\\') {
      inString = !inString
      continue
    }

    if (inString) continue

    if (ch === '/' && code[i + 1] === '/') {
      inComment = true
      continue
    }

    if (ch === '/' && code[i + 1] === '*') {
      inBlockComment = true
      continue
    }

    if (ch === '{') braceCount++
    if (ch === '}') braceCount--
    if (ch === '(') parenCount++
    if (ch === ')') parenCount--
  }

  if (braceCount > 0) {
    errors.push({ line: 0, message: 'error: unclosed block' })
    return errors
  }
  if (braceCount < 0) {
    errors.push({ line: 0, message: 'error: unexpected closing brace' })
    return errors
  }
  if (parenCount > 0) {
    errors.push({ line: 0, message: 'error: unclosed parenthesis' })
    return errors
  }
  if (parenCount < 0) {
    errors.push({ line: 0, message: 'error: unexpected closing parenthesis' })
    return errors
  }

  const mainStart = code.indexOf('int main')
  if (mainStart === -1) {
    errors.push({ line: 0, message: 'error: no main() function found' })
    return errors
  }

  const mainBodyStart = code.indexOf('{', mainStart)
  if (mainBodyStart === -1) {
    errors.push({ line: 0, message: 'error: main() body not found' })
    return errors
  }

  let mainStartLine = 1
  for (let i = 0; i <= mainBodyStart; i++) {
    if (code[i] === '\n') mainStartLine++
  }

  const mainBody = code.substring(mainBodyStart + 1)
  const braceEnd = findMatchingBrace(mainBody, 0)
  if (braceEnd === -1) {
    errors.push({ line: mainStartLine, message: 'error: unclosed block in main' })
    return errors
  }

  const actualMainBody = mainBody.substring(0, braceEnd)
  const stmts = splitIntoStatements(actualMainBody, mainStartLine + 1)

  for (const stmt of stmts) {
    const trimmed = stmt.text.trim()
    if (!trimmed) continue

    if (trimmed.startsWith('//')) continue
    if (trimmed.startsWith('/*')) continue

    const lastChar = trimmed[trimmed.length - 1]
    if (lastChar === '{' || lastChar === '}') continue

    if (isBlockStatement(trimmed)) continue

    if (lastChar !== ';' && lastChar !== '{' && lastChar !== '}') {
      errors.push({ line: stmt.line, message: 'error: missing semicolon' })
      return errors
    }
  }

  return errors
}

function findMatchingBrace(str, start) {
  let depth = 1
  let inString = false
  let inComment = false
  let inBlockComment = false

  for (let i = start; i < str.length; i++) {
    const ch = str[i]
    const prev = i > 0 ? str[i - 1] : ''

    if (inBlockComment) {
      if (ch === '*' && str[i + 1] === '/') {
        inBlockComment = false
        i++
      }
      continue
    }

    if (inComment) {
      if (ch === '\n') inComment = false
      continue
    }

    if (ch === '"' && prev !== '\\') {
      inString = !inString
      continue
    }

    if (inString) continue

    if (ch === '/' && str[i + 1] === '/') {
      inComment = true
      continue
    }

    if (ch === '/' && str[i + 1] === '*') {
      inBlockComment = true
      continue
    }

    if (ch === '{') {
      depth++
    }
    if (ch === '}') {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

function splitIntoStatements(body, baseLineNum) {
  const stmts = []
  let current = ''
  let currentLine = baseLineNum
  let stmtStartLine = baseLineNum
  let depth = 0
  let inString = false
  let inComment = false
  let inBlockComment = false
  let i = 0

  while (i < body.length) {
    const ch = body[i]
    const prev = i > 0 ? body[i - 1] : ''

    if (inBlockComment) {
      if (ch === '*' && body[i + 1] === '/') {
        inBlockComment = false
        i += 2
      } else {
        i++
      }
      if (ch === '\n') currentLine++
      continue
    }

    if (inComment) {
      if (ch === '\n') {
        inComment = false
        currentLine++
      }
      i++
      continue
    }

    if (ch === '"' && prev !== '\\') {
      inString = !inString
      current += ch
      i++
      continue
    }

    if (inString) {
      current += ch
      i++
      continue
    }

    if (ch === '/' && body[i + 1] === '/') {
      if (current.trim()) {
        stmts.push({ text: current.trim(), line: stmtStartLine })
        current = ''
      }
      inComment = true
      i += 2
      continue
    }

    if (ch === '/' && body[i + 1] === '*') {
      if (current.trim()) {
        stmts.push({ text: current.trim(), line: stmtStartLine })
        current = ''
      }
      inBlockComment = true
      i += 2
      continue
    }

    if (ch === '\n') {
      currentLine++
      i++
      continue
    }

    if (ch === '{' || ch === '}') {
      if (current.trim()) {
        stmts.push({ text: current.trim(), line: stmtStartLine })
        current = ''
        stmtStartLine = currentLine
      }
      stmts.push({ text: ch, line: currentLine })
      depth += (ch === '{' ? 1 : -1)
      stmtStartLine = currentLine + 1
      i++
      continue
    }

    if (depth === 0 && ch === ';') {
      current += ch
      stmts.push({ text: current.trim(), line: stmtStartLine })
      current = ''
      stmtStartLine = currentLine + 1
      i++
      continue
    }

    if (depth === 0) {
      if (current === '' && (ch === ' ' || ch === '\t')) {
        i++
        continue
      }
      if (current === '') {
        stmtStartLine = currentLine
      }
      current += ch
    }

    i++
  }

  if (current.trim()) {
    stmts.push({ text: current.trim(), line: stmtStartLine })
  }

  return stmts
}

function isBlockStatement(stmt) {
  const t = stmt.trim()
  if (/^(if|else|while|for|do|switch|case|default)\b/.test(t)) return true
  if (/^(int|char|float|double|long|short|unsigned|signed|void|struct|typedef|const|static|enum)\s+/.test(t)) return true
  if (/^(return|break|continue)\b/.test(t)) return true
  return false
}