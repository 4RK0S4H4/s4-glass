# S4 Glass

The S4 Glass design language: spec (`DESIGN.md`), component markup (`COMPONENTS.md`), toolkit (`toolkit/`), templates, demos, and the source of the `s4-glass` Claude skill (`skill/`). Plain HTML/CSS/JS, no build step for the toolkit itself.

**Current work and next steps are in `PLAN.md`: read it at the start of every session and keep it up to date.**

## Delivery: GitHub Pages, not artifacts
- This repo is **public** and served by GitHub Pages from `main`, root folder (Settings → Pages → Deploy from a branch → `main` / `/ (root)`). `.nojekyll` makes Pages serve the files as they are.
- Site: **https://4rk0s4h4.github.io/s4-glass/** – the home page and design-language guide, with every demo linked from it:
  - Guide: https://4rk0s4h4.github.io/s4-glass/guide/design.html · Components: https://4rk0s4h4.github.io/s4-glass/guide/components.html
  - Gallery: https://4rk0s4h4.github.io/s4-glass/demo/components.html · App template: …/templates/app.html · Web page template: …/templates/page.html · Examples: …/demo/examples/
- After a change is merged to `main`, give the owner the Pages link(s) of what changed (the site updates a minute or two after the merge). Don't publish Claude artifacts and don't send HTML files: the owner reviews on a phone, where a downloaded HTML file shows a blank page. Screenshots are still welcome alongside the link.
- Previews for the owner's other apps (colour samplers, mockups, direction previews – what used to be Claude artifacts) go in `demo/samples/` with fictional data, and the link is what gets sent. The apps themselves (e.g. Bank Reconciliation) stay private and are never published here.
- New demos go in `demo/` (or `demo/examples/` for things built with the skill), get a card in `DEMOS` in `tools/build_site.py`, and must pass the checks below. Everything here is public: no company data, credentials or internal URLs in demos.

## Commands
- `python3 tools/check_css.py toolkit/s4.css` – house rules (0 problems required)
- `node tools/check_pages.mjs [pages…]` – no sideways scroll, Inter + digit features, theme, no page errors at 390/1280/1920 × light/dark (no args = demo + templates + site)
- `pip install markdown --break-system-packages -q && python3 tools/build_site.py` – rebuild `index.html` and `guide/*.html` after editing `DESIGN.md` or `COMPONENTS.md` (CI fails if they are stale)
- `python3 tools/refresh_examples.py` – swap the toolkit inside the single-file builds in `demo/examples/` for the current one (run after any toolkit change, then `check_pages` and look at them)
- `python3 tools/package_skill.py` – build `build/s4-glass.skill` (send it to the owner with the file tool; "Save skill" installs it)
- `node tools/build_icons.mjs <@iconify-json/solar>/icons.json` – rebuild `toolkit/icons.js` after adding names

## Rules
- `DESIGN.md` is the source of truth; `skill/SKILL.md` is the condensed version for Claude. Change both together, and the Bank Reconciliation app (arko-EMOVIS/bank-reconciliation-app) if a token or rule it uses changes.
- Decisions the owner made (DESIGN.md → "Decided with the owner") are not re-opened unless the owner asks.
- Work on a `claude/…` branch, open a PR, let CI go green, then merge when the owner says so.

## Recommendations
- Every recommendation to the owner (in chat and on a samples page) comes from the front-end design skill (`frontend-design`) when it is available in the session, and it must be obvious which it was. Every `demo/samples/` page that offers options has a "Recommended" tag on the option you suggest and a **Recommendation basis** box saying either "front-end design skill" (used) or "S4 Glass rules and the owner's decisions; the front-end design skill was not available in this session" (see the box in `demo/samples/density.html`). Recommendations stay inside the S4 Glass rules and "Decided with the owner".
- Check `ListSkills` at the start of a session. The owner asked for the skill to be used on 2026-10-27, but it was not in their account or the session then: say so, and ask them to add it, rather than claiming it was used.
