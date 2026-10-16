import { stackSidenotes } from '../lib/sidenote-layout.js';

/*
 * Progressive enhancement: Astro's actual footnotes are the canonical HTML.
 * Sidenotes are visually duplicated on wide screens, hidden from assistive
 * technology. Endnotes stay reachable by keyboard and without JavaScript.
 */
function initSidenotes() {
  const prose = document.querySelector('.article .prose');
  const endnotes = prose?.querySelector('section[data-footnotes]');
  if (!prose || !endnotes) return;

  const references = prose.querySelectorAll('a[data-footnote-ref]');
  if (!references.length) return;

  const rail = document.createElement('div');
  rail.className = 'margin-notes';
  rail.setAttribute('aria-hidden', 'true');

  const notesByTarget = new Map();
  const entries = [];

  for (const reference of references) {
    const hash = reference.getAttribute('href') || '';
    if (!hash.startsWith('#')) continue;
    const destination = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!destination || !endnotes.contains(destination)) continue;

    let entry = notesByTarget.get(destination);
    if (!entry) {
      const note = document.createElement('aside');
      note.className = 'margin-note';

      const number = document.createElement('span');
      number.className = 'margin-note-number';
      number.textContent = reference.textContent?.trim() || String(entries.length + 1);

      const text = document.createElement('div');
      text.className = 'margin-note-text';
      const copy = destination.cloneNode(true);
      copy.querySelectorAll('a[data-footnote-backref]').forEach((el) => el.remove());
      copy.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
      // Keep original links keyboard-accessible in the canonical endnotes.
      copy.querySelectorAll('a, button, input, select, textarea').forEach((el) => {
        el.setAttribute('tabindex', '-1');
      });
      while (copy.firstChild) text.appendChild(copy.firstChild);

      note.append(number, text);
      rail.appendChild(note);
      entry = { reference, note };
      entries.push(entry);
      notesByTarget.set(destination, entry);
    }

    const highlight = (active) => entry.note.classList.toggle('is-highlighted', active);
    reference.addEventListener('pointerenter', () => highlight(true));
    reference.addEventListener('pointerleave', () => highlight(false));
    reference.addEventListener('focus', () => highlight(true));
    reference.addEventListener('blur', () => highlight(false));
  }

  if (!entries.length) return;
  prose.appendChild(rail);

  const wide = window.matchMedia('(min-width: 1280px)');
  let scheduledFrame = 0;
  function position() {
    scheduledFrame = 0;
    if (!wide.matches) return;
    const proseTop = prose.getBoundingClientRect().top;
    const tops = entries.map(({ reference }) => reference.getBoundingClientRect().top - proseTop);
    const heights = entries.map(({ note }) => note.getBoundingClientRect().height);
    const positions = stackSidenotes(tops, heights, 18);
    entries.forEach(({ note }, i) => {
      note.style.top = `${Math.round(positions[i])}px`;
    });
  }
  function schedule() {
    if (!scheduledFrame) scheduledFrame = requestAnimationFrame(position);
  }

  wide.addEventListener('change', schedule);
  window.addEventListener('resize', schedule, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(prose);
  document.fonts?.ready.then(schedule);
  schedule();
}

initSidenotes();
