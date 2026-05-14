import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './Hero.css'

const codeLines = [
  { ln: 1, v: 'int main() {' },
  { ln: 2, v: '    int *ptr = malloc(sizeof(int));' },
  { ln: 3, v: '    *ptr = 42;' },
  { ln: 4, v: '    printf("%d\\n", *ptr);' },
  { ln: 5, v: '    free(ptr);' },
  { ln: 6, v: '    return 0;' },
  { ln: 7, v: '}' },
];

export default function Hero({ onStart }) {
  const { t } = useLanguage();
  const [activeLine, setActiveLine] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveLine((l) => (l % 7) + 1);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <div className="hero-overline">{t('heroOverline')}</div>
          <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: t('heroTitle') }} />
          <p className="hero-sub">{t('heroSub')}</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={onStart}>{t('launchWorkspace')}</button>
            <div className="npm-install">
              <code>npm create codelearn@latest</code>
              <button className="copy-btn">❐</button>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card">
            <div className="card-header">
              <div className="dots">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
              <span className="filename">main.c</span>
            </div>
            <div className="card-body">
              {codeLines.map((line) => (
                <div key={line.ln} className={`code-line ${line.ln === activeLine ? 'active' : ''}`}>
                  <span className="line-num">{line.ln}</span>
                  <span className="line-text">{line.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-card-accent">
            <div className="card-header">
              <span className="label">{t('liveHeapMap')}</span>
              <span className="status">● {t('active')}</span>
            </div>
            <div className="heap-viz">
              <div className="heap-node active">
                <div className="node-addr">0x7ff1</div>
                <div className="node-val">42</div>
              </div>
              <div className="heap-connector" />
              <div className="heap-node muted">
                <div className="node-addr">0x7ff8</div>
                <div className="node-val">??</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
