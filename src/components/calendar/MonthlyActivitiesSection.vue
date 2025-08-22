<template>
  <section class="monthly-activities-section">
    <div class="section-header">
      <h2>🗓️ Actividades para {{ currentMonthName }}</h2>
      <a :href="`/calendario/mes/${getMonthSlug(currentMonth)}/`" class="view-full-btn">
        Ver calendario completo →
      </a>
    </div>

    <div v-if="hasActivities" class="activities-container">
      <!-- Activity type navigation -->
      <div class="activity-tabs">
        <button 
          v-for="tab in activityTabs" 
          :key="tab.type"
          @click="setActiveTab(tab.type)"
          class="activity-tab"
          :class="{ active: activeTab === tab.type }"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-text">{{ tab.name }}</span>
          <span class="tab-count">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Activities carousel for active tab -->
      <div class="activity-carousel-container">
        <div class="carousel-header">
          <h3>{{ getActiveTabInfo().icon }} {{ getActiveTabInfo().name }}</h3>
          <div class="carousel-controls">
            <button 
              @click="scrollActivitiesLeft" 
              :disabled="!canScrollLeft"
              class="scroll-btn"
              aria-label="Scroll izquierda"
            >
              ←
            </button>
            <button 
              @click="scrollActivitiesRight" 
              :disabled="!canScrollRight"
              class="scroll-btn"
              aria-label="Scroll derecha"
            >
              →
            </button>
          </div>
        </div>

        <div 
          ref="activitiesCarousel"
          class="activities-carousel"
          @scroll="updateScrollButtons"
        >
          <div class="activities-track">
            <div 
              v-for="[category, plants] in getCurrentTabActivities()" 
              :key="category"
              class="category-activity-card"
            >
              <div class="category-header">
                <span class="category-icon">{{ getCategoryIcon(category) }}</span>
                <h4>{{ formatCategoryName(category) }}</h4>
                <span class="plants-count">{{ Object.keys(plants).length }} plantas</span>
              </div>
              
              <div class="plants-list">
                <a 
                  v-for="[plantSlug, tasks] in Object.entries(plants).slice(0, 4)" 
                  :key="plantSlug"
                  :href="`/calendario/${category}/${plantSlug}/`"
                  class="plant-item"
                >
                  <span class="plant-name">{{ formatPlantName(plantSlug) }}</span>
                  <div class="plant-tasks">
                    <span 
                      v-for="task in tasks.slice(0, 2)" 
                      :key="task"
                      class="task-badge"
                      :class="`priority-${getTaskPriority(task)}`"
                    >
                      {{ getTaskIcon(task) }} {{ formatTaskName(task) }}
                    </span>
                  </div>
                </a>
                
                <div v-if="Object.keys(plants).length > 4" class="more-plants">
                  <a :href="`/calendario/categoria/${category}/`" class="more-plants-link">
                    +{{ Object.keys(plants).length - 4 }} más plantas
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-activities">
      <div class="no-activities-content">
        <span class="no-activities-icon">🌱</span>
        <h3>No hay actividades específicas este mes</h3>
        <p>Explora otras categorías o consulta los consejos estacionales</p>
        <a href="/calendario/" class="explore-btn">
          Explorar calendario completo
        </a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'MonthlyActivitiesSection',
  props: {
    currentMonthName: {
      type: String,
      required: true
    },
    currentMonth: {
      type: Number,
      required: true
    },
    monthlyTasks: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeTab: 'sowing',
      canScrollLeft: false,
      canScrollRight: true
    }
  },
  computed: {
    hasActivities() {
      return Object.keys(this.monthlyTasks).length > 0;
    },
    activityTabs() {
      const activities = this.groupActivitiesByType();
      return [
        {
          type: 'sowing',
          name: 'Sembrar',
          icon: '🌱',
          count: this.getActivityCount(activities.sowing)
        },
        {
          type: 'transplanting',
          name: 'Trasplantar',
          icon: '🌿',
          count: this.getActivityCount(activities.transplanting)
        },
        {
          type: 'harvesting',
          name: 'Cosechar',
          icon: '🌾',
          count: this.getActivityCount(activities.harvesting)
        },
        {
          type: 'flowering',
          name: 'Floración',
          icon: '🌸',
          count: this.getActivityCount(activities.flowering)
        },
        {
          type: 'pruning',
          name: 'Podar',
          icon: '✂️',
          count: this.getActivityCount(activities.pruning)
        }
      ].filter(tab => tab.count > 0); // Only show tabs with activities
    },
    groupedActivities() {
      return this.groupActivitiesByType();
    }
  },
  mounted() {
    this.updateScrollButtons();
    // Set active tab to first available activity
    if (this.activityTabs.length > 0) {
      this.activeTab = this.activityTabs[0].type;
    }
  },
  methods: {
    formatCategoryName(category) {
      if (!category || typeof category !== 'string') {
        return '';
      }
      return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
    },
    formatPlantName(slug) {
      if (!slug || typeof slug !== 'string') {
        return 'Sin nombre';
      }
      return slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    },
    formatTaskName(task) {
      if (!task || typeof task !== 'string') {
        return 'Sin definir';
      }
      const translations = {
        'sowing': 'Siembra', 'transplanting': 'Trasplante', 'harvesting': 'Cosecha',
        'flowering': 'Floración', 'planting': 'Plantación', 'pruning': 'Poda'
      };
      return translations[task] || task.charAt(0).toUpperCase() + task.slice(1).replace(/_/g, ' ');
    },
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
    getTaskIcon(task) {
      const icons = {
        'sowing': '🌱', 'transplanting': '🌿', 'harvesting': '🌾',
        'flowering': '🌸', 'planting': '🌳', 'pruning': '✂️'
      };
      return icons[task] || '🛠️';
    },
    getTaskPriority(task) {
      const priorities = {
        'sowing': 'high', 'transplanting': 'medium', 'harvesting': 'high',
        'flowering': 'low', 'planting': 'medium', 'pruning': 'low'
      };
      return priorities[task] || 'medium';
    },
    getMonthSlug(monthNumber) {
      const monthSlugs = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
      return monthSlugs[monthNumber - 1] || `mes-${monthNumber}`;
    },
    groupActivitiesByType() {
      const activities = {
        sowing: {},
        transplanting: {},
        harvesting: {},
        flowering: {},
        pruning: {},
        planting: {}
      };

      Object.entries(this.monthlyTasks).forEach(([category, plants]) => {
        Object.entries(plants).forEach(([plantSlug, tasks]) => {
          tasks.forEach(task => {
            if (activities[task]) {
              if (!activities[task][category]) {
                activities[task][category] = {};
              }
              if (!activities[task][category][plantSlug]) {
                activities[task][category][plantSlug] = [];
              }
              activities[task][category][plantSlug].push(task);
            }
          });
        });
      });

      return activities;
    },
    getActivityCount(activityData) {
      let count = 0;
      Object.values(activityData).forEach(category => {
        count += Object.keys(category).length;
      });
      return count;
    },
    setActiveTab(tabType) {
      this.activeTab = tabType;
      this.$nextTick(() => {
        this.updateScrollButtons();
      });
    },
    getActiveTabInfo() {
      return this.activityTabs.find(tab => tab.type === this.activeTab) || this.activityTabs[0];
    },
    getCurrentTabActivities() {
      const activities = this.groupedActivities[this.activeTab] || {};
      return Object.entries(activities).sort(([, a], [, b]) => {
        return Object.keys(b).length - Object.keys(a).length; // Sort by number of plants
      });
    },
    scrollActivitiesLeft() {
      const carousel = this.$refs.activitiesCarousel;
      if (carousel) {
        carousel.scrollBy({ left: -320, behavior: 'smooth' });
      }
    },
    scrollActivitiesRight() {
      const carousel = this.$refs.activitiesCarousel;
      if (carousel) {
        carousel.scrollBy({ left: 320, behavior: 'smooth' });
      }
    },
    updateScrollButtons() {
      const carousel = this.$refs.activitiesCarousel;
      if (!carousel) return;

      this.canScrollLeft = carousel.scrollLeft > 0;
      this.canScrollRight = carousel.scrollLeft < (carousel.scrollWidth - carousel.clientWidth);
    }
  }
}
</script>

