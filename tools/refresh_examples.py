#!/usr/bin/env python3
"""Refresh the single-file example builds in demo/examples/ with the current toolkit.

Each example inlines the toolkit as <style data-s4> / <script data-s4> blocks (fonts, stylesheet, helpers, icons). This swaps the
stylesheet and helper-script blocks for the current toolkit/s4.css and toolkit/s4.js, and leaves each page's own styles, script and
icon subset alone. Run it after the toolkit changes, then check the pages (node tools/check_pages.mjs) and look at them.

  python3 tools/refresh_examples.py"""
import json, pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
css = (root / "toolkit" / "s4.css").read_text(encoding="utf-8")
js = (root / "toolkit" / "s4.js").read_text(encoding="utf-8")
fonts = (root / "toolkit" / "fonts.css").read_text(encoding="utf-8")
icons = (root / "toolkit" / "icons.js").read_text(encoding="utf-8")
ICON_MAP = re.compile(r"const S4_ICONS = (\{.*\});")
all_icons = json.loads(ICON_MAP.search(icons).group(1))

def icon_subset(old):
    """The toolkit's icons.js, cut down to the names the page's old subset had (either the old line/duo layout or the flat one)."""
    m = ICON_MAP.search(old)
    prev = json.loads(m.group(1)) if m else {}
    names = set(prev.get("line", {})) | set(prev.get("duo", {})) if ("line" in prev or "duo" in prev) else set(prev)
    sub = {n: all_icons[n] for n in sorted(names) if n in all_icons}
    return ICON_MAP.sub(lambda _: "const S4_ICONS = " + json.dumps(sub, ensure_ascii=False) + ";", icons, count=1)

for page in sorted((root / "demo" / "examples").glob("*.html")):
    s = page.read_text(encoding="utf-8")
    blocks = list(re.finditer(r"<(style|script) data-s4>(.*?)</\1>", s, re.S))
    out, last, did = [], 0, []
    for m in blocks:
        body = m.group(2)
        new = None
        if m.group(1) == "script" and body.lstrip().startswith("/* S4 Glass 2.0 – small helpers"):
            new, name = js, "s4.js"
        elif m.group(1) == "style" and body.lstrip().startswith("@font-face"):
            new, name = fonts, "fonts.css"
        elif m.group(1) == "style" and body.lstrip().startswith("/* ====") and "S4 Glass" in body[:400]:
            new, name = css, "s4.css"
        elif m.group(1) == "script" and body.lstrip().startswith("/* S4 Glass icons"):
            new, name = icon_subset(body), "icons subset"
        if new is not None:
            out.append(s[last:m.start(2)]); out.append("\n" + new.strip("\n") + "\n"); last = m.end(2); did.append(name)
    out.append(s[last:])
    page.write_text("".join(out), encoding="utf-8")
    print(f"{page.name}: refreshed {', '.join(did) or 'nothing'}")
