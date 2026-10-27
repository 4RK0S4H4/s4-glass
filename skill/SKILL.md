---
name: s4-glass
description: "The S4 Glass 2.0 design language: brand-neutral frosted glass in light and dark, every colour worked out from one accent trio, filled (not outlined) states, one named type scale, a single status system, Title Case labels, Inter with open digits and centred brackets, Solar icons, and real phone patterns (icon rail, bottom tab bar, bottom-sheet dialogs, table rows as cards) plus a web-page layer. Holds the tokens, stylesheet, JS helpers, icon set, app and web-page templates, component gallery, colour sampler, font builder and a house-rule checker. Use it whenever an app, tool, dashboard, web page, landing page, mockup or restyle should look S4 Glass or like the user's other apps (including Emovis apps and everything built through S4 App Studio), when an existing app should be brought onto S4 Glass or checked against it, or when the user asks for their house style, glass look or design language – even if they don't name it. Not for S4 Material or S4 Flat."
---

# S4 Glass 2.0

The user's house look for every app and web page: frosted, flat glass surfaces in both themes (the material leads over what is underneath), a faint tint of the accent in the greys and borders, one loud accent used as a fill, Inter with open digits, and Solar icons. It is brand-neutral: every colour comes from three accent values, so a new app makes one colour decision.

The look was settled over many rounds of the user's feedback on a real app (Bank Reconciliation, Emovis); 2.0 adds what that app had to invent for itself (a type scale, one status system, phone patterns, web pages) and the tooling that keeps it consistent. Don't re-litigate the rules in a new app unless the user asks.

This skill is the look. The process (intake, brief, mockups, build, delivery) lives in `s4-app-studio`; this skill plugs into its mockup and build steps, and also works on its own to style a page, restyle an app or show colour samples.

