/* S4 Glass 2.0 – small helpers, no dependencies. Paste into <head> before the stylesheet (the theme must be set before the
   first paint, or dark-mode users see a white flash). Everything else waits for the page and works on plain HTML.
   In React/Vue: keep the theme part in index.html; call s4Slider / s4Copy / s4Tips from effects, or re-create them in the framework.

   s4Theme("light" | "dark" | "auto")   theme toggle; data-theme is always "light" or "dark" (auto follows the device)
   s4Density("auto" | "standard" | "compact")  density setting; data-density is always "standard" or "compact" (auto: compact on a wide screen with a mouse, standard on touch and small screens). A [data-density-seg] box of buttons with data-v is wired and kept in step.
   s4Slider(box, ".on")                  one indicator that slides between options of .seg / .nav / .ptabs (on click only)
   s4Copy(el, text)                      copy + the 0.6s green flash (the tick stays until the green has faded); any [data-copy] element copies on click
   s4Tips(root)                          tooltips (.tip) for .trunc / .dcol text, only when it is actually cut off: a main line, a quieter sub line (<small> or .sub), a short delay, flips above near the bottom
   s4Menu(button, menu)                  open a .menu under its button; arrows / Home / End move, Enter picks; any [data-menu="id"] button opens #id
   s4Date(field)                         date / month picker: <div class="dp-field" data-type="date|month" data-min data-max data-value><input><button class="dp-open">…</button></div>. Every .dp-field is wired on load; the ISO value is in input.dataset.value and a change event fires. Touch screens get the phone's own picker (type=date / month)
   s4Combo(input)                        suggestions while typing, replacing <datalist>: an <input list="id"> is wired on load (free text still allowed; add data-native to keep the browser's)
   s4Search(input)                       an S4 clear button in every input[type=search] / .search (Escape clears too)
   data-tip="Copy Amount"                a tooltip on hover and keyboard focus for icon-only buttons and short hints (keep aria-label; data-tip-sub = a quieter second line)
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
  var timer, cur, SEL = ".trunc, .tip-on-cut, [data-tip]";
  function hide() { clearTimeout(timer); cur = null; tip.hidden = true; }
  function show(el) {
    if (cur !== el || !el.isConnected) return;
    var main, subText = "";
    if (el.hasAttribute("data-tip")) { main = el.getAttribute("data-tip"); subText = el.getAttribute("data-tip-sub") || ""; }
    else {
      var sub = el.querySelector("small, .sub"); subText = sub ? sub.textContent.trim() : "";
      main = (sub ? Array.prototype.map.call(el.childNodes, function (n) { return n === sub || (n.nodeType === 1 && n.contains(sub)) ? "" : n.textContent; }).join("") : el.textContent).trim();
      if (subText.toLowerCase() === main.toLowerCase()) subText = "";
    }
    tip.textContent = ""; var m = document.createElement("div"); m.textContent = main; tip.appendChild(m);
    if (subText) { var sm = document.createElement("small"); sm.textContent = subText; tip.appendChild(sm); }
    tip.hidden = false;
    var r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
    var x = Math.min(Math.max(8, r.left + (el.hasAttribute("data-tip") ? r.width / 2 - w / 2 : -9)), innerWidth - w - 8), y = r.bottom + 6 + h > innerHeight - 8 ? r.top - h - 6 : r.bottom + 6;
    tip.style.left = x + "px"; tip.style.top = y + "px";
  }
  function want(el, delay) {   /* cut-off text only when it is really cut off; a data-tip always */
    if (el === cur) return; hide();
    if (!el || (!el.hasAttribute("data-tip") && el.scrollWidth <= el.clientWidth + 1)) return;
    cur = el; timer = setTimeout(function () { show(el); }, delay);
  }
  (root || document).addEventListener("mouseover", function (e) { want(e.target.closest && e.target.closest(SEL), 280); });
  (root || document).addEventListener("mouseout", function (e) { if (cur && !(e.relatedTarget && cur.contains(e.relatedTarget)) && document.activeElement !== cur) hide(); });
  (root || document).addEventListener("focusin", function (e) { var el = e.target.closest && e.target.closest("[data-tip]"); if (el && el.matches(":focus-visible")) want(el, 0); });
  (root || document).addEventListener("focusout", hide);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") hide(); });
  document.addEventListener("mousedown", hide); addEventListener("blur", hide); addEventListener("scroll", hide, true);
}

