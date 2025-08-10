// Simple static server para testing
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = 3000;

// Load pages data
let pagesData = [];
try {
  const pagesJson = await readFile(join(__dirname, 'data', 'pages.json'), 'utf-8');
  pagesData = JSON.parse(pagesJson);
} catch (error) {
  console.error('Error loading pages data:', error);
}

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
};

// Helper functions
function getCategoryCounts() {
  const counts = {};
  pagesData.forEach(page => {
    if (page.categories) {
      page.categories.forEach(category => {
        counts[category.slug] = (counts[category.slug] || 0) + 1;
      });
    }
  });
  return counts;
}

function getPagesByCategory(categorySlug) {
  return pagesData.filter(page => 
    page.categories && page.categories.some(cat => cat.slug === categorySlug)
  );
}

function getPageBySlug(slug, categorySlug = null) {
  return pagesData.find(page => 
    page.slug === slug && 
    (!categorySlug || (page.categories && page.categories.some(cat => cat.slug === categorySlug)))
  );
}

function generateBaseHTML(title, content, description = "", canonicalUrl = "") {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    ${canonicalUrl ? `<link rel="canonical" href="${canonicalUrl}">` : ''}
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="twitter:card" content="summary_large_image">
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #fafafa; line-height: 1.6; }
        main { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
        .hero { background: linear-gradient(135deg, #4a7c23 0%, #2d5016 100%); color: white; padding: 4rem 2rem; border-radius: 16px; text-align: center; margin-bottom: 4rem; }
        .hero__title { font-size: 3rem; margin: 0 0 1rem 0; }
        .hero__subtitle { font-size: 1.5rem; margin: 0 0 1.5rem 0; opacity: 0.9; }
        .hero__description { font-size: 1.125rem; max-width: 600px; margin: 0 auto; line-height: 1.6; opacity: 0.85; }
        .section-title { font-size: 2rem; color: #2d5016; text-align: center; margin: 0 0 2rem 0; }
        .categories-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 4rem; }
        .category-card { background: white; padding: 2rem 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-decoration: none; color: inherit; text-align: center; transition: transform 0.3s ease; }
        .category-card:hover { transform: translateY(-4px); }
        .category-card__title { font-size: 1.25rem; font-weight: 600; color: #2d5016; margin: 0 0 0.5rem 0; }
        .category-card__count { color: #666; font-size: 0.875rem; margin: 0; }
        .plant-card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 1.5rem; margin-bottom: 1rem; }
        .plant-card__title a { color: #2d5016; text-decoration: none; font-size: 1.25rem; font-weight: 700; }
        .plant-card__excerpt { margin-top: 0.5rem; color: #555; }
        .breadcrumb { margin-bottom: 1.5rem; font-size: 0.875rem; }
        .breadcrumb a { color: #4a7c23; text-decoration: none; }
        .breadcrumb__separator { margin: 0 0.5rem; }
        .plant-article__title { font-size: 2.5rem; font-weight: 800; color: #2d5016; margin: 0 0 1.5rem 0; }
        .plant-article__content { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 2rem 0; line-height: 1.7; }
        .plant-article__content h2 { color: #2d5016; margin-top: 2rem; }
        .plant-article__content h3 { color: #4a7c23; }
        .plant-article__content img { max-width: 100%; height: auto; margin: 1rem 0; border-radius: 8px; }
        .plant-article__back { display: inline-block; background: #4a7c23; color: white; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 3rem 0 2rem 0; }
        .view-all { text-align: center; margin-top: 3rem; }
        .view-all__link { background: #4a7c23; color: white; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600; }
        img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
    <main>
        ${content}
    </main>
</body>
</html>`;
}

function generateHomepage() {
  const categoryCounts = getCategoryCounts();
  const topCategories = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6);
  
  const recentPosts = pagesData
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  const categoriesHTML = topCategories.map(([slug, count]) => {
    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
    return `
      <a href="/${slug}/" class="category-card">
        <h3 class="category-card__title">${categoryName}</h3>
        <p class="category-card__count">${count} artículos</p>
      </a>
    `;
  }).join('');

  const recentHTML = recentPosts.map(post => {
    const categorySlug = post.categories && post.categories[0] ? post.categories[0].slug : '';
    const excerpt = post.excerpt.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
    return `
      <div class="plant-card">
        <h3 class="plant-card__title">
          <a href="/${categorySlug}/${post.slug}/">${post.title}</a>
        </h3>
        <p class="plant-card__excerpt">${excerpt}</p>
      </div>
    `;
  }).join('');

  const content = `
    <section class="hero">
      <h1 class="hero__title">Plantas y Flores</h1>
      <p class="hero__subtitle">Tu guía completa para el mundo de la jardinería y el cultivo</p>
      <p class="hero__description">
        Descubre información detallada sobre cientos de especies de plantas y flores, 
        aprende técnicas de cultivo y mantén tu jardín siempre floreciente.
      </p>
    </section>

    <section class="categories-section">
      <h2 class="section-title">Categorías Populares</h2>
      <div class="categories-grid">
        ${categoriesHTML}
      </div>
    </section>

    <section class="recent-section">
      <h2 class="section-title">Artículos Recientes</h2>
      ${recentHTML}
      <div class="view-all">
        <a href="/plantas/" class="view-all__link">Ver todos los artículos</a>
      </div>
    </section>
  `;

  return generateBaseHTML(
    'Plantas y Flores - Guía completa de jardinería y cultivo',
    content,
    'Descubre todo sobre plantas, flores y jardinería. Guías de cultivo, cuidados y consejos para tu jardín.'
  );
}

function generateCategoryPage(categorySlug) {
  const pages = getPagesByCategory(categorySlug);
  const categoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
  
  if (pages.length === 0) {
    return null; // Category not found
  }

  const plantsHTML = pages.map(page => {
    const excerpt = page.excerpt.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
    return `
      <div class="plant-card">
        <h2 class="plant-card__title">
          <a href="/${categorySlug}/${page.slug}/">${page.title}</a>
        </h2>
        <p class="plant-card__excerpt">${excerpt}</p>
      </div>
    `;
  }).join('');

  const content = `
    <header class="category-header" style="background: linear-gradient(135deg, #4a7c23 0%, #2d5016 100%); color: white; padding: 3rem 2rem; border-radius: 16px; margin-bottom: 3rem;">
      <nav class="breadcrumb" style="margin-bottom: 1.5rem; font-size: 0.875rem; opacity: 0.9;">
        <a href="/" style="color: white; text-decoration: none;">Inicio</a>
        <span class="breadcrumb__separator" style="margin: 0 0.5rem;">›</span>
        <span class="breadcrumb__current">${categoryName}</span>
      </nav>
      
      <h1 style="font-size: 2.5rem; font-weight: 800; margin: 0 0 1rem 0;">${categoryName}</h1>
      <p style="font-size: 1.125rem; line-height: 1.6; margin: 0 0 1rem 0; opacity: 0.9;">
        Información completa sobre ${categoryName.toLowerCase()}
      </p>
      <div style="font-size: 0.875rem; opacity: 0.8; font-weight: 500;">
        ${pages.length} artículos
      </div>
    </header>

    <section class="category-content">
      ${plantsHTML}
    </section>
  `;

  return generateBaseHTML(
    `${categoryName} - Plantas y Flores`,
    content,
    `Descubre todo sobre ${categoryName.toLowerCase()}. Guías completas de cultivo, cuidados y consejos.`,
    `https://plantasyflores.com/${categorySlug}/`
  );
}

function generateArticlePage(categorySlug, articleSlug) {
  const page = getPageBySlug(articleSlug, categorySlug);
  
  if (!page) {
    return null; // Article not found
  }

  const categoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
  const excerpt = page.excerpt.replace(/<[^>]*>/g, '').substring(0, 160);

  const content = `
    <article class="plant-article">
      <header class="plant-article__header">
        <nav class="breadcrumb">
          <a href="/">Inicio</a>
          <span class="breadcrumb__separator">›</span>
          <a href="/${categorySlug}/">${categoryName}</a>
          <span class="breadcrumb__separator">›</span>
          <span class="breadcrumb__current">${page.title}</span>
        </nav>
        
        <h1 class="plant-article__title">${page.title}</h1>
      </header>

      <div class="plant-article__content">
        ${page.seo_html || page.excerpt}
      </div>

      <div class="plant-article__navigation">
        <a href="/${categorySlug}/" class="plant-article__back">
          ← Volver a ${categoryName}
        </a>
      </div>
    </article>
  `;

  return generateBaseHTML(
    `${page.title} - ${categoryName} - Plantas y Flores`,
    content,
    excerpt,
    `https://plantasyflores.com/${categorySlug}/${articleSlug}/`
  );
}

function generatePlantsPage() {
  const allPlants = pagesData.sort((a, b) => a.title.localeCompare(b.title));

  const plantsHTML = allPlants.map(page => {
    const categorySlug = page.categories && page.categories[0] ? page.categories[0].slug : '';
    const excerpt = page.excerpt.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
    return `
      <div class="plant-card">
        <h2 class="plant-card__title">
          <a href="/${categorySlug}/${page.slug}/">${page.title}</a>
        </h2>
        <p class="plant-card__excerpt">${excerpt}</p>
      </div>
    `;
  }).join('');

  const content = `
    <header class="plants-header" style="background: linear-gradient(135deg, #4a7c23 0%, #2d5016 100%); color: white; padding: 3rem 2rem; border-radius: 16px; margin-bottom: 3rem;">
      <nav class="breadcrumb" style="margin-bottom: 1.5rem; font-size: 0.875rem; opacity: 0.9;">
        <a href="/" style="color: white; text-decoration: none;">Inicio</a>
        <span class="breadcrumb__separator" style="margin: 0 0.5rem;">›</span>
        <span class="breadcrumb__current">Todas las plantas</span>
      </nav>
      
      <h1 style="font-size: 2.5rem; font-weight: 800; margin: 0 0 1rem 0;">Todas las Plantas</h1>
      <p style="font-size: 1.125rem; line-height: 1.6; margin: 0 0 1rem 0; opacity: 0.9;">
        Explora nuestra completa biblioteca de plantas y flores.
      </p>
      <div style="font-size: 0.875rem; opacity: 0.8; font-weight: 500;">
        ${allPlants.length} artículos
      </div>
    </header>

    <section class="plants-content">
      ${plantsHTML}
    </section>
  `;

  return generateBaseHTML(
    'Todas las Plantas - Plantas y Flores',
    content,
    'Descubre nuestra colección completa de plantas y flores.',
    'https://plantasyflores.com/plantas/'
  );
}

const server = createServer(async (req, res) => {
  try {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    // Route handling
    if (filePath === '/index.html' || filePath === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(generateHomepage());
      return;
    }
    
    if (filePath === '/plantas/' || filePath === '/plantas/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(generatePlantsPage());
      return;
    }
    
    // Category pages: /category/
    const categoryMatch = filePath.match(/^\/([^\/]+)\/$/);
    if (categoryMatch) {
      const categorySlug = categoryMatch[1];
      const categoryPage = generateCategoryPage(categorySlug);
      if (categoryPage) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(categoryPage);
        return;
      }
    }
    
    // Article pages: /category/article/
    const articleMatch = filePath.match(/^\/([^\/]+)\/([^\/]+)\/$/);
    if (articleMatch) {
      const categorySlug = articleMatch[1];
      const articleSlug = articleMatch[2];
      const articlePage = generateArticlePage(categorySlug, articleSlug);
      if (articlePage) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(articlePage);
        return;
      }
    }

    // Handle wp-content/uploads/ paths (map to public/wp-content/uploads/)
    if (filePath.startsWith('/wp-content/uploads/')) {
      const imagePath = filePath.replace('/wp-content/uploads/', '/wp-content/uploads/');
      const fullPath = join(__dirname, 'public', imagePath);
      
      try {
        const stats = await stat(fullPath);
        if (stats.isFile()) {
          const ext = extname(filePath);
          const mimeType = mimeTypes[ext] || 'text/plain';
          
          const content = await readFile(fullPath);
          res.writeHead(200, { 'Content-Type': mimeType });
          res.end(content);
          return;
        }
      } catch (err) {
        // File not found, continue to try other paths
      }
    }

    // Static files - try both public/ and root directory
    let fullPath = join(__dirname, 'public', filePath);
    
    try {
      const stats = await stat(fullPath);
      if (stats.isFile()) {
        const ext = extname(filePath);
        const mimeType = mimeTypes[ext] || 'text/plain';
        
        const content = await readFile(fullPath);
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(content);
        return;
      }
    } catch (err) {
      // Try without public/ prefix
      try {
        fullPath = join(__dirname, filePath.substring(1));
        const stats = await stat(fullPath);
        if (stats.isFile()) {
          const ext = extname(filePath);
          const mimeType = mimeTypes[ext] || 'text/plain';
          
          const content = await readFile(fullPath);
          res.writeHead(200, { 'Content-Type': mimeType });
          res.end(content);
          return;
        }
      } catch (err2) {
        // File not found, continue to 404
      }
    }
    
    // 404
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Page Not Found</h1>');
    
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end('<h1>500 - Server Error</h1>');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Simple server running at http://localhost:${PORT}`);
  console.log(`📱 Test pages:`);
  console.log(`   Homepage: http://localhost:${PORT}/`);
  console.log(`   Category: http://localhost:${PORT}/rosa/`);
  console.log(`   Article:  http://localhost:${PORT}/rosa/princesa-de-monaco/`);
  console.log(`   Archive:  http://localhost:${PORT}/plantas/`);
});