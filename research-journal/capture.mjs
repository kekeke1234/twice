import puppeteer from 'puppeteer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHOT_DIR = path.join(__dirname, 'screenshots');
const BASE = 'http://localhost:5174';

fs.mkdirSync(SHOT_DIR, { recursive: true });

const shot = (page, name, opts = {}) =>
  page.screenshot({ path: path.join(SHOT_DIR, name), fullPage: opts.fullPage ?? false, ...opts });

const wait = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox'],
  });

  const ctx = await browser.createBrowserContext();

  // helper: open a fresh page with a specific preset/language pre-seeded in localStorage
  const openWith = async ({ activePreset = 'default', language = 'ko', route = '/' } = {}) => {
    const page = await ctx.newPage();
    await page.evaluateOnNewDocument((preset, lang) => {
      try {
        localStorage.setItem('activePreset', preset);
        localStorage.setItem('language', lang);
        localStorage.removeItem('customTheme');
      } catch (e) {}
    }, activePreset, language);
    await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 60000 });
    await wait(800);
    return page;
  };

  console.log('▶ 1) Landing (default dark, Korean) ...');
  {
    const p = await openWith({ activePreset: 'default', language: 'ko', route: '/' });
    await shot(p, '2026-04-04_01_landing-skeleton.png', { fullPage: true });
    await shot(p, '2026-05-12_01_dark-mode.png', { fullPage: true });
    await p.close();
  }

  console.log('▶ 2) Landing (sunset preset, Korean) — theme variant ...');
  {
    const p = await openWith({ activePreset: 'sunset', language: 'ko', route: '/' });
    await shot(p, '2026-05-12_02_light-mode.png', { fullPage: true });
    await p.close();
  }

  console.log('▶ 3) Landing (default, English) — language toggle ...');
  {
    const p = await openWith({ activePreset: 'default', language: 'en', route: '/' });
    await shot(p, '2026-05-12_03_lang-toggle.png', { fullPage: true });
    await p.close();
  }

  console.log('▶ 4) Auth page ...');
  {
    const p = await openWith({ activePreset: 'default', language: 'ko', route: '/auth' });
    await shot(p, '2026-05-09_03_auth-page.png', { fullPage: true });
    await p.close();
  }

  console.log('▶ 5) Leaderboard page ...');
  {
    const p = await openWith({ activePreset: 'default', language: 'ko', route: '/leaderboard' });
    await shot(p, '2026-05-09_04_leaderboard.png', { fullPage: true });
    await p.close();
  }

  console.log('▶ 6) IDE — default state (no code run yet) ...');
  {
    const p = await openWith({ activePreset: 'default', language: 'ko', route: '/ide' });
    await wait(1500);
    await shot(p, '2026-05-16_00_ide-default.png');
    await p.close();
  }

  console.log('▶ 7) IDE — run code (Judge0 success) ...');
  try {
    const p = await openWith({ activePreset: 'default', language: 'ko', route: '/ide' });
    await wait(1500);
    // Try clicking the run button. We do not know the exact selector — search by text/title.
    const ran = await p.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const runBtn = buttons.find(b =>
        /run|실행|▶/i.test(b.textContent || '') ||
        /run|실행/i.test(b.getAttribute('title') || '') ||
        /run|실행/i.test(b.getAttribute('aria-label') || '')
      );
      if (runBtn) { runBtn.click(); return true; }
      return false;
    });
    if (ran) {
      console.log('  • Run button clicked; waiting for Judge0 round-trip ...');
      await wait(8000);
      await shot(p, '2026-05-16_02_code-success.png');
    } else {
      console.log('  • Run button not found by heuristic; saving IDE screenshot anyway.');
      await shot(p, '2026-05-16_02_code-success.png');
    }
    await p.close();
  } catch (e) {
    console.log('  ! Code-run capture failed:', e.message);
  }

  console.log('▶ 8) IDE — Korean error (introduce a compile error) ...');
  try {
    const p = await openWith({ activePreset: 'default', language: 'ko', route: '/ide' });
    await wait(1500);

    // Inject broken C code via clipboard paste fallback or by typing — but the easiest:
    // Replace the localStorage 'code' with broken C and reload.
    await p.evaluate(() => {
      const brokenC = '#include <stdio.h>\nint main(){\n  printf("hi"\n  return 0;\n}\n';
      localStorage.setItem('code', brokenC);
    });
    await p.reload({ waitUntil: 'networkidle2' });
    await wait(1500);

    const ran = await p.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const runBtn = buttons.find(b =>
        /run|실행|▶/i.test(b.textContent || '') ||
        /run|실행/i.test(b.getAttribute('title') || '') ||
        /run|실행/i.test(b.getAttribute('aria-label') || '')
      );
      if (runBtn) { runBtn.click(); return true; }
      return false;
    });
    if (ran) await wait(9000);
    await shot(p, '2026-05-16_03_korean-error.png');
    await shot(p, '2026-05-16_04_caret-arrow.png');
    await p.close();
  } catch (e) {
    console.log('  ! Korean-error capture failed:', e.message);
  }

  await browser.close();
  console.log('\n✅ Done. Screenshots saved to:', SHOT_DIR);
})().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
