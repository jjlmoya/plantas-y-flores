import fs from 'fs';
import path from 'path';

// Función para leer páginas de categorías
export async function getPagesData() {
  const pagesPath = path.join(process.cwd(), 'public', 'data', 'pages.json');
  const rawData = fs.readFileSync(pagesPath, 'utf8');
  return JSON.parse(rawData);
}

// Función para obtener todas las plantas desde archivos por categoría
export async function getPlants() {
  const postsDir = path.join(process.cwd(), 'public', 'data', 'posts');
  const allPlants = [];
  
  // Leer todos los archivos JSON en la carpeta posts
  const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.json'));
  
  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const rawData = fs.readFileSync(filePath, 'utf8');
    const categoryPlants = JSON.parse(rawData);
    
    // Convertir cada planta al formato esperado
    const formattedPlants = categoryPlants.map(plant => ({
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
    
    allPlants.push(...formattedPlants);
  }
  
  return allPlants;
}

// Función optimizada para obtener plantas por categoría (directamente desde archivo)
export async function getPlantsByCategory(categorySlug) {
  if (!categorySlug || typeof categorySlug !== 'string') {
    console.warn('Invalid categorySlug provided:', categorySlug);
    return [];
  }
  
  const filePath = path.join(process.cwd(), 'public', 'data', 'posts', `${categorySlug}.json`);
  
  // Verificar si el archivo existe
  if (!fs.existsSync(filePath)) {
    console.warn(`No se encontró archivo para categoría: ${categorySlug}`);
    return [];
  }
  
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const categoryPlants = JSON.parse(rawData);
    
    if (!Array.isArray(categoryPlants)) {
      console.warn(`Category data is not an array for: ${categorySlug}`);
      return [];
    }
  
    // Convertir al formato esperado
    return categoryPlants.map(plant => ({
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
  } catch (error) {
    console.error(`Error parsing category data for ${categorySlug}:`, error.message);
    return [];
  }
}

// Función para obtener una planta específica
export async function getPlantBySlug(slug, categorySlug = null) {
  if (categorySlug) {
    // Si conocemos la categoría, buscar directamente en su archivo
    const categoryPlants = await getPlantsByCategory(categorySlug);
    return categoryPlants.find(plant => plant.slug === slug);
  } else {
    // Si no conocemos la categoría, buscar en todas
    const allPlants = await getPlants();
    return allPlants.find(plant => plant.slug === slug);
  }
}

// Función para obtener páginas de categorías (solo pages.json)
export async function getCategoryPages() {
  const pages = await getPagesData();
  
  return pages.map(page => ({
    slug: page.slug,
    data: {
      id: page.id,
      title: page.title,
      date: page.date,
      excerpt: page.excerpt,
      seo_html: page.seo_html,
      main_image: page.main_image
    }
  }));
}

// Función para obtener todas las categorías disponibles
export async function getCategories() {
  const postsDir = path.join(process.cwd(), 'public', 'data', 'posts');
  const categoryPages = await getCategoryPages();
  const categoryMap = new Map();
  
  // Obtener categorías desde nombres de archivos
  const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.json'));
  
  for (const file of files) {
    const categorySlug = file.replace('.json', '');
    const filePath = path.join(postsDir, file);
    const rawData = fs.readFileSync(filePath, 'utf8');
    const categoryPlants = JSON.parse(rawData);
    
    // Obtener nombre de categoría del primer post
    const categoryName = categoryPlants.length > 0 && categoryPlants[0].categories && categoryPlants[0].categories.length > 0
      ? categoryPlants[0].categories[0].name
      : categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
    
    categoryMap.set(categorySlug, {
      id: categorySlug,
      data: {
        slug: categorySlug,
        name: categoryName,
        posts_count: categoryPlants.length,
        description: `Descubre todo sobre ${categoryName.toLowerCase()}. Guías completas de cultivo, cuidados y consejos.`
      }
    });
  }
  
  // Agregar contenido de las páginas de categoría
  categoryPages.forEach(page => {
    if (categoryMap.has(page.slug)) {
      categoryMap.get(page.slug).data.content = page.data.seo_html;
      categoryMap.get(page.slug).data.main_image = page.data.main_image;
      // Limpiar HTML del excerpt para usar como descripción
      const cleanDescription = page.data.excerpt 
        ? page.data.excerpt.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '').trim()
        : categoryMap.get(page.slug).data.description;
      categoryMap.get(page.slug).data.description = cleanDescription;
    }
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

// Función para generar rutas estáticas de plantas
export async function generatePlantPaths() {
  const allPlants = await getPlants();
  
  return allPlants.map(plant => {
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

// Función para generar rutas estáticas de categorías
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

// Función helper para obtener lista de categorías disponibles
export async function getAvailableCategories() {
  const postsDir = path.join(process.cwd(), 'public', 'data', 'posts');
  const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.json'));
  return files.map(file => file.replace('.json', ''));
}