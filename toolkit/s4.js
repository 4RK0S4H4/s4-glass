/* S4 Glass 2.0 – small helpers, no dependencies. Paste into <head> before the stylesheet (the theme must be set before the
   first paint, or dark-mode users see a white flash). Everything else waits for the page and works on plain HTML.
   In React/Vue: keep the theme part in index.html; call s4Slider / s4Copy / s4Tips from effects, or re-create them in the framework.

   s4Theme("light" | "dark" | "auto")   theme toggle; data-theme is always "light" or "dark" (auto follows the device)
   s4Density("auto" | "standard" | "compact")  density setting; data-density is always "standard" or "compact" (auto: compact on a wide screen with a mouse, standard on touch and small screens). A [data-density-seg] box of buttons with data-v is wired and kept in step.
   s4Slider(box, ".on")                  one indicator that slides between options of .seg / .nav / .ptabs (on click only)
   s4Copy(el, text)                      copy + the 0.6s green flash; any [data-copy] element copies on click
   s4Tips(root)                          tooltips (.tip) for .trunc / .dcol text, only when it is actually cut off
   s4Menu(button, menu)                  open a .menu under its button; any [data-menu="id"] button opens #id
   s4Dialog(scrim) / s4Close(scrim)      open / close a .scrim dialog: focus moves in and back, Escape closes, a 0.15s exit
   s4Toast("Saved", {action, onAction})  a dark toast for ~4s, with an optional action button ("Undo")
   s4Fold(details, open)                 open or close a details.fold with its height animating; summary clicks are wired
   s4Swap(el)                            replay the fade on new tab content (give it class="swap")
   s4Sort(table)                         header sorting: asc → desc → back to the original order; any table.t with th.sortable is wired
*/
(function () {
  var KEY = "s4-theme", t = "auto", m = window.matchMedia && matchMedia("(prefers-color-scheme: dark)");
  try { t = localStorage.getItem(KEY) || "auto"; } catch (e) {}
  function set() { document.documentElement.setAttribute("data-theme", t === "light" || t === "dark" ? t : (m && m.matches ? "dark" : "light")); }
  set(); if (m && m.addEventListener) m.addEventListener("change", function () { if (t === "auto") set(); });
  window.s4Theme = function (v) { t = v; try { localStorage.setItem(KEY, v); } catch (e) {} set(); };
  window.s4ThemeToggle = function () { s4Theme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark"); };
})();

/* Density: like the theme, set before the first paint. "auto" is compact only on a 1300–2200px screen with a mouse (a 1080p monitor); standard on touch, small and larger (1440p) screens. */
(function () {
  var KEY = "s4-density", d = "auto", q = window.matchMedia && matchMedia("(pointer: fine) and (min-width: 1300px) and (max-width: 2200px)");
  try { d = localStorage.getItem(KEY) || "auto"; } catch (e) {}
  function mark() { document.querySelectorAll("[data-density-seg] button").forEach(function (b) { b.classList.toggle("on", b.dataset.v === d); }); }
  function set() { document.documentElement.setAttribute("data-density", d === "compact" || d === "standard" ? d : (q && q.matches ? "compact" : "standard")); mark(); }
  set(); if (q && q.addEventListener) q.addEventListener("change", function () { if (d === "auto") set(); });
  window.s4Density = function (v) { d = v; try { localStorage.setItem(KEY, v); } catch (e) {} set(); };
  /* [data-density-seg] boxes work wherever and whenever they are added (settings screens render later): one delegated click, and a
     re-mark when new nodes appear. */
  document.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("[data-density-seg] button"); if (b && b.dataset.v) s4Density(b.dataset.v); });
  var queued = false;
  function later() { if (queued) return; queued = true; requestAnimationFrame(function () { queued = false; mark(); }); }
  function watch() { if (window.MutationObserver) new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); mark(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", watch); else watch();
})();

function s4Still() { return !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches); }

