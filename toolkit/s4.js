/* S4 Glass 2.0 – small helpers, no dependencies. Paste into <head> before the stylesheet (the theme must be set before the
   first paint, or dark-mode users see a white flash). Everything else waits for the page and works on plain HTML.
   In React/Vue: keep the theme part in index.html; call s4Slider / s4Copy / s4Tips from effects, or re-create them in the framework.

   s4Theme("light" | "dark" | "auto")   theme toggle; data-theme is always "light" or "dark" (auto follows the device)
   s4Density("auto" | "standard" | "compact")  density setting; data-density is always "standard" or "compact" (auto: compact on a wide screen with a mouse, standard on touch and small screens). A [data-density-seg] box of buttons with data-v is wired and kept in step.
   s4Slider(box, ".on")                  one indicator that slides between options of .seg / .nav / .ptabs (on click only)
   s4Copy(el, text)                      copy + the 0.6s green flash (the tick stays until the green has faded); any [data-copy] element copies on click
   s4Tips(root)                          tooltips (.tip) for .trunc / .dcol text, only when it is actually cut off: a main line, a quieter sub line (<small> or .sub), a short delay, flips above near the bottom
   s4Menu(button, menu)                  open a .menu under its button; arrows / Home / End move, Enter picks; any [data-menu="id"] button opens #id
   s4Select(select)                      a themed dropdown for a <select> (every select is wired on load; add data-native to keep the browser's; touch screens keep it anyway)
   s4Dialog(scrim) / s4Close(scrim)      open / close a .scrim dialog: focus moves in and back, Escape closes, a 0.15s exit. With data-dirty="the queued files", Escape asks "Discard the queued files?" first
   s4Toast("Saved", {action, onAction, anchor})  a dark toast for ~4s (6.5s with an action, time to reach "Undo"); anchor = the button it points to (an undo pop-up)
   s4Fold(details, open)                 open or close a details.fold with its height animating; summary clicks are wired
   s4Swap(el)                            replay the fade on new tab content (give it class="swap")
   s4Sort(table)                         header sorting: asc → desc → back to the original order, blank cells always last; any table.t with th.sortable is wired
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
  function flash() {   /* green + tick for 0.6s, then the green fades (.fade, 0.14s) with the tick still there, so colour and icon go back together */
    clearTimeout(el._s4t); el.classList.remove("fade"); el.classList.add("done");
    el._s4t = setTimeout(function () { el.classList.remove("done"); el.classList.add("fade"); el._s4t = setTimeout(function () { el.classList.remove("fade"); }, s4Still() ? 0 : 140); }, 600);
  }
  function legacy() { var ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); flash(); } catch (e) {} ta.remove(); }
  try { navigator.clipboard.writeText(text).then(flash, legacy); } catch (e) { legacy(); }
}

/* Tooltips for cut-off text: only when the text really doesn't fit, after a short delay (so crossing a table doesn't flicker). A <small> or .sub
   inside the element becomes a quieter second line. Shows under the text, above it near the bottom of the window. */
function s4Tips(root) {
  var tip = document.createElement("div"); tip.className = "tip"; tip.hidden = true; tip.setAttribute("role", "tooltip"); document.body.appendChild(tip);
  var timer, cur, SEL = ".trunc, .tip-on-cut";
  function hide() { clearTimeout(timer); cur = null; tip.hidden = true; }
  function show(el) {
    if (cur !== el || !el.isConnected) return;
    var sub = el.querySelector("small, .sub"), subText = sub ? sub.textContent.trim() : "";
    var main = (sub ? Array.prototype.map.call(el.childNodes, function (n) { return n === sub || (n.nodeType === 1 && n.contains(sub)) ? "" : n.textContent; }).join("") : el.textContent).trim();
    if (subText.toLowerCase() === main.toLowerCase()) subText = "";
    tip.textContent = ""; var m = document.createElement("div"); m.textContent = main; tip.appendChild(m);
    if (subText) { var sm = document.createElement("small"); sm.textContent = subText; tip.appendChild(sm); }
    tip.hidden = false;
    var r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
    var x = Math.min(Math.max(8, r.left - 9), innerWidth - w - 8), y = r.bottom + 6 + h > innerHeight - 8 ? r.top - h - 6 : r.bottom + 6;
    tip.style.left = x + "px"; tip.style.top = y + "px";
  }
  (root || document).addEventListener("mouseover", function (e) {
    var el = e.target.closest && e.target.closest(SEL); if (el === cur) return;
    hide(); if (!el || el.scrollWidth <= el.clientWidth + 1) return;
    cur = el; timer = setTimeout(function () { show(el); }, 280);
  });
  (root || document).addEventListener("mouseout", function (e) { if (cur && !(e.relatedTarget && cur.contains(e.relatedTarget))) hide(); });
  document.addEventListener("mousedown", hide); addEventListener("blur", hide); addEventListener("scroll", hide, true);
}

