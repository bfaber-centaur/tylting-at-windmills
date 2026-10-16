#!/usr/bin/env python3
"""Verify generated static URLs for the /windmills/ path migration."""
from html.parser import HTMLParser
from pathlib import Path

dist = Path("dist")
expected = [
    "windmills/index.html",
    "windmills/writing/index.html",
    "windmills/writing/the-first-step/index.html",
    "windmills/series/hctigt/index.html",
    "windmills/projects/index.html",
    "windmills/about/index.html",
    "windmills/rss.xml",
]
for path in expected:
    assert (dist / path).is_file(), f"Missing public page: {path}"
print("All expected /windmills/ pages exist.")

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        url = attrs.get("href") or attrs.get("src")
        if url:
            self.urls.append(url)

for path in ["windmills/index.html", "windmills/writing/the-first-step/index.html"]:
    html = (dist / path).read_text(encoding="utf-8")
    parsed = Links()
    parsed.feed(html)
    for url in parsed.urls:
        assert not url.startswith(("/writing/", "/series/", "/projects/", "/about/", "/rss.xml")), (
            f"Unprefixed URL in {path}: {url}"
        )
    assert "/windmills/writing/" in html, f"No prefixed writing link in {path}"
    print(f"{path}: {len(parsed.urls)} links and assets checked")

article = (dist / "windmills/writing/the-first-step/index.html").read_text(encoding="utf-8")
assert "colab.research.google.com/github/bubskee/hctigt/blob/main/notebooks/03-make-a-choice.ipynb" in article
assert 'rel="canonical" href="https://tylting.at/windmills/writing/the-first-step/"' in article or 'href="https://tylting.at/windmills/writing/the-first-step/" rel="canonical"' in article, "Incorrect article canonical URL"
assert "/windmills/writing/the-first-step/" in (dist / "windmills/rss.xml").read_text(encoding="utf-8"), "Incorrect RSS URL"
assert (dist / "_redirects").is_file(), "Missing Cloudflare Worker redirects"
assert (dist / "robots.txt").is_file(), "Missing domain-root robots.txt"
assert (dist / "windmills/favicon.svg").is_file(), "Missing base-aware favicon"
assert "/windmills/favicon.svg" in article, "Favicon does not use /windmills prefix"
# Standard GFM definition syntax requires the colon in [^n]:.
source_markdown = Path("src/content/writing/the-first-step.md").read_text(encoding="utf-8")
for num in ("1", "2", "3"):
    assert any(line.startswith(f"[^{num}]: ") for line in source_markdown.splitlines()), f"Footnote {num} definition is missing the colon"
    assert f"[^{num}]" not in article, f"Footnote {num} was not rendered"
assert "data-footnotes" in article, "Missing rendered footnote section"
assert article.count("data-footnote-ref") >= 3, "Missing superscript reference links"
assert article.count("data-footnote-backref") >= 3, "Missing return links"
assert article.count("<sup") >= 3, "Footnote references should be superscripts"
print("Footnotes: three linked references, definitions and back-links rendered.")

assert '<blockquote>' in article, "Bilbo quotation is not a semantic blockquote"
assert '*The Fellowship of the Ring*' not in article, "Blockquote attribution not rendered as emphasis"
assert "Bilbo Baggins" in article and "Frodo" in article, "Missing quotation or attribution"

print("Article, Colab, canonical URL, RSS, and redirects verified.")
