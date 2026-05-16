const API_BASE = '/api';

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: data.error || `Request failed (${res.status})` };
  return { ok: true, data };
}

export async function saveUserCode(userId, problemId, code) {
  return postJSON(`${API_BASE}/saveCode`, { userId, problemId, code });
}

export async function loadUserCode(userId, problemId) {
  return postJSON(`${API_BASE}/loadCode`, { userId, problemId });
}

export async function loadAllUserCodes(userId) {
  return postJSON(`${API_BASE}/loadAllCodes`, { userId });
}

export function getLocalUserCodeKey(userId, problemId) {
  return `userCode_${userId}_${problemId}`;
}

export function saveUserCodeLocal(userId, problemId, code) {
  localStorage.setItem(getLocalUserCodeKey(userId, problemId), code);
}

export function loadUserCodeLocal(userId, problemId) {
  return localStorage.getItem(getLocalUserCodeKey(userId, problemId));
}