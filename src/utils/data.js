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
  
  // Agregar todas las páginas de categoría (incluso las que no tienen posts)
  categoryPages.forEach(page => {
    if (categoryMap.has(page.slug)) {
      // Actualizar categoría existente con contenido de página
      categoryMap.get(page.slug).data.content = page.data.seo_html;
      categoryMap.get(page.slug).data.main_image = page.data.main_image;
      // Limpiar HTML del excerpt para usar como descripción
      const cleanDescription = page.data.excerpt 
        ? page.data.excerpt.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '').trim()
        : categoryMap.get(page.slug).data.description;
      categoryMap.get(page.slug).data.description = cleanDescription;
    } else {
      // Agregar nueva categoría sin posts
      const categoryName = page.data.title || page.slug.charAt(0).toUpperCase() + page.slug.slice(1);
      const cleanDescription = page.data.excerpt 
        ? page.data.excerpt.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '').trim()
        : `Descubre todo sobre ${categoryName.toLowerCase()}. Guías completas de cultivo, cuidados y consejos.`;
      
      categoryMap.set(page.slug, {
        id: page.slug,
        data: {
          slug: page.slug,
          name: categoryName,
          posts_count: 0,
          description: cleanDescription,
          content: page.data.seo_html,
          main_image: page.data.main_image
        }
      });
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
  const categories = await getCategories();
  const paths = [];
  
  // Generar rutas para plantas normales (con variedades)
  allPlants.forEach(plant => {
    const category = plant.data.categories[0]?.slug || 'plantas';
    paths.push({
      params: { 
        category: category,
        plant: plant.slug 
      },
      props: { plant }
    });
  });
  
  // Generar rutas para categorías sin variedades (como páginas de planta individual)
  categories.forEach(category => {
    if (category.data.posts_count === 0) {
      // Crear una "planta" ficticia usando los datos de la categoría
      const categoryAsPlant = {
        slug: category.id,
        data: {
          id: category.id,
          title: category.data.name,
          date: new Date().toISOString(),
          excerpt: category.data.description,
          featured_image: category.data.main_image || null,
          main_image: category.data.main_image || null,
          categories: [{
            slug: category.id,
            name: category.data.name
          }],
          tags: [],
          seo_html: category.data.content || `<h2>Todo sobre ${category.data.name}</h2><p>${category.data.description}</p>`
        }
      };
      
      paths.push({
        params: { 
          category: category.id,
          plant: 'comun'
        },
        props: { plant: categoryAsPlant }
      });
    }
  });
  
  return paths;
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