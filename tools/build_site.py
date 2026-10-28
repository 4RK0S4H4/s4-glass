#!/usr/bin/env python3
"""Build the GitHub Pages site: the design-language guide and the demo index, in S4 Glass itself.

Writes (all committed, so Pages can serve the repo straight from `main`, root folder):
  index.html              home: what S4 Glass is, the demos, the guide's sections, how to start
  guide/design.html       DESIGN.md as a page with a table of contents
  guide/components.html   COMPONENTS.md as a page with a table of contents
The pages link toolkit/ files instead of inlining them, so the site stays small and always uses the current toolkit.

Usage: pip install markdown --break-system-packages -q && python3 tools/build_site.py
Re-run after changing DESIGN.md, COMPONENTS.md or the demo list below.
"""
import html, pathlib, re
import markdown

root = pathlib.Path(__file__).resolve().parent.parent

DEMOS = [  # (title, path, what it shows, duotone icon)
    ("Component Gallery", "demo/components.html", "Every component on one page, with accent, theme and neutrals switches.", "widget-5"),
    ("App Template", "templates/app.html", "An app shell: side nav on desktop, icon rail on tablets, tab bar on phones.", "monitor"),
    ("Web Page Template", "templates/page.html", "A web page: sticky header, hero, sections, call to action, footer.", "global"),
    ("Habit Tracker", "demo/examples/habits.html", "A phone-first app built by a fresh Claude session from the skill alone.", "smartphone"),
    ("Icon Samples (draft)", "demo/samples/icons.html", "Solar Bold Duotone next to Phosphor Duotone in the rail, buttons, chips and table rows.", "stars"),
    ("Wide-Screen Layouts (draft)", "demo/samples/wide-screen.html", "Three ways to use a 1080p and a 1440p monitor: fill, cap and centre, or cap and widen the detail panel.", "monitor"),
    ("Table Samples (draft)", "demo/samples/tables.html", "A 240-row table with search, filters, bulk select, sticky columns and three ways to page and show the selection.", "checklist-minimalistic"),
    ("Orders Restyle", "demo/examples/orders.html", "A plain HTML table restyled by a fresh Claude session using the skill.", "checklist-minimalistic"),
]

HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="S4 Glass: a frosted-glass design language for apps and web pages, light and dark, phone to desktop.">
<script data-s4 src="{up}toolkit/s4.js"></script>
<link data-s4 rel="stylesheet" href="{up}toolkit/fonts.css">
<link data-s4 rel="stylesheet" href="{up}toolkit/s4.css">
<style>
  :root {{ --accent: #4f46e5; --accent-2: #6d28d9; --accent-light: #a5b4fc; }}
  .guide {{ display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: var(--s-10); align-items: start; padding-block: var(--s-10) var(--s-16); }}
  .toc {{ position: sticky; top: 76px; max-height: calc(100dvh - 96px); overflow: auto; display: flex; flex-direction: column; gap: 2px; font-size: var(--fs-ui); }}
  .toc b {{ padding: 0 10px 6px; font-size: var(--fs-xs); color: var(--text3); }}
  .toc a {{ padding: 6px 10px; border-radius: var(--r-sm); color: var(--text2); text-decoration: none; }}
  .toc a:hover {{ background: var(--hov); color: var(--text); }}
  .doc {{ min-width: 0; max-width: 900px; }}
  .doc > h1 {{ margin: 0 0 var(--s-3); font-size: var(--fs-page-h2); letter-spacing: -.02em; line-height: 1.15; }}
  .doc h2 {{ margin: var(--s-12) 0 var(--s-3); padding-top: var(--s-6); border-top: 1px solid var(--border); font-size: var(--fs-page-h3); scroll-margin-top: 76px; }}
  .doc h3 {{ margin: var(--s-6) 0 var(--s-2); font-size: var(--fs-title); scroll-margin-top: 76px; }}
  .doc p, .doc li {{ line-height: var(--lh-prose); max-width: var(--prose-max); }}
  .doc ul, .doc ol {{ padding-left: 1.3em; }} .doc li + li {{ margin-top: .3em; }}
  .doc :not(pre) > code {{ padding: 1px 5px; border-radius: var(--r-xs); background: var(--well); border: 1px solid var(--border); font-size: .92em; }}
  .doc pre {{ margin: var(--s-3) 0; padding: var(--s-3) var(--s-4); overflow: auto; border-radius: var(--r); background: var(--glass); border: 1px solid var(--border); font-size: var(--fs-ui); line-height: 1.55; }}
  .doc .table-wrap {{ margin: var(--s-3) 0; border: 1px solid var(--border); border-radius: var(--r); background: var(--glass); }}
  .doc table.t th {{ position: static; }} .doc table.t td {{ white-space: normal; }}
  .doc a {{ color: var(--accent-text); }}
  .doc td code {{ font-size: inherit; }}
  @media (pointer: coarse) {{ .toc a {{ display: flex; align-items: center; min-height: var(--tap); }} }}
  .swatches {{ display: flex; flex-wrap: wrap; gap: var(--s-2); }}
  .swatches button {{ width: 40px; height: 40px; border-radius: 50%; border: 3px solid var(--bg); background: var(--c); box-shadow: 0 0 0 1px var(--border2); cursor: pointer; }}
  .swatches button[aria-pressed="true"] {{ box-shadow: 0 0 0 2px var(--text); }}
  .demo-card {{ display: flex; flex-direction: column; gap: var(--s-2); height: 100%; color: inherit; text-decoration: none; }}
  .demo-card:hover {{ color: inherit; }}
  .demo-card .ic.lg {{ color: var(--accent-text); }}
  .demo-card p {{ margin: 0; color: var(--text2); }}
  .demo-card .go {{ margin-top: auto; display: inline-flex; align-items: center; gap: 6px; font-weight: 600; color: var(--accent-text); }}
  .steps-list code {{ padding: 1px 5px; border-radius: var(--r-xs); background: var(--well); border: 1px solid var(--border); font-size: .92em; }}
  .steps-list {{ counter-reset: n; display: grid; gap: var(--s-3); padding: 0; list-style: none; }}
  .steps-list li {{ counter-increment: n; display: grid; grid-template-columns: 32px minmax(0, 1fr); gap: var(--s-3); align-items: start; }}
  .steps-list li::before {{ content: counter(n); display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: var(--accent-soft); color: var(--accent-ink); font-weight: 700; font-size: var(--fs-ui); }}
  @media (max-width: 980px) {{ .guide {{ grid-template-columns: minmax(0, 1fr); gap: var(--s-6); padding-block: var(--s-6) var(--s-12); }} .toc {{ position: static; max-height: none; flex-direction: row; flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin-inline: calc(-1 * var(--s-4)); padding-inline: var(--s-4); }} .toc b {{ display: none; }} .toc a {{ flex: none; white-space: nowrap; background: var(--bg-hover); }} }}
</style>
<script data-s4 src="{up}toolkit/icons.js"></script>
</head>
<body class="site">
<header class="site-head">
  <div class="container">
    <a class="brand" href="{up}index.html"><svg data-ic-duo="stars"></svg>S4 Glass</a>
    <nav class="site-nav" aria-label="Main">
      <a href="{up}index.html"{cur_home}>Overview</a>
      <a href="{up}guide/design.html"{cur_design}>Design Language</a>
      <a href="{up}guide/components.html"{cur_comp}>Components</a>
      <a href="{up}demo/components.html">Gallery</a>
    </nav>
    <div class="site-acts">
      <button class="btn icon subtle" type="button" data-theme-toggle aria-label="Switch Light or Dark"><svg data-ic="moon"></svg></button>
      <button class="btn icon menu-btn" type="button" aria-label="Menu" aria-expanded="false"><svg data-ic="hamburger-menu"></svg></button>
    </div>
  </div>
</header>
"""
FOOT = """<footer class="site-foot">
  <div class="container"><span>S4 Glass 2.0 · <a href="https://github.com/4RK0S4H4/s4-glass">Source on GitHub</a></span><span>Inter (SIL OFL) · Solar icons (CC BY 4.0, 480 Design)</span></div>
</footer>
</body>
</html>
"""

def head(title, up, cur):
    c = {k: (' aria-current="page"' if k == cur else "") for k in ("home", "design", "comp")}
    return HEAD.format(title=title, up=up, cur_home=c["home"], cur_design=c["design"], cur_comp=c["comp"])

def render_doc(md_path, out_path, title, cur):
    md = markdown.Markdown(extensions=["tables", "fenced_code", "toc"], extension_configs={"toc": {"toc_depth": "2"}})
    text = md_path.read_text(encoding="utf-8")
    text = re.sub(r"^Contents:.*$", "", text, count=1, flags=re.M)   # the page has its own table of contents
    body = md.convert(text)
    body = re.sub(r"<table>", '<div class="table-wrap"><table class="t compact">', body).replace("</table>", "</table></div>")
    toc = "".join(f'<a href="#{t["id"]}">{html.escape(t["name"])}</a>' for t in md.toc_tokens[0].get("children", [])) if md.toc_tokens else ""
    page = head(title, "../", cur) + f"""<main class="container guide">
  <nav class="toc" aria-label="On this page"><b>On This Page</b>{toc}</nav>
  <article class="doc">{body}</article>
</main>
""" + FOOT
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(page, encoding="utf-8")

def build_index():
    design = markdown.Markdown(extensions=["toc"], extension_configs={"toc": {"toc_depth": "2"}})
    design.convert((root / "DESIGN.md").read_text(encoding="utf-8"))
    sections = design.toc_tokens[0].get("children", [])
    demos = "".join(f"""
        <a class="card lift demo-card" href="{p}"><svg class="ic lg" data-ic-duo="{ic}"></svg><span class="title">{html.escape(t)}</span><p>{html.escape(d)}</p><span class="go">Open<svg class="ic sm" data-ic="arrow-right"></svg></span></a>""" for t, p, d, ic in DEMOS)
    secs = "".join(f'<a class="li" href="guide/design.html#{s["id"]}"><span class="li-main"><b>{html.escape(s["name"])}</b></span><svg class="ic sm" data-ic="alt-arrow-right"></svg></a>' for s in sections)
    page = head("S4 Glass – Design Language", "", "home") + f"""<main>
  <section class="hero">
    <div class="container">
      <h1>One look for every app you build.</h1>
      <p class="lead">S4 Glass is a frosted-glass design language for apps, tools and web pages: light and dark, phone to 2560 wide, every colour from one accent. Pick one and this page follows.</p>
      <div class="swatches" role="group" aria-label="Try an accent">
        <button type="button" style="--c:#4f46e5" data-a="#4f46e5,#6d28d9,#a5b4fc" aria-pressed="true" aria-label="Indigo"></button>
        <button type="button" style="--c:#047857" data-a="#047857,#0f766e,#6ee7b7" aria-pressed="false" aria-label="Emerald"></button>
        <button type="button" style="--c:#1d64d8" data-a="#1d64d8,#3b3fc4,#93c5fd" aria-pressed="false" aria-label="Blue"></button>
        <button type="button" style="--c:#c2410c" data-a="#c2410c,#be123c,#fdba74" aria-pressed="false" aria-label="Orange"></button>
        <button type="button" style="--c:#ce0057" data-a="#ce0057,#8a0069,#ff5c9d" aria-pressed="false" aria-label="Emovis Pink"></button>
        <button type="button" style="--c:#334155" data-a="#334155,#1e293b,#cbd5e1" aria-pressed="false" aria-label="Slate"></button>
      </div>
      <div class="cluster mt-8" style="--gap: var(--s-3)"><a class="btn primary lg" href="guide/design.html">Read the Design Language</a><a class="btn lg" href="demo/components.html">Open the Gallery</a></div>
    </div>
  </section>

  <section class="section" id="demos">
    <div class="container">
      <div class="section-head"><h2>Demos</h2><p>Open them on your phone and on a computer; switch light and dark with the moon button.</p></div>
      <div class="grid-auto" style="--min: 260px">{demos}
      </div>
    </div>
  </section>

  <section class="section" id="guide">
    <div class="container grid-auto" style="--min: 320px; --gap: var(--s-10)">
      <div class="stack" style="--gap: var(--s-3)">
        <h2 class="page-h2">The guide</h2>
        <p class="lead m-0">The rules, the tokens and the decisions behind them, including everything settled with the owner on the Bank Reconciliation app.</p>
        <div class="cluster"><a class="btn" href="guide/design.html">Design Language</a><a class="btn" href="guide/components.html">Component Markup</a></div>
      </div>
      <div class="card flush"><div class="list">{secs}</div></div>
    </div>
  </section>

  <section class="section" id="start">
    <div class="container grid-auto" style="--min: 320px; --gap: var(--s-10)">
      <div class="stack" style="--gap: var(--s-3)"><h2 class="page-h2">Start a new app</h2><p class="lead m-0">Plain CSS and a little JavaScript. No build step, no dependencies.</p></div>
      <ol class="steps-list">
        <li><span>Copy <code>toolkit/</code> next to your page (or start from a template).</span></li>
        <li><span>Load <code>s4.js</code> first, then <code>fonts.css</code> and <code>s4.css</code>.</span></li>
        <li><span>Set three values: <code>--accent</code>, <code>--accent-2</code>, <code>--accent-light</code>.</span></li>
        <li><span>Build from the components; check with <code>tools/check_css.py</code> and screenshots at 390, 1280 and 1920.</span></li>
      </ol>
    </div>
  </section>
</main>
<script>
  document.querySelector(".swatches").addEventListener("click", function (e) {{
    var b = e.target.closest("button"); if (!b) return; var v = b.dataset.a.split(","), r = document.documentElement.style;
    r.setProperty("--accent", v[0]); r.setProperty("--accent-2", v[1]); r.setProperty("--accent-light", v[2]);
    this.querySelectorAll("button").forEach(function (x) {{ x.setAttribute("aria-pressed", x === b); }});
  }});
</script>
""" + FOOT
    (root / "index.html").write_text(page, encoding="utf-8")

render_doc(root / "DESIGN.md", root / "guide/design.html", "Design Language – S4 Glass", "design")
render_doc(root / "COMPONENTS.md", root / "guide/components.html", "Components – S4 Glass", "comp")
build_index()
(root / ".nojekyll").write_text("")   # serve files as they are (no Jekyll processing)
print("Built index.html, guide/design.html, guide/components.html")
