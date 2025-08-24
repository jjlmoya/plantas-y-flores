/**
 * ⚠️ MVP FAVORITOS - SPEC FÉRREA
 * 
 * Composable Vue para estado reactivo de favoritos.
 * PROHIBIDO:
 * - EventBus propio (usar emits Vue nativos)
 * - Watchers complejos
 * - Estado global complejo
 * 
 * Si necesitas algo más = revisar FAVORITES_SPEC.md
 */

import { ref, computed, readonly } from 'vue'
import {
  loadFavorites,
  addFavorite as storageAddFavorite,
  removeFavorite as storageRemoveFavorite,
  isFavorite as storageIsFavorite,
  getFavoritesStats,
  isStorageAvailable
} from './storage.js'

// Estado reactivo global (singleton)
const favorites = ref([])
const isLoading = ref(false)
const storageEnabled = ref(true) // SIEMPRE TRUE, no jodas más

// Inicializar favoritos en cliente - FORZAR CARGA INMEDIATA
let favoritesInitialized = false
if (typeof window !== 'undefined') {
  try {
    const loaded = loadFavorites()
    favorites.value = loaded
    favoritesInitialized = true
  } catch (error) {
    console.error('Error cargando favoritos:', error)
    favorites.value = []
  }
}

/**
 * Composable principal para usar favoritos
 * @returns {Object} API reactiva de favoritos
 */
export function useFavorites() {
  // FORZAR RECARGA DE FAVORITOS CADA VEZ
  if (typeof window !== 'undefined') {
    const loaded = loadFavorites()
    if (JSON.stringify(loaded) !== JSON.stringify(favorites.value)) {
      favorites.value = loaded
    }
  }
  
  /**
   * Alternar estado de favorito de una planta
   * @param {string} plantId ID de la planta
   */
  const toggleFavorite = async (plantId) => {
    if (!storageEnabled.value || !plantId) {
      console.warn('Storage no disponible o plantId inválido')
      return
    }

    isLoading.value = true
    
    try {
      const currentlyFavorite = favorites.value.includes(plantId)
      
      if (currentlyFavorite) {
        const newFavorites = storageRemoveFavorite(plantId)
        favorites.value = newFavorites
        
        // Analytics event
        if (typeof gtag === 'function') {
          gtag('event', 'favorite_removed', {
            'plant_id': plantId,
            'total_favorites': newFavorites.length
          })
        }
      } else {
        const newFavorites = storageAddFavorite(plantId)
        favorites.value = newFavorites
        
        // Analytics event
        if (typeof gtag === 'function') {
          gtag('event', 'favorite_added', {
            'plant_id': plantId,
            'total_favorites': newFavorites.length
          })
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Verificar si una planta es favorita
   * @param {string} plantId ID de la planta
   * @returns {ComputedRef<boolean>}
   */
  const isFavorite = (plantId) => {
    return computed(() => {
      if (!plantId || !storageEnabled.value) return false
      return favorites.value.includes(plantId)
    })
  }

  /**
   * Obtener estadísticas computadas
   */
  const stats = computed(() => {
    if (!storageEnabled.value) {
      return {
        count: 0,
        maxAllowed: 0,
        percentageFull: 0,
        canAddMore: false
      }
    }
    
    return getFavoritesStats()
  })

  /**
   * Lista readonly de favoritos
   */
  const favoritesReadonly = readonly(favorites)

  /**
   * Estado de carga readonly
   */
  const isLoadingReadonly = readonly(isLoading)

  /**
   * Refrescar favoritos desde storage
   */
  const refreshFavorites = () => {
    if (storageEnabled.value) {
      try {
        favorites.value = loadFavorites()
      } catch (error) {
        console.error('Error refreshing favorites:', error)
      }
    }
  }

  return {
    // Estado
    favorites: favoritesReadonly,
    isLoading: isLoadingReadonly,
    storageEnabled: readonly(storageEnabled),
    stats,
    
    // Métodos
    toggleFavorite,
    isFavorite,
    refreshFavorites
  }
}

/**
 * Composable específico para mostrar listas de favoritos
 * @returns {Object} API para componentes de lista
 */
export function useFavoritesList() {
  const { favorites, stats, refreshFavorites } = useFavorites()
  
  const isEmpty = computed(() => favorites.value.length === 0)
  const hasItems = computed(() => favorites.value.length > 0)
  
  return {
    favorites: readonly(favorites),
    stats: readonly(stats),
    isEmpty,
    hasItems,
    refreshFavorites
  }
}

/**
 * Composable específico para botones de favorito
 * @param {string} plantId ID de la planta
 * @returns {Object} API para botón de favorito
 */
export function useFavoriteButton(plantId) {
  const { toggleFavorite, isFavorite, isLoading, storageEnabled } = useFavorites()
  
  const isPlantFavorite = isFavorite(plantId)
  
  const handleToggle = () => toggleFavorite(plantId)
  
  const buttonText = computed(() => {
    if (isLoading.value) return 'Guardando...'
    return isPlantFavorite.value ? 'Quitar de favoritos' : 'Añadir a favoritos'
  })
  
  const buttonIcon = computed(() => {
    return isPlantFavorite.value ? 
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' :
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
  })
  
  const isDisabled = computed(() => {
    return !plantId || isLoading.value
  })
  
  return {
    isFavorite: isPlantFavorite,
    isLoading: readonly(isLoading),
    isDisabled,
    buttonText,
    buttonIcon,
    toggle: handleToggle
  }
}