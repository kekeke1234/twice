import { useAuth } from '../context/AuthContext'
import Navbar from '../landing/Navbar'
import Footer from '../landing/Footer'
import './LeaderboardPage.css'

export default function LeaderboardPage({ onNavigate }) {
  const { user } = useAuth()
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const rankings = users
    .map(u => ({ name: u.nickname, solved: u.solved, time: u.bestTime || '-' }))
    .sort((a, b) => b.solved - a.solved)
    .map((entry, i) => ({ rank: i + 1, ...entry }))

  return (
    <div className="leaderboard-page">
      <Navbar
        onStart={() => onNavigate('ide')}
        onPricing={() => onNavigate('pricing')}
        onLeaderboard={() => onNavigate('leaderboard')}
        onHome={() => onNavigate('landing')}
      />

      <main className="leaderboard-content">
        <header className="leaderboard-header">
          <div className="overline">COMPETITION</div>
          <h1 className="leaderboard-title">Leaderboard</h1>
          <p className="leaderboard-sub">Top performers in C programming challenges.</p>
          {user && <p className="leaderboard-user">Logged in as <strong>{user.nickname}</strong></p>}
        </header>

        {rankings.length === 0 ? (
          <div className="leaderboard-empty">
            <p>No participants yet.</p>
            <button className="auth-btn" onClick={() => onNavigate('auth')}>Sign up to join</button>
          </div>
        ) : (
          <div className="leaderboard-table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Solved</th>
                  <th>Best Time</th>
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
  )
}
