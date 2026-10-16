#!/usr/bin/env node
/**
 * Download the one HCTiGT article before Astro builds.
 * Network errors fail the build, never silently publish an old local copy.
 * Use HCTIGT_REF=<40-char-commit> to pin a reproducible source build.
 */
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import {
  publishHctigt, sourceArticle, sourceImages, sourceRepository,
} from './hctigt-publication.mjs';

const ref = process.env.HCTIGT_REF || 'main';
if (ref !== 'main' && !/^[0-9a-f]{40}$/i.test(ref)) {
  throw new Error('HCTIGT_REF must be main or a 40-character commit SHA.');
}

const rawBase = 'https://raw.githubusercontent.com/' + sourceRepository + '/' + ref + '/';

async function fetchBytes(path) {
  const response = await fetch(rawBase + path, {
    signal: AbortSignal.timeout(45000),
    headers: { 'User-Agent': 'tylting-at-windmills-build' },
  });
  if (!response.ok) {
    throw new Error('Could not fetch ' + path + ' from ' + sourceRepository +
      '@' + ref + ': HTTP ' + response.status);
  }
  return Buffer.from(await response.arrayBuffer());
}

const sourceBytes = await fetchBytes(sourceArticle);
const source = sourceBytes.toString('utf8');
const article = publishHctigt(source);
const images = sourceImages(source);

// Fetch all input files before writing output to avoid leaving a half-sync.
const downloaded = await Promise.all(images.map(async filename => ({
  filename,
  bytes: await fetchBytes('assets/' + filename),
})));
for (const { filename, bytes } of downloaded) {
  if (bytes.length < 1024) {
    throw new Error('Image is suspiciously small: ' + filename);
  }
}

await mkdir('src/content/writing', { recursive: true });
await mkdir('public/hctigt-assets', { recursive: true });
await writeFile('src/content/writing/the-first-step.md', article, 'utf8');
for (const { filename, bytes } of downloaded) {
  await writeFile('public/hctigt-assets/' + filename, bytes);
}
const digest = createHash('sha256').update(sourceBytes).digest('hex');
console.log('Imported ' + sourceRepository + '/' + sourceArticle +
  '@' + ref + ' (sha256:' + digest.slice(0, 16) +
  '), ' + images.length + ' image(s).');
