#!/usr/bin/env python3
"""Sklada A-haut.html + fotos/ w jeden samodzielny plik HTML (data: URI)."""
import base64, pathlib, re, sys

root = pathlib.Path(__file__).parent
html = (root / "A-haut.html").read_text(encoding="utf-8")

def datauri(rel, mime):
    b = (root / rel).read_bytes()
    return f"data:{mime};base64," + base64.b64encode(b).decode()

# 1. obrazy
for m in sorted(set(re.findall(r'src="(fotos/[^"]+\.webp)"', html))):
    html = html.replace(f'src="{m}"', 'src="' + datauri(m, "image/webp") + '"')

# 2. poster
html = html.replace('poster="fotos/hero.jpg"', 'poster="' + datauri("fotos/hero.jpg", "image/jpeg") + '"')

# 3. wideo - oba formaty, zeby zadzialalo w kazdej przegladarce
vids = {
    "D_WEBM": datauri("fotos/hero-16x9.webm", "video/webm"),
    "D_MP4":  datauri("fotos/hero-16x9.mp4",  "video/mp4"),
    "M_WEBM": datauri("fotos/hero-9x16.webm", "video/webm"),
    "M_MP4":  datauri("fotos/hero-9x16.mp4",  "video/mp4"),
}
html = html.replace('data-src-desktop="fotos/hero-16x9"',
                    'data-webm-desktop="%s" data-mp4-desktop="%s"' % (vids["D_WEBM"], vids["D_MP4"]))
html = html.replace('data-src-mobile="fotos/hero-9x16"',
                    'data-webm-mobile="%s" data-mp4-mobile="%s"' % (vids["M_WEBM"], vids["M_MP4"]))
html = html.replace('var base = wide ? v.dataset.srcDesktop : v.dataset.srcMobile;',
                    'var key = wide ? "Desktop" : "Mobile";\n    var base = v.dataset["webm" + key];')
html = html.replace('''    [["webm","video/webm"], ["mp4","video/mp4"]].forEach(function(f){
      var s = document.createElement("source");
      s.src = base + "." + f[0];
      s.type = f[1];
      v.appendChild(s);
    });''',
'''    [[v.dataset["webm" + key], "video/webm"], [v.dataset["mp4" + key], "video/mp4"]].forEach(function(f){
      var s = document.createElement("source");
      s.src = f[0];
      s.type = f[1];
      v.appendChild(s);
    });
    delete v.dataset.webmDesktop; delete v.dataset.mp4Desktop;
    delete v.dataset.webmMobile;  delete v.dataset.mp4Mobile;''')

out = root / "nude-divine-single.html"
out.write_text(html, encoding="utf-8")
print(f"{out.name}: {out.stat().st_size/1024/1024:.2f} MB")
