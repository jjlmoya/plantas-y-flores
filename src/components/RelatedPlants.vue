<template>
  <section class="related-plants" v-if="relatedPlants.length > 0">
    <div class="related-plants__header">
      <h2 class="related-plants__title">
        <span class="related-plants__icon">🌿</span>
        Artículos Relacionados
      </h2>
      <p class="related-plants__subtitle">
        Descubre más plantas de la misma categoría
      </p>
    </div>
    
    <div class="related-plants__grid">
      <article 
        v-for="plant in relatedPlants" 
        :key="plant.slug"
        class="related-plant-card"
      >
        <div class="related-plant-card__image">
          <template v-if="plant.main_image || plant.featured_image">
            <img 
              :src="getImagePath(plant.main_image || plant.featured_image)" 
              :alt="plant.title"
              loading="lazy"
              @error="onImageError($event)"
            />
          </template>
          <template v-else>
            <div class="related-plant-card__placeholder">
              <div class="related-plant-card__icon">🌱</div>
            </div>
          </template>
        </div>
        
        <div class="related-plant-card__content">
          <h3 class="related-plant-card__title">
            <a :href="getPlantUrl(plant)">{{ plant.title }}</a>
          </h3>
          
          <div class="related-plant-card__meta">
            <div class="related-plant-card__categories">
              <span 
                v-for="category in plant.categories.slice(0, 1)" 
                :key="category.slug"
                class="related-plant-card__category"
              >
                {{ category.name }}
              </span>
            </div>
            
            <div class="related-plant-card__match" v-if="getMatchReason(plant)">
              <span class="related-plant-card__match-icon">{{ getMatchIcon(plant) }}</span>
              <span class="related-plant-card__match-text">{{ getMatchReason(plant) }}</span>
            </div>
          </div>
          
          <p class="related-plant-card__excerpt" v-html="cleanExcerpt(plant.excerpt)"></p>
          
          <a :href="getPlantUrl(plant)" class="related-plant-card__link">
            Leer más
            <span class="related-plant-card__arrow">→</span>
          </a>
        </div>
      </article>
    </div>
    
    <div class="related-plants__footer" v-if="categoryName">
      <a :href="`/${currentPlant.categories[0]?.slug || 'plantas'}/`" class="related-plants__view-all">
        Ver todas las plantas de {{ categoryName }}
        <span class="related-plants__count">({{ totalInCategory }})</span>
      </a>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPlant: {
    type: Object,
    required: true
  },
  allPlants: {
    type: Array,
    required: true
  },
  maxResults: {
    type: Number,
    default: 6
  }
});

// Lógica para encontrar plantas relacionadas
const relatedPlants = computed(() => {
  const current = props.currentPlant;
  const plants = props.allPlants.filter(plant => plant.slug !== current.slug);
  
  // Crear puntuación para cada planta
  const scored = plants.map(plant => {
    let score = 0;
    const reasons = [];
    
    // Puntuación por categoría (peso alto)
    const sharedCategories = plant.categories.filter(cat => 
      current.categories.some(currentCat => currentCat.slug === cat.slug)
    );
    if (sharedCategories.length > 0) {
      score += sharedCategories.length * 10;
      reasons.push('same-category');
    }
    
    // Puntuación por tags (peso medio)
    if (plant.tags && current.tags) {
      const sharedTags = plant.tags.filter(tag => 
        current.tags.some(currentTag => currentTag.slug === tag.slug)
      );
      if (sharedTags.length > 0) {
        score += sharedTags.length * 5;
        reasons.push('same-tags');
      }
    }
    
    // Puntuación por similitud en el título (peso bajo)
    const currentWords = current.title.toLowerCase().split(' ');
    const plantWords = plant.title.toLowerCase().split(' ');
    const commonWords = currentWords.filter(word => 
      word.length > 3 && plantWords.includes(word)
    );
    if (commonWords.length > 0) {
      score += commonWords.length * 2;
      reasons.push('similar-title');
    }
    
    return { ...plant, score, reasons };
  });
  
  // Ordenar por puntuación y tomar los mejores
  return scored
    .filter(plant => plant.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, props.maxResults);
});

const categoryName = computed(() => {
  return props.currentPlant.categories[0]?.name || null;
});

const totalInCategory = computed(() => {
  if (!props.currentPlant.categories[0]) return 0;
  const categorySlug = props.currentPlant.categories[0].slug;
  return props.allPlants.filter(plant => 
    plant.categories.some(cat => cat.slug === categorySlug)
  ).length;
});

