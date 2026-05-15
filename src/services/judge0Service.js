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

  return compileOutput
    .replace(/'/g, '')
    .replace(/'/g, '')
    .replace(/"/g, '')
    .replace(/"/g, '')
    .replace(/error:/g, '오류:')
    .replace(/warning:/g, '경고:')
    .replace(/note:/g, '메모:')
    .replace(/In function/g, '함수 안에서')
    .replace(/expected/g, '예상')
    .replace(/before/g, '앞에')
    .replace(/undeclared/g, '선언 안 된')
    .replace(/implicit declaration of function/g, '함수 선언 없이 사용')
    .replace(/incompatible/g, '호환 안 되는')
    .replace(/pointer type/g, '포인터 타입')
    .replace(/types/g, '타입')
    .replace(/undefined reference to/g, '참조 불가')
    .replace(/first use in this function/g, '이 함수에서 첫 사용')
    .replace(/\^+$/gm, (m) => '↓'.repeat(m.length));
}

function friendlyRuntimeError(stderr) {
  if (!stderr) return stderr;
  return stderr
    .replace(/Segmentation fault/g, '세그멘테이션 폴트 (메모리 오류)')
    .replace(/stack overflow/g, '스택 오버플로우 (너무 큰 배열이나 재귀 호출)')
    .replace(/floating point exception/g, '부동소수점 예외 (0으로 나누기 등)')
    .replace(/abort called/g, '프로그램 강제 종료');
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
    return { type: 'timeout', output: '시간 초과: 코드가 너무 오래 걸립니다. 무한 루프를 확인해주세요.' };
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