/**
 * Position sidenotes near in-text references, stacking those that would overlap.
 * Pure function so it can be tested without a browser.
 */
export function stackSidenotes(anchorTops, heights, gap = 18) {
  if (anchorTops.length !== heights.length) {
    throw new Error('A sidenote needs one height per anchor.');
  }
  let previousBottom = -gap;
  return anchorTops.map((anchorTop, i) => {
    const top = Math.max(0, anchorTop, previousBottom + gap);
    previousBottom = top + Math.max(0, heights[i]);
    return top;
  });
}
