<template>
  <article class="plant-card">
    <div class="plant-card__image" v-if="plant.featured_image">
      <img 
        :src="getImagePath(plant.featured_image)" 
        :alt="plant.title"
        loading="lazy"
      />
    </div>
    
    <div class="plant-card__content">
      <header class="plant-card__header">
        <h2 class="plant-card__title">
          <a :href="getPlantUrl(plant)">{{ plant.title }}</a>
        </h2>
        
        <div class="plant-card__meta">
          <time :datetime="plant.date" class="plant-card__date">
            {{ formatDate(plant.date) }}
          </time>
          
          <div class="plant-card__categories">
            <a 
              v-for="category in plant.categories"
              :key="category.slug"
              :href="`/${category.slug}/`"
              class="plant-card__category"
            >
              {{ category.name }}
            </a>
          </div>
        </div>
      </header>
      
      <div class="plant-card__excerpt" v-html="cleanExcerpt(plant.excerpt)"></div>
      
      <footer class="plant-card__footer">
        <a :href="getPlantUrl(plant)" class="plant-card__read-more">
          Leer más
        </a>
      </footer>
    </div>
  </article>
</template>

<script setup>
defineProps({
  plant: {
    type: Object,
    required: true
  }
});

const getImagePath = (imageUrl) => {
  if (!imageUrl) return '';
  // Convertir URLs de WordPress a rutas locales
  return imageUrl.replace('https://plantasyflores.online/wp-content/uploads/', '/images/');
};

const getPlantUrl = (plant) => {
  const category = plant.categories[0]?.slug || 'plantas';
  return `/${category}/${plant.slug}/`;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const cleanExcerpt = (excerpt) => {
  return excerpt
    .replace(/<a[^>]*class="more-link"[^>]*>.*?<\/a>/gi, '')
    .replace(/&hellip;/g, '...')
    .trim();
};
</script>

<style scoped>
.plant-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.plant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.plant-card__image {
  aspect-ratio: 16/9;
  overflow: hidden;
}

.plant-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.plant-card:hover .plant-card__image img {
  transform: scale(1.05);
}

.plant-card__content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.plant-card__title {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
}

.plant-card__title a {
  color: #2d5016;
  text-decoration: none;
  transition: color 0.3s ease;
}

.plant-card__title a:hover {
  color: #4a7c23;
}

.plant-card__meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #666;
}

.plant-card__categories {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.plant-card__category {
  background: #e8f5e8;
  color: #2d5016;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.plant-card__category:hover {
  background: #d1e7dd;
}

.plant-card__excerpt {
  flex: 1;
  color: #555;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.plant-card__excerpt :deep(p) {
  margin: 0 0 1rem 0;
}

.plant-card__footer {
  margin-top: auto;
}

.plant-card__read-more {
  color: #4a7c23;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.plant-card__read-more:hover {
  color: #2d5016;
}

@media (max-width: 768px) {
  .plant-card__content {
    padding: 1rem;
  }
  
  .plant-card__meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>