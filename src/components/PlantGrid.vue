<template>
  <section class="plant-grid">
    <header class="plant-grid__header" v-if="title || description">
      <h1 class="plant-grid__title" v-if="title">{{ title }}</h1>
      <p class="plant-grid__description" v-if="description">{{ description }}</p>
    </header>
    
    <div class="plant-grid__container">
      <PlantCard 
        v-for="plant in plants" 
        :key="plant.id" 
        :plant="plant" 
      />
    </div>
    
    <div class="plant-grid__empty" v-if="plants.length === 0">
      <p>No se encontraron plantas en esta categoría.</p>
    </div>
  </section>
</template>

<script setup>
import PlantCard from './PlantCard.vue';

defineProps({
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
</script>

<style scoped>
.plant-grid {
  width: 100%;
}

.plant-grid__header {
  text-align: center;
  margin-bottom: 3rem;
}

.plant-grid__title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2d5016;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.plant-grid__description {
  font-size: 1.125rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.plant-grid__container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.plant-grid__empty {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .plant-grid__title {
    font-size: 2rem;
  }
  
  .plant-grid__container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .plant-grid__header {
    margin-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  .plant-grid__container {
    gap: 1rem;
  }
}
</style>