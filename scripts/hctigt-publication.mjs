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

  // Present the author's one-sentence series introduction in the page
  // header above the title, rather than repeating it inside the essay.
  // Keep its interpretability footnote alive at the next mention in prose.
  // If the source intro changes, require a conscious update to this display
  // adaptation rather than quietly dropping a footnote.
  const seriesParagraph = /^\*Hill Climb Till It's Go Time\* (is my series about .+)$/m;
  const seriesMatch = body.match(seriesParagraph);
  if (!seriesMatch || !seriesMatch[1].includes('[^1]') ||
      body.split('interpretability[^2]').length !== 2) {
    throw new Error('Series intro or its interpretability footnote changed. Review site presentation.');
  }
  const seriesIntro = seriesMatch[1].replace('[^1]', '');
  body = body.replace(seriesParagraph, '').replace('interpretability[^2]', 'interpretability[^1][^2]');
  // Remove redundant blank space where the paragraph used to be.
  body = body.replace(/\n{3,}/g, '\n\n');

  // Retain author prose but render the intended greeting as an emoji.
  body = body.replace('Here: :hand:', 'Here: 👋');

  const frontmatter = publicationMetadata.replace(
    /\n---$/, '\nseriesIntro: ' + JSON.stringify(seriesIntro) + '\n---'
  );
  return frontmatter + '\n\n' + body.trimEnd() + '\n';
}
