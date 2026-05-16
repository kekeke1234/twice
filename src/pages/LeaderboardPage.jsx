import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../landing/Navbar';
import Footer from '../landing/Footer';
import './LeaderboardPage.css';

export default function LeaderboardPage({ onNavigate }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/users')
      .then(r => r.json())
      .then(data => { if (!cancelled) setUsers(data.users || []) })
      .catch(() => { if (!cancelled) setUsers([]) });
    return () => { cancelled = true };
  }, []);

  const rankings = users
    .map(u => ({ name: u.nickname, solved: u.solved, time: u.bestTime || '-' }))
    .sort((a, b) => b.solved - a.solved)
    .map((entry, i) => ({ rank: i + 1, ...entry }));

  return (
    <div className="leaderboard-page">
      <Navbar
        onStart={() => onNavigate('ide')}
        onLeaderboard={() => onNavigate('leaderboard')}
        onHome={() => onNavigate('landing')}
        onAuth={() => onNavigate('auth')}
      />

      <main className="leaderboard-content">
        <header className="leaderboard-header">
          <div className="overline">{t('competition')}</div>
          <h1 className="leaderboard-title">{t('leaderboardTitle')}</h1>
          <p className="leaderboard-sub">{t('leaderboardSub')}</p>
          {user && <p className="leaderboard-user">{t('loggedInAs')} <strong>{user.nickname}</strong></p>}
        </header>

        {rankings.length === 0 ? (
          <div className="leaderboard-empty">
            <p>{t('noParticipantsYet')}</p>
            <button className="auth-btn" onClick={() => onNavigate('auth')}>{t('signUpToJoin')}</button>
          </div>
        ) : (
          <div className="leaderboard-table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>{t('rank')}</th>
                  <th>{t('name')}</th>
                  <th>{t('solved')}</th>
                  <th>{t('bestTime')}</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((entry) => (
                  <tr key={entry.name} className={entry.rank <= 3 ? `top-${entry.rank}` : ''}>
                    <td className="rank-cell">
                      {entry.rank <= 3 ? (
                        <span className="trophy">{entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}</span>
                      ) : (
                        entry.rank
                      )}
                    </td>
                    <td className="name-cell">{entry.name}</td>
                    <td className="solved-cell">{entry.solved}</td>
                    <td className="time-cell">{entry.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
