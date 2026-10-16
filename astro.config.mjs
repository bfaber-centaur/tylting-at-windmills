import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';

// Canonical origin for article links, RSS, and the sitemap. Override for staging builds when needed.
const site = process.env.SITE_URL ?? 'https://tylting.at';

export default defineConfig({
  site,
  base: '/windmills',
  // Cloudflare serves assets at the domain root, so nest the generated site.
  outDir: './dist/windmills',
  trailingSlash: 'always',
  // Explicit GFM footnotes so [^1] references become accessible notes.
  markdown: {
    processor: satteri({
      features: {
        gfm: {
          footnotes: {
            label: 'Footnotes',
            backContent: '↩',
            backLabel: 'Back to reference {reference}',
          },
        },
      },
    }),
  },
  integrations: [mdx(), sitemap()],
});
