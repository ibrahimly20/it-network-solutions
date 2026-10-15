"""Download candidate client logos into _logos/ (run by the fetch-logos workflow)."""
import json, os, re, urllib.parse, urllib.request

OUT = "_logos"
os.makedirs(OUT, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 (itns-site logo fetch; contact via GitHub)"}

def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read(), r.headers.get("Content-Type", ""), r.geturl()

def save(name, url):
    try:
        data, ctype, final = get(url)
    except Exception as e:
        print(f"FAIL {name} {url}: {e}")
        return
    ext = os.path.splitext(urllib.parse.urlparse(final).path)[1].lower() or ".bin"
    if "svg" in ctype: ext = ".svg"
    path = f"{OUT}/{name}{ext}"
    open(path, "wb").write(data)
    print(f"OK   {path} {len(data)}B {ctype} <- {final}")

def wiki_image(lang, title):
    api = f"https://{lang}.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=original&redirects=1&titles={urllib.parse.quote(title)}"
    try:
        d = json.loads(get(api)[0])
        for p in d["query"]["pages"].values():
            if "original" in p:
                return p["original"]["source"]
    except Exception as e:
        print(f"FAIL wiki {lang}:{title}: {e}")

def site_logos(name, url, limit=4):
    try:
        html, _, final = get(url)
    except Exception as e:
        print(f"FAIL site {url}: {e}")
        return
    html = html.decode("utf-8", "ignore")
    cands = []
    for m in re.finditer(r'<img[^>]+>', html, re.I):
        tag = m.group(0)
        if re.search(r'logo', tag, re.I):
            s = re.search(r'(?:data-src|src)=["\']([^"\']+)', tag)
            if s: cands.append(s.group(1))
    og = re.search(r'property=["\']og:image["\'][^>]*content=["\']([^"\']+)', html, re.I)
    if og: cands.append(og.group(1))
    for rel in re.finditer(r'<link[^>]+rel=["\'][^"\']*icon[^"\']*["\'][^>]*>', html, re.I):
        h = re.search(r'href=["\']([^"\']+)', rel.group(0))
        if h: cands.append(h.group(1))
    seen = []
    for c in cands:
        u = urllib.parse.urljoin(final, c)
        if u not in seen: seen.append(u)
    print(f"site {name}: {seen}")
    for i, u in enumerate(seen[:limit]):
        save(f"{name}-site{i}", u)

# Wikipedia infobox images
for name, lang, title in [
    ("armoiries-niger", "fr", "Armoiries du Niger"),
    ("armoiries-niger-en", "en", "Coat of arms of Niger"),
    ("ecobank-wiki", "en", "Ecobank"),
    ("niger-telecoms-wiki", "en", "Niger Telecoms"),
    ("niger-telecoms-wiki-fr", "fr", "Niger Télécoms"),
    ("agrhymet-wiki-fr", "fr", "Centre régional AGRHYMET"),
    ("bagri-wiki-fr", "fr", "Banque agricole du Niger"),
]:
    src = wiki_image(lang, title)
    print(f"wiki {name}: {src}")
    if src: save(name, src)

# Official websites
for name, url in [
    ("niger-telecoms", "https://www.nigertelecoms.ne/"),
    ("ecobank", "https://ecobank.com/"),
    ("bagri", "https://www.bagriniger.com/"),
    ("bagri2", "https://bagri.ne/"),
    ("agrhymet", "https://agrhymet.cilss.int/"),
    ("agrhymet2", "https://www.agrhymet.ne/"),
]:
    site_logos(name, url)
