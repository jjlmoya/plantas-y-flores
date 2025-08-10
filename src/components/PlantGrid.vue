<template>
  <section class="plant-grid">
    <header class="plant-grid__header" v-if="title || description">
      <h1 class="plant-grid__title" v-if="title">{{ title }}</h1>
      <p class="plant-grid__description" v-if="description">{{ description }}</p>
    </header>
    
    <div class="plant-grid__container">
      <template v-for="(plant, index) in plants" :key="plant.id">
        <PlantCard :plant="plant" />
        
        <!-- Insertar anuncio nativo cada 4 plantas 
        <AdSenseAd 
          v-if="shouldShowAd(index)"
          :ad-slot="getAdSlot(index)"
          ad-type="in-feed"
          class-name="grid-native-ad"
          :responsive="true"
        />
        -->
      </template>
    </div>
    
    <div class="plant-grid__empty" v-if="plants.length === 0">
      <p>No se encontraron plantas en esta categoría.</p>
    </div>
  </section>
</template>

<script setup>
import PlantCard from './PlantCard.vue';
import AdSenseAd from './AdSenseAd.vue';
import { computed } from 'vue';

const props = defineProps({
  plants: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
});

// Lógica para mostrar anuncios cada 4 plantas
const shouldShowAd = (index) => {
  return (index + 1) % 4 === 0 && index > 0;
};

// Generar diferentes slots para diferentes posiciones
const getAdSlot = (index) => {
  const baseSlots = ['7890123456', '8901234567', '9012345678'];
  const slotIndex = Math.floor(index / 4) % baseSlots.length;
  return baseSlots[slotIndex];
};
</script>

<style scoped>
.plant-grid {
  width: 100%;
}

.plant-grid__header {
  text-align: center;
  margin-bottom: 4rem;
}

.plant-grid__title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: #1a5511;
  margin: 0 0 1.5rem 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 4px rgba(26, 85, 17, 0.1);
}

.plant-grid__description {
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  color: #475569;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
  opacity: 0.9;
}

.plant-grid__container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  margin-bottom: 3rem;
  align-items: stretch;
}

.plant-grid__empty {
  text-align: center;
  padding: 6rem 2rem;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #64748b;
  font-size: 1.125rem;
  margin: 2rem 0;
}

/* Estilos para anuncios nativos en el grid - mismo tamaño que las cards */
:deep(.grid-native-ad) {
  /* Resetear todos los estilos conflictivos */
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  box-shadow: none;
  border-radius: 0;
  min-height: auto;
  display: block;
  position: static;
}

:deep(.grid-native-ad .adsense-container) {
  /* Aplicar estilos de PlantCard aquí */
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  height: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0;
  padding: 0;
}

:deep(.grid-native-ad .adsense-container:hover) {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

/* Simular la estructura de una PlantCard */
:deep(.grid-native-ad .adsense-container::before) {
  content: '';
  height: 200px;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%);
  position: relative;
  display: block;
}

:deep(.grid-native-ad .adsense-container::after) {
  content: '🌿';
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 4rem;
  opacity: 0.3;
  z-index: 1;
}

:deep(.grid-native-ad .ad-label) {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.7rem;
  color: #059669;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
  margin: 0;
}

:deep(.grid-native-ad .adsense-ad) {
  flex: 1;
  padding: 1.5rem;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  margin: 0;
}

@media (max-width: 1024px) {
  .plant-grid__container {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .plant-grid__header {
    margin-bottom: 3rem;
  }
  
  .plant-grid__container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  /* Ajustes para anuncios en móvil */
  :deep(.grid-native-ad .adsense-container) {
    min-height: 320px;
  }
  
  :deep(.grid-native-ad .adsense-container::before) {
    height: 150px;
  }
  
  :deep(.grid-native-ad .adsense-container::after) {
    top: 60px;
    font-size: 3rem;
  }
  
  :deep(.grid-native-ad .adsense-ad) {
    padding: 1rem;
  }
  
  :deep(.grid-native-ad .ad-label) {
    top: 0.75rem;
    right: 0.75rem;
    font-size: 0.65rem;
    padding: 0.2rem 0.6rem;
  }
}

@media (max-width: 480px) {
  .plant-grid__header {
    margin-bottom: 2rem;
  }
  
  .plant-grid__container {
    gap: 1.5rem;
  }
  
  .plant-grid__empty {
    padding: 4rem 1.5rem;
    border-radius: 16px;
    margin: 1rem 0;
  }
}
</style>