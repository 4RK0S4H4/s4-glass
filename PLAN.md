# Plan – what's being worked on

Read this first in every new session (after CLAUDE.md). Update it when a step is picked, built or merged.

## How each area is done
1. Show 2–3 lettered options on a page in `demo/samples/` (fictional data), merge it, and send the owner the Pages link.
2. The owner picks one (or a mix).
3. Build the pick into `DESIGN.md` (record it under "Decided with the owner"), `skill/SKILL.md`, `COMPONENTS.md` and `toolkit/`. Rebuild the site (`tools/build_site.py`), run the checks, take screenshots at 390 and 1280/1920 in light and dark, open a PR, and merge when CI is green (standing permission, see CLAUDE.md).
4. Repackage the skill (`tools/package_skill.py`) and send the owner `build/s4-glass.skill`. Then update this file.

The owner reads on a phone: keep messages short and ask one thing at a time.

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
| 8 | Forms and validation (states, errors, help text, date pickers, multi-step) | **Samples page up, waiting for the owner's pick.** A Check as You Go (recommended on design judgement) · B Check on Submit (error summary) · C One Step at a Time (steps and review). Shows every field state, error messages with icons, "Today"/"Net 30" date presets, a character counter | [Samples](https://4rk0s4h4.github.io/s4-glass/demo/samples/forms.html) |
| 9 | Empty, loading and error states (skeletons, copy, offline) | Not started | |
| 10 | Dialogs, toasts and destructive actions (confirm and undo) | Not started | |
| 11 | Accessibility audit (focus, contrast, keyboard, reduced motion) | Not started. Checks existing work: report, fix clear defects, put changes to a decided look on a samples page first | |

New areas (9–11) wait until phases 1–3 of the roadmap below are done (agreed with the owner 2026-10-29). Area 7 (Tables) is built (option C, PR #30). Area 8 (Forms) samples were already under way in another session (PR #31); the owner can still pick there, but its native date pickers are replaced by the S4 date picker from Phase 1. Use dataviz only if a chart is involved.

## Roadmap (agreed with the owner 2026-10-29)

**Why:** an end-to-end review found the visual foundations on track, but the *behaviour* layer off course. How controls behave (dropdowns, dialogs, menus, copy, sorting, undo) lives in each app's own code, so the Bank Reconciliation app (React) built better versions than the toolkit (plain JS) and they never came back. The public examples are also too thin to teach the skill (Orders is a 3-row table). Bank Rec, meanwhile, is behind on the newer S4 decisions (65 of its 82 icons are still Linear; no density, wide-screen, trail/tabs or chart tokens). Goal: **S4 Glass holds the best version of every control, and Bank Rec runs on it**.

Work the phases in order. Each phase is one or more PRs; tick items off here as they merge.

### Phase 1 – Harvest Bank Rec's components into S4 Glass, and replace browser-default controls
Bring the components over **without company specifics**, in plain JS (`toolkit/s4.js` + `s4.css`) **and** as a small React kit (`toolkit/react/`, plain TSX files an app copies or imports: no build step for the toolkit). Each gets a gallery entry (`demo/components.html`), markup in `COMPONENTS.md`, a line in `DESIGN.md` → Components and the condensed rule in `skill/SKILL.md`. No new look, so no samples round, **except** where noted (a visible design choice → one lettered page in `demo/samples/` first). Source: `bankrec/src/ui.tsx` and `bankrec/src/styles.css` in arko-EMOVIS/bank-reconciliation-app (private: read it, never copy data or names into this public repo).

From Bank Rec (better than the toolkit today) – **PR 1 of 3, built on `claude/phase1-bankrec-harvest`** (plain JS + CSS, `toolkit/react/` kit, gallery, COMPONENTS, DESIGN, SKILL). `frontend-design` was **not** in the session's skill list on 2026-10-29 (needed for the date-picker samples: say so on the page, use the fallback basis wording, ask the owner to add it). Remaining Phase 1: PR 2 (date + month picker, samples first) and PR 3 (combobox, radios, `data-tip` tooltips, search clear, `::selection`, textarea grip). React kit has no gallery of its own (the plain HTML gallery shows the same markup); it type-checks against @types/react.
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
- [ ] **Date picker** – today the browser's calendar (blue selected day, blue Clear/Today, unstyled). Build an S4 calendar pop-over: month header with previous/next, Mon–Sun or Sun–Sat per locale, today marked with a ring-free soft fill, the selected day solid accent, out-of-month days `--text3`, min/max respected, Clear and Today as `.btn.subtle`, full keyboard (arrows, PgUp/PgDn, Home/End, Enter, Escape), typing a date still works. Also a **month picker** (Bank Rec's "Sep 2026" box). **Samples first**: one page with the picker and the phone behaviour as options (A S4 calendar in a bottom sheet on phones, B the phone's own picker as the dropdown does). Used in Bank Rec by Month End → Closing Day.
- [ ] **Suggestions while typing** (combobox) – replaces `<datalist>` (browser-drawn list; Bank Rec's Payments → Vendor / Customer Name). Same list look as the dropdown, free text allowed.
- [ ] **Radio buttons** – today native with `accent-color`; draw them like the S4 checkbox (soft ring, solid accent dot when on).
- [ ] **Tooltips** – Bank Rec has 104 `title=` attributes (slow, unstyled OS tooltips). An S4 tooltip on hover and keyboard focus (`.tip`, `data-tip`) for icon-only buttons and short hints; keep `aria-label`.
- [ ] **Search fields** – hide the browser's own clear "×" and give `.search` an S4 clear button.
- [ ] **Text selection colour** (`::selection` from the accent, readable in both themes) and the **textarea resize grip**.
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
- [ ] `SKILL.md` down to a short core (about a third of today's 35 KB): principles, then "read X when doing Y" pointers into `references/`; point to the React kit and the flagship.
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
