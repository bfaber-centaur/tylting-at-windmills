import { getCollection } from 'astro:content';

export async function publishedPosts() {
  const posts = await getCollection('writing', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function postUrl(id: string) {
  return '/writing/' + id + '/';
}
