#!/usr/bin/env python3
"""S4 Glass rule check for a stylesheet: the house rules that a reviewer would otherwise have to catch by eye.

Usage:  python3 check_css.py s4.css [app.css …]      exit code 1 if anything is flagged

Checks
  dark-blocks   the prefers-color-scheme dark block and the [data-theme="dark"] block hold the same tokens (s4.css only:
                files that have both blocks)
  dark-rules    no component rule written as [data-theme="dark"] .x, and no component rule inside a dark block
  colours       no hex / rgb() colour literals outside token declarations (custom properties). #fff / #000 / white text on
                accent fills are allowed, as are colours inside url() data URIs
  font-size     every font-size uses a --fs-* token (or inherit / em / the 16px phone-field rule)
  important     !important only on [hidden] and in the reduced-motion block
"""
import re, sys

ALLOWED_HEX = {"#fff", "#ffffff", "#000", "#000000"}

def strip_comments(s):
    return re.sub(r"/\*.*?\*/", "", s, flags=re.S)

def blocks(css):
    """Yield (selector, body, depth-path) for every rule, descending into @media / @supports."""
    out, i, stack = [], 0, []
    sel_start = 0
    while i < len(css):
        c = css[i]
        if c == "{":
            sel = css[sel_start:i].strip()
            stack.append((sel, i + 1))
            sel_start = i + 1
        elif c == "}":
            if stack:
                sel, start = stack.pop()
                body = css[start:i]
                if not sel.startswith("@"):
                    out.append((sel, body, tuple(s for s, _ in stack)))
            sel_start = i + 1
        elif c == ";" and not stack:
            sel_start = i + 1
        i += 1
    return out

def decls(body):
    # split declarations, ignoring ; inside url(...) and quotes
    parts, depth, cur, q = [], 0, "", None
    for ch in body:
        if q:
            cur += ch
            if ch == q: q = None
            continue
        if ch in "\"'": q = ch; cur += ch; continue
        if ch == "(": depth += 1
        if ch == ")": depth -= 1
        if ch == ";" and depth == 0: parts.append(cur); cur = ""; continue
        cur += ch
    if cur.strip(): parts.append(cur)
    res = []
    for p in parts:
        if ":" in p and "{" not in p:
            k, v = p.split(":", 1); res.append((k.strip(), v.strip()))
    return res

def check(path):
    raw = open(path, encoding="utf-8").read()
    css = strip_comments(raw)
    rules = blocks(css)
    problems = []
    def flag(kind, sel, msg): problems.append(f"{path}: [{kind}] {sel[:70]} – {msg}")

    # dark blocks identical
    media_dark = [b for s, b, ctx in rules if s.startswith(":root:not([data-theme=\"light\"])") and any("prefers-color-scheme: dark" in c for c in ctx) and not any("@supports" in c for c in ctx)]
    attr_dark = [b for s, b, ctx in rules if s == ":root[data-theme=\"dark\"]" and not any("@supports" in c for c in ctx)]
    if media_dark and attr_dark:
        a = dict(decls(media_dark[0])); b = dict(decls(attr_dark[-1] if len(attr_dark) == 1 else attr_dark[0]))
        for k in sorted(set(a) | set(b)):
            if a.get(k) != b.get(k):
                flag("dark-blocks", k, f"media block: {a.get(k)!r} vs data-theme block: {b.get(k)!r}")

    for sel, body, ctx in rules:
        is_token_block = sel.startswith(":root") and all(k.startswith("--") or k == "color-scheme" for k, _ in decls(body))
        if re.search(r"\[data-theme=\"?dark\"?\]\s*[^\s,{]", sel) and not sel.strip().startswith(":root[data-theme=\"dark\"]"):
            flag("dark-rules", sel, "write a token for both dark blocks instead of a dark-only component rule")
        if re.search(r"\[data-theme=\"?dark\"?\]\s+\S", sel):
            flag("dark-rules", sel, "write a token for both dark blocks instead of a dark-only component rule")
        in_dark = any("prefers-color-scheme: dark" in c for c in ctx) or sel.startswith(":root[data-theme=\"dark\"]")
        if in_dark and not is_token_block:
            flag("dark-rules", sel, "component rule inside a dark block")
        for k, v in decls(body):
            if k.startswith("--"):
                continue
            vv = re.sub(r"url\([^)]*\)", "", v)
            for h in re.findall(r"#[0-9a-fA-F]{3,8}\b", vv):
                if h.lower() not in ALLOWED_HEX:
                    flag("colours", sel, f"{k}: {h} – use a token")
            if re.search(r"\brgba?\(", vv) and not re.search(r"rgba?\((255,\s*255,\s*255|0,\s*0,\s*0)", vv):
                flag("colours", sel, f"{k}: {v[:60]} – use a token")
            if k in ("font-size",) or (k == "font" and re.search(r"\d+px", vv)):
                if not (re.search(r"var\(--fs-", vv) or vv in ("inherit", "16px") or re.fullmatch(r"[\d.]+em", vv)):
                    flag("font-size", sel, f"{k}: {v} – use a --fs-* token")
            if "!important" in v and sel != "[hidden]" and not any("prefers-reduced-motion" in c for c in ctx):
                flag("important", sel, f"{k}: {v}")
    return problems

if __name__ == "__main__":
    files = sys.argv[1:] or ["toolkit/s4.css"]
    allp = [p for f in files for p in check(f)]
    for p in allp: print(p)
    print(f"{len(allp)} problem(s) in {len(files)} file(s)")
    sys.exit(1 if allp else 0)