/* Menus: placed under (or above) the button, kept inside the window; Escape or a click outside closes. Arrow keys, Home and End move between
   the items, Enter picks; opened from the keyboard, the first item takes focus. */
function s4Menu(btn, menu) {
  var open = !menu.hidden; if (menu._s4close) menu._s4close();   /* closing with its own button also drops its key handler */
  document.querySelectorAll(".menu:not(.static)").forEach(function (x) { x.hidden = true; });
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
    menu.hidden = true; btn.setAttribute("aria-expanded", "false"); menu._s4close = null;
    document.removeEventListener("click", close, true); document.removeEventListener("keydown", close); removeEventListener("scroll", scrolled, true);
    if (e && e.type === "keydown") btn.focus();
  }
  function scrolled(e) { if (!menu.contains(e.target)) close(); }
  menu._s4close = function () { close(); };
  setTimeout(function () { document.addEventListener("click", close, true); document.addEventListener("keydown", close); addEventListener("scroll", scrolled, true); });
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
  sel.parentNode.insertBefore(btn, sel); sel.classList.add("sel-native"); sel.tabIndex = -1; sel.setAttribute("aria-hidden", "true");   /* hidden from sight, not display:none, so the browser's own "required" check can still point at it */
  var list, act = 0, typed = "", typedAt = 0, uid = "s4sel" + Math.random().toString(36).slice(2, 7);
  function opts() { return Array.prototype.slice.call(sel.options); }
  function sync() { var o = sel.options[sel.selectedIndex]; btn.querySelector(".sel-v").textContent = o ? o.textContent : ""; btn.disabled = sel.disabled; }
  function mirror() {   /* the error look and aria-invalid follow the select, so form code can keep talking to the <select> */
    var bad = sel.classList.contains("bad") || sel.getAttribute("aria-invalid") === "true"; btn.classList.toggle("bad", bad);
    if (sel.hasAttribute("aria-invalid")) btn.setAttribute("aria-invalid", sel.getAttribute("aria-invalid")); else btn.removeAttribute("aria-invalid");
    if (sel.hasAttribute("aria-describedby")) btn.setAttribute("aria-describedby", sel.getAttribute("aria-describedby"));
  }
  sync(); mirror(); sel.addEventListener("change", sync);
  /* code that sets sel.value / selectedIndex, a form reset, or new options all update the button */
  ["value", "selectedIndex"].forEach(function (k) {
    var d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, k);
    Object.defineProperty(sel, k, { configurable: true, get: function () { return d.get.call(sel); }, set: function (v) { d.set.call(sel, v); sync(); } });
  });
  if (sel.form) sel.form.addEventListener("reset", function () { setTimeout(sync); });
  if (window.MutationObserver) new MutationObserver(function () { sync(); mirror(); }).observe(sel, { attributes: true, attributeFilter: ["class", "aria-invalid", "aria-describedby", "disabled"], childList: true, subtree: true, characterData: true });
  sel.focus = function () { btn.focus(); };   /* error summaries and validation focus the select: send it to the button */
  sel.addEventListener("focus", function () { btn.focus(); });
  sel.addEventListener("invalid", function () { btn.classList.add("bad"); });
  Array.prototype.forEach.call(sel.labels || [], function (l) { l.addEventListener("click", function (e) { if (!btn.contains(e.target)) { e.preventDefault(); btn.focus(); } }); });
  function ok(i) { var o = sel.options[i]; return o && !o.disabled; }
  function step(from, dir) { var n = sel.options.length; for (var i = from + dir; i >= 0 && i < n; i += dir) if (ok(i)) return i; return from; }
  function pick(i) {
    var o = opts()[i]; shut(true);
    if (o && !o.disabled && sel.selectedIndex !== i) { sel.selectedIndex = i; sel.dispatchEvent(new Event("change", { bubbles: true })); }
  }
  function mark(i) {
    act = i; Array.prototype.forEach.call(list.children, function (li, k) { li.classList.toggle("act", k === i); });
    btn.setAttribute("aria-activedescendant", uid + "-" + i); var li = list.children[i]; if (li && li.scrollIntoView) li.scrollIntoView({ block: "nearest" });
  }
  function away(e) { if (!btn.contains(e.target) && !list.contains(e.target)) shut(); }
  function scrolled(e) { if (list && !list.contains(e.target)) shut(); }   /* the list is fixed: close it rather than leave it behind when the page scrolls */
  function shut(focus) {
    if (!list) return; list.remove(); list = null; btn.setAttribute("aria-expanded", "false"); btn.removeAttribute("aria-activedescendant");
    document.removeEventListener("mousedown", away); removeEventListener("resize", shut); removeEventListener("blur", shut); removeEventListener("scroll", scrolled, true); if (focus) btn.focus();
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
    list.style.minWidth = Math.min(Math.max(r.width, 160), innerWidth - 16) + "px"; list.style.left = Math.max(8, Math.min(r.left, innerWidth - list.offsetWidth - 8)) + "px"; list.style.maxHeight = Math.min(320, up ? above : below) + "px";
    if (up) { list.classList.add("up"); list.style.bottom = innerHeight - r.top + 4 + "px"; } else list.style.top = r.bottom + 4 + "px";
    mark(ok(sel.selectedIndex) ? sel.selectedIndex : step(-1, 1));
    document.addEventListener("mousedown", away); addEventListener("resize", shut); addEventListener("blur", shut); addEventListener("scroll", scrolled, true);
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
    if (k === "ArrowDown") mark(step(act, 1)); else if (k === "ArrowUp") mark(step(act, -1));
    else if (k === "Home") mark(ok(0) ? 0 : step(0, 1)); else if (k === "End") mark(ok(n - 1) ? n - 1 : step(n - 1, -1));
    else if (k === "Enter" || k === " ") pick(act);
    else {
      var now = Date.now(); typed = (now - typedAt > 700 ? "" : typed) + k.toLowerCase(); typedAt = now;
      var from = list ? act : Math.max(0, sel.selectedIndex), o = opts(), hit = -1;
      for (var q = 0; q < n && hit < 0; q++) { var c = (q + from + (typed.length === 1 ? 1 : 0)) % n; if (!o[c].disabled && o[c].textContent.toLowerCase().indexOf(typed) === 0) hit = c; }
      if (hit >= 0) { if (list) mark(hit); else if (sel.selectedIndex !== hit) { sel.selectedIndex = hit; sel.dispatchEvent(new Event("change", { bubbles: true })); } }
    }
  });
}

