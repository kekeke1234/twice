import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'currentUser';

function readStoredUser() {
  try {
    const persistent = localStorage.getItem(STORAGE_KEY);
    if (persistent) return { user: JSON.parse(persistent), remember: true };
    const session = sessionStorage.getItem(STORAGE_KEY);
    if (session) return { user: JSON.parse(session), remember: false };
  } catch {}
  return { user: null, remember: false };
}

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

export function AuthProvider({ children }) {
  const initial = readStoredUser();
  const [user, setUser] = useState(initial.user);
  const rememberRef = useRef(initial.remember);

  useEffect(() => {
    if (user) {
      const value = JSON.stringify(user);
      if (rememberRef.current) {
        localStorage.setItem(STORAGE_KEY, value);
        sessionStorage.removeItem(STORAGE_KEY);
      } else {
        sessionStorage.setItem(STORAGE_KEY, value);
        localStorage.removeItem(STORAGE_KEY);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const signup = useCallback(async (email, password, nickname) => {
    const result = await postJSON('/api/signup', { email, password, nickname });
    if (!result.ok) return result;
    rememberRef.current = false;
    setUser(result.data.user);
    return { ok: true };
  }, []);

  const login = useCallback(async (email, password, remember = false) => {
    const result = await postJSON('/api/login', { email, password });
    if (!result.ok) return result;
    rememberRef.current = remember;
    setUser(result.data.user);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    rememberRef.current = false;
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