<style scoped>
.monthly-activities-section {
  margin: 3rem 0;
  padding: 0 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.section-header h2 {
  color: #2d3748;
  font-size: 1.75rem;
  margin: 0;
}

.view-full-btn {
  background: #48bb78;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.view-full-btn:hover {
  background: #38a169;
  transform: translateY(-1px);
}

.activities-container {
  max-width: 1400px;
  margin: 0 auto;
}

.activity-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0.25rem;
}

.activity-tabs::-webkit-scrollbar {
  display: none;
}

.activity-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-weight: 500;
}

.activity-tab:hover {
  border-color: #48bb78;
  background: #f0fff4;
}

.activity-tab.active {
  border-color: #48bb78;
  background: #48bb78;
  color: white;
}

.tab-icon {
  font-size: 1.1rem;
}

.tab-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.activity-tab.active .tab-count {
  background: rgba(255, 255, 255, 0.3);
}

.activity-tab:not(.active) .tab-count {
  background: #e2e8f0;
  color: #4a5568;
}

.activity-carousel-container {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
}

.carousel-header h3 {
  color: #2d3748;
  margin: 0;
  font-size: 1.25rem;
}

.carousel-controls {
  display: flex;
  gap: 0.5rem;
}

.scroll-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #cbd5e0;
  background: white;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
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

