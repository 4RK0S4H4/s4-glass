# Plan – what's being worked on

Read this first in every new session (after CLAUDE.md). Update it when a step is picked, built or merged.

## How each area is done
1. Show 2–3 lettered options on a page in `demo/samples/` (fictional data), merge it, and send the owner the Pages link.
2. The owner picks one (or a mix).
3. Build the pick into `DESIGN.md` (record it under "Decided with the owner"), `skill/SKILL.md`, `COMPONENTS.md` and `toolkit/`. Rebuild the site (`tools/build_site.py`), run the checks, take screenshots at 390 and 1280/1920 in light and dark, open a PR, and merge when CI is green (standing permission, see CLAUDE.md).
4. Repackage the skill (`tools/package_skill.py`) and send the owner `build/s4-glass.skill`. Then update this file.

The owner reads on a phone: keep messages short and ask one thing at a time.

## Review 2026-11-03 (after Phase 1, before Phase 2)

End-to-end review of the docs, toolkit, React kit, skill, tools, CI and this plan. **Phase 2 not started.**

**Skills in the session:** `skill-creator` – yes, used for the skill review and eval runs. `frontend-design` – **no**. `design:*` – **no**. So the recommendations below are **my own design judgement**, not the front-end design skill. Please add `frontend-design` and the design plugin to the environment.

**How it was checked:**
- `check_css` (0 problems) and `check_pages` (all ok) on main.
- A hands-on run of every control with Playwright:
  - keyboard only and touch at 390
  - light / dark, compact density, reduced motion, 2560
  - pickers inside dialogs, two dialogs, Escape and focus return, long text
- A React kit type-check (strict, React 18 types), plus a render test of every component in Chromium.
- A docs-vs-code audit.
- The 3 skill evals, each run once by a fresh agent with the packaged skill (no baseline run).

### Bugs fixed (PRs #37, #38)
- **Press shrink:** the decided 97% press shrink never happened. `--press` was defined twice, so the accent tint overrode the scale. The tint is now `--press-bg`. **Phase 3:** if Bank Rec reads `--press` as a colour, rename it there too.
- **`s4Select` (dropdown) and form code:**
  - The button now follows `.value`, `selectedIndex`, form reset and new options.
  - `.bad` / `aria-invalid`, `focus()`, `<label for>` and `required` reach the button. Before, a required select blocked submit silently, and error links focused nothing.
  - Disabled options are skipped by arrows and type-ahead.
  - Long options wrap at the screen edge.
  - The list closes on page scroll.
- **Dialogs:**
  - First focus goes to the first body field, not the header Close.
  - A dialog opened from a dialog sits on top.
  - The focus trap ignores the hidden select.
- **Date picker:**
  - Tab out of the calendar goes to the next field. It used to escape the dialog.
  - The pop-over fits short windows.
  - New messages: "There is no 2/30/2026…" and a month range message for month fields.
  - A typed-date error keeps the `.err` icon.
- **Menus:** closing a menu with its own button removes the key handler. Menus close on page scroll.
- **`s4Search`:** the wrapper takes the width a bare `.search` had. Before, the tables samples search was 160px on a phone.
- **Icons:** feature and empty-state icons are 32px (spec), not 21px.
- **`build_icons.mjs`:**
  - It now takes `toolkit/icons.js` as its source.
  - SKILL.md step 6 couldn't be followed: `@iconify-json/solar` is not shipped. Two of the three eval runs hit this.
