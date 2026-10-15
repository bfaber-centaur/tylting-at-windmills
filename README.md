# Tylting at Windmills

Personal website and writing archive, built with [Astro](https://astro.build/) and hosted on [Cloudflare Pages](https://developers.cloudflare.com/pages/).

This site is the home for essays, experiments, and **Hill Climb Till It's Go Time** (HCTiGT). The authoritative repository is [bubskee/tylting-at-windmills](https://github.com/bubskee/tylting-at-windmills). Changes can be developed in [bfaber-centaur/tylting-at-windmills](https://github.com/bfaber-centaur/tylting-at-windmills) and proposed upstream via pull requests.

## Development

Requires Node.js 22.22.0 or later (see .node-version).

```sh
npm install
npm run dev
npm run build
```

There are **no published articles** in the starter. Posts are Markdown/MDX files in src/content/writing. To publish one, copy _example.mdx to a filename without the leading underscore, fill in the frontmatter, set draft: false, and commit.

## Pages deployment

Cloudflare dashboard → Workers & Pages → Create application → Pages → Connect to Git → select **bubskee/tylting-at-windmills** (after merging this PR).

- Production branch: main
- Build command: npm run build
- Build output directory: dist
- Root directory: repository root

Set the build-time SITE_URL variable to the assigned Pages URL, or update astro.config.mjs; update it again for a custom domain. This is used for canonical URLs, RSS and sitemap.

## Site structure

- / — homepage
- /writing/ — chronological writing
- /series/hctigt/ — HCTiGT series
- /projects/ — projects
- /about/ — about
- /rss.xml — RSS

Posts accept title, description, pubDate, optional updatedDate, optional series: hctigt, tags, draft, and optional crosspostUrl (e.g. LessWrong). The site's own URL remains the canonical URL.

The starter intentionally contains no article drafts and no external services, analytics, database, or CMS.