/* Menus: placed under (or above) the button, kept inside the window; Escape or a click outside closes. Arrow keys, Home and End move between
   the items, Enter picks; opened from the keyboard, the first item takes focus. */
function s4Menu(btn, menu) {
  var open = !menu.hidden; document.querySelectorAll(".menu:not(.static)").forEach(function (x) { x.hidden = true; });
  if (open) return;
  var byKey = btn.matches && btn.matches(":focus-visible");
  menu.hidden = false; btn.setAttribute("aria-expanded", "true");
  var r = btn.getBoundingClientRect(), w = menu.offsetWidth, h = menu.offsetHeight;
  var x = Math.min(Math.max(8, r.right - w), innerWidth - w - 8), y = r.bottom + 6 + h > innerHeight - 8 ? Math.max(8, r.top - h - 6) : r.bottom + 6;
  menu.style.left = x + "px"; menu.style.top = y + "px";
  function items() { return Array.prototype.filter.call(menu.querySelectorAll("button:not(:disabled), a[href]"), function (b) { return b.offsetParent !== null; }); }
  if (byKey) { var first = items()[0]; if (first) first.focus(); }
  function close(e) {
    if (e && e.type === "keydown") {
      var k = e.key, list = items(), i = list.indexOf(document.activeElement);
      if (k === "ArrowDown" || k === "ArrowUp" || k === "Home" || k === "End") {
        e.preventDefault(); if (!list.length) return;
        list[k === "Home" ? 0 : k === "End" ? list.length - 1 : k === "ArrowDown" ? (i + 1) % list.length : (i <= 0 ? list.length - 1 : i - 1)].focus(); return;
      }
      if (k !== "Escape") return;
    }
    if (e && e.type === "click" && (menu.contains(e.target) && !e.target.closest("button, a") || btn.contains(e.target))) return;
    menu.hidden = true; btn.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", close, true); document.removeEventListener("keydown", close);
    if (e && e.type === "keydown") btn.focus();
  }
  setTimeout(function () { document.addEventListener("click", close, true); document.addEventListener("keydown", close); });
}

/* Dropdown: wraps a <select>. The select stays in the page, hidden, and keeps the value (forms, change events); a button + listbox shows and sets it.
   Arrows / Home / End / type-ahead / Enter / Escape; opens upward near the bottom; a tick marks the current option. Touch screens and [data-native] keep the browser's. */
