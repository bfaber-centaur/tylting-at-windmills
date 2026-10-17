/**
 * The site owns metadata and display tweaks; bubskee/hctigt owns the article.
 * There is deliberately one configured article until a second one exists.
 */
export const sourceRepository = 'bubskee/hctigt';
export const sourceArticle = 'posts/01-the-first-step.md';
export const imageBase = '/windmills/hctigt-assets/';

export const publicationMetadata = [
  '---',
  'title: "The First Step"',
  'description: "An invitation to get your hands dirty with a real transformer experiment."',
  'pubDate: 2026-10-16',
  'draft: false',
  'series: hctigt',
  // Site-owned navigation, not text moved out of the canonical article.
  'seriesIntro: "is my series about finding my way into interpretability—and inviting you along."',
  'tags: [interpretability, experiments]',
  '---',
].join('\n');

const imagePattern = /!\[([^\]]+)\]\(assets\/([A-Za-z0-9._-]+)\)/g;

export function sourceImages(markdown) {
  return [...new Set([...markdown.matchAll(imagePattern)].map(match => match[2]))];
}

export function publishHctigt(markdown) {
  if (!markdown.startsWith('# HCTiGT: The First Step\n')) {
    throw new Error('Unexpected HCTiGT first heading. Review the build adapter.');
  }
  let body = markdown.replace(/^# HCTiGT: The First Step\r?\n\s*/, '');

  // The site already provides the H1 title. A display-only blockquote
  // preserves the author's exact quotation and attribution.
  if (!/^> .*Frodo/m.test(body)) {
    const quote = /^“(.+Frodo.+?)”\s+(—Bilbo Baggins, .+)$/m;
    if (!quote.test(body)) {
      throw new Error('Bilbo quotation changed. Review how it should render.');
    }
    body = body.replace(quote, (_line, words, credit) => {
      return '> “' + words + '”\n>\n> ' + credit;
    });
  }

  // The author's images live at the repo root under assets/, not posts/assets/.
  body = body.replace(imagePattern, (_full, alt, filename) => {
    return '![' + alt + '](' + imageBase + filename + ')';
  });

  // Keep every author-written paragraph and footnote reference in place.
  // Series context above the page title is separate, site-owned metadata.
  // If the manuscript also explains the series, display both until its
  // author edits HCTiGT; never silently remove or relocate source prose.
  // Retain author prose but render the intended greeting as an emoji.
  body = body.replace('Here: :hand:', 'Here: 👋');

  return publicationMetadata + '\n\n' + body.trimEnd() + '\n';
}
