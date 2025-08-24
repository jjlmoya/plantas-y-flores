<template>
  <div class="horizontal-plant-scroll">
    <div class="scroll-container">
      <div class="plants-track" ref="plantsTrack">
        <div 
          v-for="plant in plants" 
          :key="plant.id"
          class="plant-card"
          @click="navigateToPlant(plant)"
        >
          <div class="plant-image">
            <img 
              :src="getImageUrl(plant.main_image || plant.featured_image)" 
              :alt="plant.title"
              @error="handleImageError"
            />
          </div>
          <div class="plant-info">
            <h3 class="plant-title">{{ plant.title }}</h3>
            <p class="plant-excerpt">{{ getCleanExcerpt(plant.excerpt) }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Botones de navegación -->
    <button 
      class="scroll-btn scroll-left" 
      @click="scrollLeft"
      :disabled="!canScrollLeft"
    >
      ‹
    </button>
    <button 
      class="scroll-btn scroll-right" 
      @click="scrollRight"
      :disabled="!canScrollRight"
    >
      ›
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  plants: {
    type: Array,
    default: () => []
  }
})

// Refs
const plantsTrack = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)


// Métodos
const navigateToPlant = (plant) => {
  const categorySlug = plant.categories && plant.categories[0] ? plant.categories[0].slug : 'plantas'
  window.location.href = `/${categorySlug}/${plant.slug}/`
}

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/wp-content/uploads/2017/07/watering-can-1506750_1280-300x169.webp'
  if (imagePath.startsWith('http')) {
    return imagePath.replace('https://plantasyflores.online', '').replace('https://www.plantasyflores.online', '')
  }
  return imagePath
}

const handleImageError = (event) => {
  event.target.src = '/wp-content/uploads/2017/07/watering-can-1506750_1280-300x169.webp'
}

const getCleanExcerpt = (excerpt) => {
  if (!excerpt) return ''
  return excerpt.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim().substring(0, 80) + '...'
}

const scrollLeft = () => {
  if (plantsTrack.value) {
    plantsTrack.value.scrollBy({
      left: -300,
      behavior: 'smooth'
    })
  }
}

const scrollRight = () => {
  if (plantsTrack.value) {
    plantsTrack.value.scrollBy({
      left: 300,
      behavior: 'smooth'
    })
  }
}

const updateScrollButtons = () => {
  if (!plantsTrack.value) return
  
  const track = plantsTrack.value
  canScrollLeft.value = track.scrollLeft > 0
  canScrollRight.value = track.scrollLeft < (track.scrollWidth - track.clientWidth - 10)
}

onMounted(() => {
  updateScrollButtons()
  if (plantsTrack.value) {
    plantsTrack.value.addEventListener('scroll', updateScrollButtons)
  }
})

onBeforeUnmount(() => {
  if (plantsTrack.value) {
    plantsTrack.value.removeEventListener('scroll', updateScrollButtons)
  }
})
</script>

<style scoped>
.horizontal-plant-scroll {
  position: relative;
  margin: 2rem 0;
}

.scroll-container {
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.plants-track {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.plants-track::-webkit-scrollbar {
  display: none;
}

.plant-card {
  flex: 0 0 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.plant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.plant-image {
  height: 160px;
  overflow: hidden;
  position: relative;
}

.plant-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.plant-card:hover .plant-image img {
  transform: scale(1.05);
}

.plant-info {
  padding: 1rem;
}

.plant-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.plant-excerpt {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Botón favorito */
.plant-card__favorite-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: none;
  border-radius: 8px;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
}

.plant-card__favorite-btn:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.plant-card__favorite-btn:active {
  transform: scale(0.9);
}

.plant-card__favorite-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.plant-card__favorite-btn[aria-pressed="true"] {
  background: rgba(254, 242, 242, 0.9);
  color: #dc2626;
}

.plant-card__favorite-btn[aria-pressed="false"] {
  color: #6b7280;
}

.plant-card__favorite-btn svg {
  width: 14px;
  height: 14px;
  transition: all 0.2s ease;
}

.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(74, 124, 35, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-btn:hover {
  background: rgba(45, 80, 22, 1);
  transform: translateY(-50%) scale(1.1);
}

.scroll-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: translateY(-50%) scale(1);
}

.scroll-left {
  left: -20px;
}

.scroll-right {
  right: -20px;
}

@media (max-width: 768px) {
  .plant-card {
    flex: 0 0 240px;
  }
  
  .plant-image {
    height: 120px;
  }
  
  .scroll-btn {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }
  
  .scroll-left {
    left: -17px;
  }
  
  .scroll-right {
    right: -17px;
  }
}

@media (max-width: 480px) {
  .plant-card {
    flex: 0 0 200px;
  }
  
  .plants-track {
    padding: 1rem;
    gap: 0.75rem;
  }
}
</style>