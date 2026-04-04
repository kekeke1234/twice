import './CTA.css'

export default function CTA({ onStart }) {
  return (
    <section className="cta-section">
      <div className="cta-inner">
        <div className="cta-badge">기획 초안 · 2026.04.04</div>
        <h2 className="cta-title">
          지금 바로<br />
          <span className="text-accent">C언어를 눈으로 확인</span>하세요
        </h2>
        <p className="cta-sub">
          포인터가 어떻게 동작하는지, 메모리가 어떻게 변하는지<br />
          코드 한 줄 한 줄 따라가며 직접 확인해보세요.
        </p>
        <div className="cta-btns">
          <button className="cta-btn-primary" onClick={onStart}>
            무료로 체험 시작하기 →
          </button>
        </div>
        <p className="cta-note">회원가입 없이 바로 사용 가능 · 한국어/영어 지원</p>
      </div>
    </section>
  )
}