.activities-carousel {
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.activities-carousel::-webkit-scrollbar {
  display: none;
}

.activities-track {
  display: flex;
  gap: 1.5rem;
  padding: 2rem;
  min-width: min-content;
}

.category-activity-card {
  flex: 0 0 300px;
  background: #fcfdfe;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.category-activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e0;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.category-icon {
  font-size: 1.5rem;
}

.category-header h4 {
  flex: 1;
  margin: 0;
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
}

.plants-count {
  background: #e2e8f0;
  color: #4a5568;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.plants-list {
  padding: 1rem;
}

.plant-item {
  display: block;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.plant-item:hover {
  border-color: #48bb78;
  background: #f0fff4;
  transform: translateX(2px);
}

.plant-name {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.plant-tasks {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.task-badge {
  background: #e2e8f0;
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.task-badge.priority-high {
  background: #fed7d7;
  color: #742a2a;
}

.task-badge.priority-medium {
  background: #feebc8;
  color: #9c4221;
}

.task-badge.priority-low {
  background: #c6f6d5;
  color: #22543d;
}

.more-plants {
  margin-top: 0.75rem;
  text-align: center;
}

.more-plants-link {
  color: #48bb78;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: 1px solid #48bb78;
  border-radius: 20px;
  display: inline-block;
  transition: all 0.3s ease;
}

.more-plants-link:hover {
  background: #48bb78;
  color: white;
}

.no-activities {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
}

.no-activities-content {
  max-width: 400px;
  margin: 0 auto;
}

.no-activities-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-activities h3 {
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.no-activities p {
  color: #718096;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.explore-btn {
  background: #48bb78;
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-block;
}

.explore-btn:hover {
  background: #38a169;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .monthly-activities-section {
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

  .activity-tabs {
    justify-content: flex-start;
    padding-bottom: 0.5rem;
  }

  .activity-tab {
    padding: 0.625rem 1rem;
    font-size: 0.9rem;
  }

  .carousel-header {
    padding: 1rem 1.5rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .activities-track {
    gap: 1rem;
    padding: 1rem;
  }

  .category-activity-card {
    flex: 0 0 280px;
  }

  .category-header {
    padding: 1rem;
  }

  .carousel-controls {
    display: none; /* Hide on mobile, use touch scroll */
  }
}

@media (max-width: 480px) {
  .activities-track {
    padding: 0.75rem;
  }

  .category-activity-card {
    flex: 0 0 260px;
  }

  .category-header {
    padding: 0.875rem;
    gap: 0.5rem;
  }

  .category-icon {
    font-size: 1.25rem;
  }

  .category-header h4 {
    font-size: 0.9rem;
  }

  .plants-count {
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
  }

  .plant-item {
    padding: 0.625rem;
  }

  .plant-name {
    font-size: 0.85rem;
  }
}
</style>