function s4Select(sel) {
  if (sel._s4sel || sel.hasAttribute("data-native") || sel.multiple || sel.size > 1 || (window.matchMedia && matchMedia("(pointer: coarse)").matches)) return;
  sel._s4sel = true;
  var btn = document.createElement("button"); btn.type = "button"; btn.className = "sel " + sel.className.replace(/\bbad\b/, "").trim();
  var lab = sel.getAttribute("aria-label") || (sel.id && document.querySelector('label[for="' + sel.id + '"]') ? document.querySelector('label[for="' + sel.id + '"]').textContent.trim() : "");
  if (lab) btn.setAttribute("aria-label", lab); else if (sel.closest("label")) btn.setAttribute("aria-label", sel.closest("label").textContent.replace(sel.textContent, "").trim());
  btn.setAttribute("role", "combobox"); btn.setAttribute("aria-haspopup", "listbox"); btn.setAttribute("aria-expanded", "false"); btn.disabled = sel.disabled;
  btn.innerHTML = '<span class="sel-v"></span><svg class="sel-c" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  sel.parentNode.insertBefore(btn, sel); sel.hidden = true;
  var list, act = 0, typed = "", typedAt = 0, uid = "s4sel" + Math.random().toString(36).slice(2, 7);
  function opts() { return Array.prototype.slice.call(sel.options); }
  function sync() { var o = sel.options[sel.selectedIndex]; btn.querySelector(".sel-v").textContent = o ? o.textContent : ""; btn.disabled = sel.disabled; }
  sync(); sel.addEventListener("change", sync);
  function pick(i) {
    var o = opts()[i]; shut(true);
    if (o && !o.disabled && sel.selectedIndex !== i) { sel.selectedIndex = i; sel.dispatchEvent(new Event("change", { bubbles: true })); }
  }
  function mark(i) {
    act = i; Array.prototype.forEach.call(list.children, function (li, k) { li.classList.toggle("act", k === i); });
    btn.setAttribute("aria-activedescendant", uid + "-" + i); var li = list.children[i]; if (li && li.scrollIntoView) li.scrollIntoView({ block: "nearest" });
  }
  function away(e) { if (!btn.contains(e.target) && !list.contains(e.target)) shut(); }
  function shut(focus) {
    if (!list) return; list.remove(); list = null; btn.setAttribute("aria-expanded", "false"); btn.removeAttribute("aria-activedescendant");
    document.removeEventListener("mousedown", away); removeEventListener("resize", shut); removeEventListener("blur", shut); if (focus) btn.focus();
  }
  function show() {
    if (list) return;
    list = document.createElement("ul"); list.className = "sel-list"; list.id = uid; list.setAttribute("role", "listbox"); if (btn.getAttribute("aria-label")) list.setAttribute("aria-label", btn.getAttribute("aria-label"));
    opts().forEach(function (o, i) {
      var li = document.createElement("li"); li.id = uid + "-" + i; li.setAttribute("role", "option"); li.setAttribute("aria-selected", i === sel.selectedIndex); li.textContent = o.textContent;
      if (i === sel.selectedIndex) { li.classList.add("on"); li.insertAdjacentHTML("beforeend", '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.3l2.3 2.3 4.7-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'); }
      if (o.disabled) li.setAttribute("aria-disabled", "true");
      li.addEventListener("mousemove", function () { mark(i); }); li.addEventListener("mousedown", function (e) { e.preventDefault(); }); li.addEventListener("click", function () { pick(i); });
      list.appendChild(li);
    });
    document.body.appendChild(list); btn.setAttribute("aria-expanded", "true"); btn.setAttribute("aria-controls", uid);
    var r = btn.getBoundingClientRect(), below = innerHeight - r.bottom - 12, above = r.top - 12, up = below < 180 && above > below;
    list.style.left = Math.min(r.left, innerWidth - 168) + "px"; list.style.minWidth = Math.max(r.width, 160) + "px"; list.style.maxHeight = Math.min(320, up ? above : below) + "px";
    if (up) { list.classList.add("up"); list.style.bottom = innerHeight - r.top + 4 + "px"; } else list.style.top = r.bottom + 4 + "px";
    mark(Math.max(0, sel.selectedIndex));
    document.addEventListener("mousedown", away); addEventListener("resize", shut); addEventListener("blur", shut);
  }
  btn.addEventListener("click", function () { if (list) shut(); else show(); });
  btn.addEventListener("keydown", function (e) {
    var n = sel.options.length; if (!n) return;
    var k = e.key;
    if (k === "Escape" && !list) return;   /* a closed dropdown leaves Escape to the dialog around it */
    if (k === "Tab") { shut(); return; }
    var typing = k.length === 1 && !e.ctrlKey && !e.metaKey && k !== " ";
    if (!(["ArrowDown", "ArrowUp", "Home", "End", "Enter", " ", "Escape"].indexOf(k) >= 0 || typing)) return;
    e.preventDefault(); e.stopPropagation && k === "Escape" && e.stopPropagation();
    if (!list && !typing) { show(); return; }
    if (k === "Escape") { shut(true); return; }
    if (k === "ArrowDown") mark(Math.min(n - 1, act + 1)); else if (k === "ArrowUp") mark(Math.max(0, act - 1));
    else if (k === "Home") mark(0); else if (k === "End") mark(n - 1);
    else if (k === "Enter" || k === " ") pick(act);
    else {
      var now = Date.now(); typed = (now - typedAt > 700 ? "" : typed) + k.toLowerCase(); typedAt = now;
      var from = list ? act : Math.max(0, sel.selectedIndex), o = opts(), hit = -1;
      for (var q = 0; q < n && hit < 0; q++) { var c = (q + from + (typed.length === 1 ? 1 : 0)) % n; if (o[c].textContent.toLowerCase().indexOf(typed) === 0) hit = c; }
      if (hit >= 0) { if (list) mark(hit); else if (sel.selectedIndex !== hit) { sel.selectedIndex = hit; sel.dispatchEvent(new Event("change", { bubbles: true })); } }
    }
  });
}

