<template>
  <article class="plant-card">
    <div class="plant-card__image">
      <template v-if="plant.main_image || plant.featured_image">
        <img 
          :src="getImagePath(plant.main_image || plant.featured_image)" 
          :alt="plant.title"
          loading="lazy"
          @error="onImageError"
          @load="onImageLoad"
          v-show="!imageError"
        />
        <div class="plant-card__image-fallback" v-if="imageError">
          <div class="plant-card__image-icon">🌱</div>
          <span class="plant-card__image-text">{{ plant.title }}</span>
        </div>
      </template>
      <template v-else>
        <div class="plant-card__image-placeholder">
          <div class="plant-card__image-icon">🌿</div>
          <span class="plant-card__image-text">{{ plant.title }}</span>
        </div>
      </template>
    </div>
    
    <div class="plant-card__content">
      <header class="plant-card__header">
        <h2 class="plant-card__title">
          <a :href="getPlantUrl(plant)" @click="trackPlantClick">{{ plant.title }}</a>
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
import { ref } from 'vue';

const props = defineProps({
  plant: {
    type: Object,
    required: true
  }
});

const imageError = ref(false);

const onImageError = () => {
  imageError.value = true;
};

const onImageLoad = () => {
  imageError.value = false;
};

const getImagePath = (imageUrl) => {
  if (!imageUrl) return '';
  
  // Si ya es una ruta local, devolverla tal como está
  if (imageUrl.startsWith('/wp-content/uploads/')) {
    return imageUrl;
  }
  
  // Convertir URLs de WordPress a rutas locales
  if (imageUrl.includes('plantasyflores.online/wp-content/uploads/')) {
    return imageUrl.replace(/https?:\/\/[^/]*\/wp-content\/uploads\//, '/wp-content/uploads/');
  }
  
  // Si no es una URL de WordPress, devolver tal como está
  return imageUrl;
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

// Función para trackear clics en plantas
const trackPlantClick = () => {
  // Verificar si gtag está disponible
  if (typeof gtag !== 'undefined') {
    const category = props.plant.categories[0]?.name || 'Plantas';
    gtag('event', 'plant_click', {
      'plant_name': props.plant.title,
      'plant_category': category,
      'event_category': 'Plants',
      'event_label': `${category} - ${props.plant.title}`
    });
  }
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.plant-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.12);
  border-color: rgba(74, 124, 35, 0.2);
}

.plant-card__image {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #f1f3f4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.plant-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  filter: saturate(0.95) brightness(1.02) contrast(1.05);
  border-radius: 0;
}

.plant-card:hover .plant-card__image img {
  transform: scale(1.08);
  filter: saturate(1.1) brightness(1.1);
}

.plant-card__image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    transparent 60%,
    rgba(0, 0, 0, 0.05) 100%
  );
  pointer-events: none;
}

.plant-card__image-fallback,
.plant-card__image-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fdf8 0%, #ecfdf5 100%);
  color: #166534;
  text-align: center;
  padding: 1rem;
  z-index: 2;
}

.plant-card__image-placeholder {
  background: linear-gradient(135deg, #fef3f2 0%, #fefaf0 100%);
  color: #92400e;
}

.plant-card__image-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.plant-card__image-text {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.plant-card__content {
  padding: 2rem 1.8rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.plant-card__title {
  margin: 0;
  font-size: clamp(1.1rem, 2.5vw, 1.35rem);
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.plant-card__title a {
  color: #1a5511;
  text-decoration: none;
  transition: color 0.3s ease;
  display: block;
}

.plant-card__title a:hover {
  color: #2d8a1f;
}

.plant-card__meta {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  font-size: 0.85rem;
  color: #64748b;
  flex-wrap: wrap;
}

.plant-card__date {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.plant-card__categories {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.plant-card__category {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #166534;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid rgba(22, 101, 52, 0.1);
}

.plant-card__category:hover {
  background: linear-gradient(135deg, #bbf7d0, #86efac);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(22, 101, 52, 0.15);
}

.plant-card__excerpt {
  flex: 1;
  color: #475569;
  line-height: 1.7;
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.plant-card__excerpt :deep(p) {
  margin: 0 0 0.8rem 0;
}

.plant-card__excerpt :deep(p:last-child) {
  margin-bottom: 0;
}

.plant-card__footer {
  margin-top: auto;
  padding-top: 1rem;
}

.plant-card__read-more {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.plant-card__read-more:hover {
  color: #1d4ed8;
  transform: translateX(2px);
}

.plant-card__read-more::after {
  content: '→';
  transition: transform 0.3s ease;
}

.plant-card__read-more:hover::after {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .plant-card {
    border-radius: 16px;
  }
  
  .plant-card__image {
    aspect-ratio: 16/10;
  }
  
  .plant-card__content {
    padding: 1.5rem 1.3rem;
    gap: 0.8rem;
  }
  
  .plant-card__meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
  
  .plant-card__excerpt {
    -webkit-line-clamp: 2;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .plant-card {
    border-radius: 12px;
  }
  
  .plant-card__image {
    aspect-ratio: 3/2;
  }
  
  .plant-card__content {
    padding: 1.2rem 1rem;
  }
  
  .plant-card__title {
    font-size: 1.1rem;
  }
  
  .plant-card:hover .plant-card__image img {
    transform: scale(1.05);
  }
}
</style>