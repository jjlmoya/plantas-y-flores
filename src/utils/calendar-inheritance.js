import fs from 'fs';
import path from 'path';
import { getPlants, getCategoryPages } from './data.js';

// Simple in-memory cache to avoid repeated file reads during build
const cache = {
  globalConfig: null,
  categoryPlants: new Map(),
  plantCalendars: new Map(),
  allCategories: null
};

/**
 * Deep merge utility for combining configurations
 * Later objects override earlier ones
 */
function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Load global calendar configuration
 * Contains all available options and enums
 */
export async function getGlobalCalendarConfig() {
  // Return cached config if available
  if (cache.globalConfig) {
    return cache.globalConfig;
  }

  const globalPath = path.join(process.cwd(), 'public', 'data', 'calendar', 'global-config.json');
  
  if (!fs.existsSync(globalPath)) {
    console.warn(`Global calendar configuration not found at: ${globalPath}, using defaults`);
    cache.globalConfig = getDefaultGlobalConfig();
    return cache.globalConfig;
  }
  
  try {
    const rawData = fs.readFileSync(globalPath, 'utf8');
    const config = JSON.parse(rawData);
    
    // Validate required fields
    if (!config.ui_config || !config.month_names || !config.task_definitions) {
      console.warn('Global config missing required fields, merging with defaults');
      cache.globalConfig = { ...getDefaultGlobalConfig(), ...config };
      return cache.globalConfig;
    }
    
    cache.globalConfig = config;
    return config;
  } catch (error) {
    console.error(`Error parsing global calendar config: ${error.message}, using defaults`);
    cache.globalConfig = getDefaultGlobalConfig();
    return cache.globalConfig;
  }
}

// Default configuration fallback
function getDefaultGlobalConfig() {
  return {
    metadata: {
      version: "1.0.0",
      last_updated: new Date().toISOString().split('T')[0]
    },
    month_names: {
      es: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    },
    month_slugs: {
      es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
    },
    task_definitions: [
      "prepare_seedbeds", "transplanting", "moderate_watering", "fertilize", "pest_monitoring", 
      "harvest_early", "harvest_main", "harvest_late", "plant_cleanup"
    ],
    ui_config: {
      category_icons: {
        tomate: "🍅", rosa: "🌹", albahaca: "🌿", default: "🌱"
      },
      activity_colors: {
        sowing: "#48bb78", transplanting: "#4299e1", harvesting: "#ed8936",
        flowering: "#d53f8c", pruning: "#48bb78", planting: "#38b2ac", 
        care: "#48bb78", watering: "#4299e1", fertilizing: "#48bb78",
        pest_monitoring: "#f56565", maintenance: "#718096",
        // Colores específicos para tareas nuevas
        monitor_growth: "#48bb78", remove_mulch: "#f6ad55", fertilize_light: "#48bb78",
        water_moderately: "#4299e1", enjoy_blooms: "#d53f8c", deadhead_spent: "#ed8936",
        allow_foliage_yellow: "#f6ad55", lift_bulbs_optional: "#9f7aea", store_dry: "#805ad5",
        prepare_beds: "#48bb78", mulch_protection: "#38b2ac", reduce_watering: "#4299e1",
        fertilize_seedlings: "#48bb78", water_regularly: "#4299e1", water_content: "#4299e1",
        lift_tubers: "#9f7aea", lifting_time: "#805ad5",
        prepare_winter: "#38b2ac", store_tubers_cool_dry: "#805ad5", mulch: "#38b2ac",
        remove_old_leaves: "#f6ad55", remove_runners: "#ed8936", deadhead_daily: "#ed8936",
        minimal_water: "#4299e1", prepare_supports: "#48bb78", mulch_for_winter: "#38b2ac",
        water_establishment: "#4299e1", enjoy_color_changes: "#d53f8c", 
        monitor_flower_development: "#d53f8c", prepare_coastal_beds: "#48bb78",
        prepare_wet_beds: "#4299e1", water_garden: "#4299e1", water_lightly: "#4299e1",
        minimal_watering: "#4299e1", remove_spent: "#f6ad55", water_base_only: "#4299e1",
        water_carefully: "#4299e1", fertilize_orchid: "#48bb78", increase_watering: "#4299e1",
        monitor_pods: "#48bb78", prepare_soil: "#48bb78", store_cool_dark: "#805ad5",
        store_properly: "#805ad5", water_deeply: "#4299e1", prepare_outdoor: "#48bb78",
        low_water_content: "#4299e1"
      },
    },
    hemispheres: {
      northern: { month_offset: 0 },
      southern: { month_offset: 6 }
    }
  };
}

/**
 * Load base configuration for a plant category
 * Returns empty object if category base config doesn't exist
 */
