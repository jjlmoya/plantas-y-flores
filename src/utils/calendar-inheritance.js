import fs from 'fs';
import path from 'path';
import { getPlants, getCategoryPages } from './data.js';

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
  const globalPath = path.join(process.cwd(), 'public', 'data', 'calendar', 'global-config.json');
  
  if (!fs.existsSync(globalPath)) {
    console.warn(`Global calendar configuration not found at: ${globalPath}, using defaults`);
    return getDefaultGlobalConfig();
  }
  
  try {
    const rawData = fs.readFileSync(globalPath, 'utf8');
    const config = JSON.parse(rawData);
    
    // Validate required fields
    if (!config.ui_config || !config.month_names || !config.task_definitions) {
      console.warn('Global config missing required fields, merging with defaults');
      return { ...getDefaultGlobalConfig(), ...config };
    }
    
    return config;
  } catch (error) {
    console.error(`Error parsing global calendar config: ${error.message}, using defaults`);
    return getDefaultGlobalConfig();
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
      "prepare_seedbeds", "transplant", "moderate_watering", "fertilize", "pest_monitoring", 
      "harvest_early", "harvest_main", "harvest_late", "plant_cleanup"
    ],
    ui_config: {
      category_icons: {
        tomate: "🍅", rosa: "🌹", albahaca: "🌿", default: "🌱"
      },
      task_icons: {
        prepare_seedbeds: "🌱", transplant: "🌿", moderate_watering: "💧",
        fertilize: "🌱", harvest_main: "🌾", default: "•"
      },
      task_priorities: {
        harvest_main: "high", transplant: "high", 
        fertilize: "medium", moderate_watering: "medium"
      },
      activity_colors: {
        sowing: "#48bb78", transplanting: "#4299e1", harvesting: "#ed8936",
        flowering: "#d53f8c", pruning: "#805ad5", planting: "#38b2ac", care: "#9f7aea"
      },
      translation_strings: {
        es: {
          full_sun: "Sol directo", moderate: "Moderado", beginner: "Principiante",
          sowing: "Siembra", harvesting: "Cosecha", transplanting: "Trasplante"
        }
      }
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
    
    return {
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
  const categoryDir = path.join(process.cwd(), 'public', 'data', 'calendar', category);
  
  if (!fs.existsSync(categoryDir)) {
    return [];
  }
  
  const files = fs.readdirSync(categoryDir)
    .filter(file => file.endsWith('.json') && file !== 'index.json');
  
  const plants = [];
  
  for (const file of files) {
    const plantSlug = file.replace('.json', '');
    const plantCalendar = await getPlantCalendarWithInheritance(category, plantSlug);
    plants.push({
      slug: plantSlug,
      category: category,
      calendar: plantCalendar
    });
  }
  
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
  
  const calendarDir = path.join(process.cwd(), 'public', 'data', 'calendar');
  
  if (!fs.existsSync(calendarDir)) {
    return [];
  }
  
  const categories = fs.readdirSync(calendarDir).filter(dir => {
    const dirPath = path.join(calendarDir, dir);
    return fs.statSync(dirPath).isDirectory();
  });
  
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
        'light_watering': 'Riego Ligero',
        'prune_shoots': 'Podar Brotes',
        'prune_main': 'Poda Principal',
        'deadheading': 'Eliminar Flores Marchitas',
        'fertilize': 'Fertilizar',
        'pest_monitoring': 'Monitoreo de Plagas',
        'harvest_early': 'Cosecha Temprana',
        'harvest_main': 'Cosecha Principal',
        'harvest_late': 'Cosecha Tardía',
        'plant_cleanup': 'Limpieza de Plantas',
        'seed_collection': 'Recolección de Semillas',
        'water_restriction': 'Restricción de Riego',
        'thinning': 'Raleo',
        'pinching': 'Despunte',
        'staking': 'Entutorado',
        'soil_preparation': 'Preparación del Suelo',
        // Plant types
        'annual': 'Anual',
        'perennial': 'Perenne',
        'biennial': 'Bienal',
        // Difficulty levels
        'beginner': 'Principiante',
        'intermediate': 'Intermedio',
        'advanced': 'Avanzado',
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
        // Sun requirements
        'full_sun': 'Pleno Sol',
        'partial_sun': 'Sol Parcial',
        'partial_shade': 'Sombra Parcial',
        'full_shade': 'Sombra Completa',
        // Water needs
        'low': 'Bajo',
        'moderate': 'Moderado',
        'high': 'Alto',
        // Preservation methods
        'oil_infusion': 'Infusión en Aceite',
        'drying': 'Secado',
        'freezing': 'Congelación',
        'canning': 'Enlatado',
        'dehydrating': 'Deshidratación',
        'pickling': 'Encurtido',
        'fermentation': 'Fermentación',
        // Harvest indicators
        'aroma': 'Aroma',
        'full_bloom': 'Floración Completa',
        'color_change': 'Cambio de Color',
        'size': 'Tamaño',
        'firmness': 'Firmeza',
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
        'ground': 'Suelo',
        'greenhouse': 'Invernadero'
      };
      
      // Return translation if available, otherwise format the original
      if (translations[task]) {
        return translations[task];
      }
      
      // Fallback to title case formatting
      return task.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },
    formatCategoryName: (category) => {
      return category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ');
    },
    formatPlantName: (plantSlug) => {
      return plantSlug.charAt(0).toUpperCase() + plantSlug.slice(1).replace(/-/g, ' ');
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
  if (!localeCode) return '📍';
  
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
    'cy-GB': '🏴󠁧󠁢󠁷󠁬󠁳󠁿'  // Gales
  };
  
  return localeFlags[localeCode] || '📍';
}