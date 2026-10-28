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
| 7 | Tables at scale (filtering, bulk select, sticky columns, pagination) | **Samples page up, waiting for the owner's pick.** v2 after the owner could not tell A from C: A Toolbar and Pages · B Spreadsheet Style (column filters, range select, status bar) · C Day Ledger (day groups with subtotals, filter rail; recommended on design judgement, skill not available) | [Samples](https://4rk0s4h4.github.io/s4-glass/demo/samples/tables.html) |
| 8 | Forms and validation (states, errors, help text, date pickers, multi-step) | Not started | |
| 9 | Empty, loading and error states (skeletons, copy, offline) | Not started | |
| 10 | Dialogs, toasts and destructive actions (confirm and undo) | Not started | |
| 11 | Accessibility audit (focus, contrast, keyboard, reduced motion) | Not started. Checks existing work: report, fix clear defects, put changes to a decided look on a samples page first | |

Areas 6–11 go one at a time in this order; start the next only when the owner has picked and the build is merged. Use dataviz only if a chart is involved.

## Next (not started)
- Repackage the skill (`tools/package_skill.py`) and send the owner `build/s4-glass.skill` so the installed copy matches.
- Owner picks the next area, or proposes candidates (use the `frontend-design` skill, now available, and say so on the page).
- Optional: re-check the recommendation boxes on the older samples pages with the skill.

- Density Auto cutoff changed (owner, 2026-10-28): compact only 1300–2200px wide with a mouse, standard on 1440p and up.
- Icons: a separate session is making `demo/samples/icons.html` (Solar Bold Duotone vs Phosphor Duotone). The owner wants Solar Bold Duotone across all glass apps going forward, pending the draft.
- Candidate next areas (from the front-end design skill, used as a lens): wide-screen desktop layouts (recommended), tables at scale, forms and validation, empty/loading/error states, dialogs/toasts/destructive actions, accessibility audit.

## Open items
- Habits and Orders (`demo/examples/`) are refreshed with the final toolkit (`python3 tools/refresh_examples.py`); Habits also shows the density setting. Re-run the script after any toolkit change.
- **Still to do: the Bank Reconciliation app** (arko-EMOVIS/bank-reconciliation-app, private). Its tokens must follow, per CLAUDE.md: `--ease` (motion), the surface tokens (`--glass`, `--glass2`, `--bar-bg`, `--nav-bg`, `--modal-bg`, `--blur`, `--sat`, `--shadow-1`), the new chart tokens (`--series-*`, `--seq-*`, `--viz-*`), density (`--row-py`, `--ctl-h`, `--card-pad`, `--nav-h`, `--stack-gap`, `s4Density()`), and the trail and page tabs (`.crumbs`, `.pagetabs`). Do it in a session with that repo attached, and keep that app's own decisions.
