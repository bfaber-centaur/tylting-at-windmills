import rss from '@astrojs/rss';
import { publishedPosts, postUrl } from '../lib/posts';

export async function GET(context) {
  const posts = await publishedPosts();
  return rss({
    title: 'Tylting at Windmills',
    description: 'Research notes, essays, and experiments.',
    site: context.site,
    items: posts.map(({ id, data }) => ({
      title: data.title,
      description: data.description,
      pubDate: data.pubDate,
      link: postUrl(id),
    })),
  });
}
