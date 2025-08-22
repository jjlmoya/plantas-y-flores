<template>
  <section class="categories-carousel-section">
    <div class="section-header">
      <h2>🏷️ Explora por Categoría</h2>
      <div class="scroll-indicators">
        <button 
          @click="scrollLeft" 
          :disabled="!canScrollLeft"
          class="scroll-btn scroll-left"
          aria-label="Scroll izquierda"
        >
          ←
        </button>
        <button 
          @click="scrollRight" 
          :disabled="!canScrollRight"
          class="scroll-btn scroll-right"
          aria-label="Scroll derecha"
        >
          →
        </button>
      </div>
    </div>

    <div 
      ref="carousel"
      class="categories-carousel"
      @scroll="handleScroll"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div class="categories-track">
        <a
          v-for="category in categoriesWithCounts"
          :key="category.slug"
          :href="`/calendario/categoria/${category.slug}/`"
          class="category-card"
          :class="{ 'popular': category.count >= 8 }"
          @click="handleCategoryClick(category)"
        >
          <div class="category-icon">{{ category.icon }}</div>
          <div class="category-info">
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-count">{{ category.count }} plantas</p>
          </div>
          <div class="category-indicator">
            <span v-if="category.count >= 8" class="popular-badge">🔥</span>
            <span class="arrow">→</span>
          </div>
        </a>
      </div>
    </div>

    <!-- Mobile scroll dots -->
    <div class="scroll-dots mobile-only">
      <span 
        v-for="(dot, index) in scrollDots" 
        :key="index"
        class="dot"
        :class="{ active: index === activeDot }"
      ></span>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AllCategoriesCarousel',
  props: {
    categories: {
      type: Array,
      required: true
    },
    allPlantsWithCalendar: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      canScrollLeft: false,
      canScrollRight: true,
      activeDot: 0,
      touchStartX: 0,
      touchEndX: 0,
      isScrolling: false
    }
  },
  computed: {
    categoriesWithCounts() {
      return this.categories.map(category => {
        const count = this.getCategoryPlantCount(category);
        return {
          slug: category,
          name: this.formatCategoryName(category),
          icon: this.getCategoryIcon(category),
          count: count
        };
      }).sort((a, b) => b.count - a.count); // Sort by popularity
    },
    scrollDots() {
      // Calculate number of dots based on visible items
      const itemsPerView = this.getItemsPerView();
      return Math.ceil(this.categoriesWithCounts.length / itemsPerView);
    }
  },
  mounted() {
    this.updateScrollButtons();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize);
    }
  },
  beforeUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize);
    }
  },
  methods: {
    getCategoryIcon(category) {
      const icons = {
        'tomate': '🍅', 'rosa': '🌹', 'albahaca': '🌿', 'lirios': '🏵️',
        'hibiscus': '🌺', 'amapola': '🌸', 'patata': '🥔', 'fresa': '🍓',
        'chili': '🌶️', 'lavanda': '💜', 'cosmos': '🌼', 'margarita': '🌻',
        'hortensias': '💙', 'azalea': '🌺', 'tomillo': '🌿', 'tulipan': '🌷',
        'orquidea': '🌺', 'platano': '🍌', 'col': '🥬', 'mango': '🥭',
        'pensamiento': '💜', 'peonia': '🌸', 'pina': '🍍',
        'plantas-comestibles': '🥗', 'manzanilla': '🌼'
      };
      return icons[category] || '🌱';
    },
    formatCategoryName(category) {
      if (!category || typeof category !== 'string') {
        return '';
      }
      return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
    },
    getCategoryPlantCount(category) {
      return this.allPlantsWithCalendar.filter(plant => 
        plant.category === category
      ).length;
    },
    scrollLeft() {
      const carousel = this.$refs.carousel;
      const scrollAmount = this.getScrollAmount();
      carousel.scrollBy({ 
        left: -scrollAmount, 
        behavior: 'smooth' 
      });
    },
    scrollRight() {
      const carousel = this.$refs.carousel;
      const scrollAmount = this.getScrollAmount();
      carousel.scrollBy({ 
        left: scrollAmount, 
        behavior: 'smooth' 
      });
    },
    getScrollAmount() {
      // Scroll by 2-3 cards width
      return 280 * 2.5;
    },
    getItemsPerView() {
      if (typeof window === 'undefined') return 4; // Default for SSR
      const width = window.innerWidth;
      if (width < 480) return 1;
      if (width < 768) return 2;
      if (width < 1024) return 3;
      return 4;
    },
    handleScroll() {
      if (this.isScrolling) return;
      
      this.updateScrollButtons();
      this.updateActiveDot();
    },
    updateScrollButtons() {
      const carousel = this.$refs.carousel;
      if (!carousel) return;

      this.canScrollLeft = carousel.scrollLeft > 0;
      this.canScrollRight = carousel.scrollLeft < (carousel.scrollWidth - carousel.clientWidth);
    },
    updateActiveDot() {
      const carousel = this.$refs.carousel;
      if (!carousel) return;

      const itemWidth = 280; // Card width + gap
      const itemsPerView = this.getItemsPerView();
      const scrollPosition = carousel.scrollLeft;
      const dotIndex = Math.round(scrollPosition / (itemWidth * itemsPerView));
      
      this.activeDot = Math.min(dotIndex, this.scrollDots - 1);
    },
    handleResize() {
      this.updateScrollButtons();
      this.updateActiveDot();
    },
    handleCategoryClick(category) {
      // Emit event for analytics or other tracking
      this.$emit('category-selected', category);
    },
    // Touch events for mobile
    handleTouchStart(e) {
      this.touchStartX = e.touches[0].clientX;
    },
    handleTouchMove(e) {
      if (!this.touchStartX) return;
      this.touchEndX = e.touches[0].clientX;
    },
    handleTouchEnd() {
      if (!this.touchStartX || !this.touchEndX) return;
      
      const diff = this.touchStartX - this.touchEndX;
      const minSwipeDistance = 50;
      
      if (Math.abs(diff) > minSwipeDistance) {
        if (diff > 0 && this.canScrollRight) {
          this.scrollRight();
        } else if (diff < 0 && this.canScrollLeft) {
          this.scrollLeft();
        }
      }
      
      this.touchStartX = 0;
      this.touchEndX = 0;
    }
  }
}
</script>