/* Sliding selection: places without animating on first paint, resize and font load; slides only after a click. Returns place(). */
function s4Slider(box, sel) {
  box.classList.add("slider");
  function place(animate) {
    var a = box.querySelector(":scope > " + sel);
    if (!a) { box.classList.remove("has-slide"); return; }
    box.classList.toggle("slide-ready", !!animate);
    box.style.setProperty("--sx", a.offsetLeft + "px"); box.style.setProperty("--sy", a.offsetTop + "px");
    box.style.setProperty("--sw", a.offsetWidth + "px"); box.style.setProperty("--sh", a.offsetHeight + "px");
    box.classList.add("has-slide");
  }
  place(false);
  if (window.ResizeObserver) new ResizeObserver(function () { place(false); }).observe(box);
  if (document.fonts) document.fonts.ready.then(function () { place(false); });
  box.addEventListener("click", function () { requestAnimationFrame(function () {
    place(true);
    var a = box.querySelector(":scope > " + sel);   /* a row that scrolls sideways brings the choice to the middle */
    if (a && box.scrollWidth > box.clientWidth + 1) box.scrollTo({ left: a.offsetLeft - (box.clientWidth - a.offsetWidth) / 2, behavior: s4Still() ? "auto" : "smooth" });
  }); });
  return place;
}

/* Copy chips: <button class="copy" data-copy="-1234.56"><span>(1,234.56)</span><svg…/></button>. Negatives copy as -1234.56. */
function s4Copy(el, text) {
  function flash() { el.classList.add("done"); clearTimeout(el._s4t); el._s4t = setTimeout(function () { el.classList.remove("done"); }, 600); }
  function legacy() { var ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); flash(); } catch (e) {} ta.remove(); }
  try { navigator.clipboard.writeText(text).then(flash, legacy); } catch (e) { legacy(); }
}

/* Tooltips for cut-off text: only when the text really doesn't fit. */
function s4Tips(root) {
  var tip = document.createElement("div"); tip.className = "tip"; tip.hidden = true; tip.setAttribute("role", "tooltip"); document.body.appendChild(tip);
  function show(el) {
    if (el.scrollWidth <= el.clientWidth + 1) return;
    tip.textContent = el.textContent.trim(); tip.hidden = false;
    var r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
    var x = Math.min(Math.max(8, r.left), innerWidth - w - 8), y = r.bottom + 6 + h > innerHeight ? r.top - h - 6 : r.bottom + 6;
    tip.style.left = x + "px"; tip.style.top = y + "px";
  }
  (root || document).addEventListener("mouseover", function (e) { var el = e.target.closest && e.target.closest(".trunc, .tip-on-cut"); if (el) show(el); });
  (root || document).addEventListener("mouseout", function (e) { if (e.target.closest && e.target.closest(".trunc, .tip-on-cut")) tip.hidden = true; });
  addEventListener("scroll", function () { tip.hidden = true; }, true);
}

/* Menus: placed under (or above) the button, kept inside the window; Escape or a click outside closes. */
function s4Menu(btn, menu) {
  var open = !menu.hidden; document.querySelectorAll(".menu:not(.static)").forEach(function (x) { x.hidden = true; });
  if (open) return;
  menu.hidden = false; btn.setAttribute("aria-expanded", "true");
  var r = btn.getBoundingClientRect(), w = menu.offsetWidth, h = menu.offsetHeight;
  var x = Math.min(Math.max(8, r.right - w), innerWidth - w - 8), y = r.bottom + 6 + h > innerHeight - 8 ? Math.max(8, r.top - h - 6) : r.bottom + 6;
  menu.style.left = x + "px"; menu.style.top = y + "px";
  function close(e) {
    if (e && e.type === "keydown" && e.key !== "Escape") return;
    if (e && e.type === "click" && (menu.contains(e.target) && !e.target.closest("button, a") || btn.contains(e.target))) return;
    menu.hidden = true; btn.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", close, true); document.removeEventListener("keydown", close);
    if (e && e.type === "keydown") btn.focus();
  }
  setTimeout(function () { document.addEventListener("click", close, true); document.addEventListener("keydown", close); });
}

