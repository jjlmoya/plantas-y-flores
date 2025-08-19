import { getAvailableCalendarCategories, getCategoryPlantsWithCalendar, getGlobalCalendarConfig, getUIHelpers, getAvailableActivities, activityToSlug } from '../utils/calendar-inheritance.js';

export async function GET() {
  const globalConfig = await getGlobalCalendarConfig();
  const ui = getUIHelpers(globalConfig);
  const categories = await getAvailableCalendarCategories();
  const activities = await getAvailableActivities();
  
  const currentDate = new Date().toISOString();
  const baseUrl = 'https://plantasyflores.online';
  
  let urls = [];
  
  // Calendar main page
  urls.push(`
  <url>
    <loc>${baseUrl}/calendario/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);
  
  // Month pages
  for (let month = 1; month <= 12; month++) {
    const monthSlug = ui.getMonthSlug(month);
    urls.push(`
  <url>
    <loc>${baseUrl}/calendario/mes/${monthSlug}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }
  
  // Activity pages
  for (const activity of activities) {
    const activitySlug = activityToSlug(activity);
    urls.push(`
  <url>
    <loc>${baseUrl}/calendario/actividad/${activitySlug}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }
  
  // Category pages and individual plant pages
  for (const category of categories) {
    // Category page
    urls.push(`
  <url>
    <loc>${baseUrl}/calendario/categoria/${category}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
    
    // Individual plant pages in this category
    try {
      const categoryPlants = await getCategoryPlantsWithCalendar(category);
      for (const plant of categoryPlants) {
        urls.push(`
  <url>
    <loc>${baseUrl}/calendario/${category}/${plant.slug}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
      }
    } catch (error) {
      console.warn(`Error loading plants for category ${category}:`, error);
    }
  }
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}