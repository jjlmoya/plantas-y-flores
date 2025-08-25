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
      changefreq: 'weekly',
      priority: 1.0
    },
    
    // All plants page
    {
      url: 'https://plantasyflores.online/plantas/',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.9
    },
    
    // Favorites page
    {
      url: 'https://plantasyflores.online/favoritos/',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8
    },
    
    // News page
    {
      url: 'https://plantasyflores.online/novedades/',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7
    },
    
    // Static plant category pages (basado en analytics reales)
    {
      url: 'https://plantasyflores.online/plantas-comestibles/',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8    // 40 vistas (1.57%) - más popular
    },
    {
      url: 'https://plantasyflores.online/plantas-medicinales/',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.65   // 25 vistas (0.98%)
    },
    {
      url: 'https://plantasyflores.online/plantas-aromaticas/',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.6    // 16 vistas (0.63%)
    },
    {
      url: 'https://plantasyflores.online/plantas-de-interior/',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.5    // 19 vistas (0.74%)
    },
    {
      url: 'https://plantasyflores.online/plantas-de-exterior/',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.45   // 8 vistas (0.31%) - menos popular
    },
    
    // Other important pages (basado en analytics)
    {
      url: 'https://plantasyflores.online/categorias/',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7    // 71 vistas (2.78%) - muy popular
    },
    {
      url: 'https://plantasyflores.online/plantas/',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.6    // 28 vistas (1.1%)
    },
    {
      url: 'https://plantasyflores.online/contacto/',
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.5    // 13 vistas (0.51%)
    },
    {
      url: 'https://plantasyflores.online/tienda-de-semillas/',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.45   // 7 vistas (0.27%) - menos popular de lo esperado
    },
    {
      url: 'https://plantasyflores.online/colaboraciones/',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.4
    },
    {
      url: 'https://plantasyflores.online/politica-de-cookies/',
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.3
    },
    
    // Dynamic category pages
    ...categories.map(category => ({
      url: `https://plantasyflores.online/${category.data.slug}/`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7
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