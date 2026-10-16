// Astro's `base` affects URLs, while `outDir` determines filesystem paths.
// Cloudflare Workers expects redirect rules at the root of the assets directory.
import { copyFile, rename } from 'node:fs/promises';

await rename('dist/windmills/_redirects', 'dist/_redirects');
await copyFile('dist/windmills/robots.txt', 'dist/robots.txt');
console.log('Prepared Cloudflare assets: /windmills/* plus root redirects and robots.txt');
