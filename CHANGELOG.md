# Changelog

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
