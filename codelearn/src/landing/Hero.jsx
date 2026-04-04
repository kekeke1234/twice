import { useState, useEffect } from 'react'
import './Hero.css'

const STEPS = [
  {
    line: 3,
    code: 'int x = 10;',
    memory: [
      { name: 'x', val: '10', addr: '0xff04', color: '#56b6c2', new: true },
    ],
    heap: [],
    note: 'x 변수가 Stack에 생성됩니다',
  },
  {
    line: 4,
    code: 'int *ptr = &x;',
    memory: [
      { name: 'ptr', val: '→ 0xff04', addr: '0xff08', color: '#c678dd', new: true, isPtr: true },
      { name: 'x', val: '10', addr: '0xff04', color: '#56b6c2' },
    ],
    heap: [],
    note: 'ptr이 x의 주소를 가리킵니다',
    arrow: true,
  },
  {
    line: 5,
    code: 'int y = *ptr + 5;',
    memory: [
      { name: 'y', val: '15', addr: '0xff0c', color: '#98c379', new: true },
      { name: 'ptr', val: '→ 0xff04', addr: '0xff08', color: '#c678dd', isPtr: true },
      { name: 'x', val: '10', addr: '0xff04', color: '#56b6c2' },
    ],
    heap: [],
    note: '*ptr을 역참조해 y = 10 + 5 = 15',
    arrow: true,
  },
  {
    line: 6,
    code: 'int *heap = malloc(4);',
    memory: [
      { name: 'heap', val: '→ 0x2010', addr: '0xff10', color: '#e5c07b', new: true, isPtr: true },
      { name: 'y', val: '15', addr: '0xff0c', color: '#98c379' },
      { name: 'ptr', val: '→ 0xff04', addr: '0xff08', color: '#c678dd', isPtr: true },
      { name: 'x', val: '10', addr: '0xff04', color: '#56b6c2' },
    ],
    heap: [{ name: '[4 bytes]', addr: '0x2010', color: '#e5c07b', new: true }],
    note: 'Heap에 4바이트 동적 할당!',
    arrow: true,
  },
]

const codeLines = [
  { ln: 1,  t: 'macro', v: '#include <stdio.h>' },
  { ln: 2,  t: 'macro', v: '#include <stdlib.h>' },
  { ln: 3,  t: 'plain', v: 'int main() {' },
  { ln: 4,  t: 'stmt',  v: '    int x = 10;' },
  { ln: 5,  t: 'stmt',  v: '    int *ptr = &x;' },
  { ln: 6,  t: 'stmt',  v: '    int y = *ptr + 5;' },
  { ln: 7,  t: 'stmt',  v: '    int *heap = malloc(4);' },
  { ln: 8,  t: 'plain', v: '    // ...' },
  { ln: 9,  t: 'plain', v: '    return 0;' },
  { ln: 10, t: 'plain', v: '}' },
]

const lineToStep = { 4: 0, 5: 1, 6: 2, 7: 3 }

