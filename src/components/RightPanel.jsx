import './RightPanel.css'

export default function RightPanel() {
  return (
    <div className="right-panel">
      <div className="panel-section">
        <div className="section-header">
          <span className="label">STACK FRAMES</span>
        </div>
        <div className="stack-view">
          <div className="frame">
            <div className="frame-name">main()</div>
            <div className="frame-vars">
              <div className="var">
                <span className="var-name">ptr</span>
                <span className="var-val">0x7ff1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-section">
        <div className="section-header">
          <span className="label">HEAP ALLOCATIONS</span>
        </div>
        <div className="heap-view">
          <div className="heap-block active">
            <div className="block-addr">0x7ff1</div>
            <div className="block-info">4 bytes (int)</div>
            <div className="block-val">42</div>
          </div>
        </div>
      </div>

      <div className="panel-section">
        <div className="section-header">
          <span className="label">TERMINAL</span>
        </div>
        <div className="terminal-view">
          <div className="term-line">$ gcc main.c -o main</div>
          <div className="term-line">$ ./main</div>
          <div className="term-line output">Value: 42</div>
          <div className="term-line output">Address: 0x7ff1</div>
          <div className="term-line cursor">_</div>
        </div>
      </div>
    </div>
  )
}