<style scoped>
.categories-carousel-section {
  margin: 2rem 0;
  padding: 0 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.section-header h2 {
  color: #2d3748;
  font-size: 1.75rem;
  margin: 0;
}

.scroll-indicators {
  display: flex;
  gap: 0.5rem;
}

.scroll-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  background: white;
  color: #4a5568;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-btn:hover:not(:disabled) {
  border-color: #48bb78;
  color: #48bb78;
  background: #f0fff4;
}

.scroll-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.categories-carousel {
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-snap-type: x mandatory;
  padding-bottom: 1rem;
}

.categories-carousel::-webkit-scrollbar {
  display: none;
}

.categories-track {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  min-width: min-content;
}

.category-card {
  flex: 0 0 250px;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  scroll-snap-align: start;
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(72, 187, 120, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-card:hover {
  transform: translateY(-4px);
  border-color: #48bb78;
  box-shadow: 0 8px 25px rgba(72, 187, 120, 0.15);
}

.category-card:hover::before {
  opacity: 1;
}

.category-card.popular {
  border-color: #f6ad55;
  background: linear-gradient(135deg, #fffbf0 0%, #fef5e7 100%);
}

.category-card.popular:hover {
  border-color: #ed8936;
  box-shadow: 0 8px 25px rgba(237, 137, 54, 0.15);
}

.category-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.category-info {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.category-name {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  text-transform: capitalize;
}

.category-count {
  margin: 0;
  font-size: 0.85rem;
  color: #718096;
}

.category-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  position: relative;
  z-index: 1;
}

.popular-badge {
  font-size: 1rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.arrow {
  font-size: 1.2rem;
  color: #a0aec0;
  transition: all 0.3s ease;
}

.category-card:hover .arrow {
  color: #48bb78;
  transform: translateX(2px);
}

.category-card.popular:hover .arrow {
  color: #ed8936;
}

.scroll-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cbd5e0;
  transition: all 0.3s ease;
}

.dot.active {
  background: #48bb78;
  transform: scale(1.2);
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .categories-carousel-section {
    padding: 0 0.5rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }

  .categories-track {
    gap: 0.75rem;
    padding: 0.25rem;
  }

  .category-card {
    flex: 0 0 220px;
    padding: 1.25rem;
    gap: 0.75rem;
  }

  .category-icon {
    font-size: 2rem;
  }

  .category-name {
    font-size: 1rem;
  }

  .category-count {
    font-size: 0.8rem;
  }

  .mobile-only {
    display: flex;
  }

  .scroll-indicators {
    display: none;
  }
}

@media (max-width: 480px) {
  .categories-track {
    gap: 0.5rem;
  }

  .category-card {
    flex: 0 0 200px;
    padding: 1rem;
    border-radius: 12px;
  }

  .category-icon {
    font-size: 1.75rem;
  }

  .category-name {
    font-size: 0.95rem;
  }

  .category-count {
    font-size: 0.75rem;
  }

  .arrow {
    font-size: 1rem;
  }
}

/* CSS Scroll Snap for better mobile experience */
@media (max-width: 768px) {
  .categories-carousel {
    scroll-snap-type: x mandatory;
  }
  
  .category-card {
    scroll-snap-align: center;
  }
}
</style>