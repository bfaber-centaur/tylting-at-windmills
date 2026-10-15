import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Replace the fallback after the Pages URL or a custom domain is assigned.
const site = process.env.SITE_URL ?? 'https://tylting-at-windmills.pages.dev';

export default defineConfig({
  site,
  integrations: [mdx(), sitemap()],
});
