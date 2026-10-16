import test from 'node:test';
import assert from 'node:assert/strict';
import { stackSidenotes } from '../src/lib/sidenote-layout.js';

test('notes follow separated references', () => {
  assert.deepEqual(stackSidenotes([40, 180, 350], [60, 90, 70]), [40, 180, 350]);
});
test('overlapping notes are stacked with a gap', () => {
  assert.deepEqual(stackSidenotes([40, 50, 51], [80, 90, 40], 18), [40, 138, 246]);
});
test('notes clamp to top and support empty articles', () => {
  assert.deepEqual(stackSidenotes([-15, 10], [35, 20], 12), [0, 47]);
  assert.deepEqual(stackSidenotes([], []), []);
});
test('notes require one height per reference', () => {
  assert.throws(() => stackSidenotes([5, 10], [8]), /one height per anchor/);
});
