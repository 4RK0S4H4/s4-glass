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
| 3 | Charts and data visualisation | **Waiting on the owner's pick** of a colour scheme: A Accent First · B Reference Set · C One Hue (same five charts, tooltips, table view, texture) | [Samples](https://4rk0s4h4.github.io/s4-glass/demo/samples/charts.html) |
| 4 | Navigation and density (page headers, breadcrumbs, tabs vs segmented vs nav, compact / comfortable) | Not started | – |


## Open items (the owner said: do these at the very end, once every area is done)
- `demo/examples/` (Habits, Orders) are single-file builds made with the old toolkit, so they still have the old motion and glass. Owner said yes: rebuild them with the final toolkit at the end.
- Motion changed `--ease`, and the glass step changed the surface tokens (`--glass`, `--bar-bg`, `--blur`, `--sat`, `--shadow-1`). The Bank Reconciliation app (arko-EMOVIS/bank-reconciliation-app, private) should follow, per CLAUDE.md. Do it in a session with that repo attached?