/* Dialogs: <div class="scrim" hidden><div class="modal" role="dialog" aria-modal="true" aria-labelledby="…">…</div></div> */
function s4Dialog(scrim) {
  clearTimeout(scrim._s4t); scrim.classList.remove("closing");
  scrim._s4back = document.activeElement; scrim.hidden = false;
  var f = scrim.querySelector("[autofocus], .modal footer .btn.primary, input, select, textarea, button"); if (f) f.focus();
  if (!scrim._s4wired) {
    scrim._s4wired = true;
    scrim.addEventListener("click", function (e) { if (e.target === scrim && !scrim.hasAttribute("data-dirty")) s4Close(scrim); });
    scrim.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.stopPropagation(); s4Close(scrim); return; }
      if (e.key !== "Tab") return;   /* keep focus inside the dialog */
      var els = Array.prototype.filter.call(scrim.querySelectorAll("a[href], button:not(:disabled), input:not(:disabled), select, textarea, [tabindex]:not([tabindex='-1'])"), function (x) { return x.offsetParent !== null; });
      if (!els.length) return; var first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
}
/* Closing: focus goes back at once (keys never wait), the dialog fades out (a phone sheet slides down), then it hides. */
function s4Close(scrim) {
  if (scrim._s4back && scrim._s4back.focus) scrim._s4back.focus();
  if (s4Still() || scrim.hidden) { scrim.hidden = true; return; }
  scrim.classList.add("closing"); clearTimeout(scrim._s4t);
  scrim._s4t = setTimeout(function () { scrim.hidden = true; scrim.classList.remove("closing"); }, innerWidth <= 760 ? 200 : 150);
}

function s4Toast(text, opt) {
  opt = opt || {}; var old = document.querySelector(".toast[data-s4]"); if (old) old.remove();
  var t = document.createElement("div"); t.className = "toast"; t.setAttribute("data-s4", ""); t.setAttribute("role", "status");
  var s = document.createElement("span"); s.textContent = text; t.appendChild(s);
  if (opt.action) { var b = document.createElement("button"); b.type = "button"; b.textContent = opt.action; b.onclick = function () { t.remove(); if (opt.onAction) opt.onAction(); }; t.appendChild(b); }
  document.body.appendChild(t);
  setTimeout(function () { t.classList.add("leaving"); setTimeout(function () { t.remove(); }, s4Still() ? 0 : 160); }, opt.ms || 4000);
}

/* Folds: <details class="fold"> grows and shrinks instead of jumping. The open state is set at once when opening and at
   the end when closing; a second click half-way reverses it. Steps: s4Fold(done, false); s4Fold(next, true). */
function s4Fold(d, open) {
  var body = d.querySelector(":scope > .fold-body"); d._s4want = open;
  if (d._s4a) { d._s4a.cancel(); d._s4a = null; }
  if (body) body.getAnimations().forEach(function (x) { x.cancel(); });
  if (s4Still() || !d.animate) { d.open = open; return; }
  var from = d.getBoundingClientRect().height;
  d.open = false; var shut = d.getBoundingClientRect().height; d.open = true;
  var to = open ? d.getBoundingClientRect().height : shut;
  if (Math.abs(from - to) < 1) { d.open = open; return; }
  var dur = 240, ease = getComputedStyle(d).getPropertyValue("--ease").trim() || "ease-out";
  d.style.overflow = "clip";
  d._s4a = d.animate({ height: [from + "px", to + "px"] }, { duration: dur, easing: ease });
  if (body) body.animate({ opacity: open ? [0, 1] : [1, 0] }, { duration: open ? dur : dur * .6, easing: "ease-out", fill: "forwards" });
  d._s4a.onfinish = function () { d._s4a = null; d.style.overflow = ""; d.open = open; if (body) body.getAnimations().forEach(function (x) { x.cancel(); }); };
}

/* Tab content: re-render, then s4Swap(panel) so it fades in where it is (no slide). */
/* App-shell top bar: content slides under it, so .main learns the bar's height (--bar-h). Runs by itself; call s4Bars() after adding a bar later. */
function s4Bars(root) {
  (root || document).querySelectorAll(".main > .topbar:first-child").forEach(function (bar) {
    if (bar._s4bar) return; bar._s4bar = true;
    function set() { bar.parentNode.style.setProperty("--bar-h", bar.offsetHeight + "px"); }
    set();
    if (window.ResizeObserver) new ResizeObserver(set).observe(bar);
  });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { s4Bars(); }); else s4Bars();

function s4Swap(el) { el.classList.add("swap"); el.style.animation = "none"; void el.offsetWidth; el.style.animation = ""; }

