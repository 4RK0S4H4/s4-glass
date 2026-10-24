#!/usr/bin/env python3
"""Make a single-file S4 Glass page: inline every stylesheet and script tagged data-s4.

  <link data-s4 rel="stylesheet" href="toolkit/fonts.css">   ->  <style data-s4>…</style>
  <link data-s4 rel="stylesheet" href="toolkit/s4.css">      ->  <style data-s4>…</style>
  <script data-s4 src="toolkit/s4.js"></script>              ->  <script data-s4>…</script>

Paths are relative to the page. The source page keeps working as-is in a browser (links), and the output is one
self-contained file for an artifact, an email attachment or GitHub Pages.

Usage:  python3 inline.py PAGE.html [OUT.html]          (in place without OUT)
Older form, still supported: python3 inline.py PAGE.html s4.css fonts.css [OUT.html] fills an empty <style data-s4></style>.
Don't also link Inter from Google Fonts: it can override the embedded faces with a build that lacks ss01/cv09."""
import pathlib, re, sys

args = sys.argv[1:]
if not args:
    sys.exit(__doc__)
page_p = pathlib.Path(args[0])
page = page_p.read_text(encoding="utf-8")

if len(args) >= 3 and args[1].endswith(".css") and args[2].endswith(".css"):   # older form
    css_p, fonts_p = pathlib.Path(args[1]), pathlib.Path(args[2])
    out = pathlib.Path(args[3]) if len(args) > 3 else page_p
    pat = re.compile(r"<style data-s4>.*?</style>", re.S)
    if not pat.search(page):
        sys.exit("No <style data-s4></style> tag found. Add one where the stylesheet should go.")
    block = "<style data-s4>\n" + fonts_p.read_text(encoding="utf-8").strip() + "\n" + css_p.read_text(encoding="utf-8").strip() + "\n</style>"
    out.write_text(pat.sub(lambda _: block, page, count=1), encoding="utf-8")
    print(f"Inlined {css_p.name} + {fonts_p.name} into {out}")
    sys.exit()

out = pathlib.Path(args[1]) if len(args) > 1 else page_p
base = page_p.parent
n = 0

def read(href):
    p = (base / href).resolve()
    if not p.exists():
        sys.exit(f"{href} not found (looked for {p})")
    return p.read_text(encoding="utf-8").strip()

def css(m):
    global n; n += 1
    href = re.search(r'href="([^"]+)"', m.group(0)).group(1)
    return "<style data-s4>\n" + read(href) + "\n</style>"

def js(m):
    global n; n += 1
    return "<script data-s4>\n" + read(m.group(1)).replace("</script", "<\\/script") + "\n</script>"

page = re.sub(r"<link\b[^>]*\bdata-s4\b[^>]*>", css, page)
page = re.sub(r'<script\b[^>]*\bdata-s4\b[^>]*\bsrc="([^"]+)"[^>]*>\s*</script>', js, page)
out.write_text(page, encoding="utf-8")
print(f"Inlined {n} file(s) into {out} ({out.stat().st_size:,} bytes)")
