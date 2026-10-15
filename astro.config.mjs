import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Canonical origin for article links, RSS, and the sitemap. Override for staging builds when needed.
const site = process.env.SITE_URL ?? 'https://tylting.at';

export default defineConfig({
  site,
  integrations: [mdx(), sitemap()],
});
