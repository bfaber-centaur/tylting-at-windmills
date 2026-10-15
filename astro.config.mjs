import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Canonical origin for article links, RSS, and the sitemap. Override for a future custom domain.
const site = process.env.SITE_URL ?? 'https://tylting-at-windmills.bfaber.workers.dev';

export default defineConfig({
  site,
  integrations: [mdx(), sitemap()],
});
