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
| 2 | Glass and transparency | **Waiting on the owner's pick** (A Today · B Apple Ladder · C Clearer) | [Samples](https://4rk0s4h4.github.io/s4-glass/demo/samples/glass.html) |
| 3 | Charts and data visualisation | Not started (use the dataviz skill) | – |
| 4 | Navigation and density (page headers, breadcrumbs, tabs vs segmented vs nav, compact / comfortable) | Not started | – |

## Glass options (for step 2)
- **A · Today:** two glass levels with one blur. The light page is flat grey, and content stops at the top bar.
- **B · Apple Ladder:** thin glass for bars, regular for cards and the nav, thick for dialogs and sheets. The light page gets a faint accent wash, content scrolls under the bars, and dark bars are a smoky glass.
- **C · Clearer:** like B but more see-through, with a stronger colour wash. The palest text gets weaker over busy content.

In all three, menus stay solid (#56) and there's no white shine (#94, #99, #191). Building B or C means the app shell's content scrolls under the top bar and tab bar.

## Open items (ask after the current pick)
- `demo/examples/` (Habits, Orders) are single-file builds made with the old toolkit, so they still have the old motion. Rebuild them?
- Motion changed `--ease`. The Bank Reconciliation app (arko-EMOVIS/bank-reconciliation-app, private) should follow, per CLAUDE.md. Do it in a session with that repo attached?