/* Table sorting. A cell sorts by its data-sort value if it has one (give status cells their urgency rank: bad 1, warn 2,
   needs-a-decision 3, accent 4, ok 5, mute 6), else by its text; amounts such as (1,234.56) sort as numbers. */
function s4Sort(table) {
  var body = table.tBodies[0]; if (!body) return;
  Array.prototype.forEach.call(body.rows, function (r, i) { r._s4i = i; });
  function key(td) {
    var v = td ? (td.getAttribute("data-sort") != null ? td.getAttribute("data-sort") : td.textContent.trim()) : "";
    var n = v.replace(/[,$€£\s)]/g, "").replace(/^\(/, "-");
    return n !== "" && !isNaN(n) ? { n: parseFloat(n) } : { s: v.toLowerCase() };
  }
  table.querySelectorAll("th.sortable .th-sort").forEach(function (btn) {
    if (btn._s4sort) return; btn._s4sort = true;
    btn.addEventListener("click", function () {
      var th = btn.closest("th"), col = Array.prototype.indexOf.call(th.parentElement.children, th);
      var dir = th.getAttribute("aria-sort") === "ascending" ? "descending" : th.getAttribute("aria-sort") === "descending" ? "none" : "ascending";
      table.querySelectorAll("th.sortable").forEach(function (h) { h.classList.remove("sorted"); h.removeAttribute("aria-sort"); });
      var rows = Array.prototype.slice.call(body.rows);
      rows.sort(function (a, b) {
        if (dir === "none") return a._s4i - b._s4i;
        var x = key(a.cells[col]), y = key(b.cells[col]);
        var c = x.n != null && y.n != null ? x.n - y.n : String(x.s != null ? x.s : x.n).localeCompare(String(y.s != null ? y.s : y.n), undefined, { numeric: true });
        return (dir === "ascending" ? c : -c) || a._s4i - b._s4i;
      });
      rows.forEach(function (r) { body.appendChild(r); });
      if (dir !== "none") { th.classList.add("sorted"); th.setAttribute("aria-sort", dir); th.querySelector(".sort-ic") && (th.querySelector(".sort-ic").style.transform = dir === "descending" ? "" : "rotate(180deg)"); }
    });
  });
}

/* Wire up the plain-HTML conveniences once the page is there. */
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (e) {
    var c = e.target.closest("[data-copy]"); if (c) { s4Copy(c, c.getAttribute("data-copy") || c.textContent.trim()); return; }
    var mb = e.target.closest("[data-menu]"); if (mb) { var mn = document.getElementById(mb.getAttribute("data-menu")); if (mn) s4Menu(mb, mn); return; }
    var ob = e.target.closest("[data-open]"); if (ob) { var sc = document.getElementById(ob.getAttribute("data-open")); if (sc) s4Dialog(sc); return; }
    var cb = e.target.closest("[data-close]"); if (cb) { var s2 = cb.closest(".scrim"); if (s2) s4Close(s2); return; }
    var tb = e.target.closest("[data-theme-toggle]"); if (tb) { s4ThemeToggle(); return; }
    var nb = e.target.closest(".site-head .menu-btn"); if (nb) { var nv = document.querySelector(".site-nav"); var o = nv.classList.toggle("open"); nb.setAttribute("aria-expanded", o); return; }
    var fs = e.target.closest("details.fold > summary"); if (fs && !fs.closest("[data-manual]")) { e.preventDefault(); var fd = fs.parentElement; s4Fold(fd, !(fd._s4want != null ? fd._s4want : fd.open)); return; }
    var sb = e.target.closest(".seg button"); if (sb && !sb.closest("[data-manual]")) { sb.parentElement.querySelectorAll(":scope > .on").forEach(function (x) { x.classList.remove("on"); x.setAttribute("aria-pressed", "false"); }); sb.classList.add("on"); sb.setAttribute("aria-pressed", "true"); }
  });
  document.querySelectorAll(".seg").forEach(function (s) { s4Slider(s, "button.on"); });
  document.querySelectorAll(".ptabs").forEach(function (s) { s4Slider(s, "button.on"); });
  document.querySelectorAll("table.t").forEach(function (t) { if (t.querySelector("th.sortable")) s4Sort(t); });
  s4Tips();
});
