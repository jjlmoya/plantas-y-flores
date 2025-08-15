export const prerender = false;

import { getPlants, getCategories } from '../../utils/data.js';

export async function GET({ request }) {
  try {
    const allPlants = await getPlants();
    const allCategories = await getCategories();

    // Función para capitalizar título
    const capitalizeTitle = (title) => {
      return title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };

    // Combinar plantas y categorías en un solo array
    const allItems = [
      // Añadir todas las plantas
      ...allPlants.map(plant => {
        const categoryName = plant.data.categories[0]?.name || '';
        const originalTitle = plant.data.title;
        
        // Añadir categoría al título si es planta y capitalizar
        const formattedTitle = categoryName ? 
          `${capitalizeTitle(categoryName)}: ${capitalizeTitle(originalTitle)}` : 
          capitalizeTitle(originalTitle);
        
        return {
          title: formattedTitle,
          content: plant.data.seo_html,
          excerpt: plant.data.excerpt,
          url: `https://plantasyflores.online/${plant.data.categories[0]?.slug || 'plantas'}/${plant.slug}/`
        };
      }),
      // Añadir todas las categorías
      ...allCategories.map(category => ({
        title: capitalizeTitle(category.data.name),
        content: category.data.content || '',
        excerpt: category.data.description,
        url: `https://plantasyflores.online/${category.data.slug}/`
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

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Robots-Tag': 'noindex, nofollow'
      }
    });
  } catch (error) {
    console.error('Error generating random item:', error);
    return new Response(JSON.stringify({ error: 'Error generating random item' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}