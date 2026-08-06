#!/usr/bin/env python3
"""Bundle the multi-page Friendspace source into one self-contained HTML file.

Artifacts are a single page with a strict CSP, so the four screens have to live
in one document with no external requests. This inlines the shared CSS/JS,
scopes each page's stylesheet to its own screen, and boots each page's script
lazily the first time you navigate to it.

Source of truth stays the multi-file version; this is a build artifact.
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).parent
PAGES = [
    ("signup",  "index.html",   "Sign Up"),
    ("feed",    "feed.html",    "Feed"),
    ("profile", "profile.html", "Profiles"),
    ("settings","settings.html","Settings"),
    ("privacy", "privacy.html", "Legal"),
    ("awards",  "awards.html",  "Awards"),
]

def read(p):
    return (ROOT / p).read_text()

def prefix_css(css, scope):
    """Prefix every top-level selector with `scope`, leaving at-rules alone."""
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)   # else comments land in selectors
    out, i, n = [], 0, len(css)
    while i < n:
        brace = css.find("{", i)
        if brace == -1:
            out.append(css[i:]); break
        sel = css[i:brace]
        stripped = sel.strip()
        if stripped.startswith("@"):
            # copy the whole at-rule block verbatim (keyframes, media, etc.)
            depth, j = 0, brace
            while j < n:
                if css[j] == "{": depth += 1
                elif css[j] == "}":
                    depth -= 1
                    if depth == 0: break
                j += 1
            out.append(css[i:j+1]); i = j + 1; continue
        # a normal rule: prefix each comma-separated selector
        parts = []
        for one in stripped.split(","):
            one = one.strip()
            if not one:
                continue
            if one in ("body", "html", "html,body"):
                parts.append(scope)
            else:
                parts.append(scope + " " + one)
        close = css.find("}", brace)
        body = css[brace:close+1] if close != -1 else css[brace:]
        out.append(("\n" + ", ".join(parts)) if parts else "")
        out.append(body)
        i = (close + 1) if close != -1 else n
    return "".join(out)

def split_page(html):
    """Return (page_style, body_markup_without_header_or_scripts, inline_script)."""
    style = "\n".join(re.findall(r"<style[^>]*>(.*?)</style>", html, re.S))
    body = re.search(r"<body[^>]*>(.*)</body>", html, re.S).group(1)
    scripts = re.findall(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", body, re.S)
    body = re.sub(r"<script.*?</script>", "", body, flags=re.S)
    # the bundle supplies one shared header; drop each page's own
    body = re.sub(r'<div class="fs-header">.*?</div></div>', "", body, flags=re.S, count=1)
    body = re.sub(r'<div class="fs-header">.*?\n</div>\n', "", body, flags=re.S, count=1)
    return style, body, "\n".join(scripts)

def main():
    shared_css = read("assets/friendspace.css")
    trophies   = read("assets/trophies.js")
    people     = read("assets/people.js")
    notes      = read("assets/notes.js")
    gravity    = read("assets/gravity.js")
    ambient    = read("assets/ambient.js")

    styles, bodies, scripts, ids = [], [], {}, {}
    for key, fname, _label in PAGES:
        st, body, js = split_page(read(fname))
        scope = "#screen-" + key
        styles.append("/* ===== %s ===== */\n%s" % (fname, prefix_css(st, scope)))
        bodies.append('<div class="screen" id="screen-%s">%s</div>' % (key, body))
        scripts[key] = js
        for i in re.findall(r'id="([^"]+)"', body):
            ids.setdefault(i, []).append(key)

    dupes = {k: v for k, v in ids.items() if len(v) > 1}
    if dupes:
        print("!! duplicate ids across screens:", dupes, file=sys.stderr)
        return 1

    boot = "\n".join(
        "  boots.%s = function(){\n%s\n  };" % (k, scripts[k]) for k, _, _ in PAGES
    )
    nav = "".join(
        '<a href="#%s" data-nav="%s">%s</a>' % (k, k, label) for k, _, label in PAGES
    )
    # the feed binds to these; they live in the header, which we replace
    nav += ('<a href="#feed" id="bell">Notifications'
            '<span class="fs-badge-count" id="notif">47</span></a>')

    html = f"""<meta charset="utf-8">
<title>Untitled Document</title>
<style>
{shared_css}
</style>
<style>
.screen{{display:none}}
.screen.on{{display:block}}
{chr(10).join(styles)}
</style>
<script>
{trophies}
</script>
<script>
{people}
</script>
<script>
{notes}
</script>
<script>
{gravity}
</script>
<script>
{ambient}
</script>

<div class="fs-header"><div class="fs-header-in">
  <div class="fs-logo">Friendspace<span>BETA</span></div>
  <input class="fs-search" id="search" placeholder="Search Friendspace" autocomplete="off">
  <div class="fs-nav">{nav}</div>
</div></div>

{chr(10).join(bodies)}

<script>
(function(){{
  var boots = {{}}, booted = {{}};
{boot}

  function go(name){{
    if (!boots[name]) name = "signup";
    [].forEach.call(document.querySelectorAll(".screen"), function(el){{
      el.classList.toggle("on", el.id === "screen-" + name);
    }});
    [].forEach.call(document.querySelectorAll("[data-nav]"), function(a){{
      a.style.background = (a.dataset.nav === name) ? "#4a6bb0" : "";
    }});
    if (!booted[name]){{
      booted[name] = 1;
      try {{ boots[name](); }} catch (e) {{ console.error("boot " + name, e); }}
    }}
    window.scrollTo(0, 0);
  }}

  window.addEventListener("hashchange", function(){{ go(location.hash.slice(1).split("/")[0]); }});
  go((location.hash || "#signup").slice(1).split("/")[0]);
}})();
</script>
"""
    out = ROOT / "friendspace.html"
    out.write_text(html)
    print("wrote %s (%.0f KB)" % (out.name, len(html)/1024))
    return 0

if __name__ == "__main__":
    sys.exit(main())
