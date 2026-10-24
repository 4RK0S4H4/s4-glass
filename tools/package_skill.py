#!/usr/bin/env python3
"""Assemble the s4-glass Claude skill from this repo and zip it as s4-glass.skill.

The repo is the source of truth: DESIGN.md and COMPONENTS.md become the skill's references, toolkit/ + the two
checkers become its toolkit, templates/ and demo/ are copied as they are.

Usage:  python3 tools/package_skill.py [OUT_DIR]      (default: build/) -> build/s4-glass/ and build/s4-glass.skill
"""
import pathlib, shutil, sys, zipfile

root = pathlib.Path(__file__).resolve().parent.parent
out = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else root / "build"
dst = out / "s4-glass"
if dst.exists():
    shutil.rmtree(dst)
(dst / "references").mkdir(parents=True)

shutil.copy(root / "skill/SKILL.md", dst / "SKILL.md")
shutil.copy(root / "DESIGN.md", dst / "references/design-language.md")
shutil.copy(root / "COMPONENTS.md", dst / "references/components.md")
for f in (root / "skill/references").glob("*.md"):
    shutil.copy(f, dst / "references" / f.name)
shutil.copytree(root / "skill/evals", dst / "evals")
shutil.copytree(root / "toolkit", dst / "toolkit")
for t in ("check_css.py", "check_pages.mjs", "build_icons.mjs"):
    shutil.copy(root / "tools" / t, dst / "toolkit" / t)
# inside the skill, the repo's file names become the skill's
for f in list((dst / "references").glob("*.md")) + [dst / "toolkit/check_pages.mjs", dst / "toolkit/build_icons.mjs"]:
    t = f.read_text(encoding="utf-8")
    for a, b in (("DESIGN.md", "design-language.md"), ("COMPONENTS.md", "components.md"), ("tools/check_css.py", "toolkit/check_css.py"),
                 ("tools/check_pages.mjs", "toolkit/check_pages.mjs"), ("tools/build_icons.mjs", "toolkit/build_icons.mjs"),
                 ("`check_css.py` (in `tools/` in the repo, `toolkit/` in the skill)", "`toolkit/check_css.py`"), ("'../toolkit/icons.js'", "'icons.js'")):
        t = t.replace(a, b)
    f.write_text(t, encoding="utf-8")
shutil.copytree(root / "templates", dst / "templates")
shutil.copytree(root / "demo", dst / "demo")

skill = out / "s4-glass.skill"
with zipfile.ZipFile(skill, "w", zipfile.ZIP_DEFLATED) as z:
    for p in sorted(dst.rglob("*")):
        if p.is_file() and "__pycache__" not in p.parts:
            z.write(p, p.relative_to(out))
print(f"Built {dst} and {skill} ({skill.stat().st_size:,} bytes)")
