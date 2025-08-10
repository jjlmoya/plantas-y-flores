import { getPlants, getCategories } from '../utils/data.js';

export async function GET() {
  const plants = await getPlants();
  const categories = await getCategories();

  const sitemapEntries = [
    // Homepage
    {
      url: 'https://plantasyflores.com/',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0
    },
    
    // Category pages
    ...categories.map(category => ({
      url: `https://plantasyflores.com/${category.data.slug}/`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8
    })),
    
    // Plant pages
    ...plants.map(plant => {
      const category = plant.data.categories[0]?.slug || 'plantas';
      return {
        url: `https://plantasyflores.com/${category}/${plant.slug}/`,
        lastmod: new Date(plant.data.date).toISOString(),
        changefreq: 'monthly',
        priority: 0.6
      };
    })
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