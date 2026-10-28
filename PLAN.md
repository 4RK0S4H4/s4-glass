# Plan – what's being worked on

Read this first in every new session (after CLAUDE.md). Update it when a step is picked, built or merged.

## How each area is done
1. Show 2–3 lettered options on a page in `demo/samples/` (fictional data), merge it, and send the owner the Pages link.
2. The owner picks one (or a mix).
3. Build the pick into `DESIGN.md` (record it under "Decided with the owner"), `skill/SKILL.md`, `COMPONENTS.md` and `toolkit/`. Rebuild the site (`tools/build_site.py`), run the checks, take screenshots at 390 and 1280/1920 in light and dark, open a PR, and merge when the owner says so.
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
| 5 | Icons | **Built, PR open (step 3 of 4).** Owner picked **A Solar Bold Duotone** for every icon in every app (no Linear). `icons.js` is one flat style (91 names, 98 KB); DESIGN.md, SKILL.md, COMPONENTS.md, README, CHANGELOG updated; examples refreshed. Solar is **CC BY 4.0: credit it in each app's About/footer**. Remaining: merge when the owner says so, repackage the skill and send `build/s4-glass.skill`. **The private Bank Reconciliation app must follow** (swap its icons to Solar Bold Duotone everywhere, flat icon map, credit line) in a session with that repo | [Samples](https://4rk0s4h4.github.io/s4-glass/demo/samples/icons.html) · [Guide](https://4rk0s4h4.github.io/s4-glass/guide/design.html#icons) |

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
