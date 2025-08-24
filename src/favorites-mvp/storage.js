/**
 * ⚠️ MVP FAVORITOS - SPEC FÉRREA
 * 
 * SOLO localStorage permitido.
 * PROHIBIDO:
 * - IndexedDB
 * - EventBus propio
 * - Más de 200 favoritos
 * - Cualquier otra persistencia
 * 
 * Si necesitas algo más = revisar FAVORITES_SPEC.md
 */

const STORAGE_KEY = 'plantas-favorites'
const MAX_FAVORITES = 200
const STORAGE_VERSION = 1

/**
 * Estructura de datos en localStorage:
 * {
 *   version: 1,
 *   favorites: ['plant-id-1', 'plant-id-2', ...],
 *   created: timestamp
 * }
 */

/**
 * Cargar favoritos desde localStorage
 * @returns {string[]} Array de IDs de plantas favoritas
 */
export function loadFavorites() {
  try {
    // GUARD CONTRA SSR
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return []
    }
    
    const stored = localStorage.getItem(STORAGE_KEY)
    
    if (!stored) {
      return []
    }

    const data = JSON.parse(stored)
    
    // Validar estructura y versión
    if (!data || data.version !== STORAGE_VERSION || !Array.isArray(data.favorites)) {
      console.warn('Datos de favoritos corruptos, reseteando')
      return []
    }

    // Validar que todos los elementos sean strings
    const validFavorites = data.favorites.filter(id => 
      typeof id === 'string' && id.trim().length > 0
    )

    // Limitar a máximo permitido
    return validFavorites.slice(0, MAX_FAVORITES)
    
  } catch (error) {
    console.warn('Error cargando favoritos:', error)
    return []
  }
}

/**
 * Guardar favoritos en localStorage
 * @param {string[]} favorites Array de IDs de plantas
 */
export function saveFavorites(favorites) {
  try {
    // GUARD CONTRA SSR
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return
    }
    
    // Validar entrada
    if (!Array.isArray(favorites)) {
      throw new Error('Favoritos debe ser un array')
    }

    // Filtrar y validar IDs
    const validFavorites = favorites
      .filter(id => typeof id === 'string' && id.trim().length > 0)
      .slice(0, MAX_FAVORITES) // Aplicar límite

    const data = {
      version: STORAGE_VERSION,
      favorites: validFavorites,
      created: Date.now(),
      count: validFavorites.length
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    
  } catch (error) {
    console.error('Error guardando favoritos:', error)
    // No lanzar error hacia arriba para no romper la UI
  }
}

/**
 * Añadir planta a favoritos
 * @param {string} plantId ID de la planta
 * @returns {string[]} Nuevos favoritos
 */
export function addFavorite(plantId) {
  if (!plantId || typeof plantId !== 'string') {
    console.warn('ID de planta inválido:', plantId)
    return loadFavorites()
  }

  const favorites = loadFavorites()
  
  // Evitar duplicados
  if (favorites.includes(plantId)) {
    return favorites
  }

  // Verificar límite
  if (favorites.length >= MAX_FAVORITES) {
    console.warn(`Límite de ${MAX_FAVORITES} favoritos alcanzado`)
    return favorites
  }

  const newFavorites = [...favorites, plantId]
  saveFavorites(newFavorites)
  
  return newFavorites
}

/**
 * Remover planta de favoritos
 * @param {string} plantId ID de la planta
 * @returns {string[]} Nuevos favoritos
 */
export function removeFavorite(plantId) {
  if (!plantId || typeof plantId !== 'string') {
    console.warn('ID de planta inválido:', plantId)
    return loadFavorites()
  }

  const favorites = loadFavorites()
  const newFavorites = favorites.filter(id => id !== plantId)
  
  saveFavorites(newFavorites)
  return newFavorites
}

/**
 * Verificar si una planta está en favoritos
 * @param {string} plantId ID de la planta
 * @returns {boolean}
 */
export function isFavorite(plantId) {
  if (!plantId || typeof plantId !== 'string') {
    return false
  }
  
  const favorites = loadFavorites()
  return favorites.includes(plantId)
}

/**
 * Obtener estadísticas de favoritos
 * @returns {Object}
 */
export function getFavoritesStats() {
  // GUARD CONTRA SSR
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return {
      count: 0,
      maxAllowed: MAX_FAVORITES,
      percentageFull: 0,
      canAddMore: false
    }
  }
  
  const favorites = loadFavorites()
  
  return {
    count: favorites.length,
    maxAllowed: MAX_FAVORITES,
    percentageFull: (favorites.length / MAX_FAVORITES) * 100,
    canAddMore: favorites.length < MAX_FAVORITES
  }
}

/**
 * Limpiar todos los favoritos (para testing)
 */
export function clearAllFavorites() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error limpiando favoritos:', error)
  }
}

/**
 * Verificar si localStorage está disponible
 * @returns {boolean}
 */
export function isStorageAvailable() {
  try {
    // GUARD CONTRA SSR
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return false
    }
    
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch (error) {
    return false
  }
}