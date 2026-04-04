import { useState } from 'react'
import './RightPanel.css'

const questions = [
  {
    id: 1,
    badge: '질문 요청',
    badgeColor: '#f0c430',
    title: 'scanf 사용 시 경고가 뜹니다',
    desc: 'scanf("%s", input); 를 쓰면 "unsafe" 경고가 나오는데, 어떻게 해결하나요?',
    count: 3,
  },
  {
    id: 2,
    badge: '질문 요청',
    badgeColor: '#b0e0ff',
    title: 'strcmp 반환값이 헷갈려요',
    desc: 'strcmp(a, b) == 0 이면 같다는 건데, 왜 0을 반환하나요?',
    count: 2,
  },
]

export default function RightPanel() {
  const [feedback, setFeedback] = useState(null)

  return (
    <div className="right-panel">
      {/* AI 설명 영역 */}
      <div className="explanation">
        <div className="explain-breadcrumb">500 XP</div>
        <p className="explain-text">
          이번 실습에서는{' '}
          <span className="highlight-link">구조체(struct)</span>를 사용해
          사용자 정보를 저장하고,{' '}
          <span className="highlight-yellow">로그인 / 회원가입</span>{' '}
          기능을 C로 직접 구현해 봅니다.
          <code>strcmp</code>로 비밀번호를 비교하는 부분을 완성해 주세요.
        </p>
        <div className="explain-meta">
          <span>◯ 이번 편 사용</span>
          <button className="hint-btn">힌트 보기 · 1XP</button>
        </div>
      </div>

      <div className="divider" />

      {/* 레슨 평가 */}
      <div className="lesson-rating">
        <div className="rating-title">이번 레슨은 어떤가요?</div>
        <div className="rating-btns">
          <button
            className={`rate-btn ${feedback === 'up' ? 'active-up' : ''}`}
            onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
          >
            👍
          </button>
          <button
            className={`rate-btn ${feedback === 'down' ? 'active-down' : ''}`}
            onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
          >
            👎
          </button>
        </div>
      </div>

      <div className="divider" />

      {/* 관련 질문 */}
      <div className="related-section">
        <div className="related-header">
          <span className="related-title">관련 질문</span>
        </div>

        {questions.map((q) => (
          <div key={q.id} className="question-card">
            <div className="question-top">
              <span
                className="question-badge"
                style={{ background: q.badgeColor }}
              >
                {q.badge}
              </span>
              <span className="question-count">답변 {q.count}</span>
            </div>
            <div className="question-title">{q.title}</div>
            <div className="question-desc">{q.desc}</div>
          </div>
        ))}

        <div className="question-actions">
          <button className="more-btn">질문 더 보기</button>
          <button className="ask-btn">✏ 질문하기</button>
        </div>
      </div>

      <div className="divider" />

      {/* AI 설명 하단 */}
      <div className="ai-section">
        <div className="ai-header">
          <span className="ai-badge">✨ AI 설명</span>
        </div>
        <p className="ai-text">설명 준비 중...</p>
      </div>
    </div>
  )
}
