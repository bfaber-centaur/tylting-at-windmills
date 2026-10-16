import test from 'node:test';
import assert from 'node:assert/strict';
import { publishHctigt, sourceImages } from './hctigt-publication.mjs';

const source = [
  '# HCTiGT: The First Step',
  '',
  '![Chris Cassidy](assets/cassidy-spacewalk.jpg)',
  '',
  "*Hill Climb Till It's Go Time* is my series about finding my way into interpretability[^1]—and inviting you along.",
  '',
  'I am tinkering with interpretability[^2]. This paragraph stays exactly as I wrote it.',
  '',
  '“It is a dangerous business, Frodo, going out your door.” —Bilbo Baggins, *The Lord of the Rings* (J. R. R. Tolkien)',
  '',
  'Here: :hand:',
  '',
  '[^1]: What interpretability means.',
  '',
  '[^2]: From now on, interp.',
].join('\n');

test('article keeps prose and GFM footnotes, without duplicating the H1', () => {
  const page = publishHctigt(source);
  assert.match(page, /^---\ntitle: "The First Step"/);
  assert.ok(page.includes('This paragraph stays exactly as I wrote it.'));
  assert.ok(page.includes("*Hill Climb Till It's Go Time* is my series about finding my way into interpretability[^1]—and inviting you along."));
  assert.ok(page.includes('I am tinkering with interpretability[^2].'));
  assert.ok(!page.includes('interpretability[^1][^2]'));
  assert.ok(page.includes('[^1]: What interpretability means.'));
  assert.ok(page.includes('[^2]: From now on, interp.'));
  assert.ok(!page.includes('Alpha preview'));
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

test('site-owned preface and canonical introduction may repeat intentionally', () => {
  const page = publishHctigt(source);
  assert.ok(page.includes('seriesIntro: "is my series about finding my way into interpretability—and inviting you along."'));
  assert.ok(page.includes("*Hill Climb Till It's Go Time* is my series about finding my way into interpretability[^1]—and inviting you along."));
  assert.equal((page.match(/is my series about/g) || []).length, 2);
});
test('later manuscript edits pass through without moving footnotes or suppressing prose', () => {
  const changed = source.replace(
    "*Hill Climb Till It's Go Time* is my series about finding my way into interpretability[^1]—and inviting you along.",
    'Here is a new introduction of my own.[^1]'
  );
  const page = publishHctigt(changed);
  assert.ok(page.includes('Here is a new introduction of my own.[^1]'));
  assert.ok(page.includes('I am tinkering with interpretability[^2].'));
  assert.ok(!page.includes('interpretability[^1][^2]'));
  // Even after the author rewrites or deletes the body intro, the site's
  // separate series-navigation context remains independent.
  assert.ok(page.includes('seriesIntro: "is my series about finding my way into interpretability—and inviting you along."'));
});