**Where things are** (this skill's folder):
- `toolkit/` – `s4.css` (tokens + all components), `s4.js` (theme and helpers), `fonts.css` (Inter, built), `icons.js` (Solar subset), `sampler.html`, `inline.py`, `build_fonts.py`, `check_css.py`, `check_pages.mjs`.
- `templates/` – `app.html` (app shell: side nav → rail → tab bar) and `page.html` (web page). `demo/components.html` – every component on one page.
- `references/design-language.md` – the full spec (read it once per project). `references/components.md` – copy-paste markup for every component. `references/migration.md` – bringing an existing app onto S4 Glass.

## How to build with it

1. **Copy the toolkit** into the workspace once (`cp -r <skill>/toolkit <skill>/templates .`; check `ls` first and reuse earlier copies). Read `toolkit/s4.css` once so you know what exists before writing any CSS.
2. **Pick the layout**: app shell (many screens), tabs app (2–3 screens as `.seg` tabs in the top bar), single-page tool (`.app.solo` + `.content.center`), phone-first app (`.app.has-tabbar`), or web page (`body.site`). Start from the matching template instead of a blank file.
3. **Set the accent trio** (below) on `:root`. That is the only colour an app sets.
4. **Build from the components** (`references/components.md`). App-specific styles go after `s4.css`, made only from tokens. If something is missing, add it the same way the stylesheet does (a token for every colour, one rule per control type, variants as modifiers) rather than inventing a new look.
5. **Check it** (see Checks): `python3 toolkit/check_css.py app.css`, then screenshots at 390, 1280 and 1920 (and 2560 for desktop tools) in light and dark, and look at every one.
6. **Ship**: a single-file page with `python3 toolkit/inline.py page.html out.html` (inlines every `data-s4` link and script). Swap the full `icons.js` (~150 KB) for a subset first: `node toolkit/build_icons.mjs <@iconify-json/solar>/icons.json --only copy,moon,refresh --out icons-page.js`. A built app (Vite/React) imports `s4.css` and `fonts.css`, puts the theme part of `s4.js` inline in `index.html`, and inlines only the icon SVGs it uses.

## Principles (the ones that decide most choices)

1. **Frosted glass, tinted by the accent.** Frosted cards, nav, top bar, fields and dialogs where the material leads: white (light) or dark grey (dark) at 80–96% with a 28px blur and no colour boost, so what is underneath is only a faint tint. Bars 90%, cards 82%, nav 80%, dialogs 96%. Over an off-white page (light) or a near-black gradient with a faint accent bloom (dark). Content slides under the top bar and tab bar. `data-neutrals="mono"` on `<html>` removes the tint.
2. **One loud colour.** The accent fills the primary action, the current place (active nav item, selected filter, chosen tile) and what needs a decision. Nothing else. One accent-filled button per screen area; when nothing is left to do, hide it rather than grey it out. A mark that repeats many times (done days in a calendar, ticked cells, chart bars) uses the soft fill (`--tile-on` / `--fill2`, `--accent-bar` for bars); solid accent is for the one current or selected thing.
3. **Filled, not outlined.** Hover and selected are soft fills; button-like controls hover with the accent tint (`--hov`); rows and lists hover and select in neutral grey; focus is a thin neutral ring; fields focus with a brighter fill and darker border. Never a high-contrast accent outline or ring (a soft `--soft-ring` line is fine).
4. **Quiet chrome, readable data.** Inter 14px, tabular figures on data, one text size in table cells, named sizes only, radii 6/8/10/12/16/24, spacing 4–24 (to 96 on web pages), hairline borders, and flat surfaces: no shadow at rest (`--shadow-1` is `none`); shadows only on what floats (menus, dialogs). No white inset shine.
5. **Dark mode is dark glass.** No accent-coloured text or icons on dark surfaces (accent is for fills). Only three things glow, faintly: the primary button's backlight, the active nav item, the selected filter pill.
6. **Phone to 2560.** Narrow screens get their own patterns through `max-width` rules only, so 1920 and 2560 never change.
7. **Readable for everyone.** WCAG AA against what is really painted behind the text, both themes; visible focus; 40px targets (44px on phones); reduced motion respected.
8. **Tokens or nothing.** Colours, sizes, radii, spacing, shadows, z-index and durations are tokens; `check_css.py` enforces it.

## Pick the accent

Use the accent the user picked. If they said "pick for me", choose one that fits the subject and mood, for this app rather than copying the last one. Three values:

- `--accent` – white text on it reaches 4.5:1 (aim for 5:1). No pale yellow, lime or light cyan.
- `--accent-2` – a neighbouring hue, same lightness or darker, 20–40° round the wheel (ends the nav gradient, tints lines, shadows and dark surfaces).
- `--accent-light` – a light tint (dark mode's accent for lines, hover tints and badge text; never running text).

| Feel / subject | --accent | --accent-2 | --accent-light |
|---|---|---|---|
| Money, finance, trackers | `#047857` | `#0f766e` | `#6ee7b7` |
| Calm tools, health, planning | `#0f766e` | `#155e75` | `#5eead4` |
| Productivity, study, notes | `#4f46e5` | `#6d28d9` | `#a5b4fc` |
| Creative, music, personal | `#7c3aed` | `#a21caf` | `#c4b5fd` |
| Travel, weather, general | `#1d64d8` | `#3b3fc4` | `#93c5fd` |
| Fitness, food, energetic | `#c2410c` | `#be123c` | `#fdba74` |
| Media, games, sports | `#c81e3a` | `#9f1239` | `#fda4af` |
| Bold, fashion, social | `#be185d` | `#9d174d` | `#f9a8d4` |
| Serious, admin, neutral | `#334155` | `#1e293b` | `#cbd5e1` |
| **Emovis** (the user's employer) | `#ce0057` | `#8a0069` | `#ff5c9d` |

A brand only ever arrives through these three values, never as a hex value written into the stylesheet. For an Emovis app also put the Emovis logo top-left next to the app name (never draw or guess it; ask for the file once) and use Aptos Narrow in exported Excel files. Red and green accents sit near the status colours: keep status meaning in the badge text.

## Colour sampler: let the user switch, don't send stills

**Where previews go:** colour samples, direction previews, hand-built mockups and demos are published on the S4 Glass GitHub Pages site, not as Claude artifacts: add the page to the public repo `4RK0S4H4/s4-glass` under `demo/samples/` (a card in `tools/build_site.py`), merge, and send the link (https://4rk0s4h4.github.io/s4-glass/demo/samples/…). The site is public, so previews use fictional data (no real company, account, people or vendor names); the user's apps themselves stay in their own private repos.

When the user wants to see or compare colours ("show me options", "what would it look like in…", or can't decide), publish one interactive page: `toolkit/sampler.html` (swatches, custom colour with derived values, contrast warning, theme and neutrals switches, copy button) above a mock of the app's **real main screen** built from the stylesheet's classes with real labels and rows. Keep every element the accent touches: primary button, active nav item, a `.seg` filter, a `.switch`, a checkbox, a chosen tile, ok/warn/bad badges, a `.badge.solid` suggestion and a `.btn.attn`. Set `SWATCHES` to 6–8 options that fit (all one hue if the user named one) and `PICK` to your recommendation. Title it "<App Name> Colors"; it must pass the 390px check. Say in one line which you'd pick and why, then wait. For other small visual choices, the same idea: one page with lettered options (A, B, C…) on real content; record the pick where the app keeps its styling decisions.

## Type, numbers and writing

- **Inter only**, 400/500/600/700, embedded from `fonts.css` (built by `build_fonts.py`, which keeps `ss01`, `cv09`, `tnum`, `case`). Never link Google Fonts or `@fontsource` Inter: their builds strip the stylistic sets and the house digits silently vanish. No monospace face (`--mono` is Inter).
- **Named sizes**: `--fs-cap` 11 (nav group caps, keycaps) · `--fs-badge` 11.5 (badges, count pills) · `--fs-xs` 12 (table headers, sub-lines, field labels, errors) · `--fs-sm` 12.5 (hints, small buttons, filter pills) · `--fs-ui` 13 (menus, banners, tooltips, key/value lists) · `--fs-base` 14 · `--fs-title` 15 · `--fs-h2` 18 · `--fs-h1` 20 · `--fs-stat` 22 · `--fs-big` 26 · `--fs-hero` 30; web pages add fluid `--fs-display`, `--fs-page-h2`, `--fs-page-h3`, `--fs-lead`. Running text is never below 12px.
- **Digits**: `font-feature-settings: "ss01","cv09"` is set once on `body`; only `.brk` repeats it (any other `font-feature-settings` would replace it). Tabular figures (`font-variant-numeric`) on tables, inputs, chips, badges, counts and stats; paragraphs stay proportional.
- **Money**: negatives `(1,234.56)` with each bracket in `<span class="brk">`; positives in a column end with `<span class="psp">)</span>`; negatives copy as `-1234.56`; positives may be green (`.pos`).
- **Title Case for labels** (field labels, card/section/dialog headings, column headers, buttons, tabs, menu items, stat labels, badges): capitalise major words; a, an, the, and, or, to, of, in, on, for, as, by stay lowercase unless first; a little word that ends the label or belongs to the verb is capitalised ("Fill In the Entry"). Acronyms stay. **Sentence case for sentences** (empty-state lines, question dialog titles like "Delete all data?", hints, tooltips, toasts). **All caps only** for the tiny side-nav group labels: no all-caps eyebrows above headings.
- An action keeps one name everywhere ("Save a Backup" → toast "Backup saved"); errors say what to do ("10 digits needed").

## Status

Status colours are fixed (they mean the same in every app). Each role has text, soft-area, chip, ink and bar tokens: **ok**, **warn**, **bad**, **mute** (parked, carried, not this month), **accent** (in progress on our side), plus **needs your decision** = `.badge.solid` (solid accent with the stars icon: the only solid badge and the only badge with an icon; no dashed or outlined chips). Status is one badge plus a slim bar (row edge `tr.st-*`, card top `.card.edge.*`, progress `.bar > i.*`), never a tinted row. An app with its own vocabulary (Matched, To Sort, Journal Entry…) maps each state onto one of these roles and never invents another colour.

## Charts

Draw charts as SVG with the toolkit's tokens (reference: `demo/samples/charts.html`; read the `dataviz` skill too). Series colour 1 is the app's accent (`--series-1`), then `--series-2…5` (blue, aqua, yellow, violet) in that fixed order, never cycled (a sixth series folds into "Other" or small multiples; if the accent is close to one of those hues, such as a green accent beside aqua, skip that hue); magnitude uses one hue, `--seq-0…4`; status colours are never series. One series: soft tint (`--viz-soft`) with the current mark solid. Marks are thin: columns ≤24px with a 4px rounded end and square base, lines 2px, end dots 8px with a 2px surface ring, areas ~10%, a 2px surface gap between touching marks (no borders). One axis, never two; hairline grid; label only the current, peak or line end. Text uses text colours, never the series colour; tabular figures. A legend (`.legend`) for two or more series. Tooltip (`.viz-tip`) on hover and focus, crosshair on lines, arrow keys on line charts, a table view (`.chart-table`, `.table-view`) for every chart; texture (45°/135°) opt-in for colour-blind readers and print. Stat tile: label, value, delta (green only when up is good), 12-point sparkline (`.spark`).

## Phone to 2560

| Width | Behaviour |
|---|---|
| ≥1301 | as designed; 1920 and 2560 never change |
| ≤1300 (1920×1200 laptop at 150% = 1280×800) | nav 200px, tighter top bar, page subtitle hidden, detail panel 360px |
| ≤1200 | overview cards two per row |
| ≤980 | side nav → 68px icon rail (give each item a `title`); `.split` detail panel covers the list (`.detail.open` + a Back button) |
| ≤760 | one column; nav → scrolling row, or bottom `.tabbar` with `.app.has-tabbar`; dialogs → bottom sheets; `table.t.cards` rows → cards (`data-label` on each cell, `.lead` on the description); fields 16px (no iOS zoom); 44px targets; safe-area insets |

- Fix narrow sizes with `max-width` media rules only. No horizontal page scroll ever: wide tables become cards or scroll inside `.table-wrap`.
- The phone top bar is one short row (title ellipsis, actions on the first line); a sticky bar is at most a fifth of the screen.
- A desktop-heavy tool (many columns, copy-and-paste into other systems) shows a read-only overview on the phone and says the rest needs a computer, rather than squeezing every screen.
- Web pages: `.site-head` collapses its links into a menu button, hero and sections shrink their padding, CTA buttons go full width.

## Theming rules (so light and dark never drift)

- **Dark mode changes tokens only.** All colours are tokens on `:root`, redefined in two identical dark blocks (`prefers-color-scheme: dark` guarded by `:root:not([data-theme="light"])`, and `:root[data-theme="dark"]`). Never write a component rule inside a dark block or a `[data-theme="dark"] .x` rule; give the value a token and set it in both blocks (and both halves of the `@supports` OKLCH block if it uses relative colours).
- `s4.js` always sets `data-theme` to `light` or `dark` (following the device while the choice is "auto"), before the first paint. Theme toggle: a sun/moon `.btn.icon` with `data-theme-toggle` (or `s4Theme("light"|"dark"|"auto")`; settings may offer "Follow my device").
- One rule per control type; variants are modifiers; no `!important` except `[hidden]` and reduced motion; no inline `style=` except values measured at run time and the layout knobs `--gap` / `--min`.
- In a built app keep the theme in state but always set `data-theme`; run `s4Slider`'s `place()` from a layout effect when the selection changes.

## Density

- **Two modes, Auto** (decided, option C): `html[data-density]` is `standard` (the stylesheet as written) or `compact` (rows 4px, buttons 28px, cards 12px, nav items 34px, base text 13px; touch targets stay 40px+). Set with `s4Density("auto" | "standard" | "compact")` or a `.seg` with `data-density-seg` and buttons `data-v`; the default, Auto, is compact on a wide screen with a mouse and standard on touch and small screens. Give users the setting where they keep preferences. Use the `--row-py`, `--ctl-h`, `--card-pad`, `--nav-h`, `--stack-gap` tokens in app code so it follows.
- **Calm and spacious** (standard, today's look): the stylesheet as written.
- **Playful and bold**: 15px body, 14–16px radii, card padding 20px, the accent more generous on headers and empty states, still one primary button per area.

## Icons: Solar

Free **Solar** set (CC BY 4.0, 480 Design), `@iconify-json/solar` 1.2.13. **Bold Duotone** where the icon carries the screen (nav items, mode tiles, empty states, the suggestion sparkle) at 20–24px; **Linear** everywhere else at 14–18px. Never all duotone. `toolkit/icons.js` holds a curated set (`<svg data-ic="name">` / `data-ic-duo`, or `s4Icon(name, duo)` to get markup); `build_icons.mjs` adds names. Built apps emit only the needed `body` strings into an icons map from a small repo script and render `<svg viewBox="0 0 24 24">`. Useful names: `widget-5`, `checklist-minimalistic`, `document-text`, `card`, `wallet`, `chart-2`, `transfer-horizontal`, `calculator-minimalistic`, `notebook`, `magic-stick`, `settings`, `link-round`/`link-circle`, `menu-dots`, `upload`, `download`, `diskette`, `undo-left`, `undo-right`, `history`, `arrow-left`, `alt-arrow-down`, `info-circle`, `lock-keyhole-minimalistic`, `sun`, `moon`, `copy`, `check-circle`, `close-circle`, `stars`, `keyboard`, `user`, `users-group-rounded`, `calendar`, `magnifier`, `filter`, `trash-bin-minimalistic`, `pen`, `add-circle`, `danger-triangle`, `home-2`, `bell`, `hamburger-menu`, `smartphone`.

Excel mark for Export to Excel buttons (matches Solar duotone; `.xl-back` brightens in dark):
```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path class="xl-back" fill="#2fbf71" d="M10 3.5h7.5a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H10z"/><path d="M14.5 8.5h3.5M14.5 12h3.5M14.5 15.5h3.5" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/><rect x="3" y="6" width="12" height="12" rx="3.2" fill="#1d7a46"/><path d="M7 9.5l4 5m0-5l-4 5" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/></svg>
```

## Decided with the user – don't redo

These came from the user's own issues on the Bank Reconciliation app (full list with issue numbers in `references/design-language.md`, "Decided with the owner"). Apply them in every app without asking again:

- **Rejected for good**: high-contrast accent outlines, double rings and green "copied" rings (soft 35–45% `--soft-ring` lines are fine) · dashed or dotted chips · icons in status chips (only the suggestion's stars) · accent-coloured selected rows or list highlights · accent text in dark · white hover washes and white top shine · a border on the light segmented control · blinking or pulsing · see-through menus · browser-default checkboxes or blue radios · all-caps titles · bulk "Accept All" · system terms in the UI (column letters, internal codes) · filters that switch themselves · save-on-blur for important values.
- **Spacing is the most frequent complaint**: hover bands never hug their text; labels sit next to their values; inputs are sized for their content; things in a row line up (same input size, a "–" placeholder for a missing value, the same columns card to card); no dead space or empty band on the right.
- **Green is money coming in**; outgoing totals are never green. Every accent is the same accent (selected pill = primary button = solid badge).
- **Behaviour**: a workflow fits 1080p without scrolling (accordion steps that fold to a summary); the button is the control (no checkbox beside a button that does the same); rows never vanish when their state changes; explicit Save or Enter; in-app confirmation dialogs (never `confirm()`), destructive buttons red with a backup offered first; deletes undoable; nothing dropped silently (end bulk actions and imports on a summary); let the user review decisions one by one; motion only answers the user's action; on a phone nothing that looks like a button is inert.
- **Process**: for any visible change that isn't obvious, show a draft or 2–3 lettered samples on real content first, then build the pick. Measure fiddly details (bracket position, count-pill centring) instead of judging them by eye.

## Component rules that are easy to get wrong

- **Active nav item**: the accent gradient (`--nav-grad`, `background-origin: border-box`), white label and icon (duotone's faded half at 62%), a darker count pill, a faint diffuse glow small enough to fit the nav's padding. About 6px between items.
- **The top bar stays put**: global actions keep the same position on every screen; one that doesn't apply is disabled, not removed.
- **Where you are** (option C, "Tabs + Trail"): on a record's page the top bar holds a trail (`.crumbs`, last item is the page and not a link; on a phone only its `.back` link shows), then the title and actions, then page tabs (`.pagetabs`, current tab a neutral fill via `aria-current="page"`, never the accent). Nav goes to places, tabs switch between peer views of one record, `.seg` only filters or changes the mode of one list; never two of them for one job. Flat apps need neither.
- **Needs attention** (e.g. backup due): `.btn.attn`, steady solid accent with a white count. The user rejected blinking and pulsing.
- **Tables**: one text size (values 14, headers/sub-lines 12, badges 11.5); short columns never wrap; the description column (`.dcol`) takes the leftover width and gets a tooltip only when cut off; don't show the same text twice; every table sorts by clicking headers (asc → desc → default; `s4Sort` in `s4.js` does it for any `th.sortable`) unless it mirrors an external layout; status columns sort by urgency via `data-sort` (bad 1, warn 2, decision 3, accent 4, ok 5, mute 6).
- **Filters start on All** and change only on a click; jumping to a hidden row keeps the filter and shows `.hidden-note` with Show All.
- **Copy chips**: click to copy, a 0.6s green flash that never stays, plain text in tables until hovered, never on totals; wrap the value in its own `<span>`.
- **Count pills** are 20px tall with 2px top padding (Inter's digits sit high in a `line-height:1` box).
- **Pop-overs** are solid; dialogs are glass over a blurred scrim (bottom sheets on phones); toasts are dark with one optional action ("Undone: Match 40 [Redo]").
- **Density** (option C, "Two Modes, Auto"): standard and compact, `s4Density()`, default follows the device; see Density.
- **Navigation** (option C, "Tabs + Trail"): trail above the title, page tabs under it, neutral-fill current tab; nav = places, tabs = views of one record, segmented = filters.
- **Charts** (option A, "Accent First"): accent is series 1, then blue, aqua, yellow, violet; thin marks, 2px gaps, tooltips and a table view by default. See Charts.
- **Flat and material-first** (shadows B, transparency B): no shadow at rest (`--shadow-1: none`), shadows only on menus, dialogs; surfaces are 80–96% material colour, 28px blur, no colour boost, content slides under the top and tab bars. Don't go clearer or add resting shadows unless asked.
- **Motion** is quiet, Apple-like, one curve (`--ease`, no bounce), 120–240ms, exits shorter: controls shrink to 97% while pressed, the switch thumb stretches while held, ticks draw in, copy turns green with a tick for 0.6s, toasts rise and fade out, folds and dialogs grow and shrink (`s4Fold`, `s4Close`), the selection pill glides only after a click, new screens and tab content fade in without moving (`.swap` / `s4Swap`). Only what the user changed moves; keys never wait; nothing blinks, pulses or bounces; Reduce Motion makes it instant.
- **Overview of several entities**: one vertical card each in `.grid-4` (4 → 2 → 1), coloured top edge for status, vital numbers at a glance, "Show Details" for the rest.
- **Headers stay uncluttered**: the title alone; counts and totals as quieter `.sec-sub` text. Cards fit their content. Say things once (a hint for every row goes above the list).
- **Web pages**: spend boldness in one place (usually the hero); no all-caps eyebrows, no numbered markers unless the content really is a sequence, no gradient washes as decoration.

## Mockups (Claude Design)

When `s4-app-studio` makes a mockup on a Design canvas: if an S4 Glass Design System artifact exists, it is picked up automatically (check the result against this file anyway); otherwise carry the look in by hand (the trio; light page `#f5f5f5` with 1.5% accent, cards white 62% with blur and a hairline border; dark page near `#0a0a0a`, cards white 4.5%, faint accent bloom; Inter 14px; 10px buttons and fields, 12px cards, 16px dialogs; one accent-filled button per area; gradient active nav item; Title Case; status as badge + slim bar; soft fills for selection; Solar icons; no accent text in dark). Always include a 390px phone artboard. A hand-built HTML mockup uses the real toolkit, so it already matches the app.

## Existing apps

To bring an app onto S4 Glass (or audit one), follow `references/migration.md`: run `check_css.py` on its stylesheet for a baseline, swap its hard-coded palette for tokens derived from the trio, map its status states onto the six roles, move font sizes onto the scale, remove accent outlines, keep every decision the user already made in that app (its notes/changelog record them), and compare before/after screenshots of every screen. Report what changed visually, screen by screen.

## Checks

- `python3 toolkit/check_css.py s4.css app.css` – dark blocks in sync, no component rules in dark blocks, no colour or font-size literals outside tokens, no stray `!important`. 0 problems before shipping.
- Screenshots with `shoot.py` from `s4-app-studio` (`--font Inter`; it also checks contrast, tap targets, clipped text and sideways scroll) or `node toolkit/check_pages.mjs` for pages. Sizes: 390×844 always; 1280×800 and 1920×1080; 2560×1440 for desktop tools; 820×1180 and 1024×768 when it's used on tablets; light and dark. An app whose `.content` scrolls inside the window isn't captured by `shoot.py --full`: scroll `.content` with `--setup` and shoot again, or use a taller viewport.
- Look at every image at full size for: closed digits (a stripped Inter crept in); brackets sitting high or low, misaligned amount columns; tabular figures in running text; mixed text sizes for the same kind of value; accent outlines where a fill belongs; accent text in dark; accent on things that don't need attention; lost glass (solid cards, missing blur); labels not in Title Case or sentences forced into it; glows anywhere but the three allowed places; a phone screen that scrolls sideways or a top bar that wraps.

## Checklist

- One accent-filled primary action per area; gradient active nav item with a faint glow; the accent chosen for this app (or the brand trio).
- Every colour from the trio or the status tokens; `check_css.py` clean.
- Hover/selected are fills, rows neutral, no accent text in dark.
- Named font sizes; weights 400–700; open digits; centred brackets.
- Title Case labels, sentence-case sentences, uncluttered headers.
- 390 / 1280 / 1920 (/ 2560) × light / dark checked; the mockup (if any) still matches.
