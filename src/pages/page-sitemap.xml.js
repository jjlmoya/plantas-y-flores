import { getCategories } from '../utils/data.js';

export async function getStaticPaths() {
  return [
    { params: {} }
  ];
}

export async function GET() {
  const categories = await getCategories();
  
  const sitemapEntries = [
    // Homepage
    {
      url: 'https://plantasyflores.online/',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0
    },
    
    // All plants page
    {
      url: 'https://plantasyflores.online/plantas/',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.9
    },
    
    // Category pages
    ...categories.map(category => ({
      url: `https://plantasyflores.online/${category.data.slug}/`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8
    }))
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}