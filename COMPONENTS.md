# S4 Glass 2.0 – component markup

Copy-paste markup for every component in `toolkit/s4.css`. Icons are Solar Bold Duotone, shown as `<svg data-ic="name">` (filled in by `icons.js`); in a built app paste the SVG itself. See `DESIGN.md` for when to use what. `demo/components.html` shows them all live.

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
The top bar, when it is the first child of `.main`, floats over the top of `.content` so content slides under it (frosted); `s4.js` keeps `--bar-h` current. With a `.banner` above it the bar stays in the flow. Wrap nav labels in `.lbl` so the ≤980px icon rail can hide them. On wide screens `.content` stops at `--content-max` (1600px) and centres itself; `.content.flush` removes padding (full-bleed split views, not capped); `.content.center` caps width for single-page tools. A single-page tool with no nav: `<div class="app solo"><div class="main">…</div></div>`.

### Trail and page tabs
Inside the `.topbar`: a trail first, then the title and actions, then page tabs. Use them on a record's page (an account, a project); a flat app with no depth needs neither.
```html
<header class="topbar">
  <nav class="crumbs" aria-label="Breadcrumb">
    <a class="back" href="#"><svg data-ic="arrow-left"></svg>Accounts</a>   <!-- the phone shows only this link -->
    <a href="#">Accounts</a><span class="sep" aria-hidden="true">/</span><a href="#">Northwind</a><span class="sep" aria-hidden="true">/</span>
    <span class="here" aria-current="page">Operating •••• 2210</span>
  </nav>
  <div class="ttl"><h1>Operating •••• 2210</h1><span class="sub">Northwind · last matched Oct 23, 2026</span></div>
  <div class="actions">…</div>
  <nav class="pagetabs" aria-label="Views"><a href="#" aria-current="page">Overview</a><a href="#">Transactions<span class="n">43</span></a><a href="#">Rules</a></nav>
</header>
```
The trail's last item is the page and isn't a link; its back link goes one level up. The current tab is a neutral fill (`aria-current="page"` or `.on`), never the accent. **Nav** goes to places, **tabs** switch between peer views of one record, a **`.seg`** only filters or changes the mode of one list: never two of them for the same job. The bar keeps wrapping on a phone when it holds a trail or tabs, and the tabs scroll sideways.

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
    <aside class="detail open">   <!-- ≤980px: covers the list; toggle .open, add a Back button -->
      <div class="detail-cols"><div>…cards…</div><div>…cards…</div></div>   <!-- two columns once the panel is 760px wide (1440p), one below -->
    </aside>
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

### Tables at scale

For tables of hundreds of rows (option C of the table samples; full working example `demo/samples/tables.html`, option C): a bar above, sticky columns, the selected total under the table, page controls.
```html
<section class="card flush">
  <div class="t-bar"><input class="input search" type="search" placeholder="Search Description or Reference" aria-label="Search">
    <div class="cluster"><button class="fchip on" aria-pressed="true">All<span class="n">240</span></button><button class="fchip">To Sort<span class="n">75</span></button></div>
    <select aria-label="Account"><option>All Accounts</option></select></div>
  <div class="t-applied"><span>Filters</span><span class="xchip">Status: To Sort<button aria-label="Remove Status: To Sort"><svg data-ic="close"></svg></button></span><button class="lnk">Clear All</button></div>   <!-- only while a filter is applied -->
  <div class="table-wrap scroll"><table class="t">        <!-- min-width on the table so it scrolls sideways; not .cards -->
    <thead><tr><th class="sticky-l"><input type="checkbox" aria-label="Select this page"></th><th class="sticky-l2">Description</th><th>Date</th><th>Status</th><th class="num sticky-r">Amount</th></tr></thead>
    <tbody><tr class="sel"><td class="sticky-l"><input type="checkbox" checked aria-label="Select Northwind Payroll"></td><td class="sticky-l2"><span class="trunc">Northwind Payroll Run 2610</span><span class="sub">ACH Debit</span></td><td>Oct 23</td><td><span class="badge ok">Matched</span></td><td class="num sticky-r">…</td></tr></tbody>
  </table></div>
  <div class="sel-dock"><div><div class="sum">(13,423.00)</div><small>25 Selected</small></div><button class="lnk">Select All 75 Matching</button><span class="grow"></span><button class="btn sm primary">Match</button><button class="btn sm subtle">Clear</button></div>   <!-- hidden until a row is ticked -->
  <div class="t-foot"><span>1–25 of 75</span><span class="grow"></span><label>Rows per page <select><option>25</option></select></label><span class="pager"><button class="btn icon sm" aria-label="Previous Page">…</button><span>Page 1 of 3</span><button class="btn icon sm" aria-label="Next Page">…</button></span></div>
</section>
```
The header tick selects the shown page; after a full page is ticked offer "Select All N Matching". The sum uses the bracket style (`.brk`) for negatives. Sticky columns and `.cards` are alternatives: on a phone use cards, or let the table scroll sideways with the tick box, description and amount fixed.

## Charts