export async function getCategoryCalendarConfig(category) {
  if (!category || typeof category !== 'string') {
    console.warn('Invalid category parameter provided:', category);
    return {};
  }
  
  const categoryPath = path.join(process.cwd(), 'public', 'data', 'calendar', category, 'index.json');
  
  if (!fs.existsSync(categoryPath)) {
    console.warn(`No base configuration found for category: ${category}`);
    return {};
  }
  
  try {
    const rawData = fs.readFileSync(categoryPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error parsing category config for ${category}:`, error.message);
    return {};
  }
}

/**
 * Resolve article links for a plant/category
 * 1. If plant has 'key' field, look for specific plant article
 * 2. If no plant article found, look for category page
 * 3. If neither found, return null
 */
async function resolveArticleLinks(category, plantSlug, plantConfig) {
  const articleLinks = {
    plant_article: null,
    category_article: null,
    resolved_link: null
  };

  try {
    // Get all available plants and category pages
    const allPlants = await getPlants();
    const categoryPages = await getCategoryPages();

  // 1. Try to find specific plant article using 'key' field
  if (plantConfig.key) {
    const plantArticle = allPlants.find(plant => plant.slug === plantConfig.key);
    if (plantArticle) {
      // Generate relative link: /{category}/{plant-slug}/
      const plantCategory = plantArticle.data.categories?.[0]?.slug || category;
      articleLinks.plant_article = `/${plantCategory}/${plantArticle.slug}/`;
      articleLinks.resolved_link = articleLinks.plant_article;
    }
  }

  // 2. If no plant article found, try category page
  if (!articleLinks.resolved_link) {
    const categoryPage = categoryPages.find(page => page.slug === category);
    if (categoryPage) {
      // Generate relative link: /{category}/
      articleLinks.category_article = `/${category}/`;
      articleLinks.resolved_link = articleLinks.category_article;
    }
  }

  return articleLinks;
  } catch (error) {
    console.error(`Error resolving article links for ${category}/${plantSlug}:`, error.message);
    return articleLinks; // Return empty links on error
  }
}

/**
 * Load specific plant configuration with full inheritance chain and article links
 * Global -> Category -> Plant specific + Auto-resolved article links
 */
export async function getPlantCalendarWithInheritance(category, plantSlug) {
  try {
    // Validate input parameters
    if (!category || !plantSlug) {
      throw new Error(`Invalid parameters: category="${category}", plantSlug="${plantSlug}"`);
    }

    // Check cache first
    const cacheKey = `${category}/${plantSlug}`;
    if (cache.plantCalendars.has(cacheKey)) {
      return cache.plantCalendars.get(cacheKey);
    }

    // 1. Load global configuration (contains all available options)
    const globalConfig = await getGlobalCalendarConfig();
    
    // 2. Load category base configuration
    const categoryConfig = await getCategoryCalendarConfig(category);
    
    // 3. Load plant-specific configuration
    const plantPath = path.join(process.cwd(), 'public', 'data', 'calendar', category, `${plantSlug}.json`);
    
    let plantConfig = {};
    if (fs.existsSync(plantPath)) {
      try {
        const rawData = fs.readFileSync(plantPath, 'utf8');
        plantConfig = JSON.parse(rawData);
      } catch (plantError) {
        console.error(`Error loading plant config for ${category}/${plantSlug}:`, plantError.message);
        // Continue with empty plant config
      }
    } else {
      console.warn(`No specific configuration found for ${category}/${plantSlug}`);
    }
    
    // 4. Apply inheritance: Category -> Plant (global config is reference only)
    const inheritedConfig = deepMerge({}, categoryConfig, plantConfig);
    
    // 5. Resolve article links automatically
    const articleLinks = await resolveArticleLinks(category, plantSlug, plantConfig);
    
    const result = {
      ...inheritedConfig,
      _inheritance: {
        has_global: Object.keys(globalConfig).length > 0,
        has_category: Object.keys(categoryConfig).length > 0,
        has_plant_specific: Object.keys(plantConfig).length > 0,
        category: category,
        plant_slug: plantSlug
      },
      _global_config: globalConfig, // Keep reference for validation
      _article_links: articleLinks // Auto-resolved article links
    };

    // Cache the result
    cache.plantCalendars.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error(`Error in getPlantCalendarWithInheritance for ${category}/${plantSlug}:`, error.message);
    
    // Return minimal fallback configuration
    return {
      _inheritance: {
        has_global: false,
        has_category: false,
        has_plant_specific: false,
        category: category,
        plant_slug: plantSlug,
        error: error.message
      },
      _global_config: await getGlobalCalendarConfig(),
      _article_links: {
        plant_article: null,
        category_article: null,
        resolved_link: null
      }
    };
  }
}

/**
 * Get all plants in a category with their inherited configurations
 */
export async function getCategoryPlantsWithCalendar(category) {
  // Return cached category plants if available
  if (cache.categoryPlants.has(category)) {
    return cache.categoryPlants.get(category);
  }

  const categoryDir = path.join(process.cwd(), 'public', 'data', 'calendar', category);
  
  if (!fs.existsSync(categoryDir)) {
    cache.categoryPlants.set(category, []);
    return [];
  }
  
  const files = fs.readdirSync(categoryDir)
    .filter(file => file.endsWith('.json') && file !== 'index.json');
  
  const plants = [];
  
  // Siempre agregar la variedad "común" usando index.json
  const indexPath = path.join(categoryDir, 'index.json');
  if (fs.existsSync(indexPath)) {
    try {
      const rawData = fs.readFileSync(indexPath, 'utf8');
      const categoryData = JSON.parse(rawData);
      
      plants.push({
        slug: 'comun', // Variedad común disponible para todas las categorías
        category: category,
        calendar: {
          ...categoryData,
          _article_links: {
            resolved_link: `/${category}/`
          }
        }
      });
    } catch (error) {
      console.error(`Error reading category index for ${category}:`, error.message);
    }
  }
  
  // Además, procesar plantas hijas específicas si existen
  for (const file of files) {
    const plantSlug = file.replace('.json', '');
    const plantCalendar = await getPlantCalendarWithInheritance(category, plantSlug);
    plants.push({
      slug: plantSlug,
      category: category,
      calendar: plantCalendar
    });
  }
  
  // Cache the result
  cache.categoryPlants.set(category, plants);
  return plants;
}

/**
 * Find plants by activity in a specific month
 * Supports hemisphere offset (+6 months for southern hemisphere)
 */
export async function findPlantsByMonth(month, activity = 'sowing', hemisphere = 'northern') {
  const globalConfig = await getGlobalCalendarConfig();
  const monthOffset = globalConfig.hemispheres[hemisphere].month_offset;
  const adjustedMonth = ((month - 1 + monthOffset) % 12) + 1;
  
  // Get cached categories list or read from filesystem
  let categories;
  if (cache.allCategories) {
    categories = cache.allCategories;
  } else {
    const calendarDir = path.join(process.cwd(), 'public', 'data', 'calendar');
    
    if (!fs.existsSync(calendarDir)) {
      return [];
    }
    
    categories = fs.readdirSync(calendarDir).filter(dir => {
      const dirPath = path.join(calendarDir, dir);
      return fs.statSync(dirPath).isDirectory();
    });
    
    // Cache the categories list
    cache.allCategories = categories;
  }
  
  const matchingPlants = [];
  
  for (const category of categories) {
    const categoryPlants = await getCategoryPlantsWithCalendar(category);
    
    for (const plant of categoryPlants) {
      if (checkActivityInMonth(plant.calendar, adjustedMonth, activity)) {
        matchingPlants.push({
          category,
          slug: plant.slug,
          calendar: plant.calendar
        });
      }
    }
  }
  
  return matchingPlants;
}

/**
 * Check if a plant has a specific activity in a given month
 */
function checkActivityInMonth(calendar, month, activity) {
  const activities = calendar.calendar_data?.[activity];
  if (!activities) return false;
  
  // For simple activities with direct month arrays
  if (activities.best_months?.includes(month) || activities.alternative_months?.includes(month)) {
    return true;
  }
  
  // For complex activities with sub-types (like sowing: indoor/outdoor)
  for (const [type, data] of Object.entries(activities)) {
    if (typeof data === 'object' && data !== null) {
      if (data.best_months?.includes(month) || data.alternative_months?.includes(month)) {
        return true;
      }
    }
  }
  
  // Check monthly tasks
  const monthlyTasks = calendar.calendar_data?.care_calendar?.monthly_tasks?.[month.toString()];
  if (monthlyTasks && activity === 'care') {
    return monthlyTasks.length > 0;
  }
  
  return false;
}

/**
 * Get tasks for a specific month across all plants
 */
export async function getMonthlyTasks(month, hemisphere = 'northern') {
  const globalConfig = await getGlobalCalendarConfig();
  const monthOffset = globalConfig.hemispheres[hemisphere].month_offset;
  const adjustedMonth = ((month - 1 + monthOffset) % 12) + 1;
  
  const calendarDir = path.join(process.cwd(), 'public', 'data', 'calendar');
  const categories = fs.readdirSync(calendarDir).filter(dir => {
    const dirPath = path.join(calendarDir, dir);
    return fs.statSync(dirPath).isDirectory();
  });
  
  const monthlyTasks = {};
  
  for (const category of categories) {
    const categoryPlants = await getCategoryPlantsWithCalendar(category);
    
    for (const plant of categoryPlants) {
      const tasks = plant.calendar.calendar_data?.care_calendar?.monthly_tasks?.[adjustedMonth.toString()];
      if (tasks && tasks.length > 0) {
        if (!monthlyTasks[category]) {
          monthlyTasks[category] = {};
        }
        monthlyTasks[category][plant.slug] = tasks;
      }
    }
  }
  
  return monthlyTasks;
}

/**
 * Get all available categories with calendar data
 */
export async function getAvailableCalendarCategories() {
  const calendarDir = path.join(process.cwd(), 'public', 'data', 'calendar');
  
  if (!fs.existsSync(calendarDir)) {
    return [];
  }
  
  return fs.readdirSync(calendarDir).filter(dir => {
    if (dir === 'global-config.json') return false;
    const dirPath = path.join(calendarDir, dir);
    return fs.statSync(dirPath).isDirectory();
  });
}

/**
 * Apply hemisphere offset to month numbers
 * Northern hemisphere: no change
 * Southern hemisphere: +6 months (wrapping at 12)
 */
function applyHemisphereOffset(months, hemisphere = 'northern') {
  if (!months || !Array.isArray(months)) return months;
  
  if (hemisphere === 'southern') {
    return months.map(month => {
      const adjusted = month + 6;
      return adjusted > 12 ? adjusted - 12 : adjusted;
    });
  }
  
  return months;
}

/**
 * Apply hemisphere offset to calendar data
 */
export function applyHemisphereToCalendarData(calendarData, hemisphere = 'northern') {
  if (!calendarData || hemisphere === 'northern') {
    return calendarData;
  }
  
  const adjustedData = JSON.parse(JSON.stringify(calendarData)); // Deep clone
  
  // Apply hemisphere offset to all month arrays in calendar_data
  if (adjustedData.calendar_data) {
    const calendar = adjustedData.calendar_data;
    
    // Sowing months
    if (calendar.sowing?.indoor?.best_months) {
      calendar.sowing.indoor.best_months = applyHemisphereOffset(
        calendar.sowing.indoor.best_months, 
        hemisphere
      );
    }
    if (calendar.sowing?.outdoor?.best_months) {
      calendar.sowing.outdoor.best_months = applyHemisphereOffset(
        calendar.sowing.outdoor.best_months, 
        hemisphere
      );
    }
    
    // Other activities
    const activities = ['transplanting', 'harvesting', 'flowering', 'planting', 'pruning'];
    activities.forEach(activity => {
      if (calendar[activity]?.best_months) {
        calendar[activity].best_months = applyHemisphereOffset(
          calendar[activity].best_months, 
          hemisphere
        );
      }
      if (calendar[activity]?.peak_months) {
        calendar[activity].peak_months = applyHemisphereOffset(
          calendar[activity].peak_months, 
          hemisphere
        );
      }
      if (calendar[activity]?.alternative_months) {
        calendar[activity].alternative_months = applyHemisphereOffset(
          calendar[activity].alternative_months, 
          hemisphere
        );
      }
    });
    
    // Monthly tasks - more complex as keys are month numbers
    if (calendar.care_calendar?.monthly_tasks) {
      const originalTasks = calendar.care_calendar.monthly_tasks;
      const adjustedTasks = {};
      
      Object.entries(originalTasks).forEach(([monthStr, tasks]) => {
        const month = parseInt(monthStr);
        const adjustedMonth = applyHemisphereOffset([month], hemisphere)[0];
        adjustedTasks[adjustedMonth.toString()] = tasks;
      });
      
      calendar.care_calendar.monthly_tasks = adjustedTasks;
    }
  }
  
  return adjustedData;
}

/**
 * Get user's hemisphere preference from localStorage or browser
 */
export function getUserHemisphere() {
  if (typeof window === 'undefined') return 'northern';
  
  // Check localStorage first
  const saved = localStorage.getItem('calendar-hemisphere');
  if (saved && ['northern', 'southern'].includes(saved)) {
    return saved;
  }
  
  // Try to detect from timezone (rough estimation)
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const southernZones = [
      'Australia/', 'Pacific/Auckland', 'Pacific/Fiji', 
      'America/Argentina', 'America/Sao_Paulo', 'America/Santiago',
      'Africa/Johannesburg', 'Indian/Mauritius'
    ];
    
    const isSouthern = southernZones.some(zone => timezone.includes(zone));
    return isSouthern ? 'southern' : 'northern';
  } catch (error) {
    console.warn('Could not detect hemisphere from timezone:', error);
    return 'northern';
  }
}

/**
 * Save hemisphere preference
 */
export function setUserHemisphere(hemisphere) {
  if (typeof window === 'undefined') return;
  
  if (!['northern', 'southern'].includes(hemisphere)) {
    console.warn('Invalid hemisphere:', hemisphere);
    return;
  }
  
  localStorage.setItem('calendar-hemisphere', hemisphere);
  
  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent('hemisphere-changed', {
    detail: { hemisphere }
  }));
}

/**
 * Get UI configuration helpers from global config
 */
export function getUIHelpers(globalConfig) {
  const uiConfig = globalConfig.ui_config || {};
  
  return {
    getCategoryIcon: (category) => {
      return uiConfig.category_icons?.[category] || uiConfig.category_icons?.default || '🌱';
    },
    getTaskIcon: (task) => {
      return uiConfig.task_icons?.[task] || uiConfig.task_icons?.default || '•';
    },
    getTaskPriority: (task) => {
      return uiConfig.task_priorities?.[task] || 'normal';
    },
    getActivityColor: (activity) => {
      return uiConfig.activity_colors?.[activity] || '#718096';
    },
    getMonthName: (monthNumber, language = 'es') => {
      const monthNames = globalConfig.month_names?.[language] || [];
      return monthNames[monthNumber - 1] || `Month ${monthNumber}`;
    },
    getMonthNumber: (monthName, language = 'es') => {
      const monthNames = globalConfig.month_names?.[language] || [];
      const index = monthNames.findIndex(name => name.toLowerCase() === monthName.toLowerCase());
      return index !== -1 ? index + 1 : null;
    },
    getMonthSlug: (monthNumber, language = 'es') => {
      const monthNames = globalConfig.month_names?.[language] || [];
      const monthName = monthNames[monthNumber - 1];
      return monthName ? monthName.toLowerCase() : null;
    },
    getSeasonalTips: (monthNumber) => {
      return globalConfig.seasonal_tips?.[monthNumber.toString()] || {};
    },
    formatTaskName: (task) => {
      // Translations for common activities
      const translations = {
        'sowing': 'Siembra',
        'transplanting': 'Trasplante', 
        'harvesting': 'Cosecha',
        'flowering': 'Floración',
        'planting': 'Plantación',
        'pruning': 'Poda',
        'watering': 'Riego',
        'fertilizing': 'Fertilización',
        'weeding': 'Deshierbe',
        'mulching': 'Acolchado',
        'prepare_seedbeds': 'Preparar Semilleros',
        'transplant': 'Trasplante',
        'install_supports': 'Instalar Soportes',
        'moderate_watering': 'Riego Moderado',
        'heavy_watering': 'Riego Abundante',
        'prune_shoots': 'Podar Brotes',
        'prune_main': 'Poda Principal',
        'deadhead': 'Eliminar Flores Marchitas',
        'fertilize': 'Fertilizar',
        'pest_monitoring': 'Monitoreo de Plagas',
        'harvest_early': 'Cosecha Temprana',
        'harvest_main': 'Cosecha Principal',
        'harvest_late': 'Cosecha Tardía',
        'plant_cleanup': 'Limpieza de Plantas',
        'water_restriction': 'Restricción de Riego',
        'thinning': 'Raleo',
        'pinching': 'Despunte',
        'staking': 'Entutorado',
        'soil_preparation': 'Preparación del Suelo',
        'shape_tree': 'Dar Forma al Árbol',
        'dormant_protection': 'Protección Durante Latencia',
        'harvest_young_leaves': 'Cosechar Hojas Jóvenes',
        'harvest_leaves': 'Cosechar Hojas',
        'harvest_calyces': 'Cosechar Cálices',
        'adobo_aceitunas': 'Adobo de Aceitunas',
        'extraccion_aceites': 'Extracción de Aceites',
        'staking': 'Entutorado',
        'pinching': 'Despunte',
        // Plant types
        'annual': 'Anual',
        'perennial': 'Perenne',
        'perennial_bulb': 'Bulbo Perenne',
        'perennial_tree': 'Árbol Perenne',
        'perennial_palm': 'Palmera Perenne',
        'perennial_rhizome': 'Rizoma Perenne',
        'perennial_shrub': 'Arbusto Perenne',
        'perennial_evergreen_shrub': 'Arbusto Perenne de Hoja Perenne',
        'upright_spreading': 'Erecto Expandido',
        'upright_bushy': 'Erecto Arbustivo',
        'annual_biennial': 'Anual/Bienal',
        'taproot': 'Raíz Pivotante',
        'deciduous_tree': 'Árbol Caducifolio',
        'biennial': 'Bienal',
        'shrub': 'Arbusto',
        // Difficulty levels
        'beginner': 'Principiante',
        'intermediate': 'Intermedio',
        'advanced': 'Avanzado',
        'expert': 'Experto',
        // Soil types
        'well_drained': 'Bien Drenado',
        'well_drained_fertile': 'Bien Drenado y Fértil',
        'sandy': 'Arenoso',
        'sandy_loam': 'Franco Arenoso',
        'clay': 'Arcilloso',
        'clay_loam': 'Franco Arcilloso',
        'organic_rich': 'Rico en Orgánicos',
        'acidic': 'Ácido',
        'alkaline': 'Alcalino',
        'neutral': 'Neutro',
        'poor': 'Pobre',
        'rocky': 'Rocoso',
        'moist': 'Húmedo',
        'dry': 'Seco',
        'fertile': 'Fértil',
        'rich_organic': 'Rico en Materia Orgánica',
        'moist_well_drained': 'Húmedo Bien Drenado',
        'sandy_well_drained': 'Arenoso Bien Drenado',
        'deep_loose_sandy': 'Arenoso Profundo y Suelto',
        // Sun requirements
        'full_sun': 'Pleno Sol',
        'partial_sun': 'Sol Parcial',
        'partial_shade': 'Sombra Parcial',
        'full_shade': 'Sombra Completa',
        'full_sun_partial_shade': 'Sol Directo - Sombra Parcial',
        // Water needs
        'low': 'Bajo',
        'moderate': 'Moderado',
        'moderate_high': 'Moderado a alto',
        'moderate_to_high': 'Moderado a alto',
        'high': 'Alto',
        'very_low': 'Muy Bajo',
        'very_high': 'Muy Alto',
        // Special purposes and characteristics
        'container': 'Cultivo en Maceta',
        'hanging_baskets': 'Cestas Colgantes',
        'continuous_harvest': 'Cosecha Continua',
        'companion_benefit': 'Planta Compañera',
        'culinary': 'Culinario',
        'versatile_cooking': 'Cocina Versátil',
        'commercial': 'Cultivo Comercial',
        'attracts_pollinators': 'Atrae Polinizadores',
        'repels_insects': 'Repele Insectos',
        'ground_cover': 'Cubresuelos',
        'windbreak': 'Cortavientos',
        'privacy_screen': 'Pantalla de Privacidad',
        'nitrogen_fixing': 'Fija Nitrógeno',
        'pest_deterrent': 'Disuasivo de Plagas',
        'color_enhancement': 'Mejora el Color',
        'flavor_intensification': 'Intensifica el Sabor',
        // Growth habits
        'indeterminate': 'Crecimiento Indeterminado',
        'determinate': 'Crecimiento Determinado',
        'bushy': 'Arbustivo',
        'climbing': 'Trepador',
        'trailing': 'Rastrero',
        'upright': 'Vertical',
        'spreading': 'Extendido',
        'compact': 'Compacto',
        'dense_shrub': 'Arbusto Denso',
        'low_spreading': 'Rastrero Extendido',
        'clumping': 'En Macolla',
        'rosette': 'En Roseta',
        'Low Growing': 'Crecimiento Bajo',
        'low_growing': 'Crecimiento Bajo',
        'Upright Bushy': 'Arbustivo Vertical',
        'upright_bushy': 'Arbustivo Vertical',
        'Upright Clumping': 'En Macolla Vertical',
        'upright_clumping': 'En Macolla Vertical',
        'Shrubby': 'Arbustivo',
        'shrubby': 'Arbustivo',
        'Medium Tall': 'Altura Media',
        'medium_tall': 'Altura Media',
        'Tall': 'Alto',
        'tall': 'Alto',
        'Compact Tree': 'Árbol Compacto',
        'compact_tree': 'Árbol Compacto',
        'Large Tree': 'Árbol Grande',
        'large_tree': 'Árbol Grande',
        'Medium Tree': 'Árbol Mediano',
        'medium_tree': 'Árbol Mediano',
        'medium_high': 'Altura Media',
        // Nutrientes específicos
        'vitamina_k': 'Vitamina K',
        'vitamina_c': 'Vitamina C',
        'vitamina_a': 'Vitamina A',
        'hierro': 'Hierro',
        'calcio': 'Calcio',
        'antioxidantes': 'Antioxidantes',
        'fibra': 'Fibra',
        'folato': 'Folato',
        'potasio': 'Potasio',
        'antocianinas': 'Antocianinas',
        // Nutritional data
        'healthy_fats': 'Grasas Saludables',
        'fiber': 'Fibra',
        'vitamin_K': 'Vitamina K',
        'vitamin_E': 'Vitamina E',
        'vitamin_C': 'Vitamina C',
        'vitamin_A': 'Vitamina A',
        'folate': 'Folato',
        'magnesium': 'Magnesio',
        'beta_carotene': 'Beta-caroteno',
        'extremely_high': 'Extremadamente Alto',
        'very_high': 'Muy Alto',
        'high': 'Alto',
        'moderate': 'Moderado',
        'low': 'Bajo',
        'low_moderate': 'Bajo a Moderado',
        'moderate_consistent': 'Moderado y Constante',
        'potassium': 'Potasio',
        'calcium': 'Calcio',
        // Health benefits
        'heart_health': 'Salud Cardiovascular',
        'weight_management': 'Control de Peso',
        'nutrient_absorption': 'Absorción de Nutrientes',
        'eye_health': 'Salud Ocular',
        'anti_inflammatory': 'Antiinflamatorio',
        'cholesterol_reduction': 'Reducción del Colesterol',
        'immune_system': 'Sistema Inmunológico',
        'skin_health': 'Salud de la Piel',
        'antioxidant_properties': 'Propiedades Antioxidantes',
        'memory_enhancement': 'Mejora de la Memoria',
        'throat_soothing': 'Alivio de Garganta',
        // Flavor profiles
        'creamy_mild_nutty': 'Cremoso, Suave y Avellanado',
        'sweet_earthy': 'Dulce y Terroso',
        'sweet_metallic_hay_like': 'Dulce, Metálico y Herbáceo',
        'sweet_nutty_earthy': 'Dulce, Avellanado y Terroso',
        'citrusy_fresh_pungent': 'Cítrico, Fresco y Picante',
        // Missing nutritional translations
        'potassium': 'Potasio',
        'healthy_fats': 'Grasas Saludables',
        'fiber': 'Fibra',
        'vitamin_K': 'Vitamina K', 
        'vitamin_E': 'Vitamina E',
        'vitamin_C': 'Vitamina C',
        'folate': 'Folato',
        'magnesium': 'Magnesio',
        'heart_health': 'Salud Cardiovascular',
        'weight_management': 'Control de Peso', 
        'nutrient_absorption': 'Absorción de Nutrientes',
        'eye_health': 'Salud Ocular',
        'anti_inflammatory': 'Antiinflamatorio',
        'cholesterol_reduction': 'Reducción del Colesterol',
        // Flower sizes
        'small': 'Pequeña',
        'medium': 'Mediana',
        'large': 'Grande',
        'extra_large': 'Extra Grande',
        // Flower colors
        'cream': 'Crema',
        'pendant_fringed': 'Colgante Flecos',
        // Flower shapes
        'daisy': 'Margarita',
        'funnel_shaped': 'Embudo',
        'spike': 'Espiga',
        'orchid': 'Orquídea',
        'lily_flowered': 'Forma de Lirio',
        'single_late': 'Simple Tardía',
        'pineapple_spike': 'Espiga de Piña',
        'dense_spike': 'Espiga Densa',
        // Preservation methods
        'oil_infusion': 'Infusión en Aceite',
        'drying': 'Secado',
        'freezing': 'Congelación',
        'canning': 'Enlatado',
        'dehydrating': 'Deshidratación',
        'pickling': 'Encurtido',
        'fermentation': 'Fermentación',
        'cure': 'Curado',
        'dry': 'Seco',
        'extract': 'Extracto',
        // Harvest indicators
        'aroma': 'Aroma',
        'full_bloom': 'Floración Completa',
        'color_change': 'Cambio de Color',
        'size': 'Tamaño',
        'firmness': 'Firmeza',
        // Avoid plants
        'trees_shallow_roots': 'Árboles de Raíces Superficiales',
        'arboles_raices_superficiales': 'Árboles de Raíces Superficiales',
        'vegetables_heavy_feeders': 'Verduras de Alto Consumo de Nutrientes',
        'verduras_alto_consumo': 'Verduras de Alto Consumo',
        'aggressive_spreaders': 'Plantas Invasivas',
        // Plant names for companion planting
        'iris': 'Iris',
        // Fragrance levels
        'very_strong': 'Muy Fuerte',
        'mild_sweet': 'Suave Dulce',
        'mild_citrus': 'Cítrico Suave',
        'chocolate': 'Chocolate',
        // Bloom duration
        '3_weeks': '3 Semanas',
        '4_weeks': '4 Semanas',
        // Special purposes
        'fresh_eating': 'Consumo Fresco',
        'slicing': 'Para Cortar',
        'gourmet': 'Gourmet',
        // Uses
        'fiber_production': 'Producción de Fibra',
        'ornamental': 'Ornamental',
        'seeds': 'Semillas',
        // Tasks
        'harvest_petals': 'Cosechar Pétalos',
        // Special purposes
        'companion_benefit': 'Beneficio como Planta Compañera',
        'pest_control': 'Control de Plagas',
        'soil_improvement': 'Mejora del Suelo',
        'pollinator_attraction': 'Atracción de Polinizadores',
        // Origins (common ones)
        'mediterranean': 'Mediterráneo',
        'tropical': 'Tropical',
        'temperate': 'Templado',
        'subtropical': 'Subtropical',
        'native': 'Nativo',
        // Additional terms
        'acidic': 'Ácido',
        'alkaline': 'Alcalino',
        'afternoon_shade': 'Sombra de Tarde',
        'morning_sun': 'Sol de Mañana',
        'evening_sun': 'Sol de Tarde',
        'indoor': 'Interior',
        'outdoor': 'Exterior',
        'container': 'Contenedor',
        // Nuevas traducciones faltantes
        'monitor_growth': 'Monitorear Crecimiento',
        'remove_mulch': 'Retirar Acolchado',
        'fertilize_light': 'Fertilización Ligera',
        'water_moderately': 'Regar Moderadamente',
        'enjoy_blooms': 'Disfrutar Flores',
        'deadhead_spent': 'Eliminar Flores Pasadas',
        'allow_foliage_yellow': 'Permitir Amarilleo',
        'lift_bulbs_optional': 'Levantar Bulbos (Opcional)',
        'store_dry': 'Almacenar en Seco',
        'prepare_beds': 'Preparar Canteros',
        'mulch_protection': 'Protección con Acolchado',
        'reduce_watering': 'Reducir Riego',
        'ground': 'Suelo',
        'greenhouse': 'Invernadero',
        'minimal_care': 'Cuidado Mínimo',
        'windbreak_check': 'Revisión de Rompevientos',
        // Términos adicionales encontrados en JSONs
        'fertilize_seedlings': 'Fertilizar Plántulas',
        'water_regularly': 'Regar Regularmente',
        'water_content': 'Contenido de Agua',
        'lift_tubers': 'Levantar Tubérculos',
        'lifting_time': 'Tiempo de Levantado',
        'prepare_winter': 'Preparar Invierno',
        'store_tubers_cool_dry': 'Almacenar Tubérculos Fresco y Seco',
        'mulch': 'Acolchar',
        'remove_old_leaves': 'Eliminar Hojas Viejas',
        'remove_runners': 'Eliminar Estolones',
        'deadhead_daily': 'Eliminar Flores Diariamente',
        'minimal_water': 'Riego Mínimo',
        'prepare_supports': 'Preparar Soportes',
        'mulch_for_winter': 'Acolchar para Invierno',
        'water_establishment': 'Riego de Establecimiento',
        'enjoy_color_changes': 'Disfrutar Cambios de Color',
        'monitor_flower_development': 'Monitorear Desarrollo Floral',
        'prepare_coastal_beds': 'Preparar Canteros Costeros',
        'prepare_wet_beds': 'Preparar Canteros Húmedos',
        'water_garden': 'Jardín Acuático',
        'water_lightly': 'Regar Ligeramente',
        'minimal_watering': 'Riego Mínimo',
        'remove_spent': 'Eliminar Gastadas',
        'water_base_only': 'Regar Solo la Base',
        'water_carefully': 'Regar Cuidadosamente',
        'fertilize_orchid': 'Fertilizar Orquídea',
        'increase_watering': 'Aumentar Riego',
        'monitor_pods': 'Monitorear Vainas',
        'prepare_soil': 'Preparar Suelo',
        'store_cool_dark': 'Almacenar Fresco y Oscuro',
        'store_properly': 'Almacenar Adecuadamente',
        
        // Nuevas traducciones para lavandas y otras plantas
        'well_drained_sandy': 'Bien Drenado Arenoso',
        'well_drained_rocky': 'Bien Drenado Rocoso',
        'well_drained_fertile': 'Bien Drenado y Fértil',
        'excellent': 'Excelente',
        'good': 'Bueno',
        'very_high': 'Muy Alto',
        'plants_alta_humedad': 'Plantas de Alta Humedad',
        'plantas_exceso_humedad': 'Plantas de Exceso de Humedad',
        
        // Fragrance types
        'strong': 'Fuerte',
        'mild_citrus': 'Suave Cítrico',
        
        // Flower shapes
        'spike': 'Espiga',
        'pineapple_spike': 'Espiga de Piña',
        'dense_spike': 'Espiga Densa',
        'funnel_shaped': 'Embudo',
        'orchid': 'Orquídea',
        
        // Colors
        'purple': 'Púrpura',
        'blue': 'Azul',
        'white': 'Blanco',
        'pink': 'Rosa',
        'green': 'Verde',
        'yellow_green': 'Verde Amarillento',
        
        // Bloom duration
        '8_weeks': '8 semanas',
        '10_weeks': '10 semanas',
        '12_weeks': '12 semanas',
        
        // Preservation methods
        'oil_distillation': 'Destilación de Aceite',
        'sachets': 'Saquitos',
        'potpourri': 'Popurrí',
        'fresh_arrangements': 'Arreglos Frescos',
        
        // Aromatherapy properties
        'relajante': 'Relajante',
        'antiseptico': 'Antiséptico',
        'antiinflamatorio': 'Antiinflamatorio',
        'expectorante': 'Expectorante',
        'sedante': 'Sedante',
        'citrus_fresh': 'Fresco Cítrico',
        'energizante': 'Energizante',
        
        // Uses
        'aceites_esenciales': 'Aceites Esenciales',
        'infusiones': 'Infusiones',
        'repelente_insectos': 'Repelente de Insectos',
        'banos_relajantes': 'Baños Relajantes',
        'aromaterapia': 'Aromaterapia',
        'decoracion': 'Decoración',
        
        // Therapeutic benefits
        'reduce_estres': 'Reduce Estrés',
        'mejora_sueno': 'Mejora Sueño',
        'alivia_dolores': 'Alivia Dolores',
        
        // Culinary
        'flores': 'Flores',
        'hojas_jovenes': 'Hojas Jóvenes',
        'condimento': 'Condimento',
        'miel': 'Miel',
        'postres': 'Postres',
        'floral_herbal': 'Floral Herbal',
        'intenso_alcanforado': 'Intenso Alcanforado',
        
        // Medicinal
        'insomnio': 'Insomnio',
        'ansiedad': 'Ansiedad',
        'heridas_menores': 'Heridas Menores',
        'dolores_cabeza': 'Dolores de Cabeza',
        'problemas_respiratorios': 'Problemas Respiratorios',
        'heridas': 'Heridas',
        'linalool': 'Linalol',
        'linalyl_acetate': 'Acetato de Linalilo',
        'camphor': 'Alcanfor',
        'cineole': 'Cineol',
        'infusion': 'Infusión',
        'aceite_esencial': 'Aceite Esencial',
        'tintura': 'Tintura',
        'cataplasma': 'Cataplasma',
        // Coco specific uses and benefits
        'agua_fresca': 'Agua Fresca',
        'leche_de_coco': 'Leche de Coco',
        'aceite_cocinar': 'Aceite para Cocinar',
        'copra': 'Copra',
        'pulpa_fresca': 'Pulpa Fresca',
        'agua_de_coco': 'Agua de Coco',
        'aceite_de_coco': 'Aceite de Coco',
        'none': 'Ninguno',
        'sweet_nutty_tropical': 'Dulce, Avellanado y Tropical',
        'creamy_fibrous': 'Cremoso y Fibroso',
        'reposteria': 'Repostería',
        'curry': 'Curry',
        'oil_extraction': 'Extracción de Aceite',
        'fresh_room_temp': 'Fresco a Temperatura Ambiente',
        'refrigerated_water': 'Refrigerado en Agua',
        'dried_copra': 'Copra Seca',
        'brown_husk': 'Cáscara Marrón',
        'water_sound_test': 'Prueba de Sonido del Agua',
        'size_maturity': 'Tamaño de Madurez',
        'size_mature': 'Tamaño Maduro',
        'color_developed': 'Color Desarrollado',
        'when_husk_browns_water_sounds': 'Cuando la Cáscara se Vuelve Marrón y el Agua Suena',
        'manganese': 'Manganeso',
        // Cúrcuma específico
        'curcumin': 'Curcumina',
        'earthy_spicy_bitter': 'Terroso, Especiado y Amargo',
        'fibrous_fresh_powdery_dry': 'Fibroso Fresco, Polvoroso Seco',
        'golden_milk': 'Leche Dorada',
        'seasoning': 'Condimento',
        'medicinal_paste': 'Pasta Medicinal',
        'grinding': 'Molido',
        'pickling': 'Encurtido',
        'mature_size': 'Tamaño Maduro',
        'yellow_interior': 'Interior Amarillo',
        'firm_rhizomes': 'Rizomas Firmes',
        'rhizome': 'Rizoma',
        'powder': 'Polvo',
        'cosmetic': 'Cosmético',
        'dye': 'Tinte',
        'fresh_refrigerated': 'Fresco Refrigerado',
        'dried_powder': 'Polvo Seco',
        'frozen_whole': 'Congelado Entero',
        'after_foliage_yellows': 'Después del Amarilleo del Follaje',
        'autumn_winter': 'Otoño-Invierno',
        // Goji específico  
        'sweet_tart_slightly_salty': 'Dulce, Ácido y Ligeramente Salado',
        'chewy_dried_soft_fresh': 'Masticable Seco, Suave Fresco',
        'snacks': 'Aperitivos',
        'smoothies': 'Batidos',
        'granola': 'Granola',
        'trail_mix': 'Mezcla de Frutos Secos',
        'juice_extraction': 'Extracción de Jugo',
        'bright_red_color': 'Color Rojo Brillante',
        'firm_berries': 'Bayas Firmes',
        'easy_picking': 'Fácil Recolección',
        'berries': 'Bayas',
        'dried_fruit': 'Fruta Seca',
        'late_summer_autumn': 'Final de Verano-Otoño',
        'nutritional_supplement': 'Suplemento Nutricional',
        'dried_room_temp': 'Seco a Temperatura Ambiente',
        'when_fully_red_ripe': 'Cuando Esté Completamente Rojo y Maduro',
        'energy_boost': 'Aumento de Energía',
        // Laurel específico
        'aromatic_slightly_bitter_pungent': 'Aromático, Ligeramente Amargo y Picante',
        'tough_aromatic': 'Resistente y Aromático',
        'stews': 'Guisos',
        'soups': 'Sopas',
        'marinades': 'Marinados',
        'rice_dishes': 'Platos de Arroz',
        'meat_cooking': 'Cocinar Carnes',
        'oil_infusion': 'Infusión en Aceite',
        'mature_leaves': 'Hojas Maduras',
        'dark_green_color': 'Color Verde Oscuro',
        'strong_aroma': 'Aroma Fuerte',
        'leaves': 'Hojas',
        'fresh_leaves': 'Hojas Frescas',
        'dried_leaves': 'Hojas Secas',
        'aromatherapy': 'Aromaterapia',
        'dried_airtight': 'Seco Hermético',
        'oil_preserved': 'Conservado en Aceite',
        'mature_leaves_preferred': 'Preferible Hojas Maduras',
        'respiratory_health': 'Salud Respiratoria',
        'well_drained_humus_rich': 'Bien Drenado Rico en Humus',
        // Martagon específico
        'turban_reflexed_petals': 'Pétalos Recurvados en Turbante',
        '3_4_weeks': '3-4 Semanas',
        '10_50_per_stem': '10-50 por Tallo',
        '7_10_days': '7-10 Días',
        'bulbous_tall': 'Bulboso Alto',
        'moist_fertile': 'Húmedo y Fértil',
        // Menta específico
        'fresh_minty_cooling': 'Fresco, Mentolado y Refrescante',
        'tender_aromatic': 'Tierno y Aromático',
        'mojito': 'Mojito',
        'medicinal_infusions': 'Infusiones Medicinales',
        'fresh_storage': 'Almacenamiento Fresco',
        'young_tender_leaves': 'Hojas Jóvenes y Tiernas',
        'before_flowering': 'Antes de la Floración',
        'morning_harvest': 'Cosecha Matutina',
        'spring_summer_autumn': 'Primavera-Verano-Otoño',
        'frozen_cubes': 'Cubos Congelados',
        'early_morning_optimal': 'Temprano en la Mañana es Óptimo',
        'menthol': 'Mentol',
        'cooling_effect': 'Efecto Refrescante',
        'antimicrobial': 'Antimicrobiano',
        'divide_plants': 'Dividir Plantas',
        // Narciso específico
        'trumpet_cup': 'Copa de Trompeta',
        '3_weeks': '3 Semanas',
        'bulbous': 'Bulboso',
        // Orégano específico
        'morning_after_dew': 'Por la Mañana Después del Rocío',
        'small_clusters': 'Racimos Pequeños',
        '8_weeks': '8 Semanas',
        'pungent_aromatic': 'Picante y Aromático',
        'before_flowering_peak_flavor': 'Antes de la Floración para Máximo Sabor',
        'pungent_aromatic_earthy': 'Picante, Aromático y Terroso',
        'small_dried_leaves': 'Hojas Pequeñas Secas',
        'meat_seasoning': 'Condimento para Carnes',
        'before_flowering': 'Antes de la Floración',
        'morning_harvest': 'Cosecha Matutina',
        'dry_conditions': 'Condiciones Secas',
        'morning_after_dew_evaporated': 'Por la Mañana Después que se Evapore el Rocío',
        
        
        // Garden/landscape
        'borders': 'Bordes',
        'rock_gardens': 'Jardines de Rocas',
        'containers': 'Contenedores',
        'abejas': 'Abejas',
        'mariposas': 'Mariposas',
        
        // Conservation
        'uncommon': 'Poco Común',
        
        // Nuevas traducciones para amapolas
        'none': 'Ninguna',
        'cup_shaped': 'Forma de Copa',
        'large_cup_shaped': 'Copa Grande',
        'papery_delicate': 'Papel Delicado',
        'silky_smooth': 'Sedoso Suave',
        'delicate_striped': 'Delicada Rayada',
        '6_weeks': '6 semanas',
        '4_weeks': '4 semanas',
        '16_weeks': '16 semanas',
        'well_drained_poor': 'Bien Drenado Pobre',
        'very_low': 'Muy Bajo',
        'plantas_competitivas': 'Plantas Competitivas',
        'plantas_riego_frecuente': 'Plantas de Riego Frecuente',
        'plantas_competencia_raices': 'Plantas de Competencia de Raíces',
        'plantas_agresivas': 'Plantas Agresivas',
        
        // Soil and sun requirements
        'full_sun_morning_shade': 'Pleno Sol con Sombra Matutina',
        'moderate_spring_low_summer': 'Moderado Primavera, Bajo Verano',
        'winter_hardiness': 'Resistencia Invernal',
        'very_high': 'Muy Alto',
        
        // Flower colors
        'red': 'Rojo',
        'orange': 'Naranja',
        'yellow': 'Amarillo',
        'salmon': 'Salmón',
        // Flavor profiles
        'sweet_smoky': 'Dulce Ahumado',
        'rich_concentrated': 'Rico Concentrado',
        'sweet_concentrated': 'Dulce Concentrado',
        // Nutritional properties
        'low_acidity': 'Baja Acidez',
        'antioxidant_rich': 'Rico en Antioxidantes',
        'antioxidants': 'Antioxidantes',
        'minerals': 'Minerales',
        'minerales': 'Minerales',
        'medium_high': 'Medio Alto',
        'beta_caroteno': 'Beta Caroteno',
        'balanced': 'Equilibrada',
        'sweet_complex': 'Dulce Complejo',
        'fibra_soluble': 'Fibra Soluble',
        'grasas_saludables': 'Grasas Saludables',
        'proteina_vegetal': 'Proteína Vegetal',
        'extracto_irvingia': 'Extracto de Irvingia',
        'vitamin_e': 'Vitamina E',
        'cholesterol_control': 'Control de Colesterol',
        'diabetes_support': 'Apoyo para Diabetes',
        
        // Seed and propagation
        '2_years': '2 años',
        '3_years': '3 años',
        'seed_viability': 'Viabilidad de Semilla',
        'direct_sow_only': 'Solo Siembra Directa',
        'direct_sow_preferred': 'Preferible Siembra Directa',
        'root_cuttings': 'Esquejes de Raíz',
        'division': 'División',
        'best_propagation': 'Mejor Propagación',
        'transplant_difficulty': 'Dificultad de Trasplante',
        
        // Garden uses and wildlife
        'meadows': 'Praderas',
        'wildflower_gardens': 'Jardines de Flores Silvestres',
        'cutting_gardens': 'Jardines de Corte',
        'xeriscaping': 'Xerojardinería',
        'slopes': 'Pendientes',
        'perennial_borders': 'Bordes Perennes',
        'cottage_gardens': 'Jardines Cottage',
        'birds_seeds': 'Aves (Semillas)',
        'hover_flies': 'Moscas Flotantes',
        'beneficial_insects': 'Insectos Beneficiosos',
        'beetles': 'Escarabajos',
        
        // Plant qualities
        'naturalization': 'Naturalización',
        'self_seeding': 'Autosiembra',
        'prolific': 'Prolífico',
        'cut_flower_quality': 'Calidad Flor Cortada',
        'excellent_short_lived': 'Excelente Corta Duración',
        'excellent_fresh': 'Excelente Fresca',
        
        // Specific tasks
        'sowing_outdoor': 'Siembra Exterior',
        'thin_seedlings': 'Aclarar Plántulas',
        'deadhead_optional': 'Eliminar Flores Opcional',
        'deadhead_for_more_flowers': 'Eliminar Flores para Más Floración',
        'allow_self_seed': 'Permitir Autosiembra',
        'new_growth_emergence': 'Emergencia Nuevo Crecimiento',
        'mulch_around_plants': 'Acolchar Alrededor Plantas',
        'deadhead_after_bloom': 'Eliminar Flores Después Floración',
        'allow_dormancy': 'Permitir Latencia',
        'mark_plant_locations': 'Marcar Ubicaciones Plantas',
        'winter_protection': 'Protección Invernal',
        'stake_if_needed': 'Entutorar Si Necesario',
        'pod_development': 'Desarrollo Cápsulas',
        
        // Medicinal and safety
        'mild_sedative': 'Sedante Suave',
        'anxiety_relief': 'Alivio Ansiedad',
        'sleep_aid': 'Ayuda Sueño',
        'alkaloids': 'Alcaloides',
        'flavonoids': 'Flavonoides',
        'tea': 'Té',
        'tincture': 'Tintura',
        
        // Ornamental pods
        'dried_pods': 'Cápsulas Secas',
        'decorative_value': 'Valor Decorativo',
        'ornamental_pods': 'Cápsulas Ornamentales',
        
        // Cultural/symbolic
        'remembrance': 'Recuerdo',
        'peace': 'Paz',
        'sleep': 'Sueño',
        'death': 'Muerte',
        'ceremonial': 'Ceremonial',
        'remembrance_day': 'Día del Recuerdo',
        'artistic_inspiration': 'Inspiración Artística',
        'artistic': 'Artístico',
        
        // Challenges and maintenance
        'summer_dormancy': 'Latencia Estival',
        'difficult_transplant': 'Trasplante Difícil',
        'short_bloom_time': 'Tiempo Floración Corto',
        'plant_companions_for_summer': 'Plantar Compañeros para Verano',
        'mark_locations': 'Marcar Ubicaciones',
        'enjoy_brief_display': 'Disfrutar Exhibición Breve',
        'low_once_established': 'Bajo Una Vez Establecido',
        
        // Specific tasks for vanilla and orchids
        'cure_beans': 'Curar Vainas',
        'hand_pollinate': 'Polinización Manual',
        'support_pods': 'Soportar Vainas',
        'maintain_humidity': 'Mantener Humedad',
        // Specific tasks for potatoes and root crops
        'hill_soil': 'Aporcar',
        'cure': 'Curar',
        // Specific tasks for bulbs
        'divide_bulbs': 'Dividir Bulbos',
        'remove_debris': 'Limpiar Restos',
        // Specific tasks for poinsettias and photoperiod plants
        'maintain_darkness': 'Mantener Oscuridad',
        'reduce_light': 'Reducir Luz',
        'prepare_flowering': 'Preparar Floración',
        // Flower shapes
        'lily_flowered': 'Flor de Lirio',
        
        // Heat levels for chilis
        'mild': 'Suave',
        'medium': 'Medio',
        'hot': 'Picante',
        'very_hot': 'Muy Picante',
        'extreme': 'Extremo',
        
        // Flavor profiles for chilis
        'picante_variable': 'Picante Variable',
        'picante_medio': 'Picante Medio',
        'picante_extremo_frutal': 'Picante Extremo Frutal',
        'picante_intenso': 'Picante Intenso',
        'picante_fresco_verde': 'Picante Fresco Verde',
        'picante_extremo_avinagrado': 'Picante Extremo Avinagrado',
        'picante_intenso_frutal': 'Picante Intenso Frutal',
        
        // Flower shapes
        'small_star': 'Estrella Pequeña',
        
        // Health benefits
        'metabolism_boost': 'Acelera Metabolismo',
        'pain_relief': 'Alivio del Dolor',
        'immune_support': 'Apoyo Inmune',
        'circulation_boost': 'Mejora Circulación',
        
        // Nutrients
        'capsaicin': 'Capsaicina',
        'beta_carotene': 'Beta Caroteno',
        'water_deeply': 'Regar Profundamente',
        'prepare_outdoor': 'Preparar Exterior',
        'low_water_content': 'Bajo Contenido de Agua',
        'salt_tolerance_check': 'Revisión de Tolerancia a la Sal',
        'prepare_coastal_beds': 'Preparar Parterres Costeros',
        'water_establishment': 'Riego para Establecimiento',
        'water_regularly': 'Riego Regular',
        'reduce_watering': 'Reducir Riego',
        // Traduciones para harvest_data y flower_data
        'fiber_yield': 'Rendimiento de Fibra',
        'seed_yield': 'Rendimiento de Semillas',
        'fiber_production': 'Producción de Fibra',
        'ornamental': 'Ornamental',
        'seeds': 'Semillas',
        'seed_oil': 'Aceite de Semillas',
        'strong_durable': 'Fuerte y Duradero',
        'cut_stems_for_fiber': 'Cortar Tallos para Fibra',
        'fiber_quality': 'Calidad de Fibra',
        // Flower data
        'large': 'Grande',
        'yellow': 'Amarillo',
        'red': 'Rojo',
        'white': 'Blanco',
        'pink': 'Rosa',
        'hibiscus': 'Hibisco',
        '1_day': '1',
        'double': 'Doble',
        'single': 'Simple',
        // Plant types
        'annual': 'Anual',
        'perennial': 'Perenne',
        'biennial': 'Bienal',
        // Difficulty levels
        'easy': 'Fácil',
        'intermediate': 'Intermedio',
        'advanced': 'Avanzado',
        'difficult': 'Difícil',
        // Soil types
        'well_drained': 'Bien Drenado',
        'clay': 'Arcilloso',
        'sandy': 'Arenoso',
        'loamy': 'Franco',
        'chalky': 'Calcáreo',
        // Sun requirements
        'full_sun': 'Sol Directo',
        'partial_shade': 'Sombra Parcial',
        'full_shade': 'Sombra Total',
        'morning_sun': 'Sol Matutino',
        // Water needs already covered by 'moderate', 'low', 'high'
        // Fragrance levels
        'strong': 'Fuerte',
        'mild': 'Suave',
        'none': 'Sin Fragancia',
        // Additional uses
        'medicinal': 'Medicinal',
        'culinary': 'Culinario',
        'textile': 'Textil',
        'industrial': 'Industrial',
        
        // Flavor profiles - Perfiles de sabor
        'sweet': 'Dulce',
        'bitter': 'Amargo',
        'sour': 'Ácido',
        'salty': 'Salado',
        'umami': 'Umami',
        'mild': 'Suave',
        'intense': 'Intenso',
        'complex': 'Complejo',
        'rich': 'Rico',
        'delicate': 'Delicado',
        'balanced': 'Equilibrado',
        'concentrated': 'Concentrado',
        // Flavor profiles - Combinaciones específicas
        'sweet_intense': 'Dulce e intenso',
        'sweet_mild': 'Dulce y suave',
        'sweet_complex': 'Dulce y complejo',
        'sweet_smoky': 'Dulce y ahumado',
        'sweet_creamy_raspberry_hint': 'Dulce, cremoso con notas de frambuesa',
        'sweet_acidic': 'Dulce y ácido',
        'sweet_tart_apple_like': 'Dulce, ácido, similar a manzana',
        'sweet_apple_honey': 'Dulce, manzana y miel',
        'sweet_floral_honey': 'Dulce, floral y meloso',
        'sweet_floral_complex': 'Dulce, floral y complejo',
        'rich_complex': 'Rico y complejo',
        'rich_concentrated': 'Rico y concentrado',
        'intense_concentrated': 'Intenso y concentrado',
        'intense_creamy': 'Intenso y cremoso',
        'balanced_sweet': 'Equilibrado y dulce',
        'floral_herbal': 'Floral y herbal',
        'intenso_alcanforado': 'Intenso y alcanforado',
        'dulce_especiado_intenso': 'Dulce, especiado e intenso',
        'dulce_delicado': 'Dulce y delicado',
        'dulce_acidulado': 'Dulce y acidulado',
        'dulce_ligeramente_ácido': 'Dulce, ligeramente ácido',
        'neutro_intenso': 'Neutro e intenso',
        'neutro_versátil': 'Neutro y versátil',
        'terroso_ligeramente_amargo': 'Terroso, ligeramente amargo',
        'starchy_mild': 'Almidonoso y suave',
        // Flavor profiles - Chiles y picantes
        'picante_intenso': 'Picante intenso',
        'picante_medio': 'Picante medio',
        'picante_extremo_frutal': 'Picante extremo y frutal',
        'picante_extremo_avinagrado': 'Picante extremo y avinagrado',
        'picante_intenso_frutal': 'Picante intenso y frutal',
        'picante_fresco_verde': 'Picante fresco y verde',
        'picante_variable': 'Picante variable',
        // Flavor profiles - Descriptivos con espacios o caracteres especiales
        'fresco, ligeramente picante': 'Fresco, ligeramente picante',
        
        // Traducciones faltantes para kale y otras plantas
        'sow_indoor': 'Siembra Interior',
        'sow_outdoor': 'Siembra Exterior', 
        'harvest_winter': 'Cosecha de Invierno',
        'harvest_summer': 'Cosecha de Verano',
        'protect_cold': 'Proteger del Frío',
        'rich_organic': 'Rico en Materia Orgánica',
        // Preservation methods translations
        'refrigerate': 'Refrigerar',
        'blanch_freeze': 'Escaldar y Congelar',
        'dehydrate': 'Deshidratar',
        // Traducciones para hibiscus cannabinus
        'thin_seedlings': 'Aclarar Plántulas',
        'harvest_fiber': 'Cosechar Fibra',
        'harvest_seeds': 'Cosechar Semillas',
        'final_seed_harvest': 'Cosecha Final de Semillas',
        'clear_beds': 'Limpiar Canteros',
        // Traducciones para fresa
        'remove_runners': 'Eliminar Estolones',
        'plan_next_season': 'Planificar Próxima Temporada',
        'minimal_care': 'Cuidado Mínimo',
        'jam_making': 'Hacer Mermeladas',
        'freezing': 'Congelación',
        'vitamin_c': 'Vitamina C',
        'vitamin_a': 'Vitamina A',
        'fiber': 'Fibra',
        'antioxidants': 'Antioxidantes',
        'folate': 'Folatos',
        'potassium': 'Potasio',
        'manganese': 'Manganeso',
        'antioxidant_rich': 'Rico en Antioxidantes',
        'immune_support': 'Apoyo Inmunológico',
        'heart_healthy': 'Saludable para el Corazón',
        'dulce_ligeramente_ácido': 'Dulce Ligeramente Ácido',
        'grafting': 'Injerto',
        // Más traducciones nutricionales
        'metabolismo': 'Metabolismo',
        'weight_management': 'Control de Peso',
        'cholesterol_control': 'Control del Colesterol',
        'diabetes_support': 'Apoyo Diabético',
        'fibra_minima': 'Fibra Mínima',
        'fibra_soluble': 'Fibra Soluble',
        'dulzor_natural': 'Dulzor Natural',
        'beta_caroteno': 'Beta Caroteno',
        'enzimas_digestivas': 'Enzimas Digestivas',
        'grasas_saludables': 'Grasas Saludables',
        'proteina_vegetal': 'Proteína Vegetal',
        'extracto_irvingia': 'Extracto de Irvingia',
        'aceites_esenciales': 'Aceites Esenciales',
        'desinfectante': 'Desinfectante',
        'desodorante': 'Desodorante',
        'relajante': 'Relajante',
        'vitamin_b6': 'Vitamina B6',
        'healthy_fats': 'Grasas Saludables',
        'leptin_modulator': 'Modulador de Leptina',
        // Traducciones nutrientes básicos
        'protein': 'Proteína',
        'magnesium': 'Magnesio',
        'minerals': 'Minerales',
        'vitamin_e': 'Vitamina E',
        // Traducciones para tomillo
        'adobo_aceitunas': 'Adobo de aceitunas',
        'extraccion_aceites': 'Extracción de aceites',
        'condimento_carnes': 'Condimento de carnes',
        'culinario_fresco': 'Culinario fresco',
        'atraccion_abejas': 'Atracción de abejas',
        'repelente_mosquitos': 'Repelente de mosquitos',
        'flowering_support': 'Soporte de Floración',
        'sucker_removal': 'Eliminación de Chupones',
        'fruit_thinning': 'Aclareo de Frutos',
        'pollination_support': 'Soporte de Polinización',
        'fruit_development_care': 'Cuidado del Desarrollo de Frutos',
        'early_harvest': 'Cosecha Temprana',
        'fruit_protection': 'Protección de Frutos',
        'post_harvest_care': 'Cuidado Post-Cosecha',
        'late_harvest': 'Cosecha Tardía',
        'tree_recovery': 'Recuperación del Árbol',
        'fertilize_recovery': 'Fertilización de Recuperación',
        'disease_prevention': 'Prevención de Enfermedades',
        'dormant_spray': 'Fumigación en Reposo',
        'structural_pruning': 'Poda Estructural',
        'soil_amendment': 'Enmienda del Suelo',
        'irrigation_setup': 'Configuración de Riego'
      };
      
      // Return translation if available, otherwise format the original
      if (translations[task]) {
        return translations[task];
      }
      
      // Fallback to title case formatting
      return task.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },
    formatCategoryName: (category) => {
      // Special case for pina to show with ñ
      if (category === 'pina') {
        return 'Piña';
      }
      return category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ');
    },
    formatPlantName: (plantSlug) => {
      // Special case for albahaca-de-clavo to avoid "Albahaca Albahaca de clavo"
      if (plantSlug === 'albahaca-de-clavo') {
        return 'de clavo';
      }
      // Special case for peonia-sarah-bernhardt to avoid "Peonia Peonia sarah bernhardt"
      if (plantSlug === 'peonia-sarah-bernhardt') {
        return 'Sarah Bernhardt';
      }
      return plantSlug.charAt(0).toUpperCase() + plantSlug.slice(1).replace(/-/g, ' ');
    },
    formatOriginName: (originCode) => {
      if (!originCode || originCode.length < 2) {
        return 'Origen desconocido';
      }
      
      const originNames = {
        'AF': 'África',
        'EU': 'Europa',
        'AS': 'Asia',
        'NA': 'América del Norte',
        'SA': 'América del Sur',  
        'OC': 'Oceanía',
        'FR': 'Francia',
        'ES': 'España',
        'IT': 'Italia',
        'DE': 'Alemania',
        'GB': 'Reino Unido',
        'US': 'Estados Unidos',
        'BR': 'Brasil',
        'CN': 'China',
        'JP': 'Japón',
        'IN': 'India',
        'MX': 'México',
        'NL': 'Países Bajos',
        'SY': 'Siria',
        'BG': 'Bulgaria',
        'IR': 'Irán',
        'AU': 'Australia',
        'DK': 'Dinamarca',
        'DA': 'Dinamarca',
        'IT': 'Italia',
        'TH': 'Tailandia',
        'PH': 'Filipinas',
        'AR': 'Argentina',
        'Central_America': 'América Central',
        'Central_Asia': 'Asia Central',
        'Mediterranean': 'Mediterráneo',
        'Mediterranean_Europe': 'Europa Mediterránea',
        'Eastern_Mediterranean': 'Mediterráneo Oriental',
        'Europe_Asia': 'Europa y Asia',
        'North_America': 'América del Norte',
        'East_Asia': 'Asia Oriental',
        'Tropical_Pacific': 'Pacífico Tropical',
        'Southeast_Asia': 'Sudeste Asiático',
        'China': 'China',
        'CN': 'China'
      };
      
      const upperCode = originCode.toUpperCase();
      return originNames[upperCode] || originNames[originCode] || 'Origen desconocido';
    }
  };
}

/**
 * Enhanced plant calendar function with UI helpers
 */
export async function getPlantCalendarWithUI(category, plantSlug) {
  const plantCalendar = await getPlantCalendarWithInheritance(category, plantSlug);
  const uiHelpers = getUIHelpers(plantCalendar._global_config);
  
  return {
    ...plantCalendar,
    _ui: uiHelpers
  };
}

/**
 * Get monthly tasks with UI helpers
 */
export async function getMonthlyTasksWithUI(month, hemisphere = 'northern') {
  const globalConfig = await getGlobalCalendarConfig();
  const monthlyTasks = await getMonthlyTasks(month, hemisphere);
  const uiHelpers = getUIHelpers(globalConfig);
  
  return {
    tasks: monthlyTasks,
    ui: uiHelpers,
    monthName: uiHelpers.getMonthName(month),
    seasonalTips: uiHelpers.getSeasonalTips(month)
  };
}

/**
 * Generate static paths for all plants across all categories
 * Used by [...slug].astro for dynamic plant calendar pages
 */
export async function generatePlantPaths() {
  const categories = await getAvailableCalendarCategories();
  const paths = [];
  
  for (const category of categories) {
    const categoryPlants = await getCategoryPlantsWithCalendar(category);
    
    for (const plant of categoryPlants) {
      paths.push({
        params: {
          category,
          plant: plant.slug
        },
        props: {
          category,
          plantSlug: plant.slug,
          plantCalendar: plant.calendar
        }
      });
    }
  }
  
  return paths;
}

/**
 * Get all available activity types across all plants
 */
export async function getAvailableActivities() {
  const categories = await getAvailableCalendarCategories();
  const activities = new Set();
  
  for (const category of categories) {
    const categoryPlants = await getCategoryPlantsWithCalendar(category);
    
    for (const plant of categoryPlants) {
      if (plant.calendar?.calendar_data) {
        Object.keys(plant.calendar.calendar_data).forEach(activity => {
          if (['sowing', 'transplanting', 'harvesting', 'flowering', 'planting', 'pruning'].includes(activity)) {
            activities.add(activity);
          }
        });
      }
    }
  }
  
  return Array.from(activities);
}

/**
 * Find all plants that have a specific activity
 */
export async function findPlantsByActivity(activity, hemisphere = 'northern') {
  const categories = await getAvailableCalendarCategories();
  const matchingPlants = [];
  
  for (const category of categories) {
    const categoryPlants = await getCategoryPlantsWithCalendar(category);
    
    for (const plant of categoryPlants) {
      if (plant.calendar?.calendar_data?.[activity]) {
        // Get activity details and timing
        const activityData = plant.calendar.calendar_data[activity];
        const plantWithActivity = {
          category,
          slug: plant.slug,
          calendar: plant.calendar,
          activityDetails: {
            type: activity,
            data: activityData,
            months: getActivityMonths(activityData, hemisphere)
          }
        };
        matchingPlants.push(plantWithActivity);
      }
    }
  }
  
  return matchingPlants;
}

/**
 * Extract months from activity data considering hemisphere
 */
function getActivityMonths(activityData, hemisphere = 'northern') {
  const months = {
    best: [],
    alternative: [],
    peak: []
  };
  
  const monthOffset = hemisphere === 'southern' ? 6 : 0;
  
  // Direct month arrays
  if (activityData.best_months) {
    months.best = activityData.best_months.map(m => adjustMonth(m, monthOffset));
  }
  if (activityData.alternative_months) {
    months.alternative = activityData.alternative_months.map(m => adjustMonth(m, monthOffset));
  }
  if (activityData.peak_months) {
    months.peak = activityData.peak_months.map(m => adjustMonth(m, monthOffset));
  }
  
  // Sub-activities (like indoor/outdoor sowing)
  if (typeof activityData === 'object' && activityData !== null) {
    Object.entries(activityData).forEach(([subType, subData]) => {
      if (subData?.best_months && subType !== 'best_months' && subType !== 'alternative_months' && subType !== 'peak_months') {
        const adjustedMonths = subData.best_months.map(m => adjustMonth(m, monthOffset));
        months.best.push(...adjustedMonths);
        // Store subtype info
        if (!months.subtypes) months.subtypes = {};
        months.subtypes[subType] = adjustedMonths;
      }
    });
  }
  
  // Remove duplicates
  months.best = [...new Set(months.best)];
  months.alternative = [...new Set(months.alternative)];
  months.peak = [...new Set(months.peak)];
  
  return months;
}

/**
 * Adjust month for hemisphere
 */
function adjustMonth(month, offset) {
  const adjusted = ((month - 1 + offset) % 12) + 1;
  return adjusted;
}

/**
 * Validate plant configuration against global config options
 */
export function validatePlantConfig(plantConfig, globalConfig) {
  const errors = [];
  
  // Validate soil_type
  if (plantConfig.growing_conditions?.soil_type && 
      !globalConfig.soil_types.includes(plantConfig.growing_conditions.soil_type)) {
    errors.push(`Invalid soil_type: ${plantConfig.growing_conditions.soil_type}`);
  }
  
  // Validate sun_requirements
  if (plantConfig.growing_conditions?.sun_requirements && 
      !globalConfig.sun_requirements.includes(plantConfig.growing_conditions.sun_requirements)) {
    errors.push(`Invalid sun_requirements: ${plantConfig.growing_conditions.sun_requirements}`);
  }
  
  // Validate water_needs
  if (plantConfig.growing_conditions?.water_needs && 
      !globalConfig.water_needs.includes(plantConfig.growing_conditions.water_needs)) {
    errors.push(`Invalid water_needs: ${plantConfig.growing_conditions.water_needs}`);
  }
  
  // Validate task_definitions in monthly_tasks
  const monthlyTasks = plantConfig.calendar_data?.care_calendar?.monthly_tasks;
  if (monthlyTasks) {
    for (const [month, tasks] of Object.entries(monthlyTasks)) {
      if (Array.isArray(tasks)) {
        for (const task of tasks) {
          if (!globalConfig.task_definitions.includes(task)) {
            errors.push(`Invalid task '${task}' in month ${month}`);
          }
        }
      }
    }
  }
  
  return errors;
}

/**
 * Convert locale codes (like "es-ES") to flag emojis
 */
export function getOriginFlag(localeCode) {
  if (!localeCode || localeCode.length < 2) return '📍';
  
  const localeFlags = {
    'es-ES': '🇪🇸', // España
    'en-US': '🇺🇸', // Estados Unidos
    'en-GB': '🇬🇧', // Reino Unido
    'fr-FR': '🇫🇷', // Francia
    'it-IT': '🇮🇹', // Italia
    'de-DE': '🇩🇪', // Alemania
    'pt-PT': '🇵🇹', // Portugal
    'pt-BR': '🇧🇷', // Brasil
    'zh-CN': '🇨🇳', // China
    'zh-TW': '🇹🇼', // Taiwan
    'ja-JP': '🇯🇵', // Japón
    'ko-KR': '🇰🇷', // Corea del Sur
    'ru-RU': '🇷🇺', // Rusia
    'ar-SA': '🇸🇦', // Arabia Saudí
    'hi-IN': '🇮🇳', // India
    'tr-TR': '🇹🇷', // Turquía
    'el-GR': '🇬🇷', // Grecia
    'nl-NL': '🇳🇱', // Países Bajos
    'sv-SE': '🇸🇪', // Suecia
    'no-NO': '🇳🇴', // Noruega
    'da-DK': '🇩🇰', // Dinamarca
    'fi-FI': '🇫🇮', // Finlandia
    'pl-PL': '🇵🇱', // Polonia
    'cs-CZ': '🇨🇿', // República Checa
    'hu-HU': '🇭🇺', // Hungría
    'ro-RO': '🇷🇴', // Rumania
    'bg-BG': '🇧🇬', // Bulgaria
    'hr-HR': '🇭🇷', // Croacia
    'sk-SK': '🇸🇰', // Eslovaquia
    'sl-SI': '🇸🇮', // Eslovenia
    'et-EE': '🇪🇪', // Estonia
    'lv-LV': '🇱🇻', // Letonia
    'lt-LT': '🇱🇹', // Lituania
    'mt-MT': '🇲🇹', // Malta
    'cy-GB': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',  // Gales
    // Códigos continentales/regionales
    'AF': '🌍', // África
    'EU': '🇪🇺', // Europa  
    'AS': '🌏', // Asia
    'NA': '🌎', // América del Norte
    'SA': '🌎', // América del Sur
    'OC': '🌏', // Oceanía
    'FR': '🇫🇷', // Francia
    'ES': '🇪🇸', // España
    'IT': '🇮🇹', // Italia
    'DE': '🇩🇪', // Alemania
    'GB': '🇬🇧', // Reino Unido
    'US': '🇺🇸', // Estados Unidos
    'BR': '🇧🇷', // Brasil
    'CN': '🇨🇳', // China
    'JP': '🇯🇵', // Japón
    'IN': '🇮🇳', // India
    'MX': '🇲🇽', // México
    'DK': '🇩🇰', // Dinamarca
    'DA': '🇩🇰', // Dinamarca (alias)
    'AU': '🇦🇺', // Australia
    'PH': '🇵🇭', // Filipinas
    'AR': '🇦🇷', // Argentina
    'Central_America': '🌎', // América Central
    'Mediterranean': '🌊', // Mediterráneo
    'Mediterranean_Europe': '🌊', // Europa Mediterránea
    'Eastern_Mediterranean': '🌊', // Mediterráneo Oriental
    'Europe_Asia': '🌍', // Europa y Asia
    'North_America': '🌎', // América del Norte
    'East_Asia': '🌏'  // Asia Oriental
  };
  
  const upperCode = localeCode.toUpperCase();
  return localeFlags[upperCode] || localeFlags[localeCode] || '📍';
}

/**
 * Convert English activity names to Spanish slugs
 */
export function activityToSlug(activity) {
  const activitySlugs = {
    'sowing': 'siembra',
    'transplanting': 'trasplante', 
    'harvesting': 'cosecha',
    'flowering': 'floracion',
    'planting': 'plantacion',
    'pruning': 'poda'
  };
  
  return activitySlugs[activity] || activity;
}

/**
 * Convert Spanish activity slugs back to English activity names
 */
export function slugToActivity(slug) {
  const slugActivities = {
    'siembra': 'sowing',
    'trasplante': 'transplanting',
    'cosecha': 'harvesting', 
    'floracion': 'flowering',
    'plantacion': 'planting',
    'poda': 'pruning'
  };
  
  return slugActivities[slug] || slug;
}

/**
 * Get companion plants for a specific category
 * Returns plants organized by beneficial, neutral, and avoid
 */
export async function getCompanionPlants(category) {
  const globalConfig = await getGlobalCalendarConfig();
  const companionData = globalConfig.companion_plants?.[category];
  
  if (!companionData) {
    return {
      beneficial: [],
      neutral: [],
      avoid: []
    };
  }
  
  // Get available categories to filter out non-existent ones
  const availableCategories = await getAvailableCalendarCategories();
  
  // Filter companion plants to only include existing categories (for linking)
  const filterCompanions = (companions) => {
    return companions.map(companion => {
      const categoryMatch = availableCategories.find(cat => 
        cat === companion || cat.includes(companion) || companion.includes(cat)
      );
      
      return {
        name: companion,
        hasLink: !!categoryMatch,
        categorySlug: categoryMatch || null
      };
    });
  };
  
  return {
    beneficial: filterCompanions(companionData.beneficial || []),
    neutral: filterCompanions(companionData.neutral || []),
    avoid: filterCompanions(companionData.avoid || [])
  };
}

/**
 * Get all companion relationships for multiple categories
 * Useful for plant planning and garden layout
 */
export async function getBulkCompanionPlants(categories) {
  const companionMap = {};
  
  for (const category of categories) {
    companionMap[category] = await getCompanionPlants(category);
  }
  
  return companionMap;
}

/**
 * Find mutual beneficial companion relationships
 * Returns plants that benefit each other mutually
 */
export async function findMutualCompanions(category) {
  const globalConfig = await getGlobalCalendarConfig();
  const allCompanions = globalConfig.companion_plants || {};
  const categoryCompanions = allCompanions[category];
  
  if (!categoryCompanions) return [];
  
  const mutualBeneficial = [];
  const beneficialPlants = categoryCompanions.beneficial || [];
  
  for (const companion of beneficialPlants) {
    const companionData = allCompanions[companion];
    if (companionData && companionData.beneficial?.includes(category)) {
      mutualBeneficial.push(companion);
    }
  }
  
  return mutualBeneficial;
}

/**
 * Get companion plant recommendations with detailed info
 * Includes icons, descriptions, and linking logic
 */
export async function getCompanionPlantsWithDetails(category) {
  const companions = await getCompanionPlants(category);
  const globalConfig = await getGlobalCalendarConfig();
  const uiHelpers = getUIHelpers(globalConfig);
  
  const addDetails = (companionList, type) => {
    return companionList.map(companion => ({
      ...companion,
      icon: uiHelpers.getCategoryIcon(companion.categorySlug || companion.name),
      type: type,
      description: getCompanionDescription(companion.name, type),
      link: companion.hasLink ? `/${companion.categorySlug}/` : null
    }));
  };
  
  return {
    beneficial: addDetails(companions.beneficial, 'beneficial'),
    neutral: addDetails(companions.neutral, 'neutral'),
    avoid: addDetails(companions.avoid, 'avoid'),
    totalCount: companions.beneficial.length + companions.neutral.length + companions.avoid.length
  };
}

/**
 * Get description for companion relationship
 */
function getCompanionDescription(plantName, relationshipType) {
  const descriptions = {
    beneficial: {
      'albahaca': 'Repele insectos y mejora el sabor',
      'manzanilla': 'Atrae insectos beneficiosos',
      'lavanda': 'Repele plagas y atrae polinizadores',
      'tomillo': 'Control natural de plagas',
      'ajo': 'Repele áfidos y otros insectos',
      'cebolla': 'Protege contra plagas del suelo'
    },
    neutral: {
      'lechuga': 'No interfiere con el crecimiento',
      'zanahoria': 'Uso eficiente del espacio',
      'espinaca': 'Compatibilidad de cultivo'
    },
    avoid: {
      'hinojo': 'Inhibe el crecimiento',
      'nogal': 'Produce sustancias alelopáticas',
      'brócoli': 'Compite por los mismos nutrientes'
    }
  };
  
  return descriptions[relationshipType]?.[plantName] || 
         (relationshipType === 'beneficial' ? 'Relación beneficiosa' :
          relationshipType === 'neutral' ? 'Relación neutral' : 
          'Evitar plantar juntos');
}