export default function Hero({ onStart }) {
  const [step, setStep] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const cur = STEPS[step]

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => {
        const next = (s + 1) % STEPS.length
        setAnimKey((k) => k + 1)
        return next
      })
    }, 2200)
    return () => clearInterval(id)
  }, [])

  const activeLine = step + 4

  return (
    <section className="hero">
      {/* background particles */}
      <div className="hero-particles">
        {[...Array(18)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${5 + i * 5.5}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${4 + (i % 4)}s`,
          }} />
        ))}
      </div>

      <div className="hero-inner">
        {/* ── Left text ── */}
        <div className="hero-text">
          <div className="hero-badge">기획 초안 · 2026.04.04</div>
          <h1 className="hero-title">
            C언어, 이제<br />
            <span className="hero-accent">눈으로</span> 이해하세요
          </h1>
          <p className="hero-sub">
            포인터, 스택, 힙 — 추상적인 C언어 개념을<br />
            코드 한 줄 한 줄 실행하며 시각적으로 확인하세요.
          </p>
          <div className="hero-btns">
            <button className="hero-btn-primary" onClick={onStart}>
              지금 바로 체험하기 →
            </button>
            <button className="hero-btn-secondary">기능 살펴보기</button>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">3</span><span className="stat-label">핵심 기능</span></div>
            <div className="stat-div" />
            <div className="stat"><span className="stat-num">실시간</span><span className="stat-label">메모리 시각화</span></div>
            <div className="stat-div" />
            <div className="stat"><span className="stat-num">한/영</span><span className="stat-label">다국어 지원</span></div>
          </div>
        </div>

        {/* ── Right demo ── */}
        <div className="hero-demo">
          {/* Code editor */}
          <div className="demo-editor">
            <div className="demo-editor-bar">
              <span className="dot red"/><span className="dot yellow"/><span className="dot green"/>
              <span className="demo-filename">main.c</span>
              <span className="demo-running">● 실행 중</span>
            </div>
            <div className="demo-code">
              {codeLines.map((l) => {
                const isActive = l.ln === activeLine
                return (
                  <div key={l.ln} className={`demo-line ${isActive ? 'hl' : ''}`}>
                    <span className="demo-ln">{l.ln}</span>
                    {isActive && <span className="exec-arrow">▶</span>}
                    <span className={`demo-rest ${l.t === 'macro' ? 'kw' : ''}`}>{l.v}</span>
                    {isActive && <span className="cursor-blink">|</span>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Memory panel */}
          <div className="demo-memory">
            <div className="demo-mem-header">
              <span className="demo-mem-title">Live Memory</span>
              <span className="demo-mem-dot" />
            </div>

            {/* Step note */}
            <div className="mem-note" key={`note-${step}`}>{cur.note}</div>

            {/* Stack */}
            <div className="mem-section-lbl">
              <span>Stack</span>
              <span className="mem-section-addr">0xff00</span>
            </div>
            <div className="mem-cells">
              {cur.memory.map((item, i) => (
                <div
                  key={`${item.name}-${step}`}
                  className={`mem-cell ${item.new ? 'mem-cell-new' : ''} ${item.isPtr ? 'mem-cell-ptr' : ''}`}
                  style={{ '--cell-color': item.color, animationDelay: `${i * 0.07}s` }}
                >
                  <span className="mc-name">{item.name}</span>
                  <span className="mc-val">{item.val}</span>
                  <span className="mc-addr">{item.addr}</span>
                  {item.isPtr && <span className="mc-ptr-dot" style={{ background: item.color }} />}
                </div>
              ))}
            </div>

            {/* Pointer arrow */}
            {cur.arrow && (
              <div className="ptr-arrow" key={`arrow-${step}`}>
                <svg viewBox="0 0 140 24" className="arrow-svg">
                  <defs>
                    <marker id="ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="#c678dd"/>
                    </marker>
                  </defs>
                  <path d="M8,12 C40,12 100,12 132,12" stroke="#c678dd" strokeWidth="1.5"
                    fill="none" strokeDasharray="124" strokeDashoffset="124"
                    markerEnd="url(#ah)" className="arrow-path"/>
                  <text x="70" y="9" textAnchor="middle" fill="#c678dd" fontSize="8" fontFamily="monospace">ptr → x</text>
                </svg>
              </div>
            )}

            {/* Heap */}
            <div className="mem-section-lbl heap-lbl">
              <span>Heap</span>
              <span className="mem-section-addr">0x2000</span>
            </div>
            <div className="mem-cells">
              {cur.heap.length === 0
                ? <div className="mem-empty-heap">비어있음</div>
                : cur.heap.map((item, i) => (
                  <div
                    key={`heap-${item.addr}-${step}`}
                    className="mem-cell mem-cell-new mem-cell-heap"
                    style={{ '--cell-color': item.color, animationDelay: `${i * 0.07}s` }}
                  >
                    <span className="mc-name">{item.name}</span>
                    <span className="mc-addr">{item.addr}</span>
                  </div>
                ))
              }
            </div>

            {/* Step indicator */}
            <div className="step-dots">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`step-dot ${i === step ? 'active' : ''}`}
                  onClick={() => { setStep(i); setAnimKey(k => k + 1) }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