/* Dialogs: <div class="scrim" hidden><div class="modal" role="dialog" aria-modal="true" aria-labelledby="…">…</div></div> */
function s4Dialog(scrim) {
  clearTimeout(scrim._s4t); scrim.classList.remove("closing"); var old = scrim.querySelector(".ask"); if (old) old.remove();
  scrim._s4back = document.activeElement; scrim.hidden = false;
  var f = scrim.querySelector("[autofocus], .modal footer .btn.primary, input, select, textarea, button"); if (f) f.focus();
  if (!scrim._s4wired) {
    scrim._s4wired = true;
    scrim.addEventListener("click", function (e) { if (e.target === scrim && !scrim.hasAttribute("data-dirty")) s4Close(scrim); });
    scrim.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (e.defaultPrevented) return;   /* a dropdown or menu inside took it */
        e.stopPropagation();
        if (scrim.hasAttribute("data-dirty")) { s4Ask(scrim); return; }
        s4Close(scrim); return;
      }
      if (e.key !== "Tab") return;   /* keep focus inside the dialog */
      var els = Array.prototype.filter.call(scrim.querySelectorAll("a[href], button:not(:disabled), input:not(:disabled), select, textarea, [tabindex]:not([tabindex='-1'])"), function (x) { return x.offsetParent !== null; });
      if (!els.length) return; var first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
}
/* Unsaved input: Escape on a dialog with data-dirty="what would be lost" asks inside the dialog (Keep Editing / Discard); Escape again goes back to editing. */
function s4Ask(scrim) {
  var modal = scrim.querySelector(".modal"), ask = modal.querySelector(".ask");
  function leave(then) { var back = ask._s4back; ask.remove(); if (then) then(); else if (back && back.focus) back.focus(); }   /* focus returns to where it was, so keys keep reaching the dialog */
  if (ask) { leave(); return; }
  var what = scrim.getAttribute("data-dirty") || "your changes", back = document.activeElement;
  ask = document.createElement("div"); ask.className = "ask"; ask.setAttribute("role", "alertdialog"); ask.setAttribute("aria-label", "Discard changes?"); ask._s4back = back;
  var q = document.createElement("span"); q.textContent = "Discard " + what + "?"; ask.appendChild(q);
  var row = document.createElement("span"); row.className = "row"; ask.appendChild(row);
  var keep = document.createElement("button"); keep.type = "button"; keep.className = "btn"; keep.textContent = "Keep Editing"; keep.onclick = function () { leave(); };
  var drop = document.createElement("button"); drop.type = "button"; drop.className = "btn danger-fill"; drop.textContent = "Discard"; drop.onclick = function () { leave(function () { s4Close(scrim); }); };   /* the app clears data-dirty when it resets the dialog */
  row.appendChild(keep); row.appendChild(drop);
  var foot = modal.querySelector("footer"); if (foot) modal.insertBefore(ask, foot); else modal.appendChild(ask);
  keep.focus();
}
/* Closing: focus goes back at once (keys never wait), the dialog fades out (a phone sheet slides down), then it hides. */
function s4Close(scrim) {
  if (scrim._s4back && scrim._s4back.focus) scrim._s4back.focus();
  if (s4Still() || scrim.hidden) { scrim.hidden = true; return; }
  scrim.classList.add("closing"); clearTimeout(scrim._s4t);
  scrim._s4t = setTimeout(function () { scrim.hidden = true; scrim.classList.remove("closing"); }, innerWidth <= 760 ? 200 : 150);
}

function s4Toast(text, opt) {
  opt = opt || {}; var old = document.querySelector(".toast[data-s4]"); if (old) { clearTimeout(old._s4t); old.remove(); }
  var t = document.createElement("div"); t.className = "toast"; t.setAttribute("data-s4", ""); t.setAttribute("role", "status");
  var s = document.createElement("span"); s.textContent = text; t.appendChild(s);
  if (opt.action) { var b = document.createElement("button"); b.type = "button"; b.textContent = opt.action; b.onclick = function () { clearTimeout(t._s4t); t.remove(); if (opt.onAction) opt.onAction(); }; t.appendChild(b); }
  document.body.appendChild(t);
  if (opt.anchor) {   /* an undo pop-up: under (or above, near the bottom) the button it belongs to, with a pointer to it */
    t.classList.add("undo-pop"); var a = opt.anchor.getBoundingClientRect(), w = t.offsetWidth, h = t.offsetHeight;
    var up = a.bottom + 12 + h > innerHeight - 8 && a.top > h + 12, x = Math.min(Math.max(8, a.right - w), innerWidth - w - 8);
    t.style.left = x + "px"; t.style.top = (up ? a.top - h - 10 : a.bottom + 10) + "px"; t.classList.toggle("up", up);
    t.style.setProperty("--arrow-x", Math.min(Math.max(16, a.left + a.width / 2 - x), w - 16) + "px");
  }
  t._s4t = setTimeout(function () { t.classList.add("leaving"); setTimeout(function () { t.remove(); }, s4Still() ? 0 : 160); }, opt.ms || (opt.action ? 6500 : 4000));
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
    if (/^\s*[–—-]?\s*$/.test(v)) return { blank: true };
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
        if (x.blank || y.blank) return x.blank && y.blank ? a._s4i - b._s4i : x.blank ? 1 : -1;   /* blanks always last, whichever way it sorts */
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
  document.querySelectorAll("select").forEach(s4Select);
  s4Tips();
});
