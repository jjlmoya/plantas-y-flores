import { getPlants } from '../utils/data.js';

export async function getStaticPaths() {
  return [
    { params: {} }
  ];
}

export async function GET() {
  const plants = await getPlants();

  const sitemapEntries = [
    // Plant pages
    ...plants.map(plant => {
      const category = plant.data.categories[0]?.slug || 'plantas';
      return {
        url: `https://plantasyflores.online/${category}/${plant.slug}/`,
        lastmod: new Date(plant.data.date).toISOString(),
        changefreq: 'yearly',
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