/* Suggestions while typing: <input list="vendors"> + <datalist id="vendors"><option value="…"></datalist>. The browser's own list is replaced by the dropdown's look;
   free text is still allowed (nothing is forced to match). Arrows move, Enter or a click picks, Escape closes; matches are those containing what was typed, starting-with first. */
function s4Combo(input) {
  var dl = input.getAttribute("list") && document.getElementById(input.getAttribute("list"));
  if (input._s4combo || !dl || input.hasAttribute("data-native")) return; input._s4combo = true;
  var src = Array.prototype.map.call(dl.options, function (o) { return o.value; });
  input.removeAttribute("list"); input.setAttribute("autocomplete", "off"); input.setAttribute("role", "combobox"); input.setAttribute("aria-autocomplete", "list"); input.setAttribute("aria-expanded", "false");
  var list, act = -1, uid = "s4cb" + Math.random().toString(36).slice(2, 7), hits = [];
  function esc(t) { return t.replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function shut() { if (!list) return; list.remove(); list = null; act = -1; input.setAttribute("aria-expanded", "false"); input.removeAttribute("aria-activedescendant"); document.removeEventListener("mousedown", away); removeEventListener("resize", shut); }
  function away(e) { if (e.target !== input && !(list && list.contains(e.target))) shut(); }
  function mark(i) { act = i; if (!list) return; Array.prototype.forEach.call(list.children, function (li, k) { li.classList.toggle("act", k === i); }); if (i >= 0) { input.setAttribute("aria-activedescendant", uid + "-" + i); list.children[i].scrollIntoView({ block: "nearest" }); } else input.removeAttribute("aria-activedescendant"); }
  function pick(v) { input.value = v; shut(); input.dispatchEvent(new Event("input", { bubbles: true })); input.dispatchEvent(new Event("change", { bubbles: true })); }
  function refresh() {
    var q = input.value.trim().toLowerCase();
    hits = src.filter(function (v) { return v.toLowerCase().indexOf(q) >= 0 && v.toLowerCase() !== q; });
    hits.sort(function (a, b) { return (b.toLowerCase().indexOf(q) === 0) - (a.toLowerCase().indexOf(q) === 0); });
    hits = hits.slice(0, 50);
    if (!hits.length || document.activeElement !== input) { shut(); return; }
    if (!list) { list = document.createElement("ul"); list.className = "sel-list"; list.id = uid; list.setAttribute("role", "listbox"); document.body.appendChild(list); input.setAttribute("aria-expanded", "true"); input.setAttribute("aria-controls", uid);
      document.addEventListener("mousedown", away); addEventListener("resize", shut); }
    list.innerHTML = hits.map(function (v, i) { var k = q ? v.toLowerCase().indexOf(q) : -1; return '<li id="' + uid + "-" + i + '" role="option"><span>' + (k >= 0 ? esc(v.slice(0, k)) + "<mark>" + esc(v.slice(k, k + q.length)) + "</mark>" + esc(v.slice(k + q.length)) : esc(v)) + "</span></li>"; }).join("");
    Array.prototype.forEach.call(list.children, function (li, i) { li.addEventListener("mousemove", function () { mark(i); }); li.addEventListener("mousedown", function (e) { e.preventDefault(); pick(hits[i]); }); });
    var r = input.getBoundingClientRect(), below = innerHeight - r.bottom - 12, above = r.top - 12, up = below < 180 && above > below;
    list.style.left = Math.min(r.left, innerWidth - 168) + "px"; list.style.minWidth = Math.max(r.width, 160) + "px"; list.style.maxHeight = Math.min(280, up ? above : below) + "px";
    list.classList.toggle("up", up); list.style.top = up ? "" : r.bottom + 4 + "px"; list.style.bottom = up ? innerHeight - r.top + 4 + "px" : "";
    mark(-1);
  }
  input.addEventListener("input", refresh); input.addEventListener("focus", function () { if (input.value) refresh(); }); input.addEventListener("blur", shut);
  input.addEventListener("keydown", function (e) {
    var k = e.key;
    if (k === "ArrowDown" || k === "ArrowUp") { if (!list) { refresh(); if (!list) return; } e.preventDefault(); mark(k === "ArrowDown" ? Math.min(hits.length - 1, act + 1) : Math.max(0, act - 1)); }
    else if (k === "Enter" && list && act >= 0) { e.preventDefault(); pick(hits[act]); }
    else if (k === "Escape" && list) { e.preventDefault(); e.stopPropagation(); shut(); }
  });
}

/* Search fields: the browser's own clear x is hidden; this adds an S4 one that shows while there is text. */
function s4Search(input) {
  if (input._s4search || input.closest(".search-field") || input.hasAttribute("data-native")) return; input._s4search = true;
  var w = document.createElement("span"); w.className = "search-field"; input.parentNode.insertBefore(w, input); w.appendChild(input);
  var b = document.createElement("button"); b.type = "button"; b.className = "search-x"; b.setAttribute("aria-label", "Clear Search"); b.hidden = !input.value; b.tabIndex = -1;
  b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';
  w.appendChild(b);
  function sync() { b.hidden = !input.value; }
  function clear() { input.value = ""; sync(); input.dispatchEvent(new Event("input", { bubbles: true })); input.focus(); }
  input.addEventListener("input", sync); b.addEventListener("mousedown", function (e) { e.preventDefault(); }); b.addEventListener("click", clear);
  input.addEventListener("keydown", function (e) { if (e.key === "Escape" && input.value) { e.preventDefault(); e.stopPropagation(); clear(); } });
}

/* Date and month picker (decided: S4 calendar pop-over on desktop, the phone's own picker on touch). A .dp-field holds a text input that still accepts a
   typed date (M/D/YYYY, YYYY-MM-DD; "Sep 2026" for a month) and a calendar button. The value is ISO ("2026-09-30" / "2026-09") in input.dataset.value;
   a change event fires on the input. Keys in the calendar: arrows (a day or a week), Page Up / Down (a month; with Shift a year), Home / End (week start / end),
   Enter picks, Escape closes. Weeks start on Sunday; set s4Date.week = 1 for Monday. */
var s4Date = (function () {
  var MON = ["January","February","March","April","May","June","July","August","September","October","November","December"], MS = MON.map(function (m) { return m.slice(0, 3); });
  var DOW = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  function p2(n) { return (n < 10 ? "0" : "") + n; }
  function iso(y, m, d) { return y + "-" + p2(m + 1) + "-" + p2(d); }
  function dateOf(s) { var a = s.split("-"); return new Date(+a[0], +a[1] - 1, +(a[2] || 1)); }
  function isoOf(dt) { return iso(dt.getFullYear(), dt.getMonth(), dt.getDate()); }
  function monthOf(dt) { return iso(dt.getFullYear(), dt.getMonth(), 1).slice(0, 7); }
  function fmtDate(s) { var d = dateOf(s); return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear(); }
  function fmtLong(s) { var d = dateOf(s); return MS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear(); }
  function fmtMonth(s) { var d = dateOf(s); return MS[d.getMonth()] + " " + d.getFullYear(); }
  function parseDate(t) {
    var m = t.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2}|\d{4})$/), y, mo, d;
    if (m) { mo = +m[1] - 1; d = +m[2]; y = +m[3]; if (y < 100) y += 2000; }
    else if ((m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) { y = +m[1]; mo = +m[2] - 1; d = +m[3]; } else return null;
    var dt = new Date(y, mo, d); return dt.getMonth() === mo && dt.getDate() === d ? iso(y, mo, d) : null;
  }
  function parseMonth(t) {
    var m = t.match(/^([A-Za-z]{3,9})\.?\s+(\d{4})$/), y, mo;
    if (m) { mo = MS.indexOf(m[1].slice(0, 1).toUpperCase() + m[1].slice(1, 3).toLowerCase()); y = +m[2]; }
    else if ((m = t.match(/^(\d{1,2})[\/\-](\d{4})$/)) || (m = t.match(/^(\d{4})-(\d{1,2})$/))) { var a = +m[1], b = +m[2]; if (a > 31) { y = a; mo = b - 1; } else { mo = a - 1; y = b; } } else return null;
    return mo >= 0 && mo < 12 ? iso(y, mo, 1).slice(0, 7) : null;
  }
  var CL = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CR = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* the calendar itself: fills host, calls cfg.onPick(iso or "") */
  function build(host, cfg) {
    var type = cfg.type, month = type === "month", W = s4Date.week || 0, today = isoOf(new Date()), tNow = month ? today.slice(0, 7) : today;
    var lo = cfg.min ? (month ? cfg.min.slice(0, 7) : cfg.min) : "", hi = cfg.max ? (month ? cfg.max.slice(0, 7) : cfg.max) : "";
    var sel = cfg.value || "", base = sel || (lo && tNow < lo ? lo : hi && tNow > hi ? hi : tNow);
    var view = { y: dateOf(base).getFullYear(), m: dateOf(base).getMonth() }, cur = base;
    function ok(k) { return !(lo && k < lo) && !(hi && k > hi); }
    host.innerHTML = '<div class="dp-head"><button class="btn icon subtle" type="button" data-nav="-1" aria-label="' + (month ? "Previous Year" : "Previous Month") + '">' + CL + '</button><b class="dp-title" aria-live="polite"></b><button class="btn icon subtle" type="button" data-nav="1" aria-label="' + (month ? "Next Year" : "Next Month") + '">' + CR + '</button></div><div class="dp-body"></div><div class="dp-foot"><button class="btn subtle sm" type="button" data-act="clear">Clear</button><button class="btn subtle sm" type="button" data-act="today">' + (month ? "This Month" : "Today") + '</button></div>';
    var title = host.querySelector(".dp-title"), body = host.querySelector(".dp-body");
    host.querySelector('[data-act="today"]').disabled = !ok(tNow);
    function paint(focus) {
      var html = "", i;
      if (month) {
        title.textContent = view.y;
        for (i = 0; i < 12; i++) { var k = iso(view.y, i, 1).slice(0, 7); html += '<button type="button" class="dp-m' + (k === sel ? " on" : k === tNow ? " today" : "") + '" data-v="' + k + '" tabindex="' + (k === cur ? 0 : -1) + '"' + (ok(k) ? "" : " disabled") + ' aria-pressed="' + (k === sel) + '" aria-label="' + MON[i] + " " + view.y + '">' + MS[i] + '</button>'; }
        body.innerHTML = '<div class="dp-months" role="group" aria-label="' + view.y + '">' + html + '</div>';
      } else {
        title.textContent = MON[view.m] + " " + view.y;
        var lead = (new Date(view.y, view.m, 1).getDay() - W + 7) % 7;
        for (i = 0; i < 7; i++) html += '<span class="dp-dow" aria-hidden="true">' + DOW[(i + W) % 7] + '</span>';
        for (i = 0; i < 42; i++) {
          var dt = new Date(view.y, view.m, 1 - lead + i), k2 = isoOf(dt);
          html += '<button type="button" class="dp-d' + (k2 === sel ? " on" : k2 === today ? " today" : "") + (dt.getMonth() !== view.m ? " dim" : "") + '" data-v="' + k2 + '" tabindex="' + (k2 === cur ? 0 : -1) + '"' + (ok(k2) ? "" : " disabled") + ' aria-pressed="' + (k2 === sel) + '" aria-label="' + fmtLong(k2) + '">' + dt.getDate() + '</button>';
        }
        body.innerHTML = '<div class="dp-grid" role="group" aria-label="' + MON[view.m] + " " + view.y + '">' + html + '</div>';
      }
      if (!body.querySelector('[tabindex="0"]')) { var f = body.querySelector(".dp-d:not(.dim):not(:disabled), .dp-m:not(:disabled)"); if (f) f.tabIndex = 0; }
      if (focus) { var t = body.querySelector('[tabindex="0"]'); if (t) t.focus(); }
    }
    function go(k, focus) { cur = k; var d = dateOf(k); view = { y: d.getFullYear(), m: d.getMonth() }; paint(focus); }
    host.addEventListener("click", function (e) {
      var n = e.target.closest("[data-nav]"), b = e.target.closest("[data-v]"), a = e.target.closest("[data-act]");
      if (n) { var k = +n.dataset.nav; if (month) view.y += k; else { var d = new Date(view.y, view.m + k, 1); view = { y: d.getFullYear(), m: d.getMonth() }; } cur = ""; paint(false); return; }
      if (b && !b.disabled) { sel = b.dataset.v; cfg.onPick(sel); return; }
      if (a && !a.disabled) cfg.onPick(a.dataset.act === "clear" ? "" : tNow);
    });
    host.addEventListener("keydown", function (e) {
      var t = e.target.closest("[data-v]"); if (!t) return;
      var d = dateOf(cur || t.dataset.v), k = e.key, nx = null;
      if (month) {
        var st = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 }[k];
        if (st) nx = iso(d.getFullYear(), d.getMonth() + st, 1).slice(0, 7);
        else if (k === "PageUp" || k === "PageDown") nx = iso(d.getFullYear() + (k === "PageUp" ? -1 : 1), d.getMonth(), 1).slice(0, 7);
        else if (k === "Home") nx = iso(d.getFullYear(), 0, 1).slice(0, 7); else if (k === "End") nx = iso(d.getFullYear(), 11, 1).slice(0, 7);
      } else {
        var dd = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[k], wd = (d.getDay() - W + 7) % 7;
        if (dd) nx = isoOf(new Date(d.getFullYear(), d.getMonth(), d.getDate() + dd));
        else if (k === "PageUp" || k === "PageDown") { var mv = (k === "PageUp" ? -1 : 1) * (e.shiftKey ? 12 : 1), last = new Date(d.getFullYear(), d.getMonth() + mv + 1, 0).getDate(); nx = isoOf(new Date(d.getFullYear(), d.getMonth() + mv, Math.min(d.getDate(), last))); }
        else if (k === "Home") nx = isoOf(new Date(d.getFullYear(), d.getMonth(), d.getDate() - wd));
        else if (k === "End") nx = isoOf(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 6 - wd));
      }
      if (nx) { e.preventDefault(); if (ok(month ? nx : nx)) go(nx, true); }
    });
    paint(false);
    return { focus: function () { var t = body.querySelector('[tabindex="0"]'); if (t) t.focus(); } };
  }

  var pop, openField;
  function closePop(refocus) {
    if (!openField) return; var f = openField; openField = null;
    pop.hidden = true; pop.innerHTML = ""; f.btn.setAttribute("aria-expanded", "false");
    document.removeEventListener("mousedown", away, true); removeEventListener("resize", closePop); removeEventListener("scroll", scrolled, true);
    if (refocus) f.input.focus();
  }
  function away(e) { if (openField && !pop.contains(e.target) && !openField.el.contains(e.target)) closePop(false); }
  function scrolled(e) { if (openField && !pop.contains(e.target)) closePop(false); }
  function message(f, msg) {
    var w = f.el.closest("label.f, .fld"), er = w && w.querySelector(".err");
    f.input.classList.toggle("bad", !!msg); f.input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (w) w.classList.toggle("bad", !!msg);
    if (!er && msg && w) { er = document.createElement("span"); er.className = "err"; er.setAttribute("role", "alert"); er._s4made = true; w.appendChild(er); }   /* no .err in the markup: make one under the field */
    if (er) { if (!msg && er._s4made) er.remove(); else (er.querySelector("span") || er).textContent = msg || ""; }   /* an .err with an icon keeps it: the words go in its <span> */
  }
  function show(f) { return f.value ? (f.type === "month" ? fmtMonth(f.value) : fmtDate(f.value)) : ""; }
  function commit(f, v) {
    var changed = f.value !== v; f.value = v; f.input.dataset.value = v; if (!f.native) f.input.value = show(f); message(f, "");
    if (changed) f.input.dispatchEvent(new Event("change", { bubbles: true }));
  }
  function openPop(f) {
    if (openField === f) { closePop(true); return; } closePop(false); openField = f;
    if (!pop) { pop = document.createElement("div"); pop.className = "dp-pop"; pop.hidden = true; document.body.appendChild(pop); }
    f.btn.setAttribute("aria-expanded", "true");
    pop.innerHTML = '<div class="dp"></div>'; pop.hidden = false;
    var cal = build(pop.firstChild, { type: f.type, value: f.value, min: f.min, max: f.max, onPick: function (v) { commit(f, v); closePop(true); } });
    var r = f.el.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
    pop.style.left = Math.min(Math.max(8, r.left), innerWidth - w - 8) + "px";
    pop.style.top = (r.bottom + 6 + h <= innerHeight - 8 ? r.bottom + 6 : r.top > h + 14 ? r.top - h - 6 : Math.max(8, innerHeight - h - 8)) + "px";   /* below, else above, else as low as fits */
    cal.focus();
    pop.onkeydown = function (e) { if (e.key === "Escape") { e.stopPropagation(); e.preventDefault(); closePop(true); } else if (e.key === "Tab") { closePop(false); (e.shiftKey ? f.input : f.btn || f.input).focus(); } };   /* the browser's Tab then carries on from the field, not from the end of the page */
    setTimeout(function () { document.addEventListener("mousedown", away, true); addEventListener("resize", closePop); addEventListener("scroll", scrolled, true); });
  }

  function wire(el) {
    if (el._s4dp) return; el._s4dp = true;
    var input = el.querySelector("input"), btn = el.querySelector(".dp-open"); if (!input) return;
    var type = el.dataset.type === "month" ? "month" : "date", native = !!(window.matchMedia && matchMedia("(pointer: coarse)").matches);
    var f = { el: el, input: input, btn: btn, type: type, min: el.dataset.min || "", max: el.dataset.max || "", value: el.dataset.value || input.dataset.value || "", native: native };
    var mn = type === "month" ? f.min.slice(0, 7) : f.min, mx = type === "month" ? f.max.slice(0, 7) : f.max;
    if (!f.value && input.value && !native) { f.value = (type === "month" ? parseMonth : parseDate)(input.value.trim()) || ""; }
    input.dataset.value = f.value;
    if (native) {   /* the phone's own picker: it brings the right wheel or calendar, the language and the accessibility for free */
      el.classList.add("native"); input.type = type; if (mn) input.min = mn; if (mx) input.max = mx; input.value = f.value;
      input.addEventListener("change", function () { f.value = input.value; input.dataset.value = f.value; });
      return;
    }
    input.value = show(f);
    input.addEventListener("change", function (e) { if (e.isTrusted) e.stopImmediatePropagation(); });   /* typing fires the browser's own change with a display string; ours (ISO value) is the one that counts */
    if (btn) { btn.setAttribute("aria-haspopup", "dialog"); btn.setAttribute("aria-expanded", "false"); btn.addEventListener("click", function () { openPop(f); }); }
    input.addEventListener("keydown", function (e) { if (e.key === "ArrowDown" && e.altKey) { e.preventDefault(); openPop(f); } });
    input.addEventListener("blur", function () {   /* a typed date is read when you leave the field */
      var t = input.value.trim(); if (!t) { if (f.value) commit(f, ""); else message(f, ""); return; }
      var v = (type === "month" ? parseMonth : parseDate)(t);
      if (!v) { message(f, type === "month" ? "Use a month and year, like Sep 2026" : /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(t) ? "There is no " + t + ": check the day and month" : "Use M/D/YYYY, like 9/30/2026"); return; }
      if ((mn && v < mn) || (mx && v > mx)) { message(f, type === "month" ? "Pick a month between " + (mn ? fmtMonth(mn) : "the start") + " and " + (mx ? fmtMonth(mx) : "any later month") : "Pick a date between " + (f.min ? fmtLong(f.min) : "the start") + " and " + (f.max ? fmtLong(f.max) : "any later day")); return; }
      commit(f, v);
    });
    el._s4f = f;
  }
  function api(el) { if (el && el.classList) wire(el); }
  api.week = 0; api.wire = wire;
  api.set = function (el, v) { wire(el); var f = el._s4f; if (f) commit(f, v); else { var i = el.querySelector("input"); i.value = v; i.dataset.value = v; } };
  api.get = function (el) { var i = el.querySelector("input"); return i ? i.dataset.value || "" : ""; };
  return api;
})();

