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
- **Improvements flow back.** When an app (e.g. Bank Rec) improves a shared control or pattern, the improvement goes into S4 Glass (toolkit, React kit, gallery, docs) in the same batch, so apps and the language never drift apart. Controls use an S4 Glass version, not the browser default (date pickers, dropdowns, suggestions, radios, tooltips); file pickers and the dropdown on touch screens stay native on purpose.
- Work on a `claude/…` branch, open a PR and let CI go green, then **merge it yourself** (squash) and send the owner the Pages link(s). Standing permission from the owner, so don't wait to be asked. Don't merge while CI is red or a review comment is open, and still ask first when a change is large or goes against "Decided with the owner".

## Recommendations
- Every recommendation to the owner (in chat and on a samples page) comes from the front-end design skill (`frontend-design`) when it is available in the session, and it must be obvious which it was. Every `demo/samples/` page that offers options has a "Recommended" tag on the option you suggest and a **Recommendation basis** box saying what the recommendation rests on: the front-end design skill (used), or "my own design judgement" plus the reasons (users' task, scan paths, discoverability, phone fallback) when the skill was not available in the session. **A recommendation is a design judgement, not a restatement of the S4 Glass rules:** the point of this project is to shape a very good design language with your design experience, so recommend what is best and say why. The rules and "Decided with the owner" are constraints on what you can build, not the reason for a pick. **Options must be genuinely different approaches**, not variants the owner can't tell apart on screen (the owner could not see the difference between two earlier table options).
- At the start of a session, check the session's skill list (or `ListSkills`) for `frontend-design:frontend-design`. It was available as of 2026-10-27, so use it. If it is ever missing, say so, use the fallback wording in the "Recommendation basis" box and ask the owner to add the skill; never claim it was used when it wasn't.
- Earlier `demo/samples/` pages may carry the fallback basis from before the skill was available. When revisiting one, re-check its recommendation with the skill and update the box; the owner's picks stay unless they ask otherwise.

## Skills to use (owner agreed 2026-10-29)
The goal is one design language that every app and web page reuses, with the same look and behaviour. Each skill has one job:
- **Front-end design (`frontend-design`): design decisions.** Every option and recommendation, per "Recommendations" above. It is built to give each project its own identity, so use it to shape S4 Glass itself, never to restyle an app away from S4 Glass.
- **Design plugin (`design:*`, by Anthropic): keeping the system consistent.**
  - `design:design-system` – audit tokens and components for naming drift and hard-coded values, and document a new pattern before it goes into `DESIGN.md` / `COMPONENTS.md`.
  - `design:accessibility-review` – area 11 in `PLAN.md`, and a pass on each new samples page before it goes to the owner.
  - `design:ux-copy` – labels, errors, empty states and confirmations. It follows the house rules (Title Case labels, "Decided with the owner"), not its own defaults.
  - `design:design-critique` – a second opinion on a samples page before the link is sent.
- **Skill Creator (`skill-creator`): making the `s4-glass` skill reusable.** Restructure `skill/SKILL.md` (short rules up front, detail in `skill/references/`), tune its description so it triggers for S4 Glass and not S4 Material / S4 Orion, and keep evals in `skill/evals/` covering several app types (dashboard, list and detail, multi-step form, landing page, phone-first tracker). Run them after any change to the skill, before packaging.
- **ui-consistency (community plugin, optional): for the apps, not this repo.** It makes new pages match an app's existing ones. Here `DESIGN.md` is the source of truth, not a count of what existing pages do, so don't let it override the spec. It runs a hook at every session start; try it on one app before relying on it.
- **Also:** `dataviz` only when charts are involved; `code-review` and `simplify` on `toolkit/` before a skill release; `s4-app-studio` to build a test app with the skill and find gaps.
