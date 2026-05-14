import { useLanguage } from '../context/LanguageContext'
import './Target.css'

function SelfLearnerSVG() {
  return (
    <svg viewBox="0 0 120 80" className="target-svg">
      {/* 책 */}
      <rect x="10" y="20" width="36" height="46" rx="3" fill="#1a1a2e" stroke="#56b6c2" strokeWidth="1.2"/>
      <rect x="12" y="22" width="32" height="42" rx="2" fill="#12121e"/>
      {[28,36,44,52,58].map((y,i)=>(
        <rect key={i} x="16" y={y} width={16+(i%2)*6} height="3" rx="1" fill="#2a2a4a"
          className="tgt-line" style={{animationDelay:`${i*0.1}s`}}/>
      ))}
      {/* 전구 아이디어 */}
      <circle cx="80" cy="28" r="14" fill="rgba(245,197,24,0.1)" stroke="#f5c518" strokeWidth="1.2"
        className="tgt-glow"/>
      <text x="80" y="33" textAnchor="middle" fill="#f5c518" fontSize="14">💡</text>
      {/* 연결 화살표 */}
      <path d="M46,43 Q63,30 66,28" fill="none" stroke="#56b6c2" strokeWidth="1"
        strokeDasharray="3 2" className="tgt-arrow"/>
      {/* 체크 뱃지 */}
      <circle cx="94" cy="58" r="10" fill="rgba(86,182,194,0.15)" stroke="#56b6c2" strokeWidth="1"/>
      <text x="94" y="62" textAnchor="middle" fill="#56b6c2" fontSize="10">✓</text>
    </svg>
  );
};

function StudentSVG() {
  return (
    <svg viewBox="0 0 120 80" className="target-svg">
      {/* 칠판 */}
      <rect x="8" y="10" width="72" height="46" rx="4" fill="#1a1a2e" stroke="#7c6af7" strokeWidth="1.2"/>
      {/* 코드 on 칠판 */}
      <text x="15" y="26" fill="#c678dd" fontSize="7" fontFamily="monospace">int x = 10;</text>
      <text x="15" y="36" fill="#98c379" fontSize="7" fontFamily="monospace">int *p = &x;</text>
      <text x="15" y="46" fill="#abb2bf" fontSize="7" fontFamily="monospace">*p = 42;</text>
      {/* 하이라이트 줄 */}
      <rect x="13" y="30" width="62" height="9" rx="2" fill="rgba(124,106,247,0.15)"
        className="tgt-scan"/>
      {/* 학생 아이콘 */}
      <circle cx="100" cy="28" r="10" fill="#252535" stroke="#7c6af7" strokeWidth="1"/>
      <text x="100" y="32" textAnchor="middle" fill="#7c6af7" fontSize="12">🎓</text>
      {/* 물음표 → 느낌표 전환 */}
      <text x="100" y="55" textAnchor="middle" fill="#f5c518" fontSize="13"
        className="tgt-qa">!</text>
      {/* 칠판 다리 */}
      <line x1="30" y1="56" x2="25" y2="66" stroke="#2a2a3e" strokeWidth="1.5"/>
      <line x1="50" y1="56" x2="55" y2="66" stroke="#2a2a3e" strokeWidth="1.5"/>
    </svg>
  );
};

function ReviewerSVG() {
  return (
    <svg viewBox="0 0 120 80" className="target-svg">
      {/* 순환 화살표 */}
      <path d="M30,40 A22,22 0 1 1 52,18" fill="none" stroke="#c678dd" strokeWidth="2"
        strokeLinecap="round" className="tgt-spin"/>
      <polygon points="52,10 60,20 44,20" fill="#c678dd" className="tgt-spin"/>
      {/* 중앙 뇌/코드 */}
      <text x="38" y="46" textAnchor="middle" fill="#c678dd" fontSize="18">🧠</text>
      {/* 메모리 블록들 오른쪽 */}
      {[0,1,2].map(i=>(
        <rect key={i} x="72" y={15+i*18} width="38" height="12" rx="3"
          fill="#1a1a2e" stroke="#2a2a3e" strokeWidth="1"
          className="tgt-mem-row" style={{animationDelay:`${i*0.2}s`}}/>
      ))}
      {['Stack','Heap','Data'].map((lbl,i)=>(
        <text key={i} x="91" y={24+i*18} textAnchor="middle" fill="#555" fontSize="7"
          fontFamily="monospace">{lbl}</text>
      ))}
      {/* 연결선 */}
      <line x1="60" y1="38" x2="72" y2="38" stroke="#c678dd" strokeWidth="1"
        strokeDasharray="3 2" className="tgt-arrow"/>
    </svg>
  );
};

const targets = [
  {
    SVG: SelfLearnerSVG,
    titleKey: 'selfLearnerTitle',
    descKey: 'selfLearnerDesc',
    tags: ['selfLearning', 'conquerPointers', 'buildFoundation'],
    color: '#56b6c2',
  },
  {
    SVG: StudentSVG,
    titleKey: 'studentTitle',
    descKey: 'studentDesc',
    tags: ['classSupplement', 'homeworkHelp', 'examPrep'],
    color: '#7c6af7',
  },
  {
    SVG: ReviewerSVG,
    titleKey: 'reviewerTitle',
    descKey: 'reviewerDesc',
    tags: ['review', 'memoryStructure', 'debuggingSkill'],
    color: '#c678dd',
  },
];

export default function Target() {
  const { t } = useLanguage();
  return (
    <section className="target" id="target">
      <div className="section-inner">
        <div className="section-label">{t('targetAudience')}</div>
        <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('forSelfLearners') }} />
        <p className="section-sub">{t('forAllLearners')}</p>
        <div className="target-cards">
          {targets.map((target) => (
            <div key={target.titleKey} className="target-card" style={{ '--tc': target.color }}>
              <div className="target-illust">
                <target.SVG />
              </div>
              <div className="target-card-body">
                <h3 className="target-card-title">{t(target.titleKey)}</h3>
                <p className="target-card-desc">{t(target.descKey)}</p>
                <div className="target-tags">
                  {target.tags.map((tagKey) => (
                    <span key={tagKey} className="target-tag">{t(tagKey)}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
