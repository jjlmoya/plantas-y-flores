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
        // Iconos básicos existentes
        prepare_seedbeds: "🌱", transplant: "🌿", moderate_watering: "💧",
        fertilize: "🧪", harvest_main: "🌾", harvest_early: "🌾", harvest_late: "🌾",
        pest_monitoring: "🔍", plant_cleanup: "🧹", sowing: "🌱", 
        planting: "🌳", pruning: "✂️", watering: "💧", 
        deadheading: "🌸", mulching: "🍃", flowering: "🌸",
        // Iconos para actividades principales
        transplanting: "🌿", harvesting: "🌾",
        // Iconos para todas las tareas nuevas
        monitor_growth: "📈", remove_mulch: "🧹", fertilize_light: "💊",
        water_moderately: "💧", enjoy_blooms: "🌺", deadhead_spent: "🥀",
        allow_foliage_yellow: "🍂", lift_bulbs_optional: "⬆️", store_dry: "📦",
        prepare_beds: "🌱", mulch_protection: "🛡️", reduce_watering: "💧",
        fertilize_seedlings: "🧪", water_regularly: "💧", water_content: "📊",
        enjoy_fragrance: "👃", lift_tubers: "⬆️", lifting_time: "⏰",
        prepare_winter: "❄️", store_tubers_cool_dry: "🧊", mulch: "🍃",
        remove_old_leaves: "🍂", remove_runners: "✂️", deadhead_daily: "🌸",
        minimal_water: "💧", prepare_supports: "🏗️", mulch_for_winter: "❄️",
        water_establishment: "💧", enjoy_color_changes: "🎨", 
        monitor_flower_development: "🌸", prepare_coastal_beds: "🏖️",
        prepare_wet_beds: "💧", water_garden: "🌊", water_lightly: "💧",
        minimal_watering: "💧", remove_spent: "🗑️", water_base_only: "💧",
        water_carefully: "⚠️", fertilize_orchid: "🌺", increase_watering: "💧",
        monitor_pods: "🫘", prepare_soil: "🌱", store_cool_dark: "🧊",
        store_properly: "📦", water_deeply: "💧", prepare_outdoor: "🌤️",
        low_water_content: "📉", 
        // Iconos por defecto
        default: "•"
      },
      task_priorities: {
        // Prioridades básicas existentes
        harvest_main: "high", harvest_early: "high", harvest_late: "medium",
        transplant: "high", prepare_seedbeds: "high",
        fertilize: "medium", moderate_watering: "medium", 
        pest_monitoring: "medium", watering: "medium",
        plant_cleanup: "low", deadheading: "low", mulching: "low", flowering: "medium",
        // Prioridades para todas las tareas nuevas
        monitor_growth: "medium", remove_mulch: "medium", fertilize_light: "medium",
        water_moderately: "medium", enjoy_blooms: "low", deadhead_spent: "medium",
        allow_foliage_yellow: "low", lift_bulbs_optional: "low", store_dry: "high",
        prepare_beds: "high", mulch_protection: "medium", reduce_watering: "medium",
        fertilize_seedlings: "high", water_regularly: "medium", water_content: "low",
        enjoy_fragrance: "low", lift_tubers: "high", lifting_time: "high",
        prepare_winter: "high", store_tubers_cool_dry: "high", mulch: "medium",
        remove_old_leaves: "low", remove_runners: "medium", deadhead_daily: "medium",
        minimal_water: "low", prepare_supports: "high", mulch_for_winter: "high",
        water_establishment: "high", enjoy_color_changes: "low", 
        monitor_flower_development: "medium", prepare_coastal_beds: "high",
        prepare_wet_beds: "high", water_garden: "high", water_lightly: "low",
        minimal_watering: "low", remove_spent: "low", water_base_only: "medium",
        water_carefully: "medium", fertilize_orchid: "medium", increase_watering: "medium",
        monitor_pods: "medium", prepare_soil: "high", store_cool_dark: "high",
        store_properly: "high", water_deeply: "medium", prepare_outdoor: "high",
        low_water_content: "low"
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
        enjoy_fragrance: "#d53f8c", lift_tubers: "#9f7aea", lifting_time: "#805ad5",
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
        'deadhead': 'Eliminar Flores Marchitas',
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
        'enjoy_fragrance': 'Disfrutar Fragancia',
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
        'water_deeply': 'Regar Profundamente',
        'prepare_outdoor': 'Preparar Exterior',
        'low_water_content': 'Bajo Contenido de Agua',
        'salt_tolerance_check': 'Revisión de Tolerancia a la Sal',
        'prepare_coastal_beds': 'Preparar Parterres Costeros',
        'water_establishment': 'Riego para Establecimiento',
        'water_regularly': 'Riego Regular',
        'reduce_watering': 'Reducir Riego',
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