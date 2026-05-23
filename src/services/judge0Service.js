const JUDGE0_API_URL = 'https://ce.judge0.com';

function safeBtoa(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode('0x' + p1)
  }))
}

function safeAtob(str) {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder('utf-8').decode(bytes);
}

export const LANGUAGE_IDS = {
  c: 48,
  cpp: 52,
  python: 71,
  java: 62,
};

export async function submitCode(sourceCode, languageId, stdin = '', base64Encoded = true) {
  const response = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=${base64Encoded}&wait=true`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language_id: languageId,
      source_code: base64Encoded ? safeBtoa(sourceCode) : sourceCode,
      stdin: base64Encoded ? safeBtoa(stdin) : stdin,
    }),
  });
  const result = await response.json();
  
  if (base64Encoded) {
    return {
      ...result,
      stdout: result.stdout ? safeAtob(result.stdout) : null,
      stderr: result.stderr ? safeAtob(result.stderr) : null,
      compile_output: result.compile_output ? safeAtob(result.compile_output) : null,
      message: result.message ? safeAtob(result.message) : null,
    };
  }
  return result;
}

export async function getSubmission(token) {
  const response = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=true`);
  const result = await response.json();
  return {
    ...result,
    stdout: result.stdout ? safeAtob(result.stdout) : null,
    stderr: result.stderr ? safeAtob(result.stderr) : null,
    compile_output: result.compile_output ? safeAtob(result.compile_output) : null,
    message: result.message ? safeAtob(result.message) : null,
  };
}