- **Skill description:** now also says "Not for S4 Orion". S4 Orion's description claims "the user's own design system… glass layer", so the two compete.
- **React `Money`:** copies `-1234.56` with no commas.
- **Examples:** no `title=`.
- **`templates/page.html`:** the dead `#components` link is fixed.
- **React README:** the import path is fixed.
- **`demo/samples/forms.html`:** uses the S4 date picker (the phone's own on touch). Before, it used native `type=date`.
- **CHANGELOG:** now has Phase 1 and the review.

### Bugs still open (small)
- Date picker: PgDn or the arrows past `data-min` / `data-max` do nothing. They should stop at the limit.
- React `useToast().show(text, action, anchor)` takes positional arguments, but `s4Toast(text, {action, anchor})` takes options. Also missing in React:
  - the `.leaving` fade on toasts
  - the `Modal` 0.15s exit
  - `Modal narrow`
- `demo/samples/tables.html`: the "Recommendation basis" box still has the fallback wording. Re-check it once `frontend-design` is available.
- `build_site.py` DEMOS:
  - Decided samples (icons, wide-screen, tables, date-picker) are still labelled "(draft)".
  - The date-picker card still offers the rejected calendar sheet.
  - Ten samples pages have no card.
- Links:
  - `DESIGN.md:211` links `../demo/samples/charts.html`. That only works from `guide/`.
  - In the skill, `components.md` links samples pages that aren't bundled.
- `check_pages.mjs` with no arguments fails inside the skill (it looks for the site pages). It also writes `out/` next to the toolkit.
- README toolkit table:
  - The s4.js row lists only the 2.0 functions.
  - `toolkit/react/` is missing.
- Not documented in COMPONENTS.md:
  - functions: `s4Theme`, `s4ThemeToggle`, `s4Slider`, `s4Copy`, `s4Ask`, `s4Bars`, `s4Icon`
  - utility classes
  - `.skeleton` and `.drop` markup

### Gaps that need the owner (would change a decided look, so samples first)
- **Web-page headings:** Title Case or sentence case? DESIGN.md says section headings are Title Case. `templates/page.html` uses sentence case ("Rules that keep every screen calm"), and so did one eval run.
- **Compact density:** fields and dropdowns stay 34px while buttons and chips drop to 28px, so table bars have mixed heights.
- **Hand-drawn icons:** the date-picker arrows, the search "×", the dropdown chevron and the React sort chevron are stroked SVGs. "Solar Bold Duotone everywhere" says otherwise.
- **Theme toggle:** it shows a moon in both themes. SKILL.md mentions "sun/moon".
- **Unsaved dialogs:** tapping outside a dialog with unsaved input does nothing. Should it ask "Discard …?" like Escape does?
- **Feature grid:** `.grid-auto` with `--min: 240px` leaves an empty fourth column for 3 features at 1280. That's dead space on the right.
- **Top bar on wide screens:** `.content.center` caps the content at 1100px but not the top bar, so the actions sit far from the table at 1920.

### The skill (Skill Creator review)
- **Evals:** 3 cases × 5 graders, all 15 pass. The grading was inline. There was no baseline run, so the graders don't yet show they discriminate (they may pass without the skill too).
  - No case covers Phase 1: the dropdown, the date picker, a dialog with a picker, the React kit.
  - Missing from CLAUDE.md's list: a dashboard, a list | detail app, a multi-step form, React.
- **Triggering:** there is no trigger eval set. Next step: about 20 queries (half near-misses, mainly S4 Orion / Material wording such as "my design system", "glass", "M3"), run with skill-creator's `run_loop`, before Phase 4 ends.
- **Size:** SKILL.md is 31 KB / 177 lines (not 35 KB).
  - "Where things are" leaves out `toolkit/react/` and `build_icons.mjs`. React is only mentioned in passing.
  - Eval agents found three more problems:
    - "Read `toolkit/s4.css` once" means 100 KB of long lines.
    - `templates/app.html` links `../toolkit/` while the docs say `toolkit/`.
    - `migration.md` doesn't cover restyling a single HTML file.
- **Could a fresh session build a good app from it alone?** Yes, for pages and small tools: all three eval outputs were on-spec and checked at 390/1280/1920 in both themes. Two things would help:
  - **The flagship (Phase 2):** there is no example of real density for a list | detail app.
  - **Clearer guidance on:**
    - an icon subset for single files (now fixed)
    - picking an accent when the user says "pick for me" (the "trackers" row vs "health/planning")
    - headings on web pages (above)
- **The owner's installed skill is older than Phase 1.** It has no React kit, date picker, combobox, radios or `data-tip`. Every app built today still gets browser-default controls. Repackage and send `build/s4-glass.skill` now.

### The plan: what's wrong, missing or too big
- **Wrong after Phase 1:**
  - The Phase 1 text still says "PR 1 of 3, built on `claude/phase1-bankrec-harvest`".
  - Area 8 says the native date pickers "are replaced". That's now true (this review).
  - Phase 4 says SKILL.md is "35 KB".
- **Duplicated:**
  - Areas 9 and 10 overlap with what Phase 1 brought: toasts, undo pop-up, unsaved-input dialogs, empty "–".
  - Area 11 (accessibility) overlaps with this review's keyboard and focus findings.
- **Too big:** Phase 3 (Bank Rec). Split it into:
  - 3a: kit and tokens (incl. `--press-bg`)
  - 3b: icons
  - 3c: density, wide screens and motion
  - 3d: Phase 1 replacements
  
  One PR each, in its own session.
- **Missing:**
  1. **Behaviour tests in CI.** Every bug above was in behaviour, which `check_pages` doesn't test. Add `tools/check_behaviour.mjs`: dropdown, combobox, date picker, menus, dialogs (stack, Escape, dirty, focus return), toasts, on the gallery and samples. Also add to CI:
     - the React kit type-check plus a render smoke test
     - `check_pages` on `demo/samples/*` and at 2560
     - a staleness check for `refresh_examples.py`
     - `package_skill.py`
  2. **A skill release step after every merged batch** (version + one-line "what changed" for the owner). Today the installed skill drifts behind main.
  3. **A real-phone pass:** the owner opens the gallery and the forms samples on their phone. Nothing has been tested on a real device yet.
  4. **A React demo page** (built in CI with esbuild, published on Pages), so the kit is seen and tested, not only type-checked.
  5. **The owner's Forms pick (area 8)** is needed before the flagship, because the flagship has a form.

### Recommended order (my own design judgement; frontend-design not available)
1. **Now, small: skill release.** Repackage with this review's fixes and send it. Reason: the owner's apps are being built today on a skill that predates Phase 1, and that costs more each day than anything below.
2. **Behaviour tests in CI** (Missing 1). Reason: Phase 2 and Phase 3 both lean on these controls, and today's bugs (dropdown out of sync with the form, focus lost in dialogs) are exactly what a flagship or Bank Rec would hit. Catching them in CI is cheaper than in review.
3. **The owner picks Forms (area 8)**, then **Phase 2, the flagship**, built with that pick. Reason: the flagship is the reference that the skill, the evals and Bank Rec all learn from. It should show the decided form behaviour, not a guess.
4. **Phase 4, the skill**, before Phase 3. Reason: it is small once the flagship exists (point to it, add evals built around it). It helps every new app at once, while Phase 3 helps only one, and Phase 3 can then follow the restructured skill. Phase 3 can run in parallel in its own session if the owner prefers.
5. **Phase 3, Bank Rec**, in 3a–3d.
6. **Phase 5:**
   - 9 and 10 merged into one "States and Feedback" area, mostly documenting what exists
   - 11 Accessibility, with `design:accessibility-review` once it's available
   - the owner gaps above, on one samples page

**Next session starts at:** step 1 or 2, depending on the owner's answer to "what first".

## Areas
| # | Area | Status | Links |
|---|---|---|---|
| 1 | Motion | **Done.** Picked B "Apple Quiet"; built in PR #3 | [Guide](https://4rk0s4h4.github.io/s4-glass/guide/design.html#motion) · [Samples](https://4rk0s4h4.github.io/s4-glass/demo/samples/motion.html) |
| 2 | Glass, shadows and transparency | **Done** (PR #9). Owner picked **B Flat** (shadows) and **B Mostly Material** (transparency): flat, no resting shadows, surfaces 80–96% material colour, 28px blur, no colour boost, content slides under bars | [Shadows](https://4rk0s4h4.github.io/s4-glass/demo/samples/shadows.html) · [Transparency](https://4rk0s4h4.github.io/s4-glass/demo/samples/transparency.html) · earlier: [Glass](https://4rk0s4h4.github.io/s4-glass/demo/samples/glass.html), [Depth](https://4rk0s4h4.github.io/s4-glass/demo/samples/depth.html), [See-through](https://4rk0s4h4.github.io/s4-glass/demo/samples/see-through.html) |
| 3 | Charts and data visualisation | **Done** (PR #11). Owner picked **A Accent First**: accent is series 1, then blue, aqua, yellow, violet; thin marks, tooltips, table view, texture opt-in | [Samples](https://4rk0s4h4.github.io/s4-glass/demo/samples/charts.html) |
| 4a | Navigation (page headers, breadcrumbs, tabs vs segmented vs nav) | **Done** (PR #13). Owner picked **C Tabs + Trail** | [Samples](https://4rk0s4h4.github.io/s4-glass/demo/samples/navigation.html) |
| 4b | Density (compact / comfortable) | **Done** (PR #15). Owner picked **C Two Modes, Auto** | [Samples](https://4rk0s4h4.github.io/s4-glass/demo/samples/density.html) |
| 5 | Icons | **Built and merged (PR #21); skill repackaged, file still to send (step 4).** Owner picked **A Solar Bold Duotone** for every icon in every app (no Linear). `icons.js` is one flat style (91 names, 98 KB); DESIGN.md, SKILL.md, COMPONENTS.md, README, CHANGELOG updated; examples refreshed. Solar is **CC BY 4.0: credit it in each app's About/footer**. Remaining: send `build/s4-glass.skill`. **The private Bank Reconciliation app must follow** (swap its icons to Solar Bold Duotone everywhere, flat icon map, credit line) in a session with that repo | [Samples](https://4rk0s4h4.github.io/s4-glass/demo/samples/icons.html) · [Guide](https://4rk0s4h4.github.io/s4-glass/guide/design.html#icons) |
| 6 | Wide-screen desktop layouts | **Done** (PR #25, skill repackaged and sent). Owner picked **C, Cap, Then Widen the Panel**: Overview/list content capped at 1600px and centred; detail panel 34% (360–880px), two columns from 760px | [Samples](https://4rk0s4h4.github.io/s4-glass/demo/samples/wide-screen.html) |
| 7 | Tables at scale (filtering, bulk select, sticky columns, pagination) | **Done** (PR #30, skill repackaged and sent). Owner picked **C, Pages, Totals Below**: `.t-bar`, `.t-applied`/`.xchip`, sticky columns, `.sel-dock` with the sum of selected rows, `.t-foot`/`.pager` | [Samples](https://4rk0s4h4.github.io/s4-glass/demo/samples/tables.html) |
| 8 | Forms and validation (states, errors, help text, date pickers, multi-step) | **Samples page up, waiting for the owner's pick** (now on the S4 date picker, review 2026-11-03). A Check as You Go (recommended on design judgement) · B Check on Submit (error summary) · C One Step at a Time (steps and review). Shows every field state, error messages with icons, "Today"/"Net 30" date presets, a character counter | [Samples](https://4rk0s4h4.github.io/s4-glass/demo/samples/forms.html) |
| 9 | Empty, loading and error states (skeletons, copy, offline) | Not started | |
| 10 | Dialogs, toasts and destructive actions (confirm and undo) | Not started | |
| 11 | Accessibility audit (focus, contrast, keyboard, reduced motion) | Not started. Checks existing work: report, fix clear defects, put changes to a decided look on a samples page first | |

New areas (9–11) wait until phases 1–3 of the roadmap below are done (agreed with the owner 2026-10-29). Area 7 (Tables) is built (option C, PR #30). Area 8 (Forms) samples were already under way in another session (PR #31); the owner can still pick there, but its native date pickers are replaced by the S4 date picker from Phase 1. Use dataviz only if a chart is involved.

## Roadmap (agreed with the owner 2026-10-29)

**Why:** an end-to-end review found the visual foundations on track, but the *behaviour* layer off course. How controls behave (dropdowns, dialogs, menus, copy, sorting, undo) lives in each app's own code, so the Bank Reconciliation app (React) built better versions than the toolkit (plain JS) and they never came back. The public examples are also too thin to teach the skill (Orders is a 3-row table). Bank Rec, meanwhile, is behind on the newer S4 decisions (65 of its 82 icons are still Linear; no density, wide-screen, trail/tabs or chart tokens). Goal: **S4 Glass holds the best version of every control, and Bank Rec runs on it**.

Work the phases in order. Each phase is one or more PRs; tick items off here as they merge.

### Phase 1 – Harvest Bank Rec's components into S4 Glass, and replace browser-default controls
Bring the components over **without company specifics**, in plain JS (`toolkit/s4.js` + `s4.css`) **and** as a small React kit (`toolkit/react/`, plain TSX files an app copies or imports: no build step for the toolkit). Each gets a gallery entry (`demo/components.html`), markup in `COMPONENTS.md`, a line in `DESIGN.md` → Components and the condensed rule in `skill/SKILL.md`. No new look, so no samples round, **except** where noted (a visible design choice → one lettered page in `demo/samples/` first). Source: `bankrec/src/ui.tsx` and `bankrec/src/styles.css` in arko-EMOVIS/bank-reconciliation-app (private: read it, never copy data or names into this public repo).

**Phase 1 is done** (PRs #33–#36, 2026-11-03; review fixes #37–#38). Next: see "Review 2026-11-03" above for the recommended order. React kit has no gallery of its own (the plain HTML gallery shows the same markup); it type-checks against @types/react.
- [x] **Dropdown** (`Select` in ui.tsx, `button.sel` + `.sel-list`): themed listbox, arrows/Home/End/type-ahead, opens upward near the bottom, tick on the current option, open = focused-field look, native picker on touch (`pointer: coarse`).
- [x] **Dialog with unsaved input**: Escape asks "Discard …?" inside the dialog (Keep Editing / Discard). **Fixes a toolkit bug**: `s4Dialog` closes a `data-dirty` dialog on Escape without asking.
- [x] **Undo pop-up** anchored next to the undo buttons, with a pointer (`.toast.undo-pop`); the spec already requires it (#178).
- [x] **Menus**: arrow-key navigation (missing in `s4Menu`), sections with headers (`.menu-sec`), fixed width so counts line up, an options menu with descriptions (`.ptab-menu`).
- [x] **Toast**: 6.5s when it has an action (time to reach Undo), ~4s otherwise.
- [x] **Copy cells**: icon-only, block (multi-line), date copy, the "–" empty placeholder (`.amt-empty`); the tick stays until the green has faded.
- [x] **Row quick actions and owner pills** (`.qb`, `.pp`): small inline actions on a table row with a quiet on-state.
- [x] **Truncation tooltip** with a main line and a quieter sub-line, a short delay, flips above near the bottom (`DescTip`).
- [x] **Sorting**: blanks always last (`s4Sort` sorts them first today).
- [x] **Locked settings** read as plain values (`.locked-f`); **removable chip** (`.chip-x`).

Browser-default controls to replace with S4 Glass versions (owner, 2026-10-29: "controls like these use an S4 Glass version instead of the browser default"):
- [x] **Date picker** (owner picked **B**, the phone's own picker, 2026-11-03; built as `s4Date` / `DateField`, PR 2b) – today the browser's calendar (blue selected day, blue Clear/Today, unstyled). Build an S4 calendar pop-over: month header with previous/next, Mon–Sun or Sun–Sat per locale, today marked with a ring-free soft fill, the selected day solid accent, out-of-month days `--text3`, min/max respected, Clear and Today as `.btn.subtle`, full keyboard (arrows, PgUp/PgDn, Home/End, Enter, Escape), typing a date still works. Also a **month picker** (Bank Rec's "Sep 2026" box). **Samples first**: one page with the picker and the phone behaviour as options (A S4 calendar in a bottom sheet on phones, B the phone's own picker as the dropdown does). Used in Bank Rec by Month End → Closing Day.
- [x] **Suggestions while typing** (combobox) – replaces `<datalist>` (browser-drawn list; Bank Rec's Payments → Vendor / Customer Name). Same list look as the dropdown, free text allowed.
- [x] **Radio buttons** – today native with `accent-color`; draw them like the S4 checkbox (soft ring, solid accent dot when on).
- [x] **Tooltips** – Bank Rec has 104 `title=` attributes (slow, unstyled OS tooltips). An S4 tooltip on hover and keyboard focus (`.tip`, `data-tip`) for icon-only buttons and short hints; keep `aria-label`.
- [x] **Search fields** – hide the browser's own clear "×" and give `.search` an S4 clear button.
- [x] **Text selection colour** (`::selection` from the accent, readable in both themes) and the **textarea resize grip**.
- Keep native on purpose: file pickers (hidden behind S4 buttons and the drop zone), the dropdown on touch screens.

### Phase 2 – A flagship example (public, fictional)
- [ ] A realistic list | detail app in `demo/examples/` (e.g. an expense or invoice tracker, ~50 rows of fictional data) that uses every Phase 1 component at real density, in both themes, at 390 / 1280 / 1920 / 2560. It is the reference the skill, the evals and new apps learn from. Card in `DEMOS`, passes `check_pages`.

### Phase 3 – Bring Bank Rec up to the current S4 Glass (private repo, its own session)
- [ ] Bank Rec uses the S4 React kit and `s4.css` tokens instead of its own copies (its decisions stay; see its NOTES.md).
- [ ] Icons: Solar Bold Duotone everywhere, flat icon map, Solar credit line (area 5).
- [ ] Density (`s4Density`, setting in Settings), wide screens (1600 cap, 34% panel), current motion (press 97%, S4 pop/exit timings), chart tokens, trail + page tabs where a screen has depth.
- [ ] The Phase 1 replacements (date picker on Closing Day, combobox on Vendor / Customer Name, S4 radios, S4 tooltips).
- [ ] Bank Rec's own checks and screenshots (its CLAUDE.md). Afterwards, an improvement reaches Bank Rec by updating the kit, not by hand.

### Phase 4 – Restructure the skill (Skill Creator)
- [ ] `SKILL.md` down to a short core (about a third of today's 31 KB): principles, then "read X when doing Y" pointers into `references/`; point to the React kit and the flagship.
- [ ] Description tuned so it triggers for S4 Glass and not S4 Material / S4 Orion.
- [ ] Evals from 3 to 6 (add a dashboard, a multi-step form, a React list | detail app); run them before every repackage.
- [ ] One check script named in the skill (`check_pages.mjs`, or say when `shoot.py` from s4-app-studio applies).
- [ ] Repackage (`tools/package_skill.py`) and send the owner `build/s4-glass.skill`.

### Phase 5 – Resume the areas
- [x] 7 Tables: built, option C (PR #30). Repackage the skill with Phase 4.
- [ ] 8 Forms: build the owner's pick from PR #31's samples, with the S4 date picker and combobox from Phase 1.
- [ ] 9 States, 10 Dialogs/toasts: mostly document what Phase 1 brought over, then samples only for real gaps.
- [ ] 11 Accessibility: `design:accessibility-review` across the gallery, the flagship and Bank Rec together.

### Smaller items found in the review
- `DESIGN.md` mixes spec and history (issue numbers in most rules); consider moving the history to a decisions log during Phase 4.
- Bank Rec's scrim blur (6px) and dialog shadow are literals; S4 has tokens (Phase 3).
- Design note, not re-opened: in Bank Rec's Transactions nearly every row shows the solid "Suggested" badge, so the status column becomes a solid accent stripe. Decided (#189); raise only if the owner asks.

## Open items
- Habits and Orders (`demo/examples/`) are refreshed with the final toolkit (`python3 tools/refresh_examples.py`); Habits also shows the density setting. Re-run the script after any toolkit change.
- **The Bank Reconciliation app** (arko-EMOVIS/bank-reconciliation-app, private) catches up in **Phase 3** of the roadmap above: tokens (`--ease`, surfaces, chart, density), trail and page tabs, icons, and the S4 React kit. Do it in a session with that repo attached, and keep that app's own decisions.
