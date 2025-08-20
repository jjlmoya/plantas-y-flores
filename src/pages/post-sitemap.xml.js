import { getPlants } from '../utils/data.js';

export async function getStaticPaths() {
  return [
    { params: {} }
  ];
}

export async function GET() {
  const plants = await getPlants();

  // Prioridades basadas en analytics REALES - páginas más visitadas
  const pagePriorities = {
    // Top páginas individuales (por vistas)
    '/margarita/': 0.95,                          // 113 vistas (4.43%)
    '/albahaca/albahaca-de-clavo/': 0.9,         // 81 vistas (3.17%)
    '/lirios/stargazer/': 0.9,                   // 68 vistas (2.66%)
    '/peonia/peonia-sarah-bernhardt/': 0.9,      // 66 vistas (2.59%)
    '/albahaca/anis/': 0.85,                     // 47 vistas (1.84%)
    '/platano/manzano/': 0.8,                    // 42 vistas (1.65%)
    '/cosmos/': 0.8,                             // 40 vistas (1.57%)
    '/plantas-comestibles/': 0.8,                // 40 vistas (1.57%)
    '/pensamiento/': 0.75,                       // 38 vistas (1.49%)
    '/tomillo/': 0.75,                           // 37 vistas (1.45%)
    '/hibiscus/': 0.75,                          // 34 vistas (1.33%)
    '/lirios/': 0.7,                             // 31 vistas (1.21%)
    '/lirios/del-valle/': 0.7,                   // 30 vistas (1.18%)
    '/fresa/': 0.7,                              // 29 vistas (1.14%)
    '/rosa/banksiae/': 0.7,                      // 28 vistas (1.1%)
    '/girasol/': 0.7,                            // 27 vistas (1.06%)
    '/patata/': 0.65,                            // 26 vistas (1.02%)
    '/manzanilla/': 0.65,                        // 25 vistas (0.98%)
    '/plantas-medicinales/': 0.65,               // 25 vistas (0.98%)
    '/curcuma/': 0.65,                           // 24 vistas (0.94%)
    '/hortensias/': 0.65,                        // 24 vistas (0.94%)
    '/rosa/princesa-de-monaco/': 0.6,            // 23 vistas (0.9%) - sorprendentemente bajo
  };

  // Prioridades por categoría (fallback)
  const categoryPriorities = {
    'margarita': 0.9,      // Muy popular según datos reales
    'albahaca': 0.85,      // Múltiples páginas populares
    'lirios': 0.8,         // Varias páginas top
    'platano': 0.75,
    'cosmos': 0.75,
    'peonia': 0.75,
    'tomillo': 0.7,
    'hibiscus': 0.7,
    'fresa': 0.7,
    'rosa': 0.65,          // Menor de lo esperado
    'patata': 0.65,
    'manzanilla': 0.65,
    'curcuma': 0.65,
    'hortensias': 0.65,
    'girasol': 0.65,
    'pensamiento': 0.6,
    'tomate': 0.6,
    'chili': 0.6,
    'amapola': 0.6,
    'orquidea': 0.55,
    'pina': 0.55,
    'tulipan': 0.55
  };

  const sitemapEntries = [
    // Plant pages con prioridades optimizadas
    ...plants.map(plant => {
      const category = plant.data.categories[0]?.slug || 'plantas';
      const plantUrl = `/${category}/${plant.slug}/`;
      
      // Usar prioridad específica de página si existe, sino categoría, sino default
      const priority = pagePriorities[plantUrl] || 
                      pagePriorities[`/${category}/`] || 
                      categoryPriorities[category] || 
                      0.6;
      
      // Extraer imagen principal para image sitemap
      const getImagePath = (imageUrl) => {
        if (!imageUrl) return null;
        if (imageUrl.startsWith('/wp-content/uploads/')) {
          return `https://plantasyflores.online${imageUrl}`;
        }
        if (imageUrl.includes('plantasyflores.online/wp-content/uploads/')) {
          return imageUrl.replace(/https?:\/\/[^/]*\/wp-content\/uploads\//, 'https://plantasyflores.online/wp-content/uploads/');
        }
        return imageUrl;
      };

      const imageUrl = getImagePath(plant.data.main_image || plant.data.featured_image);

      // XML escape function
      const escapeXml = (str) => {
        if (!str) return str;
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/&nbsp;/g, ' ');
      };

      return {
        url: `https://plantasyflores.online/${category}/${plant.slug}/`,
        lastmod: new Date(plant.data.date).toISOString(),
        changefreq: 'yearly',
        priority: priority,
        image: imageUrl ? {
          loc: imageUrl,
          title: escapeXml(plant.data.title),
          caption: escapeXml(plant.data.excerpt?.replace(/<[^>]*>/g, '').substring(0, 200) || plant.data.title)
        } : null
      };
    })
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapEntries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>${entry.image ? `
    <image:image>
      <image:loc>${entry.image.loc}</image:loc>
      <image:title>${entry.image.title}</image:title>
      <image:caption>${entry.image.caption}</image:caption>
    </image:image>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}