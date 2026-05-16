import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(path.join(__dirname, 'data.db'));
db.exec('PRAGMA journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    nickname TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    solved INTEGER NOT NULL DEFAULT 0,
    best_time TEXT NOT NULL DEFAULT '-',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const app = express();
app.use(cors());
app.use(express.json());

function publicUser(row) {
  return {
    email: row.email,
    nickname: row.nickname,
    solved: row.solved,
    bestTime: row.best_time,
  };
}

app.post('/api/signup', (req, res) => {
  const { email, password, nickname } = req.body || {};
  if (!email || !password || !nickname) {
    return res.status(400).json({ error: 'email, password, nickname are required' });
  }

  const existingEmail = db.prepare('SELECT 1 FROM users WHERE email = ?').get(email);
  if (existingEmail) return res.status(409).json({ error: 'Email already registered' });

  const existingNick = db.prepare('SELECT 1 FROM users WHERE nickname = ?').get(nickname);
  if (existingNick) return res.status(409).json({ error: 'Nickname already taken' });

  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare(
    'INSERT INTO users (email, nickname, password_hash) VALUES (?, ?, ?)'
  ).run(email, nickname, hash);

  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  res.json({ user: publicUser(row) });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!row) return res.status(404).json({ error: 'User not found' });

  if (!bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: 'Wrong password' });
  }

  res.json({ user: publicUser(row) });
});

app.get('/api/users', (req, res) => {
  const rows = db.prepare(
    'SELECT email, nickname, solved, best_time FROM users ORDER BY solved DESC, nickname ASC'
  ).all();
  res.json({ users: rows.map(publicUser) });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`twice server listening on http://localhost:${PORT}`);
});