/* Dialogs: <div class="scrim" hidden><div class="modal" role="dialog" aria-modal="true" aria-labelledby="…">…</div></div> */
function s4Dialog(scrim) {
  clearTimeout(scrim._s4t); scrim.classList.remove("closing"); var old = scrim.querySelector(".ask"); if (old) old.remove();
  scrim._s4back = document.activeElement;
  var up = document.querySelectorAll(".scrim:not([hidden])").length; scrim.style.zIndex = up ? "calc(var(--z-modal) + " + up + ")" : "";   /* a dialog opened from a dialog sits on top of it */
  scrim.hidden = false;
  var f = ["[autofocus]", ".modal .body input, .modal .body select, .modal .body textarea, .modal .body button.sel", ".modal footer .btn.primary", "input, select, textarea, button"].reduce(function (a, q) {   /* in order of preference, not page order (the header Close comes first in the page) */
    return a || Array.prototype.filter.call(scrim.querySelectorAll(q), function (el) { return el.offsetParent !== null && !el.disabled; })[0]; }, null); if (f) f.focus();
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
      var els = Array.prototype.filter.call(scrim.querySelectorAll("a[href], button:not(:disabled), input:not(:disabled), select:not(.sel-native), textarea, [tabindex]:not([tabindex='-1'])"), function (x) { return x.offsetParent !== null; });
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
  document.querySelectorAll(".dp-field").forEach(s4Date);
  document.querySelectorAll("input[list]").forEach(s4Combo);
  document.querySelectorAll("input[type=search], input.search").forEach(s4Search);
  s4Tips();
});