SVG you draw; the toolkit supplies colours (`--series-1…5`, `--seq-0…4`, `--viz-soft`, `--viz-grid`, `--viz-axis`) and the pieces around the plot. Full working example: `demo/samples/charts.html`.
```html
<div class="card">
  <h3>Balances</h3>
  <div class="legend"><span><i class="ln" style="background:var(--series-1)"></i>Operating</span><span><i class="ln" style="background:var(--series-2)"></i>Payroll</span></div>
  <div class="plot"><svg width="640" height="250" role="img" aria-label="Month-end balances">…</svg></div>
  <div class="chart-table"><table>…the same numbers…</table></div>   <!-- shown when an ancestor has .table-view -->
</div>
<div class="viz-tip" hidden></div>   <!-- one per page; fill it with textContent on hover and focus -->
<div class="card stat"><span>Matched This Month</span><b>1,284</b><svg class="spark" viewBox="0 0 220 36" preserveAspectRatio="none">…</svg></div>
```
Use `.plot text` for axis labels (they take `--text3`); `text.ink` for the current or peak value, `text.ink2` for names. Heat cells fill with `var(--seq-0…4)`; a key is `<span class="ramp">Fewer <i style="background:var(--seq-0)"></i>… More</span>`.

## Density

```html
<div class="seg" data-density-seg role="group" aria-label="Density">
  <button type="button" data-v="auto">Auto</button><button type="button" data-v="standard">Standard</button><button type="button" data-v="compact">Compact</button>
</div>
```
`s4.js` sets `html[data-density]` to `standard` or `compact` before the first paint, remembers the choice, and keeps the `.on` button in step (also for a box rendered later, such as a settings screen); `s4Density("compact")` does the same from code. **Auto** (the default) is compact on a 1300–2200px wide screen with a mouse (a 1080p monitor) and standard on touch, small screens and larger ones (1440p and up). In your own CSS use `--row-py`, `--ctl-h`, `--ctl-h-sm`, `--card-pad`, `--nav-h` and `--stack-gap` (and `--fs-base` for text) so new parts follow.

## Copy chips and keys

```html
<button class="copy" data-copy="-1289.30"><span><span class="brk">(</span>1,289.30<span class="brk">)</span></span><svg data-ic="copy"></svg></button>
<button class="copy" data-copy="124100.11"><span>124,100.11<span class="psp">)</span></span><svg data-ic="copy"></svg></button>
<span class="copy empty">–</span>
<div class="keys"><span class="kh"><span class="kbd">J</span>Journal Entry</span><span class="kh"><span class="kbd">Enter ↵</span>Match</span></div>
```
Wrap the value in its own `<span>` (the chip is a flex box). Negatives copy as `-1289.30`. The green and the tick stay 0.6s, then the green fades (`.fade`, 0.14s) with the tick still there.

Variants (all `.copy` + a modifier):
```html
<button class="copy icon-only" data-copy="40117" aria-label="Copy Reference"><svg data-ic="copy"></svg></button>          <!-- just the icon -->
<button class="copy block" data-copy="Northwind Tech, 100 Harbour Way"><span>Northwind Tech<br>100 Harbour Way</span><svg data-ic="copy"></svg></button>   <!-- several lines -->
<button class="copy date" data-copy="9/28/2026"><span>9/28</span><svg data-ic="copy"></svg></button>   <!-- a date copies as M/D/YYYY -->
<span class="copy empty">–</span>   <!-- a value still to come; in td.num it aligns right -->
```

### Row quick actions, owner pills, removable chip, locked setting
```html
<span class="qs"><button class="qb on"><svg data-ic="link-circle"></svg>Match</button><button class="qb">JE</button><button class="qb" disabled>Pay</button></span>
<span class="pp-row"><button class="pp on">Dana</button><button class="pp hint">Lee</button></span>   <!-- .hint = suggested, not yet chosen -->
<span class="chip">6150 · Rent<button class="chip-x" aria-label="Remove 6150 · Rent"><svg data-ic="close-circle"></svg></button></span>
<div class="f locked-f">Closing Day<span>Sep 30, 2026</span></div>   <!-- a setting someone else locked: a plain value, not a field -->
```

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
`s4Menu()` places it under the button and inside the window; Escape and outside clicks close it. Arrow keys, Home and End move between items and Enter picks; opened from the keyboard, the first item takes focus.
- **Sections**: wrap a group in `<div class="menu-sec"><div class="menu-h">Changes</div>…</div>`. A menu with sections has a fixed width (400px) so counts line up at the right edge and long rows get an ellipsis (`<b class="trunc">`).
- **Options menu** (`.menu.opts`): each choice is `<button class="on"><b>Matched First</b><small>what it does</small></button>`; the current one has `.on`.

### Dropdown
```html
<label class="f">Company<select><option>2101 · Northwind Tech</option><option>2102 · Northwind US</option></select></label>
```
`s4Select()` wraps every `<select>` on load (call it for ones added later): a `button.sel` + `ul.sel-list` listbox with arrows, Home/End, type-ahead, Enter or Space to pick, a tick on the current option, opening upward near the bottom. The `<select>` stays in the page, hidden, and keeps the value and the `change` event. Touch screens keep the native select; `data-native` opts one out. In React use `<Select>` (`toolkit/react/`).

## Dialogs and sheets

```html
<button class="btn" data-open="del">Delete All Data…</button>
<div class="scrim" id="del" hidden>                     <!-- data-dirty="the queued files": a backdrop click does nothing and Escape asks "Discard the queued files?" first -->
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
s4Toast("Undone: Match 40", { action: "Redo", onAction: redo });   // rises in; fades out after ~4s, 6.5s with an action
s4Toast("Match 40 undone", { action: "Redo", anchor: undoButton }); // an undo pop-up: next to the Undo button, with a pointer to it
```
With `data-dirty` on the scrim, Escape shows a "Discard …?" bar inside the dialog (Keep Editing / Discard); set or clear the attribute as the input changes.
Cut-off text with `.trunc` gets a `.tip` tooltip on hover automatically (`s4Tips`), only when it is actually cut off, after a short delay, flipping above near the bottom. A `.sub` or `<small>` inside the element becomes a quieter second line.

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
