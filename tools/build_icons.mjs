#!/usr/bin/env node
// Builds toolkit/icons.js: a curated subset of Solar Bold Duotone (CC BY 4.0, 480 Design), the one icon style in S4 Glass.
// Usage: node tools/build_icons.mjs [path/to/@iconify-json/solar/icons.json]   (npm i @iconify-json/solar@1.2.13 first)
// Add names to NAMES (without the -linear / -bold-duotone suffix) and re-run.
// Single-file page: `node tools/build_icons.mjs <icons.json> --only copy,moon,refresh --out icons-page.js` writes a file with just those
// icons (Bold Duotone), so the page doesn't carry the whole ~100 KB set.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const src = process.argv[2] || 'node_modules/@iconify-json/solar/icons.json';
const NAMES = ['widget-5','checklist-minimalistic','document-text','card','wallet','chart-2','transfer-horizontal','calculator-minimalistic','notebook',
  'magic-stick','settings','link-round','link-circle','menu-dots','upload','download','diskette','undo-left','undo-right','history','arrow-left','arrow-right',
  'alt-arrow-down','alt-arrow-right','info-circle','lock-keyhole-minimalistic','lock-keyhole-minimalistic-unlocked','sun','moon','copy','check-circle','close-circle',
  'stars','keyboard','user','users-group-rounded','calendar','magnifier','filter','trash-bin-minimalistic','pen','add-circle','danger-triangle',
  'home-2','bell','hamburger-menu','graph-up','pie-chart-2','folder','inbox','letter','star','heart','map-point','clock-circle','shield-check','bolt','cart-large-2','tag','smartphone','monitor',
  'refresh','restart','printer','share','eye','eye-closed','add-square','minus-circle','sort-vertical','question-circle','logout-2','login-2','list','gallery','camera',
  'chat-round','phone','global','sale','box','delivery','bookmark','pin','paperclip','cloud-upload','cloud-download','widget-2','check','check-read'];
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const only = arg('--only'), outFile = arg('--out');
const j = JSON.parse(fs.readFileSync(src.startsWith('--') ? 'node_modules/@iconify-json/solar/icons.json' : src, 'utf8')); const out = {}; const miss = [];
for (const n of (only ? only.split(',') : NAMES)) { const ic = j.icons[n + '-bold-duotone']; if (ic) out[n] = ic.body; else miss.push(n + '-bold-duotone'); }
if (!only && j.icons['close-circle-bold-duotone']) out.close = j.icons['close-circle-bold-duotone'].body;   /* 'close' = the close-circle icon */
const js = `/* S4 Glass icons: a curated subset of Solar Bold Duotone (CC BY 4.0, 480 Design – https://www.figma.com/community/file/1166831539721848736), built by tools/build_icons.mjs.
   Credit Solar in the app's About or footer. Use inline SVG in production apps (copy the markup s4Icon() returns). For quick pages: <svg class="ic" data-ic="widget-5"></svg>
   is filled in on load (data-ic-duo works too). One style for every icon: the faded half is the [opacity] group, so the icon follows the text or accent colour. */
const S4_ICONS = ${JSON.stringify(out)};
function s4Icon(name) { return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + (S4_ICONS[name] || "") + '</svg>'; }
function s4Icons(root) { (root || document).querySelectorAll("svg[data-ic], svg[data-ic-duo]").forEach(function (s) {
  var a = s.hasAttribute("data-ic") ? "data-ic" : "data-ic-duo", n = s.getAttribute(a); s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("aria-hidden", "true");
  s.innerHTML = S4_ICONS[n] || ""; s.removeAttribute(a); }); }
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { s4Icons(); }); else s4Icons();
`;
fs.writeFileSync(outFile || path.join(here, '../toolkit/icons.js'), js);
console.log(`icons.js: ${Object.keys(out).length} icons (Bold Duotone), ${(js.length / 1024).toFixed(0)} KB` + (miss.length ? `; missing: ${miss.join(', ')}` : ''));
