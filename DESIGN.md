# S4 Glass 2.0 – the design language

S4 Glass is one look for every app, tool and web page: frosted glass surfaces in light and dark, a faint tint of one accent running through the greys, one loud accent used as a fill, Inter with open digits, and Solar icons. It is brand-neutral. Every colour comes from three accent values, so a new app makes exactly one colour decision.

The look was settled over many rounds of feedback on a real, heavily used app (Bank Reconciliation, Emovis). Version 2.0 keeps every decision from that work and adds what the app had to invent on its own: a type scale, a status system, phone patterns and a web-page layer. This file is the spec. The code is in `toolkit/`, starters in `templates/`, every component on one page in `demo/components.html`.

Contents: [Principles](#principles) · [Colour](#colour) · [Type and numbers](#type-and-numbers) · [Space, shape, depth, motion](#space-shape-depth-motion) · [Motion](#motion) · [Layouts](#layouts) · [Phone to 2560](#phone-to-2560) · [Components](#components) · [Charts](#charts) · [Writing](#writing) · [Icons](#icons) · [Accessibility](#accessibility) · [What changed in 2.0](#what-changed-in-20) · [Checklist](#checklist)

## Principles

1. **Frosted glass, tinted by the accent.** Cards, the nav, the top bar, fields and dialogs are frosted glass, but the material leads: the surface colour (white in light mode, dark grey in dark mode) wins over whatever is underneath, which only shows as a faint tint. Light: bars 90%, cards 82%, nav 80%, dialogs 96%. Dark: bars 90%, cards 80%, nav 80%, dialogs 96%. Blur 28px with no colour boost, so content that slides under a bar is frosted, never a picture. Greys, borders and shadows carry a faint tint of the accent, so an emerald app feels green-grey without anything being loudly coloured. `data-neutrals="mono"` turns the tint off.
2. **One loud colour.** The accent fills the primary action, the current place (active nav item, selected filter or tile) and things that need a decision. Nowhere else. A mark that repeats (done days in a calendar, ticked cells, chart bars) gets the soft fill (`--tile-on`, `--accent-bar`); solid accent is for the one current or selected thing. If everything is accent, nothing stands out.
3. **Filled, not outlined.** Hover and selected states are soft fills, never high-contrast accent outlines, double rings or green rings (a soft 35–45% accent line, `--soft-ring`, is fine). Every button-like control hovers with the same faint accent tint; table rows and lists hover and select in neutral grey. Keyboard focus is a thin neutral ring.
4. **Quiet chrome, readable data.** Inter at 14px, tabular figures on data, one text size inside table cells, sizes from one named scale, corners from one radius scale, spacing from one scale, hairline borders, and flat surfaces: no shadow at rest. No emoji as icons.
5. **Dark mode is dark glass.** A near-black gradient with a faint bloom of the two accent colours, under dark-grey surfaces. In dark mode the accent is for fills only; text and icons use the normal text colours. Only three things glow, faintly: the primary button (a backlight behind it), the active nav item and the selected filter pill.
6. **Fast and few keystrokes.** One-click chips, segmented filters, keyboard shortcuts shown as keycaps, click-to-copy values, suggestions accepted with Enter.
7. **Phone to 2560 wide.** Every layout is checked at 390, 1280, 1366, 1920 and 2560. Narrow screens get their own patterns (rail, tab bar, bottom sheets, table rows as cards) through `max-width` rules only, so wide layouts never move.
8. **Readable for everyone.** WCAG AA contrast against what is actually painted behind the text, in both themes; visible focus; 40px touch targets (44px on phones); reduced motion respected.
9. **Tokens or nothing.** Colours, font sizes, radii, spacing, shadows, z-index and durations come from tokens. `check_css.py` (in `tools/` in the repo, `toolkit/` in the skill) enforces it, so consistency is checked, not hoped for.

## Colour

### The accent trio

Each app sets three values and nothing else:

| Token | What it is | Rule |
|---|---|---|
| `--accent` | the main colour | white text on it reaches 4.5:1 (5:1 is better: the nav pill starts a touch brighter). No pale yellow, lime or light cyan. |
| `--accent-2` | a neighbouring hue, same lightness or darker, 20–40° round the wheel | ends the nav gradient; tints borders, shadows, dark surfaces and the second dark bloom |
| `--accent-light` | a light tint of the accent | dark mode's accent for lines, hover tints and badge text; never running text |

Starting points (all checked in both themes):

| Feel / subject | --accent | --accent-2 | --accent-light |
|---|---|---|---|
| Money, finance, trackers | `#047857` emerald | `#0f766e` | `#6ee7b7` |
| Calm tools, health, planning | `#0f766e` teal | `#155e75` | `#5eead4` |
| Productivity, study, notes | `#4f46e5` indigo | `#6d28d9` | `#a5b4fc` |
| Creative, music, personal | `#7c3aed` violet | `#a21caf` | `#c4b5fd` |
| Travel, weather, general | `#1d64d8` blue | `#3b3fc4` | `#93c5fd` |
| Fitness, food, energetic | `#c2410c` orange | `#be123c` | `#fdba74` |
| Media, games, sports | `#c81e3a` red | `#9f1239` | `#fda4af` |
| Bold, fashion, social | `#be185d` pink | `#9d174d` | `#f9a8d4` |
| Serious, admin, neutral | `#334155` slate | `#1e293b` | `#cbd5e1` |
| **Emovis** (brand) | `#ce0057` | `#8a0069` | `#ff5c9d` |

A brand comes in through these three values only, never as a hex value in the stylesheet. Red and green accents sit close to the status colours: keep status meaning in badge text and don't fill success or error states with the accent.

### What the trio becomes

Everything else is a `color-mix()` of the trio with a neutral (and OKLCH relative colours for the "vivid" glow versions, with a plain-mix fallback):

- Surfaces: `--page`, `--bg`, `--glass`, `--glass2`, `--bg2`, `--bg3`, `--well`, `--nav-bg`, `--bar-bg`, `--th-bg`, `--field-bg`, `--panel-bg`, `--modal-bg`, `--pop-bg` (solid), `--toast-bg`, `--tip-bg`.
- Text and lines: `--text`, `--text2`, `--text3` (the faintest text that still passes AA), `--border`, `--border2`.
- States: `--hov`, `--press` (accent tint for button-like controls), `--fill`, `--fill2`, `--soft-ring`, `--tile-on` (selected), `--bg-hover`, `--bg-sel` (neutral, for rows), `--focus` (neutral ring).
- Accent roles: `--btn`, `--btn-hover`, `--btn-edge`, `--accent-soft` (a quiet accent area), `--accent-chip` (a badge fill), `--accent-text` (accent text on plain surfaces; the text colour in dark), `--accent-ink` (text on accent fills; the accent darkened 25% in light so it passes AA), `--acc` (the accent as a line), `--nav-grad`, `--vivid`, `--backlight`.

### Status

Status colours are fixed, so "ok" means the same in every app whatever its accent. Each status has five tokens:

| Role | Text | Soft area (banners, notes) | Chip fill + ink (badges) | Bar (row edge, progress, card top) |
|---|---|---|---|---|
| ok | `--ok` | `--ok-bg` | `--ok-chip` / `--ok-ink` | `--ok-bar` |
| warn | `--warn` | `--warn-bg` | `--warn-chip` / `--warn-ink` | `--warn-bar` |
| bad | `--bad` | `--bad-bg` | `--bad-chip` / `--bad-ink` | `--bad-bar` |
| mute (parked, carried, not this month) | `--text2` | `--mute-bg` | `--mute-chip` / `--mute-ink` | `--mute-bar` |
| accent (in progress on our side) | `--accent-text` | `--accent-soft` | `--accent-chip` / `--accent-ink` | `--accent-bar` |

One more state belongs to the accent: **needs your decision** (a suggestion). It is a solid accent badge with the stars icon (`.badge.solid`), the only solid badge in the system, because a decision waiting for the user is exactly what the one loud colour is for.

An app with its own status vocabulary (Matched, To Sort, Journal Entry…) maps each of its states onto one of these six roles. It never invents a seventh colour.

## Type and numbers

**Inter only**, weights 400, 500, 600 and 700, embedded as data URIs built by `toolkit/build_fonts.py` (the Google Fonts and `@fontsource` builds have the stylistic sets stripped, so the house digits silently disappear). No second family, no monospace: `--mono` is Inter, so IDs and document numbers match the amounts around them.

**Named sizes.** Use the name, never a pixel value:

| Token | Size | Use |
|---|---|---|
| `--fs-cap` | 11px | tiny all-caps group labels in the side nav; keycaps |
| `--fs-badge` | 11.5px | badges and count pills only |
| `--fs-xs` | 12px | table headers, sub-lines, field labels, footnotes, error lines |
| `--fs-sm` | 12.5px | hints, secondary lines, small buttons, filter pills |
| `--fs-ui` | 13px | menus, banners, tooltips, compact lists, key/value lists |
| `--fs-base` | 14px | body, table values, buttons, fields |
| `--fs-title` | 15px | a title that leads a block or list |
| `--fs-h2` | 18px | dialog titles, entity names on overview cards |
| `--fs-h1` | 20px | the page title in the top bar |
| `--fs-stat` | 22px | a number over a label |
| `--fs-big` | 26px | the one amount a panel is about |
| `--fs-hero` | 30px | the headline number on a card |
| `--fs-display`, `--fs-page-h2`, `--fs-page-h3`, `--fs-lead` | fluid | web pages only (clamp between 390 and 1440 wide) |

Weights: 400 text, 500 emphasis and nav, 600 labels/titles/buttons, 700 counts, the hero number and page display type. No 650 (the static faces would round it).

**Numbers.**
- `font-feature-settings: "ss01", "cv09"` once on `body`: open 4, 6 and 9, flat-top 3. The only other rule that sets it is `.brk`, which repeats both. Everything else uses `font-variant-numeric`.
- Tabular figures on everything that holds data (tables, inputs, chips, badges, counts, stats). Running paragraphs stay proportional.
- Negative money is `(1,234.56)` with each bracket in `<span class="brk">`, Inter's centred bracket forms, which sit on the digits' centre at every size. Positive amounts in a column end with a hidden `<span class="psp">)</span>` so digits line up. Negatives copy as `-1234.56`. Positive amounts may be green (`.pos`); money going out is never red just for being negative.
- No slashed zero or other number features.

## Space, shape, depth, motion

- **Spacing** `--s-1…--s-24`: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96. Apps use 4–24; web pages use the large steps between sections.
- **Radii** `--r-xs` 6 (chips, checkboxes), `--r-sm` 8 (small buttons, menu items), `--r-md` 10 (buttons, fields), `--r` 12 (cards, nav items, tiles, menus), `--r-xl` 16 (dialogs, filter pills), `--r-2xl` 24 (bottom sheets, web CTA bands), `--r-pill`. Nested corners get smaller as they go in.
- **Elevation** is flat: `--shadow-1` (cards and bars) is `none`; a hairline border and the fill separate them. Shadows are only for what floats over the page: `--shadow-2` menus and pop-overs, `--shadow-3` dialogs (toasts are dark and need none). No white inset "shine" on surfaces (removed in the Bank Rec app, #191); only keycaps keep a highlight.
- **Motion** `--dur-1` .12s, `--dur-2` .18s, `--dur-3` .24s, `--ease`, `--press` .97. See [Motion](#motion).
- **Layers** `--z-sticky` 2, `--z-bar` 20, `--z-panel` 40, `--z-modal` 50, `--z-toast` 80, `--z-menu` 130, `--z-tip` 200.

## Motion

Quiet, in the manner of iOS and macOS: things move only because the user did something, they arrive quickly and settle without bouncing, and you feel the motion more than you see it. Chosen by the owner from three samples (option B, "Apple Quiet"; `demo/samples/motion.html`).

**Timing.** 120–240ms (`--dur-1…3`) on one curve, `--ease` = `cubic-bezier(.25, 1, .5, 1)`: a spring with no overshoot, fast at the start and slow at the end. Exits are shorter than entries (150–200ms, `ease-in`). Nothing bounces, blinks, pulses or loops, except a loading shimmer while data is really loading.

**What moves:**

| Moment | Motion |
|---|---|
| Press a button, filter chip or copy chip | shrinks to 97% (`--press`) under the finger in 0.12s, settles back in 0.18s |
| Switch | the thumb slides; while held it stretches a little toward where it will go, as on iOS |
| Checkbox | the box fills and the tick draws in from the left; it gives (90%) while pressed |
| Copy | the chip turns green and its icon becomes a tick for 0.6s, then it goes back (#87) |
| Toast | rises 10px and fades in; after ~4s it fades out and sinks a little |
| Fold or accordion step | the height grows or shrinks in 0.24s and the content fades in; Done folds the step to its summary while the next opens (`s4Fold`) |
| Dialog | the scrim fades and the dialog grows from 96%; closing fades it out in 0.15s. A phone sheet slides up and slides back down |
| Menu | pops from 97% just under its button |
| Segmented control, nav, tabs | the selection pill glides to the new choice, only after a click; a sideways-scrolling row brings the choice to the middle |
| New screen or tab content | fades in where it is, no slide (#93; `.content`, `.swap` / `s4Swap`) |

**Rules:**

- Animate only what the user changed. Nothing moves on arrival, resize or font load except a plain fade of new content.
- Never make the keyboard wait: the state changes at once (focus returns as a dialog starts to close; a second click on a fold reverses it half-way), and the animation follows.
- One thing moves at a time per action. No trails, flashes or two-tone sweeps (#74, #78).
- Reduce Motion in the system settings makes everything instant (the CSS block and `s4Still()` in the scripts).

## Layouts

Pick one per app; never mix two systems in one app.

- **App shell** (`.app`): 220px side nav + main column; the top bar and nav stay put and only `.content` scrolls, sliding under the top bar (and the tab bar on phones), which hides it behind its material. `s4.js` keeps `--bar-h` in step with the bar. For many screens.
- **Tabs app**: 2–3 screens as `.seg` tabs in the top bar, no side nav.
- **Where you are** (option C of the navigation samples): a record's page has a trail above the title (`.crumbs`: Accounts / Northwind / Operating, the last item is the page and isn't a link) and page tabs under it (`.pagetabs`) for the views of that one record, in the top bar. The current tab is a neutral fill, so the accent stays on the one current place in the nav. On a phone the trail collapses to a single back link and the tabs scroll sideways. Flat apps with no depth need neither. **Nav goes to places; tabs switch between peer views of one thing; a segmented pill only filters or changes the mode of one list. Never use two of them for the same job.**
- **Single-page tool**: `.app.solo` (top bar + content, no nav); `.content.center` caps the content at about 1100px.
- **Phone-first app**: `.app.has-tabbar` with a bottom `.tabbar` on phones and the side nav on desktop.
- **Web page** (`body.site`): sticky glass header, `.hero`, `.section` blocks inside `.container` (max 1200px), `.site-foot`. Same tokens and components; fluid display type.

Widths: form-style pages (settings, rules, lookups) share `--form-max` (760px); wide tables may go full width; running text stops at `--prose-max` (68ch).

Overview of several entities (companies, accounts, projects): one vertical card each in `.grid-4` (4 → 2 → 1 per row), a coloured top edge for status (`.card.edge.ok`), the vital numbers at a glance, and "Show Details" for the rest.

## Phone to 2560

| Width | What happens |
|---|---|
| ≥ 1301 | the design as drawn; 1920 and 2560 never change |
| ≤ 1300 (a 1920×1200 laptop at 150%) | nav 200px, tighter top bar, page subtitle hidden, list/detail panel 360px |
| ≤ 1200 | overview cards two per row |
| ≤ 980 (tablet, small window) | the side nav becomes a 68px icon rail (labels hidden, counts become corner pips); list/detail: the detail panel covers the list (`.detail.open`) |
| ≤ 760 (phone) | one column; nav becomes a scrolling row under the top bar, or a bottom tab bar with `.has-tabbar`; dialogs become bottom sheets; `table.t.cards` rows become cards; fields 16px (iOS doesn't zoom); 44px touch targets; safe-area insets on bars, sheets and toasts |

Phone rules:
- The top bar is one short row: the title shrinks with an ellipsis, actions stay on the first line. A sticky bar takes at most a fifth of the screen.
- Wide data tables either become cards (`table.t.cards`, each cell with `data-label`, the description cell `.lead`) or scroll sideways inside `.table-wrap`. The page itself never scrolls sideways.
- A tool that is really a desktop job (many columns, copy-and-paste into other systems) shows a read-only overview on the phone and says the rest needs a computer, rather than squeezing every screen.
- Touch: every control at least `--tap` tall; spacing between tap targets at least 4px.

## Components

All in `toolkit/s4.css`; every one is on `demo/components.html`. Markup for each is in the skill's `references/components.md`.

- **Shell**: `.app`, `.nav` (`.brand`, `.group`, `.item` + `.lbl` + `.count`, `.foot`), `.main`, `.topbar` (`.ttl` h1 + `.sub`, `.actions`), `.content`, `.banner` (`.info`, `.ok`, `.bad`; plain is a warning), `.split` (`.list-pane` + `.detail`), `.filters`, `.tabbar` + `.tab`, `.fab`.
- **Buttons**: `.btn`, `.primary`, `.subtle`, `.icon`, `.sm`, `.lg`, `.block`, `.on`, `.attn`, `.danger`, `.danger-fill`, `.pill` inside, `button.lnk`.
- **Fields**: native inputs, `select` (with the S4 chevron), `textarea`, `label.f` (+ `.hint`, `.err`), `.form-grid`, `.search`, `.switch`, checkbox, radio, `.chk`.
- **Choosers**: `.seg` (+ `.scroll`), `.fchip`, `.ptabs`, `.tile`, sliding selection (`s4Slider`).
- **Status**: `.badge` (`.ok`, `.warn`, `.bad`, `.mute`, `.accent`, `.solid`), `.chip`, `.dot`, `.bar`, `.card.edge`, table row edges `tr.st-*`.
- **Surfaces**: `.card` (`.flush`, `.lift`, `.card-head`), `.stat`, `.kv`, `.bigamt`, `.hero-num`, `.sug`, `.note`, `.hidden-note`, `.empty`, `.drop`, `.skeleton`, `.fold` / `.steps` (native `<details>`), `.list` + `.li`.
- **Tables**: `.table-wrap` (`.scroll`), `table.t` (`.compact`, `.cards`), `th.sortable` + `.th-sort`, `td.dcol`, `.trunc`, `.sub`, `td.num`, `tr.r`, `tr.sel`, `tr.done`, `tfoot`.
- **Copy and keys**: `.copy` (+ `data-copy`), `.copy.empty`, `.kbd`, `.kbd.on-pri`, `.keys` / `.kh`.
- **Overlays**: `.menu` (`.menu-h`, `hr`), `.scrim` + `.modal` (`header`, `.body`, `footer`, `.grab`, `.wide`, `.narrow`), `.toast`, `.tip`.
- **Web page**: `.site`, `.site-head` (`.brand`, `.site-nav`, `.site-acts`, `.menu-btn`), `.hero`, `.display`, `.lead`, `.section`, `.section-head`, `.prose`, `.feature`, `.cta-band`, `.site-foot`, `.container`.
- **Layout helpers**: `.stack`, `.cluster`, `.spread`, `.grid-auto` (`--min`), `.grid-4`, `.grow`, `.form-page`; spacing/type utilities on the scales only.

Component rules that matter most:
- **One accent-filled button per area**, usually the main forward action. When there is nothing left to do, hide it rather than grey it out. `.btn.attn` (steady solid accent with a white count) may sit beside it while something needs attention.
- **The top bar stays put**: global actions keep their position on every screen; one that doesn't apply is disabled, not removed.
- **Active nav item**: the accent gradient, a white label and icon (the duotone's faded half at 62%), a darker count pill, a faint diffuse glow. `background-origin: border-box`. About 6px between items.
- **Tables**: one text size (values 14, headers and sub-lines 12, badges 11.5); short columns never wrap; the description column takes the leftover width and shows a tooltip only when cut off; status is one badge plus the slim left edge, never a tinted row; every table sorts by its headers (asc → desc → default; `s4Sort` does it) unless it mirrors an external layout, and a status column sorts by urgency (bad, warn, needs a decision, accent, ok, mute – put the rank in `data-sort`); don't show the same text twice.
- **Filters start on All** and change only when clicked; a jump to a row the filter hides keeps the filter and shows `.hidden-note` with Show All.
- **Copy chips**: click to copy, a 0.6s green flash that never stays; in tables they read as plain text until hovered.
- **Pop-overs** are solid (`--pop-bg`); dialogs are glass over a blurred scrim; toasts are dark with one optional action ("Undone: Match 40 [Redo]").
- **Cards fit their content**; spare space goes below a list card, not inside it.
- **Say things once**: a hint that applies to every row goes in the line above the list.
- **Uncluttered headers**: the title stands alone; counts and totals are quieter text beside or under it. No title · count · dot · chip strings.

## Charts

Option A of the chart samples ("Accent First"); the reference implementation is [demo/samples/charts.html](../demo/samples/charts.html). Charts are plain SVG you draw per app; the tokens, the colours and the pieces around them (`.plot`, `.legend`, `.viz-tip`, `.ramp`, `.chart-table`) are in the toolkit.

- **Colour, by the job it does.** Identity: `--series-1` is the app's accent, then `--series-2…5` (blue, aqua, yellow, violet), always in that order, never cycled; a sixth series folds into "Other" or becomes small multiples. If the accent is close to one of the fixed hues (a green or teal accent beside aqua, a blue accent beside blue), leave that hue out and move on to the next, so two series never look alike. Magnitude: one hue, `--seq-0…4`, light to dark. Status colours are reserved for state and are never a series. Dark mode has its own steps (`--series-*` are redefined, validated against the dark surface), not a flip.
- **One series** is a soft tint (`--viz-soft`) with the current or selected mark solid `--series-1`. Don't colour nominal bars by value.
- **Marks are thin.** Columns at most 24px, a 4px rounded end and a square base; bars the same, with the value after the tip; lines 2px with round joins; end dots 8px with a 2px surface ring; area fills about 10%. Separate touching marks (stack segments, adjacent bars) with a 2px gap in the surface colour, never a border.
- **One axis, always.** No dual-axis charts: two scales are two charts. Gridlines and axes are hairlines (`--viz-grid`, `--viz-axis`); label only the current, the peak, or a line's end, never every point.
- **Text wears text colours** (`--text`, `--text2`, `--text3`), never the series colour; identity comes from the swatch or line key beside it. Figures are tabular.
- **A legend** (`.legend`) for two or more series; none for one. Lines also get end labels when they don't collide.
- **Interaction ships by default**: a tooltip (`.viz-tip`) on hover and focus with every series at that point, value first; a crosshair that snaps to the nearest x on line charts; the mark itself is the hit target on bars and cells; arrow keys step through a line chart. Tooltips never gate anything: every value is also in the **table view** (`.chart-table`, toggled with `.table-view`).
- **Texture** (45° and 135° lines) is available for colour-blind readers and print, never on by default.
- **Stat tiles** (`.card.stat`): label, value, an optional delta (green only when up is good) and a 12-point sparkline (`.spark`, soft line, current point solid).

## Writing

- **Title Case for labels**: field labels, headings of cards, sections, panels and dialogs, column headers, buttons, tabs, menu items, stat labels and badges. Capitalise major words; a, an, the, and, or, to, of, in, on, for, as, by stay lowercase unless first, and a little word that ends the label or belongs to the verb is capitalised ("Fill In the Entry", "The Full Statement Is In"). Acronyms stay (SAP, GL, JE).
- **Sentence case for sentences**: empty-state headings that read as sentences ("Nothing left to match"), question dialog titles ("Delete all data?"), tooltips, hints, helper text, toasts and messages.
- **All caps only** for the tiny side-nav group labels. No all-caps eyebrows over headings.
- An action keeps one name through the whole flow: the button "Save a Backup" produces the toast "Backup saved"; the same action has the same name on every screen.
- Errors say what happened and how to fix it ("10 digits needed"), in the interface's voice; no apologies. Empty states invite the next action.
- Dates and times in one format per app (e.g. "Oct 23, 2026, 6:10 PM").

## Icons

**Solar** (CC BY 4.0, 480 Design), two styles: **Bold Duotone** where the icon carries the screen (nav items, big mode tiles, empty states, the suggestion sparkle) at 20–24px; **Linear** everywhere else (top bar, chips, close, arrows, inline) at 14–18px. Never every icon duotone. `toolkit/icons.js` holds a curated set (`tools/build_icons.mjs` adds more). A single-file page inlines only the icons it uses (`build_icons.mjs --only copy,moon,refresh --out icons-page.js`); built apps inline only the SVGs they use. Icons use `currentColor`.

## Accessibility

- AA contrast for all text against what is painted behind it, both themes (`--text3` is the faintest allowed; `--accent-ink` for accent text on accent fills; no accent text in dark).
- Focus: a visible neutral ring on every control (`:focus-visible`), never removed. Fields show focus with fill + border.
- Dialogs trap focus and return it; Escape closes the innermost thing; a dirty dialog asks before closing.
- Touch targets 40px (44px on phones); `button.lnk` gets a larger hit area without moving.
- Reduced motion stops all animation and transitions.
- Colour is never the only signal: status always has a text badge.

## Decided with the owner (don't redo these)

Every rule below came from the owner's issues on the Bank Reconciliation app (issue numbers in brackets). New apps start from them; change one only when the user asks.

**Rejected – never bring back:** high-contrast accent outlines, double rings and green "copied" rings (#49, #57) · dashed or dotted outline chips (#189) · icons inside status chips, except the suggestion's stars (#110, #189) · accent-coloured selected rows or list highlights (#90, #103, #109) · accent text in dark mode (#100) · white hover washes and the white top "shine" on surfaces (#94, #99, #191) · a border on the light-mode segmented control (#101) · blinking or pulsing warnings (#86) · see-through menus (#56) · browser-default checkboxes and blue radios (#75, #122) · all-caps titles (#9) · bulk-accept buttons (#70) · internal or system terms in the UI, such as Excel column letters (#44) · filters that switch by themselves (#108) · save-on-blur for important values (#88).

**Colour:** every accent is the same accent: the selected pill, the primary button and a solid badge use one value (#77). Green means money coming in; outgoing totals are never green (#130). One status chip per track; few chips per row (#110).

**Spacing and alignment** (the most frequent complaint): hover bands get breathing room and never hug the text (#106, #109); about 4px between segmented options and 6px between nav items (#74, #80); labels sit next to their values with no dead space, and inputs are sized for their content (#42, #52, #89, #124); things in a row line up – inputs on one line, the same input size, a "–" placeholder in the value column when a value is missing, the same columns from card to card (#39, #62–#64, #160); pages use the full width consistently (#65, #72); digits sit optically centred in count pills (#53, #58, #69).

**Text:** show text once (#81, #133); show full descriptions, with a tooltip as the fallback; never cut mid-word or leave a space before "…" (#61, #83); one term per concept and one date format (#38, #159); plain, self-explanatory names ("General Ledger", "Vendor ID", "Export Unmatched") over abbreviations or system names (#92, #105, #180, #181).

**Behaviour:**
- A workflow fits a 1080p screen without scrolling: steps as an accordion, finished steps fold to a summary (#33, #97).
- The button is the control: no checkbox next to a button that does the same thing (#28, #29). One primary action per step, with secondary actions after it (#79).
- Disabled controls don't react to hover (#94). The copied state wins over hover and reverts after 0.6s (#67, #87).
- Rows never vanish when their state changes: finished rows move down or quiet down, and a row the current filter hides gets a notice, not a view switch (#88, #108).
- Values are saved with an explicit Save or Enter (#88). Confirmations are in-app dialogs, never `confirm()`; destructive buttons are red and offer a backup first (#51, #152, #174). Deletes can be undone, and the undo pop-up appears next to the undo buttons (#20, #178). A dialog with unsaved input doesn't close on a backdrop click (#176).
- Nothing is dropped silently: imports and bulk actions end on a summary of what was kept and what was skipped (#141, #142, #151, #168).
- Let the user review decisions one at a time ("Review 39 Suggestions", not "Accept All") (#70).
- Motion only answers the user's action: no slide when a screen opens, no two-tone trail, no flash (#74, #78, #93).
- On a phone, nothing that looks like a button may be inert: show plain text instead (#183).

**Shadows and glass:** flat, with the material leading (options B and B of the shadow and transparency samples). No shadows at rest; menus, dialogs and toasts keep one because they float. Surfaces are mostly the material colour, 80–96%, with the blur at 28px and no colour boost; content slides under the top and tab bars. Never go more see-through than this: the colour of whatever is underneath must not show through strongly (the earlier, clearer options looked too intense in the top bar).

**Navigation:** option C, "Tabs + Trail": a trail above the title, page tabs under it, a neutral-fill current tab. Nav = places, tabs = views of one record, segmented = filters. See [Layouts](#layouts).

**Charts:** option A, "Accent First": the app's accent is series 1, then blue, aqua, yellow, violet in that order; thin marks, 2px gaps, tooltips and a table view by default. See [Charts](#charts).

**Motion:** quiet and Apple-like (option B of the motion samples): press shrinks to 97%, ticks draw in, folds and dialogs grow and shrink, the pill glides, new content fades in without moving. No bounce.

**Process:** for any visible change that isn't obvious, show a draft or 2–3 lettered samples on real content first, and build the pick (#75, #81, #97, #102, #110, #124). Settle tricky details (brackets, count-pill centring) with measured checks, not by eye (#102, #125, #69).

## What changed in 2.0

From the review of the Bank Reconciliation app against 1.x:

| Seen in the app | 2.0 answer |
|---|---|
| 16 different font sizes, set as pixel literals | a named scale (`--fs-*`), checked by `tools/check_css.py` |
| a second, app-only status chip palette (`--sc-*`, "option D") beside the generic one | one status system with chip / ink / bar tokens; apps map their states onto six roles |
| brand pink hard-coded in ~30 places (`#ce0057`, `rgba(206,0,87,…)`) | everything derived from the trio; Emovis is just `#ce0057 / #8a0069 / #ff5c9d` |
| white inset shine on cards removed by hand (#191) | no shine in the elevation tokens (keycaps keep theirs) |
| accent outlines on hover/open (open drop-down, to-do chips, file drop, carried section) | soft fills or neutral lines only |
| all-caps eyebrow labels on the dashboard and panels | Title Case labels; all caps only in the nav groups |
| weight 650 in places | 400 / 500 / 600 / 700 only |
| phone handled by hiding screens | real phone patterns: tab bar, rail, bottom sheets, table rows as cards, 16px fields, safe areas |
| no pattern for web pages | `body.site` layer with fluid type |
| off-scale spacing utilities (`gap-14px`, `p-30px`) | utilities on the scale; `--gap` / `--min` knobs on layout helpers |

## Checklist

- Exactly one accent-filled primary action per area; the active nav item uses the gradient with a faint glow; the accent was chosen for this app (or the brand's trio).
- Every colour comes from the trio or the status tokens; `python3 tools/check_css.py` reports 0 problems for the app's own stylesheet.
- Hover and selected states are fills; rows and selections are neutral; no accent text in dark.
- Font sizes are tokens; weights 400–700; digits show the open 4, 6, 9 and flat-top 3; brackets centred; tabular figures on data only.
- Labels Title Case, sentences sentence case, headers uncluttered.
- Checked at 390, 1280, 1920 (2560 for desktop tools; 820×1180 and 1024×768 for anything used on tablets) in light and dark: no sideways scroll, no clipped text, AA contrast, targets ≥ 40px on touch.
