# S4 Glass 2.0 – component markup

Copy-paste markup for every component in `toolkit/s4.css`. Icons are shown as `<svg data-ic="name">` (filled in by `icons.js`); in a built app paste the SVG itself. See `DESIGN.md` for when to use what. `demo/components.html` shows them all live.

Contents: [Page setup](#page-setup) · [App shell](#app-shell) · [Phone tab bar](#phone-tab-bar) · [List and detail](#list-and-detail) · [Buttons](#buttons) · [Fields](#fields) · [Choosers](#choosers) · [Status](#status) · [Cards](#cards) · [Tables](#tables) · [Copy chips and keys](#copy-chips-and-keys) · [Menus](#menus) · [Dialogs and sheets](#dialogs-and-sheets) · [Toasts and tooltips](#toasts-and-tooltips) · [Folds and steps](#folds-and-steps) · [Web page](#web-page) · [Layout helpers](#layout-helpers)

## Page setup

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script data-s4 src="toolkit/s4.js"></script>                      <!-- first: sets the theme before paint -->
<link data-s4 rel="stylesheet" href="toolkit/fonts.css">
<link data-s4 rel="stylesheet" href="toolkit/s4.css">
<style>:root { --accent: #047857; --accent-2: #0f766e; --accent-light: #6ee7b7; }</style>
<script data-s4 src="toolkit/icons.js"></script>                   <!-- quick pages only -->
```
`python3 toolkit/inline.py page.html out.html` makes it one self-contained file. `viewport-fit=cover` is what lets the safe-area insets work on iPhones.

## App shell

```html
<div class="app">
  <nav class="nav" aria-label="Main">
    <div class="brand"><img src="logo.png" alt=""><span>App Name<small>Company</small></span></div>
    <a class="item active" href="#" aria-current="page"><svg data-ic-duo="widget-5"></svg><span class="lbl">Dashboard</span></a>
    <div class="group">Reconcile</div>
    <a class="item" href="#"><svg data-ic-duo="checklist-minimalistic"></svg><span class="lbl">Transactions</span><span class="count">39</span></a>
    <div class="foot">Saved in this browser</div>
  </nav>
  <div class="main">
    <div class="banner info"><svg data-ic="info-circle"></svg>Time for a backup.<button class="btn sm">Save a Backup</button></div>
    <header class="topbar">
      <div class="ttl"><h1>Transactions</h1><span class="sub">Go down the list: assign it, match it, or flag it.</span></div>
      <div class="actions">
        <button class="btn icon subtle" data-theme-toggle aria-label="Switch Light or Dark"><svg data-ic="moon"></svg></button>
        <button class="btn primary"><svg data-ic="upload"></svg>Import</button>
      </div>
    </header>
    <main class="content">…</main>
  </div>
</div>
```
Wrap nav labels in `.lbl` so the ≤980px icon rail can hide them. `.content.flush` removes padding (full-bleed split views); `.content.center` caps width for single-page tools. A single-page tool with no nav: `<div class="app solo"><div class="main">…</div></div>`.

## Phone tab bar

```html
<div class="app has-tabbar">
  <nav class="nav">…</nav>                 <!-- desktop -->
  <div class="main">…</div>
  <nav class="tabbar" aria-label="Main">    <!-- phone (≤760px) -->
    <a class="tab on" href="#" aria-current="page"><svg data-ic-duo="widget-5"></svg>Home</a>
    <a class="tab" href="#"><svg data-ic-duo="document-text"></svg>Invoices<span class="count">4</span></a>
  </nav>
</div>
<button class="btn primary fab"><svg data-ic="add-circle"></svg>New</button>   <!-- optional, floats above the tab bar on phones -->
```
3–5 tabs. Without `.has-tabbar`, the nav becomes a scrolling row under the top bar on phones.

## List and detail

```html
<main class="content flush">
  <div class="split">
    <section class="list-pane"><div class="filters">…</div><div class="table-wrap">…</div></section>
    <aside class="detail open">…</aside>   <!-- ≤980px: covers the list; toggle .open, add a Back button -->
  </div>
</main>
```

## Buttons

```html
<button class="btn primary"><svg data-ic="upload"></svg>Import</button>   <!-- one per area -->
<button class="btn">Export</button>
<button class="btn subtle">Cancel</button>
<button class="btn icon" aria-label="Undo"><svg data-ic="undo-left"></svg></button>
<button class="btn sm">Small</button>  <button class="btn lg">Web CTA</button>  <button class="btn block">Full Width</button>
<button class="btn on" aria-pressed="true"><svg data-ic="lock-keyhole-minimalistic"></svg>Locked</button>
<button class="btn attn"><svg data-ic="diskette"></svg>Backup<span class="pill">52</span></button>   <!-- steady, never blinks -->
<button class="btn danger">Delete</button>  <button class="btn danger-fill">Delete All Data</button>
<button class="btn primary">Accept<span class="kbd on-pri">Enter</span></button>
<button class="lnk">Show All</button>
```

## Fields

```html
<div class="form-grid">
  <label class="f">Company<select><option>2101 · Northwind Tech</option></select></label>
  <label class="f">GL Account<input type="text" inputmode="numeric" placeholder="e.g. 61500000"><span class="hint">8 digits</span></label>
  <label class="f">SAP Document<input type="text" class="bad"><span class="err">10 digits needed</span></label>
  <label class="f span2">Note<textarea></textarea></label>
</div>
<label class="chk"><input type="checkbox">The full statement is in</label>
<label class="chk big"><input type="checkbox"><span>Test Mode<small>No reminders while on</small></span></label>
<label class="switch"><input type="checkbox"><span class="track"></span>Test Mode</label>
<input type="search" class="search" placeholder="Search description, amount, SAP Document…">
```
Use `inputmode` (numeric / decimal / email) so phones show the right keyboard.

## Choosers

```html
<div class="seg" role="group" aria-label="Filter">               <!-- one of many; starts on All -->
  <button class="on" aria-pressed="true">All<span class="n">46</span></button><button aria-pressed="false">Matched<span class="n">3</span></button>
</div>
<div class="seg scroll">…</div>                                   <!-- one row that scrolls on a phone -->
<button class="fchip" aria-pressed="true">To Sort<span class="n">39</span></button>   <!-- independent toggles -->
<div class="ptabs">                                               <!-- choose a mode -->
  <button class="on"><svg class="ic lg" data-ic-duo="link-circle"></svg>Match</button>
  <button class="flag"><svg class="ic lg" data-ic-duo="document-text"></svg>Journal Entry</button>
</div>
<button class="tile on"><b>Nets to $0</b><small>Two rows cancel out</small></button>
```
`s4.js` wires `.seg` and `.ptabs` clicks and the sliding pill automatically; add `data-manual` to a `.seg` you drive yourself. When a tab swaps the content below it, re-render the panel and call `s4Swap(panel)` so the new content fades in where it is (no slide).

## Status

```html
<span class="badge ok">Matched</span> <span class="badge warn">To Sort</span> <span class="badge bad">Difference</span>
<span class="badge mute">Carried</span> <span class="badge accent">Journal Entry</span> <span class="badge">No Data</span>
<span class="badge solid"><svg data-ic="stars"></svg>Suggested</span>   <!-- needs your decision -->
<span class="chip">40100100</span>  <span class="dot ok"></span>
<div class="bar" role="img" aria-label="58% matched"><i class="ok" style="width:58%"></i><i class="warn" style="width:12%"></i></div>
<article class="card edge warn">…</article>   <!-- status as a coloured top edge -->
<tr class="st-ok">…</tr>                       <!-- status as the slim left edge of a row -->
```

## Cards

```html
<section class="card">
  <div class="card-head"><h3>Bank Statement</h3><span class="badge ok">Ties</span></div>
  <div class="kv"><span class="k">Beginning Balance</span><span class="num">403,443.13</span>
    <span class="k sum">Ending Balance</span><span class="num sum">124,100.11</span></div>
</section>
<div class="card stat"><span>Outstanding</span><b>18,420.00</b></div>
<div class="grid-4">…one .card per entity…</div>
<div class="sug"><b>Suggested Match</b><span class="fs-sm muted">Doc 400001234 · same amount</span></div>
<div class="note warn">Closing day passed – Month End not tied.</div>
<div class="hidden-note">Row hidden by the current filter.<button class="lnk">Show All</button></div>
<div class="card empty"><svg class="ic lg" data-ic-duo="check-circle"></svg><h2>Nothing left to match</h2><p>…</p></div>
<div class="card flush"><div class="list">
  <a class="li" href="#"><svg class="ic" data-ic="document-text"></svg><span class="li-main"><b>Title</b><small>Meta</small></span><span class="li-end num">(62,931.96)</span></a>
</div></div>
```

## Tables

```html
<div class="table-wrap scroll">                       <!-- .scroll: sticky header inside a scrolling box -->
  <table class="t cards">                             <!-- .cards: rows become cards on a phone -->
    <thead><tr>
      <th class="sortable sorted"><button class="th-sort">Date<svg class="sort-ic" data-ic="alt-arrow-down"></svg></button></th>
      <th class="dcol">Description</th><th>Status</th><th class="num">Amount</th></tr></thead>
    <tbody>
      <tr class="r st-ok"><td data-label="Date">9/28</td>
        <td class="dcol lead"><span class="trunc">Pre-authorized ACH Debit</span><span class="sub">Second line</span></td>
        <td data-label="Status"><span class="badge ok">Matched</span></td>
        <td class="num" data-label="Amount"><span class="brk">(</span>3,688.74<span class="brk">)</span></td></tr>
    </tbody>
  </table>
</div>
```
Sorting is automatic for `th.sortable` (`s4Sort`); give status cells `data-sort` with their urgency rank (bad 1 … mute 6) and cells whose text doesn't sort well (dates as 9/28) an ISO `data-sort`. `tr.r` clickable · `tr.sel` selected (neutral) · `tr.done` finished (quieter) · `td.row-acts` row buttons · `table.t.compact` dense · `td.wrap` lets a short column wrap. On phones every `td` needs `data-label`; the description cell gets `.lead` and moves to the top.

## Copy chips and keys

```html
<button class="copy" data-copy="-1289.30"><span><span class="brk">(</span>1,289.30<span class="brk">)</span></span><svg data-ic="copy"></svg></button>
<button class="copy" data-copy="124100.11"><span>124,100.11<span class="psp">)</span></span><svg data-ic="copy"></svg></button>
<span class="copy empty">–</span>
<div class="keys"><span class="kh"><span class="kbd">J</span>Journal Entry</span><span class="kh"><span class="kbd">Enter ↵</span>Match</span></div>
```
Wrap the value in its own `<span>` (the chip is a flex box). Negatives copy as `-1289.30`.

## Menus

```html
<button class="btn" data-menu="backup" aria-haspopup="menu" aria-expanded="false">Backup<svg data-ic="alt-arrow-down"></svg></button>
<div class="menu" id="backup" role="menu" hidden>
  <div class="menu-h">Backup</div>
  <button role="menuitem"><svg data-ic="diskette"></svg><span><b>Save a Backup</b><small>9 changes since Oct 23, 2026, 6:10 PM</small></span></button>
  <hr>
  <button role="menuitem"><svg data-ic="history"></svg><span><b>Restore from a Backup…</b></span></button>
</div>
```
`s4Menu()` places it under the button and inside the window; Escape and outside clicks close it.

## Dialogs and sheets

```html
<button class="btn" data-open="del">Delete All Data…</button>
<div class="scrim" id="del" hidden>                     <!-- add data-dirty to stop backdrop clicks closing it -->
  <div class="modal narrow" role="dialog" aria-modal="true" aria-labelledby="del-h">
    <div class="grab"></div>                             <!-- the handle, shown on phones -->
    <header><h2 id="del-h">Delete all data?</h2><button class="btn icon subtle" data-close aria-label="Close"><svg data-ic="close-circle"></svg></button></header>
    <div class="body">…</div>
    <footer><button class="btn" data-close>Cancel</button><button class="btn danger-fill">Delete All Data</button></footer>
  </div>
</div>
```
On phones every dialog is a bottom sheet with full-width footer buttons. Close with `s4Close(scrim)` (or a `data-close` button) rather than setting `hidden`, so it gets its short exit.

## Toasts and tooltips

```js
s4Toast("Undone: Match 40", { action: "Redo", onAction: redo });   // rises in, fades out after ~4s
```
Cut-off text with `.trunc` gets a `.tip` tooltip on hover automatically (`s4Tips`), only when it is actually cut off.

## Folds and steps

```html
<div class="card flush steps">                          <!-- numbered: only for a real sequence -->
  <details class="fold done"><summary><b>Fill In the Entry</b><span class="sec-sub">GL 61500000</span></summary><div class="fold-body">…</div></details>
  <details class="fold" open><summary><b>Copy Into SAP</b></summary><div class="fold-body">…</div></details>
</div>
```
`s4.js` animates every `details.fold` (the height grows and shrinks; a second click reverses it). To finish a step: `s4Fold(step, false); s4Fold(step.nextElementSibling, true);` Add `data-manual` to a container whose folds you drive yourself.

## Web page

```html
<body class="site">
<header class="site-head"><div class="container">
  <a class="brand" href="/"><img src="logo.svg" alt="">Name</a>
  <nav class="site-nav"><a href="#" aria-current="page">Product</a><a href="#">Pricing</a></nav>
  <div class="site-acts"><button class="btn icon subtle" data-theme-toggle aria-label="Switch Light or Dark"><svg data-ic="moon"></svg></button>
    <button class="btn icon menu-btn" aria-label="Menu" aria-expanded="false"><svg data-ic="hamburger-menu"></svg></button></div>
</div></header>
<main>
  <section class="hero"><div class="container"><h1>Say the one thing.</h1><p class="lead">…</p><a class="btn primary lg">Start</a></div></section>
  <section class="section"><div class="container">
    <div class="section-head"><h2>Heading</h2><p>Supporting line.</p></div>
    <div class="grid-auto" style="--min: 240px"><div class="feature"><svg class="ic lg" data-ic-duo="bolt"></svg><h3>Title</h3><p>…</p></div></div>
  </div></section>
  <section class="section"><div class="container prose">…long text…</div></section>
  <section class="section"><div class="container"><div class="cta-band"><h2>…</h2><a class="btn primary lg">…</a></div></div></section>
</main>
<footer class="site-foot"><div class="container"><span>© Name</span><a href="#">Privacy</a></div></footer>
</body>
```
Spend boldness in one place, usually the hero; everything else stays quiet.

## Layout helpers

```html
<div class="stack" style="--gap: var(--s-2)">…</div>        <!-- vertical, gap from the scale -->
<div class="cluster">…</div>                                 <!-- wrapping row -->
<div class="spread">…</div>                                  <!-- left and right ends -->
<div class="grid-auto" style="--min: 300px">…</div>          <!-- as many columns as fit -->
<div class="grid-4">…</div>                                  <!-- 4 → 2 → 1 -->
<div class="container">…</div>  <div class="form-page">…</div>
```
`--gap` and `--min` are the only inline styles allowed besides values measured at run time (widths of progress bars, menu positions).
