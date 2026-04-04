import './CodeEditor.css'

// C syntax token types:
// kw=keyword, type=type, fn=function, str=string, num=number,
// inc=include, macro=preprocessor, cmt=comment, plain=plain, op=operator, indent=whitespace

const lines = [
  { num: 1,  tokens: [{ t: 'macro', v: '#include' }, { t: 'plain', v: ' ' }, { t: 'str', v: '<stdio.h>' }] },
  { num: 2,  tokens: [{ t: 'macro', v: '#include' }, { t: 'plain', v: ' ' }, { t: 'str', v: '<stdlib.h>' }] },
  { num: 3,  tokens: [{ t: 'macro', v: '#include' }, { t: 'plain', v: ' ' }, { t: 'str', v: '<string.h>' }] },
  { num: 4,  tokens: [] },
  { num: 5,  tokens: [{ t: 'macro', v: '#define' }, { t: 'plain', v: ' ' }, { t: 'fn', v: 'MAX_LEN' }, { t: 'plain', v: ' ' }, { t: 'num', v: '100' }] },
  { num: 6,  tokens: [] },
  { num: 7,  tokens: [{ t: 'cmt', v: '// 사용자 정보 구조체' }] },
  { num: 8,  tokens: [{ t: 'kw', v: 'typedef' }, { t: 'plain', v: ' ' }, { t: 'kw', v: 'struct' }, { t: 'plain', v: ' {' }] },
  { num: 9,  tokens: [{ t: 'plain', v: '    ' }, { t: 'type', v: 'char' }, { t: 'plain', v: ' username[' }, { t: 'fn', v: 'MAX_LEN' }, { t: 'plain', v: '];' }] },
  { num: 10, tokens: [{ t: 'plain', v: '    ' }, { t: 'type', v: 'char' }, { t: 'plain', v: ' password[' }, { t: 'fn', v: 'MAX_LEN' }, { t: 'plain', v: '];' }] },
  { num: 11, tokens: [{ t: 'plain', v: '    ' }, { t: 'type', v: 'int' }, { t: 'plain', v: '  age;' }] },
  { num: 12, tokens: [{ t: 'plain', v: '} ' }, { t: 'type', v: 'User' }, { t: 'plain', v: ';' }] },
  { num: 13, tokens: [] },
  { num: 14, tokens: [{ t: 'cmt', v: '// 로그인 검증 함수' }] },
  { num: 15, tokens: [{ t: 'type', v: 'int' }, { t: 'plain', v: ' ' }, { t: 'fn', v: 'login' }, { t: 'plain', v: '(' }, { t: 'type', v: 'User' }, { t: 'plain', v: ' *user, ' }, { t: 'kw', v: 'const' }, { t: 'plain', v: ' ' }, { t: 'type', v: 'char' }, { t: 'plain', v: ' *pw) {' }] },
  { num: 16, tokens: [{ t: 'plain', v: '    ' }, { t: 'kw', v: 'return' }, { t: 'plain', v: ' ' }, { t: 'fn', v: 'strcmp' }, { t: 'plain', v: '(user->password, pw) ' }, { t: 'op', v: '==' }, { t: 'plain', v: ' ' }, { t: 'num', v: '0' }, { t: 'plain', v: ';' }] },
  { num: 17, tokens: [{ t: 'plain', v: '}' }] },
  { num: 18, tokens: [] },
  { num: 19, tokens: [{ t: 'cmt', v: '// 회원가입 함수' }] },
  { num: 20, tokens: [{ t: 'type', v: 'void' }, { t: 'plain', v: ' ' }, { t: 'fn', v: 'register_user' }, { t: 'plain', v: '(' }, { t: 'type', v: 'User' }, { t: 'plain', v: ' *user) {' }] },
  { num: 21, tokens: [{ t: 'plain', v: '    ' }, { t: 'fn', v: 'printf' }, { t: 'plain', v: '(' }, { t: 'str', v: '"아이디를 입력하세요: "' }, { t: 'plain', v: ');' }] },
  { num: 22, tokens: [{ t: 'plain', v: '    ' }, { t: 'fn', v: 'scanf' }, { t: 'plain', v: '(' }, { t: 'str', v: '"%s"' }, { t: 'plain', v: ', user->username);' }] },
  { num: 23, tokens: [{ t: 'plain', v: '    ' }, { t: 'fn', v: 'printf' }, { t: 'plain', v: '(' }, { t: 'str', v: '"비밀번호를 입력하세요: "' }, { t: 'plain', v: ');' }] },
  { num: 24, tokens: [{ t: 'plain', v: '    ' }, { t: 'fn', v: 'scanf' }, { t: 'plain', v: '(' }, { t: 'str', v: '"%s"' }, { t: 'plain', v: ', user->password);' }] },
  { num: 25, tokens: [{ t: 'plain', v: '    ' }, { t: 'fn', v: 'printf' }, { t: 'plain', v: '(' }, { t: 'str', v: '"나이를 입력하세요: "' }, { t: 'plain', v: ');' }] },
  { num: 26, tokens: [{ t: 'plain', v: '    ' }, { t: 'fn', v: 'scanf' }, { t: 'plain', v: '(' }, { t: 'str', v: '"%d"' }, { t: 'plain', v: ', &user->age);' }] },
  { num: 27, tokens: [{ t: 'plain', v: '}' }] },
  { num: 28, tokens: [] },
  { num: 29, tokens: [{ t: 'type', v: 'int' }, { t: 'plain', v: ' ' }, { t: 'fn', v: 'main' }, { t: 'plain', v: '() {' }] },
  { num: 30, tokens: [{ t: 'plain', v: '    ' }, { t: 'type', v: 'User' }, { t: 'plain', v: ' user;' }] },
  { num: 31, tokens: [{ t: 'plain', v: '    ' }, { t: 'type', v: 'char' }, { t: 'plain', v: ' input[' }, { t: 'fn', v: 'MAX_LEN' }, { t: 'plain', v: '];' }] },
  { num: 32, tokens: [{ t: 'plain', v: '    ' }, { t: 'type', v: 'int' }, { t: 'plain', v: '  choice;' }] },
  { num: 33, tokens: [] },
  { num: 34, tokens: [{ t: 'plain', v: '    ' }, { t: 'fn', v: 'printf' }, { t: 'plain', v: '(' }, { t: 'str', v: '"1. 로그인\\n2. 회원가입\\n선택: "' }, { t: 'plain', v: ');' }] },
  { num: 35, tokens: [{ t: 'plain', v: '    ' }, { t: 'fn', v: 'scanf' }, { t: 'plain', v: '(' }, { t: 'str', v: '"%d"' }, { t: 'plain', v: ', &choice);' }] },
  { num: 36, tokens: [] },
  { num: 37, tokens: [{ t: 'plain', v: '    ' }, { t: 'kw', v: 'if' }, { t: 'plain', v: ' (choice ' }, { t: 'op', v: '==' }, { t: 'plain', v: ' ' }, { t: 'num', v: '1' }, { t: 'plain', v: ') {' }] },
  { num: 38, tokens: [{ t: 'plain', v: '        ' }, { t: 'fn', v: 'printf' }, { t: 'plain', v: '(' }, { t: 'str', v: '"비밀번호: "' }, { t: 'plain', v: ');' }] },
  { num: 39, tokens: [{ t: 'plain', v: '        ' }, { t: 'fn', v: 'scanf' }, { t: 'plain', v: '(' }, { t: 'str', v: '"%s"' }, { t: 'plain', v: ', input);' }] },
  { num: 40, tokens: [{ t: 'plain', v: '        ' }, { t: 'kw', v: 'if' }, { t: 'plain', v: ' (' }, { t: 'fn', v: 'login' }, { t: 'plain', v: '(&user, input)) {' }] },
  { num: 41, tokens: [{ t: 'plain', v: '            ' }, { t: 'fn', v: 'printf' }, { t: 'plain', v: '(' }, { t: 'str', v: '"로그인 성공!\\n"' }, { t: 'plain', v: ');' }] },
  { num: 42, tokens: [{ t: 'plain', v: '        } ' }, { t: 'kw', v: 'else' }, { t: 'plain', v: ' {' }] },
  { num: 43, tokens: [{ t: 'plain', v: '            ' }, { t: 'fn', v: 'printf' }, { t: 'plain', v: '(' }, { t: 'str', v: '"로그인 실패!\\n"' }, { t: 'plain', v: ');' }] },
  { num: 44, tokens: [{ t: 'plain', v: '        }' }] },
  { num: 45, tokens: [{ t: 'plain', v: '    } ' }, { t: 'kw', v: 'else' }, { t: 'plain', v: ' {' }] },
  { num: 46, tokens: [{ t: 'plain', v: '        ' }, { t: 'fn', v: 'register_user' }, { t: 'plain', v: '(&user);' }] },
  { num: 47, tokens: [{ t: 'plain', v: '    }' }] },
  { num: 48, tokens: [{ t: 'plain', v: '    ' }, { t: 'kw', v: 'return' }, { t: 'plain', v: ' ' }, { t: 'num', v: '0' }, { t: 'plain', v: ';' }] },
  { num: 49, tokens: [{ t: 'plain', v: '}' }] },
]

const colorMap = {
  kw:     '#c678dd',
  type:   '#e5c07b',
  fn:     '#61afef',
  str:    '#98c379',
  num:    '#d19a66',
  macro:  '#c678dd',
  cmt:    '#5c6370',
  plain:  '#abb2bf',
  op:     '#56b6c2',
  indent: '#abb2bf',
}

export default function CodeEditor() {
  return (
    <div className="editor-wrap">
      <div className="editor-sidebar">
        {lines.map((l) => (
          <div key={l.num} className="line-num">{l.num}</div>
        ))}
      </div>
      <div className="editor-code">
        {lines.map((l) => (
          <div key={l.num} className="code-line">
            {l.tokens.map((tok, i) => (
              <span key={i} style={{ color: colorMap[tok.t] }}>{tok.v}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
