# Bringing an existing app onto S4 Glass 2.0

Learned on the Bank Reconciliation app (its stylesheet went from 130 rule problems to 0 with no change to its screens' structure). Work in this order; each step is safe on its own.

## 1. Baseline

- Read the app's own notes and changelog first. Decisions the user made in that app (a chip style they picked, a solid suggestion badge, glass banners in dark) **stay**: map them onto S4 Glass tokens rather than replacing them. If a decision conflicts with S4 Glass, keep the user's and mention the conflict.
- `python3 toolkit/check_css.py app.css` – the count is the migration target.
- Take a before screenshot grid of every screen, menu and dialog (light and dark; 390, 1280, 1920, plus 2560 for desktop tools). If the repo has a grid script (e.g. `qa_grid.mjs` + `qa_diff.mjs`), use it.
- Check which automated checks assert exact colours, sizes or text casing, so you know what may move.

## 2. Tokens

- Replace the app's token section with the S4 Glass blocks from `toolkit/s4.css` (light, dark, the OKLCH `@supports`, the no-blur fallback), with the app's trio in place of the default. An app whose inline script always sets `data-theme` before the first paint may keep a single `:root[data-theme="dark"]` block (the `prefers-color-scheme` copy is only a fallback); otherwise keep both.
- Keep the app's own token names working through **one alias block** after the S4 blocks (`--btn-bg: var(--bg2)`, `--nav-active: var(--nav-grad)`, `--sc-ok-f: var(--ok-chip)` …). An alias defined once on `:root` follows the theme, because the token it points to is redefined on the same element. Only an alias whose meaning differs by theme gets a line in the dark block.
- If the app used `--accent` as a line or text colour that changes in dark, rename those uses to `--acc` (the accent as a line: the light tint in dark) and keep `--accent` as the trio value.
- Hard-coded brand values (`#ce0057`, `rgba(206,0,87,.28)`) in components become tokens (`--btn-edge`, `--attn-shadow`, `--shadow-2`…).

## 3. Status

Map every app status onto the six roles: ok, warn, bad, mute, accent, and "needs your decision" (solid accent). Examples from Bank Rec: To Sort → warn · Suggested → solid · Matched / Nets to $0 → ok · Difference → bad · Journal Entry / Payment → accent · Carried / Ignored → mute · "Balances Tie · Work Open" (was an off-system purple) → accent. No seventh colour.

## 4. Type

- Map every `font-size` onto the named scale (11→cap, 11.5→badge, 12→xs, 12.5→sm, 13 and 13.5→ui, 14→base, 14.5/15/16→title, 18/19→h2, 20→h1, 22→stat, 24/26→big, 30→hero). Expect small reflows where 13.5 became 13; look at those screens.
- Weight 650 → 700 (the static Inter faces already rendered it as 700, so nothing changes visually).
- Remove `text-transform: uppercase` everywhere except the side-nav group labels; the label text itself must already be Title Case.

## 5. Behaviour fixes

- Accent outlines on hover, open or drag-over → soft fills (`--hov`, `--accent-soft`) or the focused-field look (`--field-focus-line` + `--field-focus-bg`).
- A bordered "suggestion" box → `--accent-soft` fill with an inset 3px `--acc` bar.
- Add the touch block (40px targets on `pointer: coarse`) and the phone block (bottom-sheet dialogs, safe-area padding, 16px fields) if the app is ever opened on a phone; add `viewport-fit=cover` to the viewport meta so the safe-area insets work.

## 6. Verify

- `check_css.py` → 0; build; the app's data checks; the full browser suite.
- After grid, diff against before: every change should be one you meant (tint shifts under 1% of pixels are the derived greys; larger ones should be a reflow you can name).
- Write the change down where the app keeps its styling rules (e.g. NOTES.md "Styling rules") and in its changelog, with the before/after reasons, so the next session doesn't undo it.
