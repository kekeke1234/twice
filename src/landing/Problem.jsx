import { useLanguage } from '../context/LanguageContext'
import './Problem.css'

function TextOnlyIllust() {
  return (
    <svg viewBox="0 0 160 90" className="prob-svg">
      {/* 책/문서 배경 */}
      <rect x="20" y="10" width="120" height="70" rx="6" fill="#1a1a2e" stroke="#2a2a3e" strokeWidth="1"/>
      {/* 텍스트 줄들 */}
      {[20, 32, 44, 56, 68].map((y, i) => (
        <rect key={i} x="30" y={y} width={60 + (i % 3) * 15} height="5" rx="2"
          fill="#2a2a3e" className="prob-line-anim" style={{ animationDelay: `${i * 0.15}s` }}/>
      ))}
      {/* 빨간 X 표시 */}
      <circle cx="120" cy="45" r="16" fill="rgba(229,83,75,0.15)" stroke="#e5534b" strokeWidth="1.5"/>
      <line x1="113" y1="38" x2="127" y2="52" stroke="#e5534b" strokeWidth="2" strokeLinecap="round"
        className="prob-x1"/>
      <line x1="127" y1="38" x2="113" y2="52" stroke="#e5534b" strokeWidth="2" strokeLinecap="round"
        className="prob-x2"/>
      {/* 눈 아이콘 (보이지 않음) */}
      <ellipse cx="50" cy="75" rx="8" ry="5" fill="none" stroke="#444" strokeWidth="1.2"/>
      <line x1="44" y1="69" x2="56" y2="81" stroke="#444" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
};

function PointerIllust({ t }) {
  return (
    <svg viewBox="0 0 160 90" className="prob-svg">
      {/* 변수 박스 */}
      <rect x="15" y="30" width="40" height="28" rx="4" fill="#1a1a2e" stroke="#56b6c2" strokeWidth="1.5"/>
      <text x="35" y="47" textAnchor="middle" fill="#56b6c2" fontSize="9" fontFamily="monospace">x = 10</text>

      {/* 포인터 박스 */}
      <rect x="70" y="30" width="44" height="28" rx="4" fill="#1a1a2e" stroke="#c678dd" strokeWidth="1.5"/>
      <text x="92" y="47" textAnchor="middle" fill="#c678dd" fontSize="9" fontFamily="monospace">ptr = ?</text>

      {/* 애니메이션 화살표 (흔들림) */}
      <path d="M114,44 Q130,20 145,44 Q130,68 114,44" fill="none"
        stroke="#c678dd" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5"
        className="prob-wiggle"/>

      {/* 물음표 머리 위 */}
      <text x="92" y="22" textAnchor="middle" fill="#e5534b" fontSize="18" className="prob-qmark">?</text>

      {/* 아래 설명 */}
      <text x="80" y="76" textAnchor="middle" fill="#444" fontSize="8" fontFamily="sans-serif">{t('whereDoesPointerPoint')}</text>
    </svg>
  );
};

function SegfaultIllust() {
  return (
    <svg viewBox="0 0 160 90" className="prob-svg">
      {/* 터미널 창 */}
      <rect x="10" y="8" width="140" height="60" rx="6" fill="#0d0d14" stroke="#2a2a3e" strokeWidth="1"/>
      <rect x="10" y="8" width="140" height="16" rx="6" fill="#1e1e2e"/>
      <rect x="10" y="16" width="140" height="8" fill="#1e1e2e"/>
      <circle cx="22" cy="16" r="3.5" fill="#ff5f57"/>
      <circle cx="33" cy="16" r="3.5" fill="#febc2e"/>
      <circle cx="44" cy="16" r="3.5" fill="#28c840"/>

      {/* 에러 텍스트 */}
      <text x="18" y="36" fill="#e5534b" fontSize="7.5" fontFamily="monospace" className="prob-type">Segmentation fault (core dumped)</text>
      <text x="18" y="47" fill="#555" fontSize="7" fontFamily="monospace">Signal: SIGSEGV</text>
      <text x="18" y="57" fill="#555" fontSize="7" fontFamily="monospace">Address: 0x00000000</text>

      {/* 깜빡이는 경고 아이콘 */}
      <text x="130" y="56" fill="#e5c07b" fontSize="18" className="prob-warn-anim">⚠</text>
    </svg>
  );
};

const problems = [
  {
    Illust: TextOnlyIllust,
    titleKey: 'textOnlyProblem',
    descKey: 'textOnlyProblemDesc',
    color: '#e5534b',
  },
  {
    Illust: PointerIllust,
    titleKey: 'pointerProblem',
    descKey: 'pointerProblemDesc',
    color: '#c678dd',
  },
  {
    Illust: SegfaultIllust,
    titleKey: 'segfaultProblem',
    descKey: 'segfaultProblemDesc',
    color: '#f5c518',
  },
];

export default function Problem() {
  const { t } = useLanguage();
  return (
    <section className="problem" id="problem">
      <div className="section-inner">
        <div className="section-label">{t('whyCVisualizer')}</div>
        <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('problemsWithLearningC') }} />
        <p className="section-sub">{t('problemsDesc')}</p>
        <div className="problem-cards">
          {problems.map((p) => (
            <div key={p.titleKey} className="problem-card" style={{ '--pc': p.color }}>
              <div className="problem-illust">
                <p.Illust t={t} />
              </div>
              <h3 className="problem-card-title">{t(p.titleKey)}</h3>
              <p className="problem-card-desc">{t(p.descKey)}</p>
              <div className="problem-card-bar" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
