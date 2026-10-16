import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';

// Canonical origin for article links, RSS, and the sitemap. Override for staging builds when needed.
const site = process.env.SITE_URL ?? 'https://tylting.at';

export default defineConfig({
  site,
  base: '/windmills',
  // Cloudflare serves assets at the domain root, so nest the generated site.
  outDir: './dist/windmills',
  trailingSlash: 'always',
  // Use Astro's official unified Markdown processor for GFM footnotes.
  markdown: {
    processor: unified({
      gfm: true,
      remarkRehype: {
        footnoteLabel: 'Footnotes',
        footnoteBackContent: '↩',
      },
    }),
  },
  integrations: [mdx(), sitemap()],
});
