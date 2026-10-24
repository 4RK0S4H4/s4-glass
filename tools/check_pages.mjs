#!/usr/bin/env node
// Loads the demo and templates at phone, laptop and desktop sizes in both themes and fails on: sideways page scroll,
// Inter not loaded, the open-digit features missing, or page errors. Screenshots go to out/ (not committed).
// Usage: node tools/check_pages.mjs [page.html …] [--sizes 390x844,1280x800]   (no pages: the demo and templates)
// Needs playwright: preinstalled in Claude cloud sessions, `npm i playwright` elsewhere.
import { createRequire } from 'node:module'; import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url); let pw;
try { pw = require('playwright'); } catch { pw = await import('playwright'); }
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2); const si = args.indexOf('--sizes'); const sizeArg = si >= 0 ? args.splice(si, 2)[1] : null;
const PAGES = args.length ? args.map(a => path.resolve(a)) : ['demo/components.html', 'templates/app.html', 'templates/page.html', 'index.html', 'guide/design.html', 'guide/components.html', 'demo/examples/habits.html', 'demo/examples/orders.html'].map(a => path.join(root, a));
const SIZES = sizeArg ? sizeArg.split(',').map(s => s.split('x').map(Number)) : [[390, 844], [1280, 800], [1920, 1080]]; const THEMES = ['light', 'dark'];
fs.mkdirSync(path.join(root, 'out'), { recursive: true });
const b = await pw.chromium.launch(); let bad = 0;
for (const pg of PAGES) for (const [w, h] of SIZES) for (const th of THEMES) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: th, hasTouch: w < 500, isMobile: w < 500 });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + pg); await p.waitForTimeout(400);
  const r = await p.evaluate(async () => { await document.fonts.ready;
    const se = document.scrollingElement; const theme = document.documentElement.dataset.theme;
    return { over: se.scrollWidth - innerWidth, inter: document.fonts.check('14px Inter'), theme,
      ff: getComputedStyle(document.body).fontFeatureSettings }; });
  const probs = [];
  if (r.over > 1) probs.push(`scrolls sideways by ${r.over}px`);
  if (!r.inter) probs.push('Inter not loaded');
  if (!/ss01/.test(r.ff) || !/cv09/.test(r.ff)) probs.push('ss01/cv09 missing on body');
  if (r.theme !== th) probs.push(`data-theme is ${r.theme}, expected ${th}`);
  if (errs.length) probs.push('page errors: ' + errs.join(' | '));
  const name = `${path.basename(pg, '.html')}-${w}-${th}`;
  await p.screenshot({ path: path.join(root, 'out', name + '.png'), fullPage: true });
  console.log((probs.length ? 'FAIL ' : 'ok   ') + name + (probs.length ? ': ' + probs.join('; ') : ''));
  bad += probs.length; await ctx.close();
}
await b.close();
console.log(bad ? `${bad} problem(s)` : 'all pages ok'); process.exit(bad ? 1 : 0);