const getImagePath = (imageUrl) => {
  if (!imageUrl) return '';
  
  if (imageUrl.startsWith('/wp-content/uploads/')) {
    return imageUrl;
  }
  
  if (imageUrl.includes('plantasyflores.online/wp-content/uploads/')) {
    return imageUrl.replace(/https?:\/\/[^/]*\/wp-content\/uploads\//, '/wp-content/uploads/');
  }
  
  return imageUrl;
};

const getPlantUrl = (plant) => {
  const category = plant.categories[0]?.slug || 'plantas';
  return `/${category}/${plant.slug}/`;
};

const onImageError = (event) => {
  const img = event.target;
  const card = img.closest('.related-plant-card__image');
  if (card) {
    img.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.className = 'related-plant-card__placeholder';
    placeholder.innerHTML = '<div class="related-plant-card__icon">🌱</div>';
    card.appendChild(placeholder);
  }
};

const getMatchReason = (plant) => {
  if (plant.reasons.includes('same-category')) {
    return 'Misma categoría';
  }
  if (plant.reasons.includes('same-tags')) {
    return 'Tags similares';
  }
  if (plant.reasons.includes('similar-title')) {
    return 'Tema relacionado';
  }
  return null;
};

const getMatchIcon = (plant) => {
  if (plant.reasons.includes('same-category')) return '📂';
  if (plant.reasons.includes('same-tags')) return '🏷️';
  if (plant.reasons.includes('similar-title')) return '🔗';
  return '🌿';
};

const cleanExcerpt = (excerpt) => {
  return excerpt
    .replace(/<a[^>]*class="more-link"[^>]*>.*?<\/a>/gi, '')
    .replace(/&hellip;/g, '...')
    .replace(/<[^>]*>/g, '')
    .substring(0, 120) + '...';
};
</script>

<style scoped>
.related-plants {
  margin: 4rem 0 2rem 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.related-plants__header {
  text-align: center;
  margin-bottom: 3rem;
}

.related-plants__title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: clamp(1.8rem, 3vw, 2.2rem);
  font-weight: 700;
  color: #1a5511;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.related-plants__icon {
  font-size: 1.2em;
  opacity: 0.8;
}

.related-plants__subtitle {
  color: #64748b;
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
}

.related-plants__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.related-plant-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.related-plant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: rgba(74, 124, 35, 0.2);
}

.related-plant-card__image {
  position: relative;
  aspect-ratio: 5/3;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.related-plant-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.4s ease;
}

.related-plant-card:hover .related-plant-card__image img {
  transform: scale(1.05);
}

.related-plant-card__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
  color: #166534;
}

.related-plant-card__icon {
  font-size: 2.5rem;
  opacity: 0.7;
}

.related-plant-card__content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.related-plant-card__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
}

.related-plant-card__title a {
  color: #1a5511;
  text-decoration: none;
  transition: color 0.3s ease;
}

.related-plant-card__title a:hover {
  color: #2d8a1f;
}

.related-plant-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.related-plant-card__category {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #166534;
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
}

.related-plant-card__match {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.related-plant-card__match-icon {
  opacity: 0.8;
}

.related-plant-card__excerpt {
  flex: 1;
  color: #475569;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.related-plant-card__link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
  transition: all 0.3s ease;
}

.related-plant-card__link:hover {
  color: #1d4ed8;
  transform: translateX(2px);
}

.related-plant-card__arrow {
  transition: transform 0.3s ease;
}

.related-plant-card__link:hover .related-plant-card__arrow {
  transform: translateX(4px);
}

.related-plants__footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}

.related-plants__view-all {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #4a7c23, #2d5016);
  color: white;
  padding: 0.875rem 1.75rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(74, 124, 35, 0.3);
}

.related-plants__view-all:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 124, 35, 0.4);
  background: linear-gradient(135deg, #5a8c33, #3d6026);
}

.related-plants__count {
  opacity: 0.8;
  font-weight: 400;
}

@media (max-width: 768px) {
  .related-plants {
    padding: 2rem 1.5rem;
    margin: 3rem 0 1.5rem 0;
    border-radius: 20px;
  }
  
  .related-plants__grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .related-plant-card__content {
    padding: 1.25rem;
  }
  
  .related-plant-card__meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .related-plants {
    padding: 1.5rem 1rem;
    border-radius: 16px;
  }
  
  .related-plants__title {
    font-size: 1.5rem;
  }
  
  .related-plant-card__content {
    padding: 1rem;
  }
}
</style>