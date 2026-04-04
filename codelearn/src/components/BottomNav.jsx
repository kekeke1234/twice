import { useState } from 'react'
import './BottomNav.css'

const lessons = [
  { id: 4, title: '04. 포인터와 메모리 구조' },
  { id: 5, title: '05. C 실습 - 구조체', active: true },
  { id: 6, title: '06. 파일 입출력 기초' },
]

export default function BottomNav() {
  const [current, setCurrent] = useState(5)

  return (
    <nav className="bottom-nav">
      <button
        className="nav-arrow"
        onClick={() => setCurrent((c) => Math.max(c - 1, lessons[0].id))}
        disabled={current === lessons[0].id}
      >
        ←
      </button>
      <div className="nav-lessons">
        {lessons.map((l) => (
          <button
            key={l.id}
            className={`nav-lesson ${current === l.id ? 'active' : ''}`}
            onClick={() => setCurrent(l.id)}
          >
            {l.title}
          </button>
        ))}
      </div>
      <button
        className="nav-arrow"
        onClick={() => setCurrent((c) => Math.min(c + 1, lessons[lessons.length - 1].id))}
        disabled={current === lessons[lessons.length - 1].id}
      >
        →
      </button>
    </nav>
  )
}
