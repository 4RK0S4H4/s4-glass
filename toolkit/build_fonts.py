#!/usr/bin/env python3
"""Build the S4 Glass Inter font CSS: Inter 400/500/600/700 as base64 woff2 @font-face rules.

Why: the Inter from Google Fonts and from @fontsource has the stylistic sets stripped,
so ss01 (open digits), cv09 (flat-top 3) and case (centred brackets) do nothing and numbers look different.
This builds a Latin subset (765 glyphs, all OpenType features kept)
from the official Inter release on npm.

Usage:  python3 build_fonts.py [OUT.css]        (default: fonts.css next to this script)
Needs:  node/npm, and `pip install fonttools brotli --break-system-packages`.
"""
import base64, pathlib, subprocess, sys, tempfile

out = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).with_name("fonts.css"))
UNI = ("U+0000,U+0020-007E,U+00A0-00AC,U+00AE-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
       "U+2000-200B,U+2010-2027,U+202F-2055,U+2057,U+205F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+FEFF")
WEIGHTS = {400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold"}

tmp = pathlib.Path(tempfile.mkdtemp())
subprocess.run(["npm", "i", "--silent", "inter-ui"], cwd=tmp, check=True)
rules = []
for w, name in WEIGHTS.items():
    src = tmp / "node_modules/inter-ui/web" / f"Inter-{name}.woff2"
    dst = tmp / f"inter-{w}.woff2"
    subprocess.run(["pyftsubset", str(src), f"--unicodes={UNI}", "--layout-features=*", "--flavor=woff2",
                    "--no-hinting", "--desubroutinize", f"--output-file={dst}"], check=True)
    b64 = base64.b64encode(dst.read_bytes()).decode()
    rules.append("@font-face{font-family:Inter;font-style:normal;font-weight:%d;font-display:block;"
                 "src:url(data:font/woff2;base64,%s) format(\"woff2\")}" % (w, b64))
out.write_text("\n".join(rules) + "\n", encoding="utf-8")

from fontTools.ttLib import TTFont  # verify the features really survived
f = TTFont(tmp / "inter-400.woff2")
tags = {fr.FeatureTag for fr in f["GSUB"].table.FeatureList.FeatureRecord}
missing = {"ss01", "cv09", "tnum", "case"} - tags
if missing:
    sys.exit(f"Built {out} but these features are missing: {sorted(missing)}. Do not ship it.")
print(f"Wrote {out} ({out.stat().st_size:,} bytes), {len(f.getGlyphOrder())} glyphs, ss01 + cv09 + tnum + case present")
