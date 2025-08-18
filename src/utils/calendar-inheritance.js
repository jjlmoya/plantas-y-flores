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
    throw new Error('Global calendar configuration not found');
  }
  
  const rawData = fs.readFileSync(globalPath, 'utf8');
  return JSON.parse(rawData);
}

/**
 * Load base configuration for a plant category
 * Returns empty object if category base config doesn't exist
 */
export async function getCategoryCalendarConfig(category) {
  const categoryPath = path.join(process.cwd(), 'public', 'data', 'calendar', category, 'index.json');
  
  if (!fs.existsSync(categoryPath)) {
    console.warn(`No base configuration found for category: ${category}`);
    return {};
  }
  
  const rawData = fs.readFileSync(categoryPath, 'utf8');
  return JSON.parse(rawData);
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
}

/**
 * Load specific plant configuration with full inheritance chain and article links
 * Global -> Category -> Plant specific + Auto-resolved article links
 */
export async function getPlantCalendarWithInheritance(category, plantSlug) {
  // 1. Load global configuration (contains all available options)
  const globalConfig = await getGlobalCalendarConfig();
  
  // 2. Load category base configuration
  const categoryConfig = await getCategoryCalendarConfig(category);
  
  // 3. Load plant-specific configuration
  const plantPath = path.join(process.cwd(), 'public', 'data', 'calendar', category, `${plantSlug}.json`);
  
  let plantConfig = {};
  if (fs.existsSync(plantPath)) {
    const rawData = fs.readFileSync(plantPath, 'utf8');
    plantConfig = JSON.parse(rawData);
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
        'high': 'Alto'
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