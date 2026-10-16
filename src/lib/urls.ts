// Astro's configured base is the public URL prefix for all navigation.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export function sitePath(relative = '') {
  return base + '/' + relative.replace(/^\/+/, '');
}
