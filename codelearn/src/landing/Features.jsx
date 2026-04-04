import { useState, useEffect } from 'react'
import './Features.css'

/* ── Feature 1: Live Memory Visualizer ── */
const MEM_STEPS = [
  { line: 1, label: 'int x = 10;',    stack: [{ n:'x', v:'10',       c:'#56b6c2' }],                                   heap: [] },
  { line: 2, label: 'int *p = &x;',   stack: [{ n:'p', v:'→ x',      c:'#c678dd', ptr:true },{ n:'x', v:'10', c:'#56b6c2' }], heap: [] },
  { line: 3, label: '*p = 42;',       stack: [{ n:'p', v:'→ x',      c:'#c678dd', ptr:true },{ n:'x', v:'42', c:'#56b6c2', changed:true }], heap: [] },
  { line: 4, label: 'malloc(8)',       stack: [{ n:'h', v:'→ heap',   c:'#e5c07b', ptr:true },{ n:'p', v:'→ x', c:'#c678dd', ptr:true },{ n:'x', v:'42', c:'#56b6c2' }], heap: [{ n:'[8B]', c:'#e5c07b' }] },
]

function MemPreview() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % MEM_STEPS.length), 1800)
    return () => clearInterval(t)
  }, [])
  const s = MEM_STEPS[idx]
  return (
    <div className="fp-mem">
      <div className="fp-code-bar">
        {MEM_STEPS.map((step, i) => (
          <div key={i} className={`fp-code-line ${i === idx ? 'fp-active-line' : ''}`}>
            <span className="fp-ln">{i + 1}</span>
            <span>{step.label}</span>
            {i === idx && <span className="fp-exec-dot">●</span>}
          </div>
        ))}
      </div>
      <div className="fp-mem-panel">
        <div className="fp-seg-title">Stack</div>
        <div className="fp-seg-cells">
          {s.stack.map((cell, i) => (
            <div key={`${cell.n}-${idx}`}
              className={`fp-cell ${cell.ptr ? 'fp-ptr' : ''} ${cell.changed ? 'fp-changed' : ''}`}
              style={{ '--cc': cell.c, animationDelay: `${i * 0.06}s` }}>
              <span className="fp-cn">{cell.n}</span>
              <span className="fp-cv">{cell.v}</span>
            </div>
          ))}
        </div>
        <div className="fp-seg-title heap">Heap</div>
        <div className="fp-seg-cells">
          {s.heap.length === 0
            ? <div className="fp-empty">비어있음</div>
            : s.heap.map((cell, i) => (
              <div key={`h-${idx}-${i}`} className="fp-cell fp-heap-cell"
                style={{ '--cc': cell.c, animationDelay: `${i * 0.06}s` }}>
                <span className="fp-cn">{cell.n}</span>
                <span className="fp-cv">malloc</span>
              </div>
            ))
          }
        </div>
        {/* step dots */}
        <div className="fp-dots">
          {MEM_STEPS.map((_, i) => (
            <div key={i} className={`fp-dot ${i === idx ? 'on' : ''}`} onClick={() => setIdx(i)} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Feature 2: Step execution ── */
const EXEC_STEPS = [
  { code: 'int x = 10;',       vars: { x: '10' },                    note: 'x 생성 · 값 10 저장' },
  { code: 'int *ptr = &x;',    vars: { x: '10', ptr: '&x' },         note: 'ptr이 x의 주소를 저장' },
  { code: 'int y = *ptr + 5;', vars: { x: '10', ptr: '&x', y: '15' },note: '*ptr = 10, y = 15' },
  { code: 'printf("%d", y);',  vars: { x: '10', ptr: '&x', y: '15' },note: '"15" 출력됨 ✓' },
]

function StepPreview() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setStep(s => (s + 1) % EXEC_STEPS.length), 1600)
    return () => clearInterval(t)
  }, [playing])
  const cur = EXEC_STEPS[step]
  return (
    <div className="fp-step">
      <div className="fp-step-controls">
        <button className="fp-ctrl" onClick={() => setStep(s => Math.max(0, s - 1))}>◀</button>
        <button className="fp-ctrl play" onClick={() => setPlaying(p => !p)}>
          {playing ? '⏸' : '▶'}
        </button>
        <button className="fp-ctrl" onClick={() => setStep(s => Math.min(EXEC_STEPS.length - 1, s + 1))}>▶</button>
        <span className="fp-step-counter">Step {step + 1} / {EXEC_STEPS.length}</span>
      </div>
      <div className="fp-step-progress">
        <div className="fp-step-bar" style={{ width: `${((step + 1) / EXEC_STEPS.length) * 100}%` }} />
      </div>
      <div className="fp-exec-lines">
        {EXEC_STEPS.map((s, i) => (
          <div key={i} className={`fp-exec-row ${i === step ? 'cur' : ''} ${i < step ? 'done' : ''}`}>
            <span className="fp-ex-num">{i + 1}</span>
            <code className="fp-ex-code">{s.code}</code>
            {i < step && <span className="fp-check">✓</span>}
            {i === step && <span className="fp-ex-note">{s.note}</span>}
          </div>
        ))}
      </div>
      <div className="fp-vars-box">
        <div className="fp-vars-title">변수 상태</div>
        <div className="fp-vars">
          {Object.entries(cur.vars).map(([k, v]) => (
            <div key={`${k}-${step}`} className="fp-var">
              <span className="fp-var-name">{k}</span>
              <span className="fp-var-eq">=</span>
              <span className="fp-var-val">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Feature 3: Human-Readable UI ── */
function HumanPreview() {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setPhase(p => (p + 1) % 3), 2000)
    return () => clearInterval(t)
  }, [])
  const messages = [
    { type: 'error', icon: '💥', title: 'Segmentation Fault', line: '8번째 줄',
      body: 'ptr이 초기화되지 않은 주소를 가리키고 있어요. 포인터는 사용 전 반드시 유효한 주소를 할당해야 합니다.',
      fix: 'int *ptr = &x;' },
    { type: 'warn',  icon: '⚠️', title: 'Memory Leak 감지', line: '12번째 줄',
      body: 'malloc()으로 할당한 메모리를 해제하지 않았어요. 프로그램 종료 전 free()를 호출하세요.',
      fix: 'free(ptr);' },
    { type: 'ok',    icon: '✅', title: '올바른 포인터 사용', line: '5번째 줄',
      body: 'ptr이 유효한 주소 &x를 가리키고 있습니다. 역참조(*ptr)도 안전하게 사용할 수 있어요.',
      fix: null },
  ]
  const m = messages[phase]
  return (
    <div className="fp-human">
      <div className={`fp-err-card ${m.type}`} key={phase}>
        <div className="fp-err-top">
          <span className="fp-err-icon">{m.icon}</span>
          <div>
            <div className="fp-err-title">{m.title}</div>
            <div className="fp-err-line">{m.line}</div>
          </div>
          <div className="fp-err-dot" />
        </div>
        <p className="fp-err-body">{m.body}</p>
        {m.fix && (
          <div className="fp-err-fix">
            <span className="fp-fix-lbl">수정 힌트</span>
            <code>{m.fix}</code>
          </div>
        )}
      </div>
      <div className="fp-phase-dots">
        {messages.map((_, i) => (
          <div key={i} className={`fp-dot ${i === phase ? 'on' : ''}`} onClick={() => setPhase(i)} />
        ))}
      </div>
    </div>
  )
}

/* ── Main Features component ── */
const features = [
  {
    num: '01', title: 'Live Memory Visualizer',
    desc: '코드의 각 줄이 실행될 때 Stack / Heap / Data 세그먼트가 실시간으로 어떻게 변하는지 시각화합니다. 포인터가 가리키는 주소, 변수의 생명주기를 한눈에 확인하세요.',
    tags: ['Stack', 'Heap', 'Data 세그먼트', '포인터 추적'],
    Preview: MemPreview,
  },
  {
    num: '02', title: '단계별 실행 흐름 시각화',
    desc: '코드를 한 줄씩 실행하며 변수 변화와 제어 흐름을 직접 따라갑니다. 재생/일시정지로 원하는 속도에 맞춰 학습하세요.',
    tags: ['Step-by-Step', '변수 추적', '실행 흐름', '재생 제어'],
    Preview: StepPreview,
  },
  {
    num: '03', title: 'Human-Readable UI/UX',
    desc: '에러 메시지를 한국어로 쉽게 설명하고, 수정 힌트까지 제공합니다. Segmentation Fault가 더 이상 무섭지 않아요.',
    tags: ['한/영 지원', '에러 가이드', '수정 힌트', '직관적 UI'],
    Preview: HumanPreview,
  },
]

export default function Features() {
  const [active, setActive] = useState(0)
  const f = features[active]

  return (
    <section className="features" id="features">
      <div className="section-inner">
        <div className="section-label">핵심 기능</div>
        <h2 className="section-title">C언어를 <span className="text-accent">시각화</span>하는 3가지 방법</h2>
        <p className="section-sub">기획서에 담긴 세 가지 핵심 기능으로 추상적인 C언어를 직관적으로 이해합니다.</p>

        <div className="feat-layout">
          <div className="feat-tabs">
            {features.map((feat, i) => (
              <button key={i}
                className={`feat-tab ${active === i ? 'active' : ''}`}
                onClick={() => setActive(i)}>
                <span className="feat-tab-num">{feat.num}</span>
                <div className="feat-tab-info">
                  <span className="feat-tab-tag">핵심 기능</span>
                  <span className="feat-tab-title">{feat.title}</span>
                </div>
                {active === i && <span className="feat-tab-bar" />}
              </button>
            ))}
          </div>

          <div className="feat-detail" key={active}>
            <h3 className="feat-title">{f.title}</h3>
            <p className="feat-desc">{f.desc}</p>
            <div className="feat-tags">
              {f.tags.map(t => <span key={t} className="feat-tag-chip">{t}</span>)}
            </div>
            <div className="feat-preview-wrap">
              <f.Preview />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
