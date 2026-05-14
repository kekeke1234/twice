import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

function getUsers() {
  try { return JSON.parse(localStorage.getItem('users') || '[]') } catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('currentUser') || 'null') } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const signup = useCallback((email, password, nickname) => {
    const users = getUsers();
    if (users.find(u => u.email === email)) return { ok: false, error: 'Email already registered' };
    if (users.find(u => u.nickname === nickname)) return { ok: false, error: 'Nickname already taken' };
    const newUser = { email, password, nickname, solved: 0, bestTime: '-' };
    users.push(newUser);
    saveUsers(users);
    setUser(newUser);
    return { ok: true };
  }, []);

  const login = useCallback((email, password) => {
    const users = getUsers();
    const found = users.find(u => u.email === email);
    if (!found) return { ok: false, error: 'User not found' };
    if (found.password !== password) return { ok: false, error: 'Wrong password' };
    setUser(found);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
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
