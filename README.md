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

Posts are Markdown/MDX files in `src/content/writing` (including `the-first-step.md`). To publish another, copy `_example.mdx` to a filename without the leading underscore, fill in the frontmatter, set `draft: false`, and commit.

## Cloudflare Workers deployment

The site lives under **[https://tylting.at/windmills/](https://tylting.at/windmills/)** (the registered domain is `tylting.at`, with a **y**). Until DNS is configured, the underlying Worker is accessible at [https://tylting-at-windmills.bfaber.workers.dev](https://tylting-at-windmills.bfaber.workers.dev).

Cloudflare dashboard → Workers & Pages → `tylting-at-windmills` is deployed from the authoritative **bubskee/tylting-at-windmills** repository.

- Production branch: `main`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Preview command: `npx wrangler preview` (optional preview builds)

The `wrangler.jsonc` config publishes Astro's static `dist/` directory. Astro builds into `dist/windmills/`, and `scripts/prepare-deploy.mjs` moves `_redirects` to `dist/` (where Cloudflare Workers processes it) and copies `robots.txt` to the domain root. No Worker script or Cloudflare Astro adapter is necessary.

### Custom domain (Dynadot registrar)

1. In Cloudflare **Domains → Onboard a domain**, add `tylting.at` to the same account, on the Free plan. Review and preserve any existing DNS records you need.
2. Cloudflare will assign **two account/zone-specific nameservers** on the `tylting.at` Overview page. If DNSSEC is already enabled for this domain at Dynadot, disable it before switching nameservers, then enable it again through Cloudflare after activation. At Dynadot choose **My Domains → Manage Domains → tylting.at → Action → DNS Settings → Name Servers**, enter those exact two nameservers and save. Do **not** copy nameservers from another Cloudflare domain.
3. Wait until the Cloudflare `tylting.at` DNS zone is **Active**. Then open **Workers & Pages → tylting-at-windmills → Settings → Domains & Routes → Add → Custom Domain** and enter `tylting.at`. Cloudflare creates the necessary DNS record and TLS certificate automatically.
4. Optionally add `www.tylting.at` as an additional custom domain and configure a redirect to the apex to avoid duplicate indexable hostnames.

The Astro `site` fallback in `astro.config.mjs` is `https://tylting.at`, with `base: '/windmills'` for the site's public URL prefix. The Cloudflare Worker redirects old root-level links through `public/_redirects`. If `SITE_URL` is defined among Cloudflare's **build-time** environment variables, ensure it is also set to `https://tylting.at`; otherwise the build-time override wins. For a future custom domain change, update `SITE_URL` or the fallback and redeploy.


## Site structure

- /windmills/ — homepage
- /windmills/writing/ — chronological writing
- /windmills/writing/the-first-step/ — first article / Colab
- /windmills/series/hctigt/ — HCTiGT series
- /windmills/projects/ — projects
- /windmills/about/ — about
- /windmills/rss.xml — RSS

Posts accept title, description, pubDate, optional updatedDate, optional series: hctigt, tags, draft, and optional crosspostUrl (e.g. LessWrong). The site's own URL remains the canonical URL.

The site uses no external services, analytics, database, or CMS. The First Step is explicitly an unfinished alpha preview; its canonical prose lives in `bubskee/hctigt`.
