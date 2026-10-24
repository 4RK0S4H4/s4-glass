# S4 Glass

A frosted-glass design language for apps, tools and web pages: light and dark, phone to 2560px desktop, every colour from one accent trio, Inter with open digits, Solar icons. Plain CSS and a little JavaScript; no build step, no dependencies.

**Guide and demos: https://4rk0s4h4.github.io/s4-glass/** (GitHub Pages from `main`, root folder; rebuilt with `python3 tools/build_site.py`).

- **[DESIGN.md](DESIGN.md)** – the spec: principles, colour, type, layout, responsive rules, writing, accessibility, checklist.
- **[COMPONENTS.md](COMPONENTS.md)** – copy-paste markup for every component.
- **`demo/components.html`** – every component on one page, with accent, theme and neutrals switches.
- **`templates/app.html`** – an app shell (side nav on desktop, rail on tablets, tab bar on phones).
- **`templates/page.html`** – a web page (sticky header, hero, sections, footer).
- **`skill/`** – the Claude skill that applies S4 Glass (`python3 tools/package_skill.py` builds `s4-glass.skill`).

## Start a new app or page

1. Copy `toolkit/` next to your page.
2. In `<head>`: `s4.js` first (it sets the theme before the first paint), then `fonts.css` and `s4.css`.
3. Set the three accent values – the only colour decision an app makes:
   ```css
   :root { --accent: #047857; --accent-2: #0f766e; --accent-light: #6ee7b7; }
   ```
4. Build from the components; add app styles after `s4.css`, made from tokens only.
5. Check it: `python3 tools/check_css.py your.css` (house rules) and screenshot at 390, 1280 and 1920 in both themes.
6. One self-contained file: `python3 toolkit/inline.py page.html out.html` inlines everything tagged `data-s4`.

## Toolkit

| File | What it is |
|---|---|
| `toolkit/s4.css` | tokens + all components (light, dark, phone, web page) |
| `toolkit/s4.js` | `s4Theme`, `s4Slider`, `s4Copy`, `s4Tips`, `s4Menu`, `s4Dialog`, `s4Toast` + plain-HTML wiring (`data-copy`, `data-menu`, `data-open`, `data-close`, `data-theme-toggle`) |
| `toolkit/fonts.css` | Inter 400/500/600/700 as base64 woff2 with `ss01`, `cv09`, `tnum`, `case` kept (rebuild: `python3 toolkit/build_fonts.py toolkit/fonts.css`) |
| `toolkit/icons.js` | a curated Solar subset, Linear + Bold Duotone (rebuild: `node tools/build_icons.mjs`) |
| `toolkit/sampler.html` | the colour sampler bar for letting someone pick an accent on a real screen |
| `toolkit/inline.py` | makes a single-file page |
| `tools/check_css.py` | the house-rule check (dark blocks in sync, no colour or font-size literals, no stray `!important`) |
| `tools/check_pages.mjs` | loads pages (default: demo, templates and the site) at phone and desktop sizes in both themes: no sideways scroll, fonts loaded, no page errors |
| `tools/build_site.py` | builds the GitHub Pages site (`index.html`, `guide/`) from DESIGN.md and COMPONENTS.md |

## Licences

Inter: SIL Open Font License 1.1. Solar icons: CC BY 4.0, 480 Design. S4 Glass CSS/JS: © the repository owner.
