// scrapper.js
const fs = require('fs');
const fetch = require('node-fetch'); // usa node-fetch@2

const BASE = 'https://plantasyflores.online/wp-json/wp/v2';

async function getAll(endpoint, params) {
  let all = [], page = 1, pages = 1;
  do {
    const url = `${BASE}/${endpoint}?${params}&per_page=100&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} en ${url}`);
    pages = Number(res.headers.get('x-wp-totalpages') || '1');
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    all.push(...data);
    page++;
  } while (page <= pages);
  return all;
}

const toNameSlug = (arr) => arr.map(t => ({ slug: t.slug, name: t.name }));

(async () => {
  // Contenido
  const posts = await getAll(
    'posts',
    'status=publish&_embed=1&_fields=id,slug,date,title.rendered,content.rendered,excerpt.rendered,featured_media,categories,tags'
  );
  const pages = await getAll(
    'pages',
    'status=publish&_embed=1&_fields=id,slug,date,title.rendered,content.rendered,excerpt.rendered,featured_media,categories,tags'
  );

  // Catálogos de términos
  const cats = await getAll('categories', '_fields=id,slug,name');
  const tags = await getAll('tags', '_fields=id,slug,name');

  const catMap = new Map(cats.map(c => [c.id, { slug: c.slug, name: c.name }]));
  const tagMap = new Map(tags.map(t => [t.id, { slug: t.slug, name: t.name }]));

  const mapItem = (i, type) => ({
    id: i.id,
    type,
    slug: i.slug,
    date: i.date,
    title: i.title?.rendered || '',
    content_html: i.content?.rendered || '',
    excerpt: i.excerpt?.rendered || '',
    featured_image: i._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
    categories: Array.isArray(i.categories) ? i.categories.map(id => catMap.get(id)).filter(Boolean) : [],
    tags: Array.isArray(i.tags) ? i.tags.map(id => tagMap.get(id)).filter(Boolean) : []
  });

  const content = [
    ...posts.map(p => mapItem(p, 'post')),
    ...pages.map(p => mapItem(p, 'page'))
  ];

  fs.writeFileSync('content.json', JSON.stringify(content, null, 2), 'utf8');
  console.log(`OK: ${content.length} items → content.json`);
})().catch(err => { console.error(err); process.exit(1); });
