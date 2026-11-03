# Changelog

## Review fixes (2026-11-03)
- **Press shrink works again**: `--press` (0.97) was overridden by the accent tint of the same name; the tint is now `--press-bg`.
- **Dropdown (`s4Select`)**: the button follows `.value`, `selectedIndex`, form reset and new options; `.bad`/`aria-invalid`, focus, `<label for>` and `required` reach the button; disabled options skipped; long options wrap at the screen edge; closes on page scroll.
- **Dialogs**: first focus is the first field in the body (not the header Close); a dialog opened from a dialog sits on top. **Date picker**: Tab leaves the calendar to the next field (it used to jump out of a dialog), the pop-over fits short windows, clearer messages for a day that doesn't exist and for months out of range. **Menus**: closing with their own button drops the key handler.
- **Search** wrapped by `s4Search` keeps the width a bare `.search` had. Feature and empty-state icons are 32px, as specified.
- `build_icons.mjs` takes `toolkit/icons.js` as its source for a page subset (no npm package needed). Skill description also excludes S4 Orion.

## Phase 1: Bank Rec's components and S4 versions of browser controls (2026-11-03, PRs #33–#36)
- Dropdown `s4Select` (native on touch), dialog with unsaved input (`data-dirty` → "Discard …?"), undo pop-up (`s4Toast(…, {anchor})`), menus with arrow keys, sections and options, copy chip variants, row quick actions `.qb` and owner pills `.pp`, truncation tooltip with a sub line, blanks-last sorting, `.locked-f`, `.chip-x`.
- Date and month picker `s4Date` (the phone's own picker on touch, owner's pick B), suggestions `s4Combo`, S4 radios, `data-tip` tooltips, `s4Search` clear button, `::selection` colour, textarea grip.
- `toolkit/react/`: a small React kit with the same components (Select, Modal, useToast, CopyCell, useSort/SortTh, SegFilter, FoldCard, DescTip, DateField, Combo, SearchInput).

## Tables at scale (2026-10-29)
- **Option C, "Pages, Totals Below"** (owner's pick): `.t-bar`, `.t-applied` + `.xchip`, sticky columns (`.sticky-l`, `.sticky-l2`, `.sticky-r`, for tables that scroll sideways, not `.cards`), `.sel-dock` (the sum of the selected amounts under the table), `.t-foot` and `.pager`.

## Wide screens (2026-10-28)
- **Option C, "Cap, Then Widen the Panel"** (owner's pick): `.content` stops at `--content-max` (1600px) and centres itself (`.content.flush` and `.content.center` unchanged); `.split` detail panel is `clamp(360px, 34vw, 880px)` (was 36vw up to 600px) and a `container-type: inline-size`, with `.detail-cols` laying cards out in two columns from 760px.

## Icons (2026-10-28)
- **One icon style: Solar Bold Duotone** for every icon (owner's pick, option A). Linear is gone: `icons.js` is a flat `S4_ICONS` map of 91 names (98 KB, was 149 KB); `data-ic` and `data-ic-duo` both render Bold Duotone, `s4Icon(name)` ignores a second argument. Solar's CC BY 4.0 credit is required. `tools/refresh_examples.py` now refreshes each example's icon subset too.

## 2.0 (2026-10-24)
Built from a design review of the Bank Reconciliation app (the app the 1.x rules were settled on).
- **Type scale**: twelve named sizes (`--fs-cap` … `--fs-hero`) plus fluid web-page sizes; no pixel font sizes in components. Weights 400–700 only.
- **Status system**: every status has text, soft-area, chip, ink and bar tokens (`--ok-*`, `--warn-*`, `--bad-*`, `--mute-*`, `--accent-chip/-bar`); `.badge.solid` for "needs your decision"; `.badge.mute`, `.dot`, `.card.edge`. Replaces app-specific chip palettes.
- **Elevation, motion and layer tokens**: `--shadow-1/2/3` (no white inset shine on surfaces), `--dur-1/2/3`, `--z-*`.
- **Phone to 2560**: icon rail at ≤980px, phone tab bar (`.app.has-tabbar` + `.tabbar`), floating action button, bottom-sheet dialogs, `table.t.cards` (rows become cards), 16px fields on phones (no iOS zoom), 44px phone targets, safe-area insets, `100dvh`.
- **Web pages**: `body.site`, `.site-head` with a phone menu, `.hero`, `.section`, `.prose`, `.feature`, `.cta-band`, `.site-foot`, `.container`, `.btn.lg`.
- **New components**: `.list`/`.li`, `.fold`/`.steps` (native `<details>`), `.note`, `.tile`, `.fchip`, `.form-grid`, `.copy.empty`, `.skeleton`, `.card-head`, `.card.lift`, native `select` chevron, layout helpers (`.stack`, `.cluster`, `.spread`, `.grid-auto`, `.grid-4`).
- **Fixes**: short table columns never wrap; accent outlines removed from hover/open states; `code` uses Inter.
- **JS**: `s4Copy`, `s4Tips`, `s4Menu`, `s4Dialog`/`s4Close` (focus trap), `s4Toast`, `s4ThemeToggle`, and `data-copy` / `data-menu` / `data-open` / `data-close` / `data-theme-toggle` wiring.
- **Tooling**: `tools/check_css.py` (house rules), `tools/check_pages.mjs` (layout/font/theme checks), `tools/build_icons.mjs` + `toolkit/icons.js`, `inline.py` inlines any `data-s4` link or script.
- Templates (`templates/app.html`, `templates/page.html`) and a component gallery (`demo/components.html`).
- From the first skill test run: `.app.solo` (single-page tool, no nav); `s4Sort` table sorting with status-by-urgency; right-aligned sort headers line up with their numbers; phone-card amounts stay together whatever the markup; 27 more icons (refresh, printer, share, eye…) and `build_icons.mjs --only` for single-file pages; tablet sizes in the checks.
- From the owner's Bank Rec issues: `.badge.dashed` removed (dashed chips were rejected, #189); DESIGN.md "Decided with the owner".

## 1.x
The look as settled on the Bank Reconciliation app (v5–v9.12): glass surfaces, accent trio, filled states, Title Case, Inter digits and brackets, Solar icons.
