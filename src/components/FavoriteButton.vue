<template>
  <button 
    @click.stop="handleFavoriteClick"
    :disabled="favoriteButton.isDisabled.value"
    :aria-pressed="isMounted ? favoriteButton.isFavorite.value : false"
    :class="['favorite-button', { 'favorite-button--large': large }]"
    :title="isMounted ? favoriteButton.buttonText.value : 'Añadir a favoritos'"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFavoriteButton } from '../favorites-mvp/composable.js';

const props = defineProps({
  plantSlug: {
    type: String,
    required: true
  },
  large: {
    type: Boolean,
    default: false
  }
});

const isMounted = ref(false);
const favoriteButton = useFavoriteButton(props.plantSlug);

onMounted(() => {
  isMounted.value = true;
  
  // Si ya es favorito al cargar, reproducir animación una vez
  if (favoriteButton.isFavorite.value) {
    setTimeout(() => {
      const button = document.querySelector(`[data-plant-slug="${props.plantSlug}"] .favorite-button`);
      if (button) {
        button.classList.add('just-clicked');
        setTimeout(() => {
          button.classList.remove('just-clicked');
        }, 600);
      }
    }, 100);
  }
});

const handleFavoriteClick = (event) => {
  const wasNotFavorite = !favoriteButton.isFavorite.value;
  
  favoriteButton.toggle();
  
  // Solo animar cuando se ACTIVA (no cuando se desactiva)
  if (wasNotFavorite) {
    const button = event.currentTarget;
    button.classList.add('just-clicked');
    
    setTimeout(() => {
      button.classList.remove('just-clicked');
    }, 600);
  }
};
</script>

<style scoped>
/* Botón favorito base */
.favorite-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: white;
  border-radius: 50%;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
}

/* Versión grande */
.favorite-button--large {
  width: 3.5rem;
  height: 3.5rem;
}

.favorite-button:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.favorite-button:active {
  transform: scale(0.95);
}

.favorite-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.favorite-button svg {
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
}

.favorite-button--large svg {
  width: 28px;
  height: 28px;
}

/* Colores por defecto - GRIS */
.favorite-button svg {
  color: #6b7280;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

/* Colores cuando es favorito - ROJO */
.favorite-button[aria-pressed="true"] svg {
  color: #dc2626;
  fill: #dc2626;
  stroke: #dc2626;
}

/* Animación SOLO cuando se hace click */
.favorite-button.just-clicked svg {
  animation: heartPop 0.6s ease-out;
}

@keyframes heartPop {
  0% { 
    transform: scale(1);
  }
  50% { 
    transform: scale(2.5);
  }
  100% { 
    transform: scale(1);
  }
}
</style>