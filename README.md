# Tylting at Windmills

Personal website and writing archive, built with [Astro](https://astro.build/) and hosted as static assets on [Cloudflare Workers](https://developers.cloudflare.com/workers/).

This site is the home for essays, experiments, and **Hill Climb Till It's Go Time** (HCTiGT). The authoritative repository is [bubskee/tylting-at-windmills](https://github.com/bubskee/tylting-at-windmills). Changes can be developed in [bfaber-centaur/tylting-at-windmills](https://github.com/bfaber-centaur/tylting-at-windmills) and proposed upstream via pull requests.

## Development

Requires Node.js 22.22.0 or later (see .node-version).

```sh
npm install
npm run dev
npm run build
```

There are **no published articles** in the starter. Posts are Markdown/MDX files in src/content/writing. To publish one, copy _example.mdx to a filename without the leading underscore, fill in the frontmatter, set draft: false, and commit.

## Cloudflare Workers deployment

Cloudflare dashboard → Workers & Pages → Create application → Import a Git repository → select **bubskee/tylting-at-windmills**.

- Production branch: `main`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Preview command: `npx wrangler preview` (optional preview builds)
- Root directory: repository root

The `wrangler.jsonc` config declares the `./dist` static asset directory. No Worker script or Cloudflare Astro adapter is needed for this fully static blog.

After the first deployment, update Cloudflare **build-time** variable `SITE_URL` to your real `https://<worker>.<subdomain>.workers.dev` URL (or your custom domain) and rebuild. The starter's `astro.config.mjs` fallback is a placeholder; `SITE_URL` is used for canonical URLs, RSS, and the sitemap.

## Site structure

- / — homepage
- /writing/ — chronological writing
- /series/hctigt/ — HCTiGT series
- /projects/ — projects
- /about/ — about
- /rss.xml — RSS

Posts accept title, description, pubDate, optional updatedDate, optional series: hctigt, tags, draft, and optional crosspostUrl (e.g. LessWrong). The site's own URL remains the canonical URL.

The starter intentionally contains no article drafts and no external services, analytics, database, or CMS.