function friendlyError(compileOutput) {
  if (!compileOutput) return compileOutput;

  let msg = compileOutput
    .replace(/'/g, '')
    .replace(/'/g, '')
    .replace(/"/g, '')
    .replace(/"/g, '');

  const errorPatterns = [
    { pattern: /error:\s*([^']+)\s+was not declared/i, replacement: '오류: "$1"이라는 변수나 함수가 선언되지 않았습니다.\n💡 확인: 변수 이름 spelling 오류, 함수 호출 전 선언 여부' },
    { pattern: /error:\s*conflicting types for\s+'([^']+)'/i, replacement: '오류: "$1"의 타입이 이전 선언과 충돌합니다.\n💡 확인: 같은 이름으로 다른 타입의 변수를 중복 선언했는지' },
    { pattern: /error:\s*incompatible types when initializing type\s+'([^']+)'/i, replacement: '오류: "$1" 타입으로 초기화할 수 없습니다.\n💡 확인: 변수 타입과 대입하려는 값의 타입이 일치하는지' },
    { pattern: /error:\s*incompatible type for argument\s+(\d+)/i, replacement: '오류: $1번째 인자의 타입이 맞지 않습니다.\n💡 확인: 함수 정의와 호출 시 인자의 타입이 일치하는지' },
    { pattern: /error:\s*implicit declaration of function\s+'([^']+)'/i, replacement: '오류: "$1" 함수를 선언 없이 사용했습니다.\n💡 확인: 함수 사용 전에 프로토타입(선언)을 했는지, 또는 헤더 파일을 include했는지' },
    { pattern: /error:\s*expected\s+'([^']+)'\s+before\s+'([^']+)'/i, replacement: '오류: "$2" 앞에 "$1"이(가) 와야 합니다.\n💡 확인: 세미콜론(;) 누락, 괄호 () or 중괄호 {} 불일치' },
    { pattern: /error:\s*expected\s+([^']+)\s+at end of input/i, replacement: '오류: 입력 끝에 $1이(가) 와야 합니다.\n💡 확인: 중괄호 {} or 괄호 () 가 열려있는 채로 닫히지 않았는지' },
    { pattern: /error:\s*undefined reference to\s+'([^']+)'/i, replacement: '오류: "$1" 함수를 찾을 수 없습니다.\n💡 확인: 함수 정의(구현)를 작성했는지, 라이브러리 링크가 되었는지' },
    { pattern: /error:\s*redefinition of\s+'([^']+)'/i, replacement: '오류: "$1"이(가) 이미 정의되어 있습니다.\n💡 확인: 같은 이름으로 변수를 중복 선언했는지' },
    { pattern: /error:\s*initializer element is not computable at load time/i, replacement: '오류: 초기화 값이 컴파일 시 계산할 수 없습니다.\n💡 확인: 변수 초기화에 변수나 함수를 사용했는지 (C에서는 상수만 가능)' },
    { pattern: /error:\s*initializer element is not constant/i, replacement: '오류: 초기화 값이 상수가 아닙니다.\n💡 확인: 전역/정적 변수 초기화에 변수나 함수 호출을 사용했는지' },
    { pattern: /error:\s*invalid use of flexible array member/i, replacement: '오류: 유연 배열 멤버를 잘못 사용했습니다.\n💡 확인: 구조체 마지막 멤버만 유연 배열일 수 있고, 직접 sizeof로 크기 계산은 불가' },
    { pattern: /error:\s*storage class specified for parameter/i, replacement: '오류: 파라미터에 storage class를 지정할 수 없습니다.\n💡 확인: 함수 파라미터에 static이나 extern을 쓴 것 같습니다' },
    { pattern: /error:\s*function definition allowed only at file scope/i, replacement: '오류: 함수 정의는 파일 전역에서만 가능합니다.\n💡 확인: 함수를 다른 함수 안에서 정의했는지' },
    { pattern: /error:\s*too few arguments to function/i, replacement: '오류: 함수에 전달된 인자가 너무 적습니다.\n💡 확인: 함수 정의의 매개변수 개수와 호출 시 인자 개수가 일치하는지' },
    { pattern: /error:\s*too many arguments to function/i, replacement: '오류: 함수에 전달된 인자가 너무 많습니다.\n💡 확인: 함수 정의의 매개변수 개수와 호출 시 인자 개수가 일치하는지' },
    { pattern: /warning:\s*implicit declaration of function/i, replacement: '경고: 함수를 선언 없이 사용했습니다.\n💡 확인: 함수 사용 전에 프로토타입을 추가하거나, 해당 헤더를 include했는지' },
    { pattern: /warning:\s*incompatible implicit declaration/i, replacement: '경고: 함수 선언이 맞지 않습니다.\n💡 확인: 함수 프로토타입과 실제 정의가 일치하는지' },
    { pattern: /warning:\s*unused variable\s+'([^']+)'/i, replacement: '경고: "$1" 변수가 사용되지 않았습니다.\n💡 확인: 해당 변수값을 실제로 사용했는지' },
    { pattern: /warning:\s*control reaches end of non-void function/i, replacement: '경고: non-void 함수가 값을 반환하지 않고 끝날 수 있습니다.\n💡 확인: 모든 코드 경로에서 return문을 작성했는지' },
    { pattern: /undefined reference to main/i, replacement: '오류: main 함트를 찾을 수 없습니다.\n💡 확인: main 함수를 정의했는지, 이름이 정확한지 (소문자 main)' },
    { pattern: /error:/gi, replacement: '오류:' },
    { pattern: /warning:/gi, replacement: '경고:' },
  ];

  for (const { pattern, replacement } of errorPatterns) {
    msg = msg.replace(pattern, replacement);
  }

  msg = msg.replace(/\^+$/gm, (m) => '↓'.repeat(m.length));

  return msg;
}

function friendlyRuntimeError(stderr) {
  if (!stderr) return stderr;

  let msg = stderr;

  const runtimePatterns = [
    { pattern: /Segmentation fault/i, replacement: '세그멘테이션 폴트 (메모리 오류)\n💡 원인: 잘못된 메모리 접근 (없는 배열 위치, NULL 포인터 역참조 등)\n💡 해결: 배열 범위 확인, 포인터가 NULL인지 검사' },
    { pattern: /stack overflow/i, replacement: '스택 오버플로우\n💡 원인: 너무 큰 배열(지역변수), 무한 재귀 호출\n💡 해결: 큰 배열은 동적 할당(malloc), 재귀는 종료 조건 확인' },
    { pattern: /stack overflow.*recursion/i, replacement: '무한 재귀 호출로 스택 오버플로우\n💡 원인: 재귀 함수의 종료 조건이 없거나 조건이 만족되지 않음\n💡 해결: base case(종료 조건) 확인, 재귀 호출 경로가 항상 종료되는지 검증' },
    { pattern: /floating point exception/i, replacement: '부동소수점 예외\n💡 원인: 0으로 나누기, 잘못된 수학 연산\n💡 해결: 나누기 전에 제수(분모)가 0이 아닌지 확인' },
    { pattern: /abort called/i, replacement: '프로그램 강제 종료\n💡 원인: assert 실패, abort() 함수 호출\n💡 해결: assert 조건문 확인' },
    { pattern: /double free or corruption/i, replacement: '메모리 오류: 이중 해제 or 메모리 손상\n💡 원인: 같은 메모리를 두 번 free(), 해제된 메모리 접근\n💡 해결: malloc과 free 쌍 확인, 해제 후 NULL 대입' },
    { pattern: /invalid next size/i, replacement: '메모리 오류: 잘못된 힙 상태\n💡 원인: 버퍼 오버플로우로 인한 힙 손상\n💡 해결: 배열 범위 초과하지 않았는지 확인' },
    { pattern: /memory leak/i, replacement: '메모리 누수\n💡 원인: malloc으로 할당된 메모리를 free하지 않음\n💡 해결: 모든 malloc에 대응하는 free 있는지 확인' },
    { pattern: /Bus error/i, replacement: '버스 오류\n💡 원인: 잘못된 메모리 주소 접근 ( alignments 문제)\n💡 해결: 포인터 값이 유효한지 확인' },
    { pattern: /Arithmetic exception/i, replacement: '산술 예외\n💡 원인: 0으로 나누기 등 유효하지 않은 수학 연산\n💡 해결: 나누기 전에 제수가 0이 아닌지 확인' },
  ];

  for (const { pattern, replacement } of runtimePatterns) {
    msg = msg.replace(pattern, replacement);
  }

  return msg;
}

export function parseOutput(result) {
  if (result.stdout) {
    return { type: 'success', output: result.stdout };
  }
  if (result.compile_output) {
    return { type: 'compile_error', output: friendlyError(result.compile_output) };
  }
  if (result.stderr) {
    return { type: 'runtime_error', output: friendlyRuntimeError(result.stderr) };
  }
  if (result.message) {
    return { type: 'error', output: result.message };
  }
  if (result.status && result.status.id === 3) {
    return { type: 'success', output: '' };
  }
  if (result.status && result.status.id === 4) {
    return { type: 'runtime_error', output: friendlyRuntimeError(result.status.description) };
  }
  if (result.status && result.status.id === 5) {
    return { type: 'timeout', output: '시간 초과\n💡 원인: 코드가 너무 오래 실행됨 (무한 루프 가능성)\n💡 해결: while/for문의 종료 조건 확인,_print문으로 디버깅' };
  }
  return { type: 'unknown', output: JSON.stringify(result) };
}

export async function runCode(sourceCode, language, stdin = '') {
  const languageId = LANGUAGE_IDS[language] || LANGUAGE_IDS.cpp;
  const result = await submitCode(sourceCode, languageId, stdin);
  return parseOutput(result);
}

export function getLanguageName(languageId) {
  const entry = Object.entries(LANGUAGE_IDS).find(([, id]) => id === languageId);
  return entry ? entry[0] : 'unknown';
}