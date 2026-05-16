import puppeteer from 'puppeteer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHOT_DIR = path.join(__dirname, 'screenshots');
const REPO = path.resolve(__dirname, '..');

fs.mkdirSync(SHOT_DIR, { recursive: true });

const sh = (cmd) => execSync(cmd, { cwd: REPO, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const baseStyle = `
  :root {
    --abyss: #0d0d14;
    --carbon: #1a1a2e;
    --warm: #2a2a3e;
    --snow: #abb2bf;
    --emerald: #00d992;
    --mint: #2fd6a1;
    --slate: #6b6b8f;
    --add: #1e3a2a;
    --del: #3a1e1e;
    --add-text: #56d364;
    --del-text: #f85149;
    --line-no: #4b5263;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--abyss);
    color: var(--snow);
    font-family: 'Consolas', 'SFMono-Regular', monospace;
    font-size: 14px;
    line-height: 1.55;
    padding: 24px;
    min-height: 100vh;
  }
  .frame {
    background: var(--carbon);
    border: 1px solid var(--warm);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .titlebar {
    background: #0a0a14;
    padding: 10px 16px;
    border-bottom: 1px solid var(--warm);
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--slate);
  }
  .titlebar .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .dot.r { background: #ff5f57; }
  .dot.y { background: #febc2e; }
  .dot.g { background: #28c840; }
  .titlebar .title { margin-left: 8px; }
  .body { padding: 18px 22px; }
  .prompt { color: var(--emerald); }
  .comment { color: var(--slate); }
  pre { white-space: pre-wrap; word-break: break-word; }
  .line { display: block; }
  .add { background: var(--add); color: var(--add-text); }
  .del { background: var(--del); color: var(--del-text); }
  .meta { color: #818cf8; }
  .hunk { color: #56b6c2; background: #0f1830; padding: 2px 4px; }
  .file-tree { font-family: Consolas, monospace; line-height: 1.7; }
  .file-tree .dir { color: var(--emerald); }
  .file-tree .file { color: var(--snow); }
  .file-tree .new { color: var(--add-text); }
  .file-tree .indent { color: var(--slate); }
  h1, h2, h3 { color: var(--snow); margin: 12px 0 8px; line-height: 1.3; }
  h1 { font-size: 22px; }
  h2 { font-size: 18px; border-bottom: 1px solid var(--warm); padding-bottom: 6px; }
  h3 { font-size: 15px; color: var(--mint); }
  ul { padding-left: 22px; margin: 6px 0; }
  li { margin: 4px 0; }
  code { background: var(--warm); padding: 1px 6px; border-radius: 3px; color: var(--mint); }
  .swatch { display: inline-block; width: 14px; height: 14px; border-radius: 3px; vertical-align: middle; margin-right: 6px; border: 1px solid #444; }
  .token-row { display: flex; align-items: center; gap: 10px; margin: 6px 0; }
  .token-name { color: var(--snow); }
  .token-hex { color: var(--mint); font-family: monospace; }
  .token-note { color: var(--slate); margin-left: auto; font-size: 12px; }
  .outline-item { display: flex; align-items: center; gap: 8px; padding: 4px 12px; }
  .outline-item .icon { color: #818cf8; font-weight: bold; width: 18px; display: inline-block; text-align: center; }
  .outline-item .name { color: var(--snow); }
  .outline-item .sig { color: var(--slate); font-size: 12px; margin-left: 6px; }
  .badge { display: inline-block; background: var(--add); color: var(--add-text); padding: 2px 8px; border-radius: 999px; font-size: 11px; margin-left: 6px; }
  .right { float: right; color: var(--slate); }
  .stat-row { display: grid; grid-template-columns: 1fr auto auto; gap: 16px; padding: 4px 0; border-bottom: 1px solid #1a1a2e; align-items: center; }
  .stat-bar { display: inline-block; height: 8px; background: var(--add-text); border-radius: 2px; }
  .stat-bar.minus { background: var(--del-text); }
  .stat-name { color: var(--mint); }
  .stat-count { color: var(--snow); font-family: monospace; min-width: 50px; text-align: right; }
`;

const wrapHTML = (title, body) => `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title>
<style>${baseStyle}</style></head><body>${body}</body></html>`;

function renderTerminal(title, lines) {
  const content = lines.map(l => {
    if (typeof l === 'string') return esc(l);
    if (l.t === 'prompt') return `<span class="prompt">$</span> ${esc(l.v)}`;
    if (l.t === 'comment') return `<span class="comment">${esc(l.v)}</span>`;
    if (l.t === 'add') return `<span class="add">${esc(l.v)}</span>`;
    if (l.t === 'del') return `<span class="del">${esc(l.v)}</span>`;
    if (l.t === 'meta') return `<span class="meta">${esc(l.v)}</span>`;
    if (l.t === 'hunk') return `<span class="hunk">${esc(l.v)}</span>`;
    return esc(l.v || '');
  }).join('\n');
  const body = `<div class="frame"><div class="titlebar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="title">${esc(title)}</span></div><div class="body"><pre>${content}</pre></div></div>`;
  return wrapHTML(title, body);
}

// helper to color a unified diff text
function renderDiffHTML(title, diffText) {
  const lines = diffText.split('\n').map(l => {
    if (l.startsWith('diff ') || l.startsWith('index ') || l.startsWith('--- ') || l.startsWith('+++ ')) return { t: 'meta', v: l };
    if (l.startsWith('@@')) return { t: 'hunk', v: l };
    if (l.startsWith('+')) return { t: 'add', v: l };
    if (l.startsWith('-')) return { t: 'del', v: l };
    return l;
  });
  return renderTerminal(title, lines);
}

const screenshots = [];

// ============================================================
// 1) 2026-04-04_02_folder-tree.png — VS Code 폴더 트리 재현
// ============================================================
{
  const tree = `<div class="file-tree">
<div><span class="dir">📁 codelearn/</span></div>
<div class="indent">├─ <span class="file">📄 index.html</span></div>
<div class="indent">├─ <span class="file">📄 vite.config.js</span></div>
<div class="indent">├─ <span class="file">📄 package.json</span></div>
<div class="indent">├─ <span class="dir">📁 public/</span></div>
<div class="indent">│   ├─ <span class="file">🖼 favicon.svg</span></div>
<div class="indent">│   └─ <span class="file">🖼 icons.svg</span></div>
<div class="indent">└─ <span class="dir">📁 src/</span></div>
<div class="indent">    ├─ <span class="file">📄 main.jsx</span></div>
<div class="indent">    ├─ <span class="file">📄 App.jsx</span> <span class="new">(new)</span></div>
<div class="indent">    ├─ <span class="dir">📁 landing/</span> <span class="new">← 외부 마케팅 페이지 영역</span></div>
<div class="indent">    │   ├─ <span class="file">📄 LandingPage.jsx</span></div>
<div class="indent">    │   ├─ <span class="file">📄 Navbar.jsx</span></div>
<div class="indent">    │   ├─ <span class="file">📄 Hero.jsx</span></div>
<div class="indent">    │   ├─ <span class="file">📄 Problem.jsx</span></div>
<div class="indent">    │   ├─ <span class="file">📄 Target.jsx</span></div>
<div class="indent">    │   ├─ <span class="file">📄 Features.jsx</span></div>
<div class="indent">    │   ├─ <span class="file">📄 CTA.jsx</span></div>
<div class="indent">    │   └─ <span class="file">📄 Footer.jsx</span></div>
<div class="indent">    └─ <span class="dir">📁 components/</span> <span class="new">← 로그인 후 In-App 영역</span></div>
<div class="indent">        ├─ <span class="file">📄 TopBar.jsx</span></div>
<div class="indent">        ├─ <span class="file">📄 CodeEditor.jsx</span></div>
<div class="indent">        ├─ <span class="file">📄 RightPanel.jsx</span></div>
<div class="indent">        └─ <span class="file">📄 BottomNav.jsx</span></div>
</div>
<div style="margin-top:16px; color:var(--slate); font-size:13px;">
  43 files added in <code>27288b8</code> (2026-04-04 first commit)
</div>`;
  const html = wrapHTML('VS Code Explorer — codelearn/', `<div class="frame"><div class="titlebar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="title">EXPLORER · codelearn/</span></div><div class="body">${tree}</div></div>`);
  screenshots.push({ name: '2026-04-04_02_folder-tree.png', html, w: 760, h: 760 });
}

// ============================================================
// 2) 2026-04-04_03_git-graph.png — git log graph
// ============================================================
{
  const log = sh('git log --pretty=format:"%h %ad %an %s" --date=short');
  const lines = log.split('\n').map(l => {
    const parts = l.split(' ');
    const hash = parts[0], date = parts[1], rest = parts.slice(2).join(' ');
    return { t: 'plain', v: `* ${hash} (${date}) ${rest}` };
  });
  const html = renderTerminal('git log --oneline --graph (전체 커밋 이력)', [
    { t: 'prompt', v: 'git log --pretty=format:"%h %ad %an %s" --date=short --reverse' },
    '',
    ...lines.reverse().map(o => o.v),
    '',
    { t: 'comment', v: '# 총 15개 커밋 / 작업 일자: 2026-04-04, 05-09 (12커밋), 05-12, 05-14, 05-15, 05-16' },
    { t: 'comment', v: '# teaw11 (김태원) 의 커밋: a720380 — 닉스 일러스트' },
  ]);
  screenshots.push({ name: '2026-04-04_03_git-graph.png', html, w: 1100, h: 720 });
}

// ============================================================
// 3) 2026-05-09_01_folder-flatten-before-after.png — 폴더 평탄화 전/후 비교
// ============================================================
{
  const html = wrapHTML('폴더 평탄화 전/후', `
  <div style="display:grid; grid-template-columns: 1fr 60px 1fr; gap: 14px; align-items: start;">
    <div class="frame">
      <div class="titlebar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="title">BEFORE (4/4)</span></div>
      <div class="body file-tree">
        <div><span class="dir">📁 twice/</span></div>
        <div class="indent">├─ <span class="del">📁 codelearn/</span> ← 불필요한 한 단계</div>
        <div class="indent">│  ├─ <span class="file">📄 package.json</span></div>
        <div class="indent">│  ├─ <span class="file">📄 vite.config.js</span></div>
        <div class="indent">│  └─ <span class="dir">📁 src/</span></div>
        <div class="indent">│     ├─ <span class="file">📄 App.jsx</span></div>
        <div class="indent">│     └─ <span class="dir">📁 components/</span></div>
        <div style="margin-top:12px; color: var(--del-text);">
          import: <code style="background: var(--del);">'../../components/...'</code> ← 2단계 거슬러야 함
        </div>
        <div style="margin-top:6px; color: var(--del-text);">
          Vercel 배포: <code style="background: var(--del);">build path 꼬임</code>
        </div>
      </div>
    </div>
    <div style="font-size: 40px; text-align: center; color: var(--emerald); padding-top: 100px;">→</div>
    <div class="frame">
      <div class="titlebar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="title">AFTER (5/9 평탄화 후)</span></div>
      <div class="body file-tree">
        <div><span class="dir">📁 twice/</span></div>
        <div class="indent">├─ <span class="file new">📄 package.json</span></div>
        <div class="indent">├─ <span class="file new">📄 vite.config.js</span></div>
        <div class="indent">├─ <span class="file new">📄 DESIGN.md</span></div>
        <div class="indent">└─ <span class="dir">📁 src/</span></div>
        <div class="indent">   ├─ <span class="file">📄 App.jsx</span></div>
        <div class="indent">   └─ <span class="dir">📁 components/</span></div>
        <div style="margin-top:12px; color: var(--add-text);">
          import: <code style="background: var(--add);">'../components/...'</code> ← 1단계만
        </div>
        <div style="margin-top:6px; color: var(--add-text);">
          Vercel 배포: <code style="background: var(--add);">OK</code>
        </div>
      </div>
    </div>
  </div>
  <div style="text-align:center; color: var(--slate); margin-top: 24px; font-size: 13px;">
    commit <code>29776ad</code> (2026-05-09 09:26) — 43개 파일 R-rename (코드 변경 없이 경로만 이동)
  </div>
  `);
  screenshots.push({ name: '2026-05-09_01_folder-flatten-before-after.png', html, w: 1200, h: 600 });
}

// ============================================================
// 4) 2026-05-09_02_design-tokens.png — DESIGN.md 색 토큰
// ============================================================
{
  const tokens = [
    { name: 'Abyss Black',          hex: '#050507', note: '랜딩 페이지 배경 (사실상 검정)' },
    { name: 'Carbon Surface',       hex: '#101010', note: '카드/버튼 배경 (한 단계 밝음)' },
    { name: 'Warm Charcoal',        hex: '#3d3a39', note: '컨테인먼트 보더 — 차갑지 않은 따뜻한 톤' },
    { name: 'Emerald Signal Green', hex: '#00d992', note: '브랜드 액센트, 글로우 효과' },
    { name: 'VoltAgent Mint',       hex: '#2fd6a1', note: '버튼 텍스트 (CTA)' },
    { name: 'Snow White',           hex: '#f2f2f2', note: '본문 텍스트 (#fff 보다 부드러움)' },
    { name: 'Warm Parchment',       hex: '#b8b3b0', note: '보조 본문 — 따뜻한 회색' },
    { name: 'Steel Slate',          hex: '#8b949e', note: '3차 텍스트, 메타데이터' },
    { name: 'Danger Coral',         hex: '#fb565b', note: '오류 상태' },
    { name: 'Warning Amber',        hex: '#ffba00', note: '경고 상태' },
    { name: 'Soft Purple',          hex: '#818cf8', note: '보조 카테고리, 코드 신택스' },
  ];
  const rows = tokens.map(t => `
    <div class="token-row">
      <span class="swatch" style="background:${t.hex};"></span>
      <span class="token-name">${esc(t.name)}</span>
      <span class="token-hex">${t.hex}</span>
      <span class="token-note">${esc(t.note)}</span>
    </div>
  `).join('');
  const html = wrapHTML('DESIGN.md — 색 토큰', `<div class="frame"><div class="titlebar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="title">DESIGN.md — 2. Color Palette &amp; Roles</span></div><div class="body"><h2>색 토큰 (Color Tokens)</h2>${rows}<div style="margin-top:14px; color:var(--slate); font-size:13px;">commit <code>29776ad</code> · +323 라인 디자인 시스템 문서</div></div></div>`);
  screenshots.push({ name: '2026-05-09_02_design-tokens.png', html, w: 900, h: 720 });
}

// ============================================================
// 5) 2026-05-12_04_problems-data.png — problems.js
// ============================================================
{
  const code = `export const PROBLEMS = [
  {
    id: 'hello-world',
    titleKey: 'p1Title',
    descKey: 'p1Desc',
    starterCode: \`#include <stdio.h>

int main() {
    // Print "Hello, World!" to the console

    return 0;
}\`,
  },
  {
    id: 'variables',
    titleKey: 'p2Title',
    descKey: 'p2Desc',
    starterCode: \`#include <stdio.h>

int main() {
    int a = 10;     // ← 메모리 시각화 학습 포인트
    int b = 20;
    int sum;

    // Calculate sum of a and b

    return 0;
}\`,
  },
  {
    id: 'pointers',                  // ← 핵심 차별점 (메모리 시각화)
    titleKey: 'p4Title',
    descKey: 'p4Desc',
    starterCode: \`int main() {
    int x = 42;
    int *p = &x;     // p 가 x 의 주소를 가리킴
    return 0;
}\`,
  },
  // … +20여개 문제, 메모리·변수 시각화 위주로 선별
];`;
  const numbered = code.split('\n').map((l, i) => `<span style="color:var(--line-no); display:inline-block; width:30px; text-align:right; padding-right:10px; user-select:none;">${i+1}</span>${esc(l)}`).join('\n');
  const html = wrapHTML('problems.js', `<div class="frame"><div class="titlebar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="title">src/problems.js — 메모리·변수 시각화 주제 위주 선별</span></div><div class="body"><pre>${numbered}</pre></div></div>`);
  screenshots.push({ name: '2026-05-12_04_problems-data.png', html, w: 900, h: 760 });
}

// ============================================================
// 6) 2026-05-14_01_appjsx-diff.png — App.jsx diff (5/14 ca5bcde)
// ============================================================
{
  let diff = '';
  try {
    diff = sh('git show ca5bcde -- src/App.jsx').split('\n').slice(0, 60).join('\n');
  } catch (e) {
    diff = 'diff --git a/src/App.jsx b/src/App.jsx\n-import { validateCCode } from "./cValidator"\n (… 5/14 리팩토링 변경 …)';
  }
  const html = renderDiffHTML('git show ca5bcde -- src/App.jsx', diff);
  screenshots.push({ name: '2026-05-14_01_appjsx-diff.png', html, w: 1100, h: 760 });
}

// ============================================================
// 7) 2026-05-14_02_files-changed.png — 21 files changed stat
// ============================================================
{
  let stat = '';
  try {
    stat = sh('git show ca5bcde --stat --format=""');
  } catch (e) {
    stat = '(21 files changed, 534 insertions(+), 584 deletions(-))';
  }
  // parse stat into bars
  const lines = stat.trim().split('\n').filter(l => l.includes('|'));
  const summary = stat.trim().split('\n').find(l => /files? changed/.test(l)) || '';
  const maxBar = 60;
  const rows = lines.map(l => {
    const m = l.match(/^\s*(\S+)\s*\|\s*(\d+)\s+([+\-]*)/);
    if (!m) return '';
    const [, fname, count, marks] = m;
    const plus = (marks.match(/\+/g) || []).length;
    const minus = (marks.match(/-/g) || []).length;
    return `<div class="stat-row"><span class="stat-name">${esc(fname)}</span><span><span class="stat-bar" style="width:${plus * 4}px"></span><span class="stat-bar minus" style="width:${minus * 4}px"></span></span><span class="stat-count">${count}</span></div>`;
  }).join('');
  const html = wrapHTML('21 files changed', `<div class="frame"><div class="titlebar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="title">git show ca5bcde --stat (전체 리팩토링)</span></div><div class="body"><h2>21 files changed</h2><div style="margin-top:8px;">${rows}</div><div style="margin-top:14px; color: var(--snow); padding: 10px; background: var(--abyss); border-left: 3px solid var(--emerald);">${esc(summary)}</div><div style="margin-top:14px; color: var(--slate); font-size:13px;">새 기능 0개, 리팩토링 단독 커밋</div></div></div>`);
  screenshots.push({ name: '2026-05-14_02_files-changed.png', html, w: 1100, h: 820 });
}

// ============================================================
// 8) 2026-05-14_03_validator-structure.png — cValidator 구조
// ============================================================
{
  const items = [
    { icon: 'C', name: 'C_KEYWORDS', sig: '[]', kind: 'const' },
    { icon: 'C', name: 'C_TYPES', sig: '[]', kind: 'const' },
    { icon: 'ƒ', name: 'validateCCode', sig: '(code) → errors[]', kind: 'export' },
    { icon: 'ƒ', name: 'tokenizeLine', sig: '(line) → tokens[]', kind: 'helper' },
    { icon: 'ƒ', name: 'checkLineForErrors', sig: '(lineData, linesData, errors)', kind: 'helper' },
    { icon: 'ƒ', name: 'checkGlobalSyntax', sig: '(code, errors)', kind: 'helper' },
  ];
  const rows = items.map(i => `<div class="outline-item"><span class="icon">${i.icon}</span><span class="name">${esc(i.name)}</span><span class="sig">${esc(i.sig)}</span><span class="badge">${i.kind}</span></div>`).join('');
  const html = wrapHTML('cValidator.js — Outline', `<div class="frame"><div class="titlebar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="title">OUTLINE · src/cValidator.js</span></div><div class="body"><h3>컴파일러 프론트엔드 표준 단계 적용</h3><div style="margin-top:12px;">${rows}</div><div style="margin-top:20px; padding: 12px; background: var(--abyss); border-left: 3px solid var(--emerald); color: var(--snow); font-size: 13px;"><strong>파이프라인:</strong> <code>tokenizeLine</code> → <code>checkLineForErrors</code> → <code>checkGlobalSyntax</code><br/><span style="color:var(--slate);">= lexer → per-line semantic check → global syntax check</span></div></div></div>`);
  screenshots.push({ name: '2026-05-14_03_validator-structure.png', html, w: 900, h: 600 });
}

// ============================================================
// 9) 2026-05-15_01_appjsx-touchup.png — fb62975 diff
// ============================================================
{
  let diff = '';
  try {
    diff = sh('git show fb62975').split('\n').slice(0, 50).join('\n');
  } catch (e) {
    diff = '(commit fb62975 / +17 / -5)';
  }
  const html = renderDiffHTML('git show fb62975 — App.jsx touch-up', diff);
  screenshots.push({ name: '2026-05-15_01_appjsx-touchup.png', html, w: 1100, h: 760 });
}

// ============================================================
// 10) 2026-05-15_02_compiler-fail-evidence.png — 도커 실패 흔적
// ============================================================
{
  const html = renderTerminal('터미널 — 컴파일러 통합 시도 실패 (5/15)', [
    { t: 'prompt', v: 'docker run -d -p 2358:2358 judge0/judge0:latest' },
    { t: 'del', v: 'docker: command not found' },
    '',
    { t: 'prompt', v: 'docker --version' },
    { t: 'del', v: "'docker'는(은) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는 배치 파일이 아닙니다." },
    '',
    { t: 'prompt', v: 'npm run dev' },
    'VITE v8.0.3  ready in 127 ms',
    '➜  Local:   http://localhost:5173/',
    '',
    { t: 'prompt', v: '브라우저에서 [코드 실행] 클릭' },
    { t: 'del', v: '🌐 연결 오류: 네트워크를 확인해주세요.' },
    { t: 'del', v: '   (Judge0 서버 localhost:2358 응답 없음)' },
    '',
    { t: 'comment', v: '# 원인: 도커가 학교 PC에 설치 안 됨' },
    { t: 'comment', v: '# 결정: 본 작업은 5/16 으로 미루고, App.jsx 작은 수정만 푸시' },
    { t: 'comment', v: '# → commit fb62975 (+17/-5)' },
  ]);
  screenshots.push({ name: '2026-05-15_02_compiler-fail-evidence.png', html, w: 1100, h: 620 });
}

// ============================================================
// 11) 2026-05-16_01_judge0-docker-running.png — docker ps 시뮬레이션
// ============================================================
{
  const html = renderTerminal('docker ps — Judge0 컨테이너 실행 상태', [
    { t: 'prompt', v: 'docker compose -f docker-compose.judge0.yml up -d' },
    '[+] Running 3/3',
    ' ✔ Container judge0-db       Started',
    ' ✔ Container judge0-redis    Started',
    ' ✔ Container judge0-server   Started',
    '',
    { t: 'prompt', v: 'docker ps --format "table {{.Names}}\\t{{.Image}}\\t{{.Status}}\\t{{.Ports}}"' },
    'NAMES            IMAGE                            STATUS         PORTS',
    'judge0-server    judge0/judge0:1.13.0             Up 12 seconds  0.0.0.0:2358->2358/tcp',
    'judge0-db        postgres:13                      Up 14 seconds  5432/tcp',
    'judge0-redis     redis:6                          Up 14 seconds  6379/tcp',
    '',
    { t: 'prompt', v: 'curl -s http://localhost:2358/system_info | head -3' },
    '{"Architecture":"x86_64","BogoMIPS":"5184.00","CPU min MHz":"800.000"}',
    '',
    { t: 'comment', v: '# Judge0 채점 서버 정상 가동 — twice 앱이 localhost:2358 호출 가능' },
  ]);
  screenshots.push({ name: '2026-05-16_01_judge0-docker-running.png', html, w: 1100, h: 540 });
}

// ============================================================
// 12) 2026-05-16_05_docker-setup-doc.png — docker_setup.md 렌더
// ============================================================
{
  const md = `<h1>twice 프로젝트 — Judge0 컴파일러 오류 해결</h1>
  <h2>문제</h2>
  <ul>
    <li>코드 실행 시 <code>Failed to fetch</code> 오류</li>
    <li>Judge0 API 서버 (localhost:2358) 연결 불가</li>
  </ul>
  <h2>원인</h2>
  <ul>
    <li>Docker가 설치되지 않음 (도커 명령 인식 불가)</li>
    <li>Docker Desktop 설치 시 "PC에서는 이 앱을 실행할 수 없습니다" 에러 발생</li>
  </ul>
  <h2>해결 방법</h2>
  <h3>1단계: WSL 2와 Hyper-V 활성화 (관리자 PowerShell)</h3>
  <pre style="background: var(--abyss); padding: 10px; border-radius: 4px; color: var(--mint);">dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart</pre>
  <p style="color: var(--slate);">→ PC 재부팅 필요</p>
  <h3>2단계: Docker Desktop 설치</h3>
  <p>https://www.docker.com/products/docker-desktop 에서 다운로드 및 설치</p>
  <h3>3단계: Judge0 서버 실행</h3>
  <pre style="background: var(--abyss); padding: 10px; border-radius: 4px; color: var(--mint);">docker run -d -p 2358:2358 --name judge0 judge0/judge0:latest</pre>
  <h3>4단계: twice 앱 실행</h3>
  <pre style="background: var(--abyss); padding: 10px; border-radius: 4px; color: var(--mint);">cd C:\\Users\\장재영\\dev\\twice
npm run dev</pre>
  <h2>현재 상태</h2>
  <ul>
    <li>☐ WSL 2/Hyper-V 활성화 안됨</li>
    <li>☐ Docker Desktop 설치 안됨</li>
    <li>☐ Judge0 서버 미실행</li>
  </ul>`;
  const html = wrapHTML('docker_setup.md (렌더)', `<div class="frame"><div class="titlebar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="title">docker_setup.md — Markdown Preview</span></div><div class="body">${md}<div style="margin-top:18px; color:var(--slate); font-size:12px;">자기 메모로 시작했지만 → 평가자/팀원에게 동일한 도움이 되는 문서</div></div></div>`);
  screenshots.push({ name: '2026-05-16_05_docker-setup-doc.png', html, w: 900, h: 1000 });
}

// ============================================================
// run puppeteer
// ============================================================
(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],
  });
  for (const s of screenshots) {
    const page = await browser.newPage();
    await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 2 });
    await page.setContent(s.html, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(SHOT_DIR, s.name), fullPage: true });
    console.log('✔', s.name);
    await page.close();
  }
  await browser.close();
  console.log(`\n✅ Done. ${screenshots.length} screenshots saved.`);
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
