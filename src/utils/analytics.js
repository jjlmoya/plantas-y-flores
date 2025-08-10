/**
 * Utilidades de Analytics para Plantas y Flores
 * Funciones para trackear eventos específicos del sitio
 */

// Verificar si Google Analytics está disponible
const isGALoaded = () => {
  return typeof gtag !== 'undefined';
};

// Trackear visualización de planta
export const trackPlantView = (plantName, category) => {
  if (!isGALoaded()) return;
  
  gtag('event', 'plant_view', {
    'plant_name': plantName,
    'plant_category': category,
    'event_category': 'Plants',
    'event_label': `${category} - ${plantName}`
  });
};

// Trackear búsqueda de plantas
export const trackPlantSearch = (searchTerm, resultsCount = 0) => {
  if (!isGALoaded()) return;
  
  gtag('event', 'search', {
    'search_term': searchTerm,
    'results_count': resultsCount,
    'event_category': 'Search',
    'event_label': searchTerm
  });
};

// Trackear navegación por categorías
export const trackCategoryView = (categoryName, plantsCount = 0) => {
  if (!isGALoaded()) return;
  
  gtag('event', 'category_view', {
    'category_name': categoryName,
    'plants_count': plantsCount,
    'event_category': 'Categories',
    'event_label': categoryName
  });
};

// Trackear interacciones con el contacto
export const trackContactInteraction = (interactionType) => {
  if (!isGALoaded()) return;
  
  gtag('event', 'contact_interaction', {
    'interaction_type': interactionType, // 'email_click', 'social_click', 'form_submit'
    'event_category': 'Contact',
    'event_label': interactionType
  });
};

// Trackear clics en enlaces de tienda
export const trackShopInteraction = (action) => {
  if (!isGALoaded()) return;
  
  gtag('event', 'shop_interaction', {
    'action': action, // 'seeds_link_click', 'newsletter_signup'
    'event_category': 'Shop',
    'event_label': action
  });
};

// Trackear tiempo de lectura en artículos
export const trackReadingTime = (plantName, timeSpent) => {
  if (!isGALoaded()) return;
  
  gtag('event', 'reading_time', {
    'plant_name': plantName,
    'time_spent_seconds': timeSpent,
    'event_category': 'Engagement',
    'event_label': `${plantName} - ${timeSpent}s`,
    'value': Math.round(timeSpent / 60) // minutos
  });
};

// Trackear scroll en páginas de plantas
export const trackScrollDepth = (plantName, scrollPercent) => {
  if (!isGALoaded()) return;
  
  // Solo trackear hitos importantes (25%, 50%, 75%, 100%)
  const milestones = [25, 50, 75, 100];
  if (milestones.includes(scrollPercent)) {
    gtag('event', 'scroll_depth', {
      'plant_name': plantName,
      'scroll_percent': scrollPercent,
      'event_category': 'Engagement',
      'event_label': `${plantName} - ${scrollPercent}%`,
      'value': scrollPercent
    });
  }
};

// Trackear errores 404 o plantas no encontradas
export const trackPlantNotFound = (searchedPlant) => {
  if (!isGALoaded()) return;
  
  gtag('event', 'plant_not_found', {
    'searched_plant': searchedPlant,
    'event_category': 'Errors',
    'event_label': searchedPlant
  });
};

// Configuración de enhanced ecommerce para futuras funcionalidades
export const trackPurchaseIntent = (itemName, category, value = 0) => {
  if (!isGALoaded()) return;
  
  gtag('event', 'begin_checkout', {
    'currency': 'EUR',
    'value': value,
    'items': [{
      'item_id': itemName.toLowerCase().replace(/\s+/g, '-'),
      'item_name': itemName,
      'category': category,
      'quantity': 1,
      'price': value
    }]
  });
};

// Trackear compartir en redes sociales
export const trackSocialShare = (platform, plantName) => {
  if (!isGALoaded()) return;
  
  gtag('event', 'share', {
    'method': platform,
    'content_type': 'plant_article',
    'item_id': plantName,
    'event_category': 'Social',
    'event_label': `${platform} - ${plantName}`
  });
};