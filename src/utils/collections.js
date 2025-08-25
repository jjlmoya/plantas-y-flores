import { getAvailableCalendarCategories, getCategoryPlantsWithCalendar } from './calendar-inheritance.js';
import fs from 'fs';
import path from 'path';

/**
 * Obtener datos de una planta desde pages.json o posts
 */
async function getPlantData(category, slug) {
  if (slug === 'comun') {
    // Es la categoría base, buscar en pages.json
    const pagesPath = path.join(process.cwd(), 'public', 'data', 'pages.json');
    const pages = JSON.parse(fs.readFileSync(pagesPath, 'utf-8'));
    return pages.find(page => page.slug === category);
  } else {
    // Es una planta específica, buscar en posts
    const postsPath = path.join(process.cwd(), 'public', 'data', 'posts', `${category}.json`);
    if (!fs.existsSync(postsPath)) return null;
    
    const posts = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));
    return posts.find(post => post.slug === slug);
  }
}

/**
 * Obtener configuración de una colección por slug
 */
export async function getCollectionConfig(slug) {
  const collectionsPath = path.join(process.cwd(), 'public', 'data', 'collections.json');
  const collections = JSON.parse(fs.readFileSync(collectionsPath, 'utf-8'));
  
  return collections.find(collection => collection.slug === slug);
}

/**
 * Obtener todas las configuraciones de colecciones
 */
export async function getAllCollections() {
  const collectionsPath = path.join(process.cwd(), 'public', 'data', 'collections.json');
  return JSON.parse(fs.readFileSync(collectionsPath, 'utf-8'));
}

/**
 * Extraer plantas según filtros de colección
 */
export async function getPlantsByFilters(filters) {
  const categories = await getAvailableCalendarCategories();
  const matchingPlants = [];

  for (const category of categories) {
    const categoryPlants = await getCategoryPlantsWithCalendar(category);
    
    for (const plant of categoryPlants) {
      if (plantMatchesFilters(plant, filters)) {
        // Función para formatear nombres de categoría con tildes
        const formatCategoryName = (category) => {
          if (category === 'pina') return 'Piña';
          if (category === 'tulipan') return 'Tulipán';
          if (category === 'oregano') return 'Orégano';
          if (category === 'curcuma') return 'Cúrcuma';
          if (category === 'platano') return 'Plátano';
          if (category === 'azafran') return 'Azafrán';
          return category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ');
        };

        // Función para convertir slug a nombre legible
        const formatPlantName = (slug) => {
          return slug.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
        };

        // Obtener datos reales de la planta desde pages.json o posts
        const plantData = await getPlantData(category, plant.slug);
        
        if (!plantData) continue; // Si no hay datos, saltar esta planta

        const categoryName = formatCategoryName(category);
        let displayName, plantUrl;
        
        if (plant.slug === 'comun') {
          // Es la categoría base - ir a la página de categoría
          displayName = plantData.title || categoryName;
          plantUrl = `/${category}/`;
        } else {
          // Es una planta específica - ir al artículo específico  
          displayName = plantData.title || `${categoryName} ${formatPlantName(plant.slug)}`;
          plantUrl = `/${category}/${plant.slug}/`;
        }

        matchingPlants.push({
          slug: plant.slug,
          name: displayName,
          category: category,
          image: plantData.main_image || plantData.featured_image || `/wp-content/uploads/2017/07/${category}-${plant.slug}.webp`,
          description: plantData.excerpt ? plantData.excerpt.replace(/<[^>]*>/g, '') : `Cultivo de ${displayName} - información completa sobre cuidados y calendario de siembra.`,
          difficulty: plant.calendar.plant_info?.difficulty || 'intermediate',
          waterNeeds: plant.calendar.growing_conditions?.water_needs || 'moderate',
          link: plantUrl,
          badges: generatePlantBadges(plant.calendar),
          plantData: plantData // Para debug si es necesario
        });
      }
    }
  }

  // Aplicar límite si se especifica
  if (filters.limit) {
    return matchingPlants.slice(0, filters.limit);
  }

  return matchingPlants;
}

