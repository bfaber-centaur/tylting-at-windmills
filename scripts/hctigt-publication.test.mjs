import test from 'node:test';
import assert from 'node:assert/strict';
import { publishHctigt, sourceImages } from './hctigt-publication.mjs';

const source = [
  '# HCTiGT: The First Step',
  '',
  '![Chris Cassidy](assets/cassidy-spacewalk.jpg)',
  '',
  'The paragraph stays exactly as I wrote it.[^1]',
  '',
  '“It is a dangerous business, Frodo, going out your door.” —Bilbo Baggins, *The Lord of the Rings* (J. R. R. Tolkien)',
  '',
  'Here: :hand:',
  '',
  '[^1]: My own footnote.',
].join('\n');

test('article keeps prose and GFM footnotes, without duplicating the H1', () => {
  const page = publishHctigt(source);
  assert.match(page, /^---\ntitle: "The First Step"/);
  assert.ok(page.includes('The paragraph stays exactly as I wrote it.[^1]'));
  assert.ok(page.includes('[^1]: My own footnote.'));
  assert.ok(!page.includes('# HCTiGT: The First Step'));
});
test('image locations are adapted, not the author text', () => {
  const page = publishHctigt(source);
  assert.deepEqual(sourceImages(source), ['cassidy-spacewalk.jpg']);
  assert.ok(page.includes('![Chris Cassidy](/windmills/hctigt-assets/cassidy-spacewalk.jpg)'));
  assert.ok(page.includes('Here: 👋'));
});
test('Bilbo is a blockquote with the same words and credit', () => {
  const page = publishHctigt(source);
  assert.ok(page.includes('> “It is a dangerous business, Frodo, going out your door.”'));
  assert.ok(page.includes('> —Bilbo Baggins, *The Lord of the Rings* (J. R. R. Tolkien)'));
});
test('unexpected source headings fail instead of silently publishing stale prose', () => {
  assert.throws(() => publishHctigt('## Surprise\n'), /Unexpected HCTiGT first heading/);
});
