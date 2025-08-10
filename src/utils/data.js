import fs from 'fs';
import path from 'path';

// Función para leer y procesar pages.json
export async function getPagesData() {
  const pagesPath = path.join(process.cwd(), 'data', 'pages.json');
  const rawData = fs.readFileSync(pagesPath, 'utf8');
  return JSON.parse(rawData);
}

// Función para obtener todas las plantas (equivalente a getCollection('plants'))
export async function getPlants() {
  const data = await getPagesData();
  
  return data
    .filter(item => item.type === 'post')
    .map(plant => ({
      slug: plant.slug,
      data: {
        id: plant.id,
        title: plant.title,
        date: plant.date,
        excerpt: plant.excerpt,
        featured_image: plant.featured_image,
        main_image: plant.main_image,
        categories: plant.categories,
        tags: plant.tags || [],
        seo_html: plant.seo_html
      }
    }));
}

// Función para obtener plantas por categoría
export async function getPlantsByCategory(categorySlug) {
  const plants = await getPlants();
  
  return plants.filter(plant => 
    plant.data.categories.some(cat => cat.slug === categorySlug)
  );
}

// Función para obtener una planta específica
export async function getPlantBySlug(slug, categorySlug = null) {
  const plants = await getPlants();
  
  return plants.find(plant => 
    plant.slug === slug && 
    (!categorySlug || plant.data.categories.some(cat => cat.slug === categorySlug))
  );
}

// Función para obtener todas las categorías (equivalente a getCollection('categories'))
export async function getCategories() {
  const plants = await getPlants();
  
  // Extraer categorías únicas de las plantas
  const categoryMap = new Map();
  
  plants.forEach(plant => {
    plant.data.categories.forEach(category => {
      if (!categoryMap.has(category.slug)) {
        categoryMap.set(category.slug, {
          id: category.slug,
          data: {
            slug: category.slug,
            name: category.name,
            posts_count: 0
          }
        });
      }
      categoryMap.get(category.slug).data.posts_count++;
    });
  });
  
  return Array.from(categoryMap.values());
}

// Función para obtener estadísticas de categorías
export async function getCategoryStats() {
  const categories = await getCategories();
  
  return categories
    .map(cat => ({
      slug: cat.data.slug,
      name: cat.data.name,
      count: cat.data.posts_count
    }))
    .sort((a, b) => b.count - a.count);
}

// Función para generar rutas estáticas (para getStaticPaths)
export async function generatePlantPaths() {
  const plants = await getPlants();
  
  return plants.map(plant => {
    const category = plant.data.categories[0]?.slug || 'plantas';
    
    return {
      params: { 
        category: category,
        plant: plant.slug 
      },
      props: { plant }
    };
  });
}

export async function generateCategoryPaths() {
  const categories = await getCategories();
  
  return categories.map(category => {
    return {
      params: { 
        category: category.id 
      },
      props: { 
        category: category.data,
        categorySlug: category.id
      }
    };
  });
}