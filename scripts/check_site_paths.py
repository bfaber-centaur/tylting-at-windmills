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
# The site's header provides series context, while the HCTiGT manuscript
# remains authoritative. Repetition is intentional until the author changes
# the source: the import must never delete or move the source's footnotes.
assert "Alpha preview" not in article, "Unwanted alpha banner"
assert 'class="article-series-preface"' in article, "Missing series pre-title context"
assert '/windmills/series/hctigt/' in article, "Series link is missing"
source_markdown = Path("src/content/writing/the-first-step.md").read_text(encoding="utf-8")
series_intro = "is my series about finding my way into interpretability"
# A second occurrence belongs to the author, not to the site's presenter.
# The site-owned frontmatter includes the header text, so only inspect
# Markdown after frontmatter when determining whether the author repeats it.
source_body = source_markdown.split("\n---\n", 1)[1]
expected_occurrences = 1 + int(series_intro in source_body)
assert article.count(series_intro) == expected_occurrences, (
    f"Series context should appear once in the header plus any canonical article occurrence, got {article.count(series_intro)}"
)
assert article.index('class="article-series-preface"') < article.index("<h1>The First Step</h1>"), "Series preface must precede title"
assert "colab.research.google.com/github/bubskee/hctigt/blob/main/notebooks/03-make-a-choice.ipynb" in article
assert 'rel="canonical" href="https://tylting.at/windmills/writing/the-first-step/"' in article or 'href="https://tylting.at/windmills/writing/the-first-step/" rel="canonical"' in article, "Incorrect article canonical URL"
assert "/windmills/writing/the-first-step/" in (dist / "windmills/rss.xml").read_text(encoding="utf-8"), "Incorrect RSS URL"
assert (dist / "_redirects").is_file(), "Missing Cloudflare Worker redirects"
assert (dist / "robots.txt").is_file(), "Missing domain-root robots.txt"
assert (dist / "windmills/favicon.svg").is_file(), "Missing base-aware favicon"
assert "/windmills/favicon.svg" in article, "Favicon does not use /windmills prefix"
# The article is freshly generated from HCTiGT, not maintained as a site copy.
source_markdown = Path("src/content/writing/the-first-step.md").read_text(encoding="utf-8")
assert source_markdown.startswith("---\ntitle: \"The First Step\""), "Missing site metadata"
assert "NASA / Public domain" in source_markdown, "Expected author's NASA image credit"
assert "Cargo Cult Science" in source_markdown, "Article seems older than canonical source"
import re
footnotes = re.findall(r"^\[\^([A-Za-z0-9_-]+)\]:", source_markdown, re.MULTILINE)
assert len(footnotes) >= 4, f"Expected current HCTiGT named notes, found {footnotes}"
for label in footnotes:
    assert f"[^{label}]" not in article, f"Footnote {label} not rendered"
assert "data-footnotes" in article, "Missing rendered footnotes section"
assert article.count("data-footnote-ref") >= len(footnotes), "Missing footnote references"
assert article.count("data-footnote-backref") >= len(footnotes), "Missing footnote backlinks"
assert article.count("<sup") >= len(footnotes), "Missing footnote superscripts"
print(f"Footnotes: {len(footnotes)} linked references, definitions and back-links.")

# Footnote presentation enhancement is bundled without replacing the endnotes.
# Astro may inline small scripts into the page rather than emitting .js files.
# Inspect both generated page HTML and every emitted JS bundle.
assets = list(dist.rglob("*.js"))
bundled = article + "\\n" + "\\n".join(
    p.read_text(encoding="utf-8") for p in assets
)
print("Sidenote script audit:", len(assets), "JS assets,",
      "inline or bundled code:", "margin-notes" in bundled)
assert "margin-notes" in bundled, "No sidenote enhancer in article or built JS"
assert "data-footnote-ref" in bundled, "Missing sidenote reference selector"
print("Desktop sidenote enhancer present; mobile endnotes remain intact.")

assert '<blockquote>' in article, "Bilbo quotation is not a semantic blockquote"
assert '*The Fellowship of the Ring*' not in article, "Blockquote attribution not rendered as emphasis"
assert "Bilbo Baggins" in article and "Frodo" in article, "Missing quotation or attribution"

# The source's image lives in the actual Cloudflare-deployed /windmills tree.
assert "/windmills/hctigt-assets/cassidy-spacewalk.jpg" in article, "Missing linked Cassidy image"
image = dist / "windmills/hctigt-assets/cassidy-spacewalk.jpg"
assert image.is_file() and image.stat().st_size > 100_000, "Missing or incomplete copied NASA image"
# The construction note should be visible on all pages, with no duplicate
# banners or dependency on a dynamic widget.
for page in [dist / "windmills/index.html", dist / "windmills/projects/index.html",
             dist / "windmills/writing/the-first-step/index.html"]:
    html = page.read_text(encoding="utf-8")
    assert html.count("Pardon our dust!") == 1, f"Missing or duplicate site notice: {page}"

# The Projects index is hand-curated, with exactly the intended active projects
# and the existing public research artifact. Keep the links verifiable in HTML.
projects = (dist / "windmills/projects/index.html").read_text(encoding="utf-8")
assert 'id="current-projects"' in projects, "Missing current projects section"
assert 'id="published-tools"' in projects, "Missing published tools section"
for url in (
    "https://github.com/bubskee/stars-elegy",
    "https://github.com/bubskee/euphoria-axis",
    "https://huggingface.co/bubskee/qwen3-14b-jr-lenses",
    "https://github.com/bubskee/euphoria-axis/blob/main/releases/qwen3-14b-jr-lenses/README.md",
):
    assert f'href="{url}"' in projects, f"Missing project link: {url}"
assert "Projects coming soon." not in projects, "Stale projects placeholder"
print("Construction note and current/public projects verified.")

print("Fresh HCTiGT article and image, Colab, canonical URL, RSS, and redirects verified.")
