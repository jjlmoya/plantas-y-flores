import { getPlants, getCategories } from '../src/utils/data.js';

export default async function GET({ params, request }) {
  // Prevenir indexación SEO
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Content-Type', 'application/json');

  try {
    const allPlants = await getPlants();
    const allCategories = await getCategories();

    // Combinar plantas y categorías en un solo array
    const allItems = [
      // Añadir todas las plantas
      ...allPlants.map(plant => ({
        type: 'plant',
        title: plant.data.title,
        categoryName: plant.data.categories[0]?.name || '',
        content: plant.data.seo_html,
        excerpt: plant.data.excerpt,
        originalUrl: `https://plantasyflores.online/${plant.data.categories[0]?.slug || 'plantas'}/${plant.slug}/`
      })),
      // Añadir todas las categorías
      ...allCategories.map(category => ({
        type: 'category', 
        title: category.data.name,
        categoryName: '',
        content: category.data.content || '',
        excerpt: category.data.description,
        originalUrl: `https://plantasyflores.online/${category.data.slug}/`
      }))
    ];

    // Generar item random
    const randomIndex = Math.floor(Math.random() * allItems.length);
    const randomItem = allItems[randomIndex];

    // Limpiar HTML del contenido
    const cleanContent = (html) => {
      if (!html) return '';
      return html
        .replace(/<[^>]*>/g, '')
        .replace(/&aacute;/g, 'á')
        .replace(/&eacute;/g, 'é')
        .replace(/&iacute;/g, 'í')
        .replace(/&oacute;/g, 'ó')
        .replace(/&uacute;/g, 'ú')
        .replace(/&ntilde;/g, 'ñ')
        .replace(/&Aacute;/g, 'Á')
        .replace(/&Eacute;/g, 'É')
        .replace(/&Iacute;/g, 'Í')
        .replace(/&Oacute;/g, 'Ó')
        .replace(/&Uacute;/g, 'Ú')
        .replace(/&Ntilde;/g, 'Ñ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#[0-9]+;/g, ' ')
        .trim();
    };

    const response = {
      ...randomItem,
      content: cleanContent(randomItem.content),
      excerpt: cleanContent(randomItem.excerpt)
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error generating random item:', error);
    res.status(500).json({ error: 'Error generating random item' });
  }
}