/**
 * Verificar si una planta coincide con los filtros
 */
function plantMatchesFilters(plant, filters) {
  const calendar = plant.calendar;

  // Filtro por dificultad (basado en plant_info.difficulty)
  if (filters.difficulty) {
    const difficulty = calendar.plant_info?.difficulty || 'intermediate';
    if (!filters.difficulty.includes(difficulty)) {
      return false;
    }
  }

  // Filtro por necesidades de agua (basado en growing_conditions.water_needs)
  if (filters.water_needs) {
    const waterNeeds = calendar.growing_conditions?.water_needs || 'moderate';
    if (!filters.water_needs.includes(waterNeeds)) {
      return false;
    }
  }

  // Filtro por temperatura máxima (resistencia al calor)
  if (filters.temperature_max) {
    const tempRange = calendar.growing_conditions?.temperature_range;
    if (!tempRange || tempRange[1] < filters.temperature_max) {
      return false;
    }
  }

  // Filtro por tolerancia a la sequía
  if (filters.drought_tolerance) {
    const droughtTolerance = calendar.growing_conditions?.drought_tolerance;
    if (!droughtTolerance || !filters.drought_tolerance.includes(droughtTolerance)) {
      return false;
    }
  }

  // Filtro por categorías específicas
  if (filters.categories) {
    if (!filters.categories.includes(plant.category)) {
      return false;
    }
  }

  // Filtro por tags/características específicas
  if (filters.tags) {
    const plantTags = calendar.tags || [];
    const hasMatchingTag = filters.tags.some(tag => plantTags.includes(tag));
    if (!hasMatchingTag) {
      return false;
    }
  }

  // Filtro por plantas aptas para contenedores/macetas
  if (filters.container_suitable !== undefined) {
    const containerSuitable = calendar.cultivation_notes?.container_suitable || calendar.growing_conditions?.container_suitable;
    if (containerSuitable !== filters.container_suitable) {
      return false;
    }
  }

  // Filtro por requerimientos de espacio
  if (filters.space_requirements) {
    const spaceReq = calendar.growing_conditions?.space_requirements;
    if (!spaceReq || !filters.space_requirements.includes(spaceReq)) {
      // También buscar en garden_use si menciona "containers"
      const gardenUse = calendar.garden_use || [];
      const specialPurposes = calendar.special_purposes || [];
      const allUses = [...gardenUse, ...specialPurposes];
      
      const hasContainerMention = allUses.some(use => 
        typeof use === 'string' && use.toLowerCase().includes('container')
      );
      
      if (!hasContainerMention) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Generar badges para una planta según sus características
 */
function generatePlantBadges(calendar) {
  const badges = [];

  if (calendar.plant_info?.difficulty === 'beginner') {
    badges.push('Fácil');
  }

  if (calendar.growing_conditions?.water_needs === 'low') {
    badges.push('Poco riego');
  } else if (calendar.growing_conditions?.water_needs === 'moderate') {
    badges.push('Riego moderado');
  }

  if (calendar.plant_info?.type === 'annual') {
    badges.push('Anual');
  } else if (calendar.plant_info?.type === 'perennial') {
    badges.push('Perenne');
  }

  if (calendar.growing_conditions?.drought_tolerance === 'high' || calendar.growing_conditions?.drought_tolerance === 'very_high') {
    badges.push('Resistente sequía');
  }

  const tempRange = calendar.growing_conditions?.temperature_range;
  if (tempRange && tempRange[1] >= 35) {
    badges.push('Calor extremo');
  }

  if (calendar.growing_conditions?.sun_requirements === 'full_shade' || calendar.growing_conditions?.sun_requirements === 'partial_shade') {
    badges.push('Sombra');
  }

  if (calendar.cultivation_notes?.container_suitable === true || calendar.growing_conditions?.container_suitable === true) {
    badges.push('Apta macetas');
  }

  return badges.slice(0, 2); // Máximo 2 badges por planta
}