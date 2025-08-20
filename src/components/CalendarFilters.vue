<template>
  <div class="calendar-filters">
    <div class="filters-header">
      <h3>🔍 Filtros</h3>
      <button v-if="hasActiveFilters" @click="clearAllFilters" class="clear-btn">
        Limpiar
      </button>
    </div>

    <div class="filters-row">
      <div class="filter-item">
        <select v-model="selectedCategory" @change="updateFilters">
          <option value="">🏷️ Todas las categorías</option>
          <option v-for="category in availableCategories" :key="category" :value="category">
            {{ getCategoryIcon(category) }} {{ formatCategoryName(category) }}
          </option>
        </select>
      </div>

      <div class="filter-item">
        <select v-model="selectedActivity" @change="updateFilters">
          <option value="">📋 Todas las actividades</option>
          <option v-for="activity in availableActivities" :key="activity" :value="activity">
            {{ formatTaskName(activity) }}
          </option>
        </select>
      </div>

      <div class="filter-item">
        <select v-model="selectedMonth" @change="updateFilters">
          <option value="">📅 Todos los meses</option>
          <option v-for="month in 12" :key="month" :value="month">
            {{ getMonthName(month) }}
          </option>
        </select>
      </div>

      <!-- Quick Action Buttons -->
      <div class="filter-item quick-actions">
        <button @click="setQuickFilter('current-month')" 
                class="quick-btn" 
                :class="{ 'active': isCurrentMonthSowingActive }">
          🌱 Qué plantar este mes
        </button>
        <button @click="setQuickFilter('next-month')" class="quick-btn">
          📅 Plantar el mes que entra
        </button>
        <button @click="setQuickFilter('harvest-now')" class="quick-btn">
          🌾 Qué cosechar ahora
        </button>
      </div>
    </div>

    <div class="search-row">
      <div class="search-wrapper">
        <input
          type="text"
          v-model="searchQuery"
          @input="debounceSearch"
          placeholder="🔍 Buscar plantas..."
          class="search-input"
          :class="{ 'searching': isSearching }"
        />
        <div v-if="isSearching" class="search-loading-indicator">
          <span class="loading-spinner small"></span>
        </div>
      </div>
    </div>

    <div class="results-summary">
      <div v-if="isLoading" class="loading-state">
        <span class="loading-spinner"></span>
        {{ loadingMessage }}
      </div>
      <div v-else-if="isSearching" class="loading-state">
        <span class="loading-spinner"></span>
        Buscando...
      </div>
      <div v-else>
        {{ resultsMessage }}
      </div>
    </div>

    <div class="plants-grid">
      <!-- Loading skeleton cards -->
      <div v-if="isLoading || isSearching" v-for="n in 6" :key="`skeleton-${n}`" class="plant-card skeleton-card">
        <div class="skeleton-header">
          <div class="skeleton-line skeleton-title"></div>
        </div>
        <div class="skeleton-activities">
          <div class="skeleton-tag"></div>
          <div class="skeleton-tag"></div>
          <div class="skeleton-tag"></div>
        </div>
        <div class="skeleton-actions">
          <div class="skeleton-button"></div>
          <div class="skeleton-button"></div>
        </div>
      </div>
      
      <!-- Actual plant cards -->
      <div 
        v-else
        v-for="plant in filteredPlants" 
        :key="`${plant.category}-${plant.slug}`"
        class="plant-card"
      >
        <div class="card-header">
          <div class="plant-info">
            <h4>{{ formatCategoryName(plant.category) }} {{ formatPlantName(plant.slug) }}</h4>
          </div>
        </div>

        <div class="card-activities">
          <span 
            v-for="activity in getPlantActivities(plant)" 
            :key="activity.type"
            :class="`activity-tag ${activity.type}`"
          >
            {{ activity.icon }} {{ activity.months }}
          </span>
        </div>

        <div class="card-actions">
          <a v-if="plant.calendar?._article_links?.resolved_link" 
             :href="plant.calendar._article_links.resolved_link" 
             class="btn-link">
            Ver artículo
          </a>
          <a :href="`/calendario/${plant.category}/${plant.slug}/`" 
             class="btn-link btn-calendar">
            Ver calendario
          </a>
        </div>
      </div>
    </div>

    <div v-if="!isLoading && !isSearching && filteredPlants.length === 0" class="no-results">
      <div class="no-results-content">
        <span class="no-results-icon">🔍</span>
        <h3>No se encontraron plantas</h3>
        <p v-if="hasActiveFilters">
          Intenta ajustar los filtros o realizar una búsqueda diferente
        </p>
        <p v-else>
          No hay plantas disponibles para mostrar
        </p>
        <button v-if="hasActiveFilters" @click="clearAllFilters" class="clear-filters-btn">
          Limpiar todos los filtros
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalendarFilters',
  props: {
    plants: {
      type: Array,
      default: () => []
    },
    availableCategories: {
      type: Array,
      default: () => []
    },
    availableActivities: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedCategory: '',
      selectedActivity: 'sowing', // Pre-select sowing activity
      selectedMonth: (new Date().getMonth() + 1).toString(), // Pre-select current month
      currentMonth: new Date().getMonth() + 1,
      searchQuery: '',
      searchDebounceTimer: null,
      isLoading: false,
      isSearching: false,
      loadingMessage: ''
    }
  },
  computed: {
    hasActiveFilters() {
      return this.selectedCategory ||
             this.selectedActivity ||
             this.selectedMonth ||
             this.searchQuery.trim();
    },
    filteredPlants() {
      if (!this.plants || this.plants.length === 0) {
        return [];
      }

      let plants = [...this.plants];

      if (this.selectedCategory) {
        plants = plants.filter(plant => plant.category === this.selectedCategory);
      }

      if (this.selectedActivity && this.selectedMonth) {
        // When both activity and month are selected, filter for plants that have that specific activity in that month
        plants = plants.filter(plant => {
          const monthNum = parseInt(this.selectedMonth);
          return this.hasSpecificActivityInMonth(plant, this.selectedActivity, monthNum);
        });
      } else if (this.selectedActivity) {
        plants = plants.filter(plant => {
          const plantActivity = this.getPlantActivity(plant, this.selectedActivity);
          return plantActivity.length > 0;
        });
      }

      if (this.selectedMonth) {
        plants = plants.filter(plant => {
          const monthNum = parseInt(this.selectedMonth);
          return this.hasActivityInMonth(plant, monthNum);
        });
      }


      if (this.searchQuery.trim()) {
        const search = this.searchQuery.toLowerCase();
        plants = plants.filter(plant => {
          const plantName = this.formatPlantName(plant.slug).toLowerCase();
          const categoryName = this.formatCategoryName(plant.category).toLowerCase();
          const scientificName = plant.calendar?.plant_info?.scientific_name?.toLowerCase() || '';
          
          return plantName.includes(search) || 
                 categoryName.includes(search) || 
                 scientificName.includes(search);
        });
      }

      return plants;
    },
    filteredCount() {
      return this.filteredPlants.length;
    },
    resultsMessage() {
      if (this.selectedActivity === 'sowing' && this.selectedMonth && !this.selectedCategory && !this.searchQuery.trim()) {
        const monthName = this.getMonthName(parseInt(this.selectedMonth));
        return `${this.filteredCount} plantas para sembrar en ${monthName}`;
      }
      return `${this.filteredCount} plantas encontradas`;
    },
    isCurrentMonthSowingActive() {
      return this.selectedActivity === 'sowing' && 
             this.selectedMonth === this.currentMonth.toString() && 
             !this.selectedCategory && 
             !this.searchQuery.trim();
    }
  },
  methods: {
    updateFilters() {
      this.isLoading = true;
      this.loadingMessage = 'Aplicando filtros...';
      
      // Simulate brief loading for better UX feedback
      setTimeout(() => {
        this.isLoading = false;
        this.loadingMessage = '';
        // Reactivity will trigger filtered results
      }, 150);
    },
    clearAllFilters() {
      this.selectedCategory = '';
      this.selectedActivity = '';
      this.selectedMonth = '';
      this.searchQuery = '';
    },
    debounceSearch() {
      this.isSearching = true;
      clearTimeout(this.searchDebounceTimer);
      
      this.searchDebounceTimer = setTimeout(() => {
        this.isSearching = false;
        // Search will trigger through computed property
      }, 300);
    },
    getMonthName(monthNumber) {
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                         'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      return monthNames[monthNumber - 1] || `Mes ${monthNumber}`;
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
    formatCategoryName(category) {
      if (!category || typeof category !== 'string') {
        return '';
      }
      return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
    },
    formatTaskName(task) {
      if (!task || typeof task !== 'string') {
        return 'Sin definir';
      }
      const translations = {
        'sowing': 'Siembra', 'transplanting': 'Trasplante', 'harvesting': 'Cosecha',
        'flowering': 'Floración', 'planting': 'Plantación', 'pruning': 'Poda',
        'beginner': 'Fácil', 'intermediate': 'Medio', 'advanced': 'Difícil'
      };
      return translations[task] || task.charAt(0).toUpperCase() + task.slice(1).replace(/_/g, ' ');
    },
    formatPlantName(slug) {
      if (!slug || typeof slug !== 'string') {
        return 'Sin nombre';
      }
      return slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    },
    getPlantActivity(plant, activityType) {
      const calendar = plant.calendar?.calendar_data;
      if (!calendar) return [];
      
      let months = [];
      
      if (activityType === 'sowing') {
        if (calendar.sowing?.indoor?.best_months) {
          months.push(...calendar.sowing.indoor.best_months);
        }
        if (calendar.sowing?.outdoor?.best_months) {
          months.push(...calendar.sowing.outdoor.best_months);
        }
      } else if (calendar[activityType]?.best_months) {
        months = calendar[activityType].best_months;
      }
      
      return [...new Set(months)]; // Remove duplicates
    },
    getPlantActivities(plant) {
      const activities = [];
      const activityTypes = ['sowing', 'transplanting', 'planting', 'flowering', 'harvesting', 'pruning'];
      
      const activityIcons = {
        sowing: '🌱',
        transplanting: '🌿', 
        planting: '🌳',
        flowering: '🌸',
        harvesting: '🌾',
        pruning: '✂️'
      };
      
      activityTypes.forEach(activityType => {
        const months = this.getPlantActivity(plant, activityType);
        if (months.length > 0) {
          activities.push({
            type: activityType,
            icon: activityIcons[activityType] || '•',
            months: months.map(m => this.getMonthName(m).slice(0, 3)).join(', ')
          });
        }
      });
      
      return activities;
    },
    hasActivityInMonth(plant, monthNum) {
      const calendar = plant.calendar?.calendar_data;
      if (!calendar) return false;
      
      const activities = ['sowing', 'transplanting', 'harvesting', 'flowering', 'planting'];
      
      return activities.some(activity => {
        if (activity === 'sowing') {
          return (calendar.sowing?.indoor?.best_months?.includes(monthNum)) ||
                 (calendar.sowing?.outdoor?.best_months?.includes(monthNum));
        }
        return calendar[activity]?.best_months?.includes(monthNum);
      });
    },
    hasSpecificActivityInMonth(plant, activityType, monthNum) {
      const calendar = plant.calendar?.calendar_data;
      if (!calendar) return false;
      
      if (activityType === 'sowing') {
        return (calendar.sowing?.indoor?.best_months?.includes(monthNum)) ||
               (calendar.sowing?.outdoor?.best_months?.includes(monthNum));
      }
      
      return calendar[activityType]?.best_months?.includes(monthNum);
    },
    setQuickFilter(filterType) {
      // Clear all filters first
      this.clearAllFilters();
      
      const currentMonth = this.currentMonth;
      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      
      switch(filterType) {
        case 'current-month':
          this.selectedActivity = 'sowing';
          this.selectedMonth = currentMonth.toString();
          break;
        case 'next-month':
          this.selectedActivity = 'sowing';
          this.selectedMonth = nextMonth.toString();
          break;
        case 'harvest-now':
          this.selectedActivity = 'harvesting';
          this.selectedMonth = currentMonth.toString();
          break;
      }
    }
  }
}
</script>

<style scoped>
.calendar-filters {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.filters-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.clear-btn {
  background: #f56565;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.clear-btn:hover {
  background: #e53e3e;
}

.filters-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-item select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  background: white;
  color: #2d3748;
  font-size: 0.9rem;
}

.filter-item select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-row {
  margin-bottom: 1rem;
}

.search-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 0.9rem;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-input.searching {
  padding-right: 3rem;
}

.search-loading-indicator {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

/* Loading spinner styles */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-left: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

.loading-spinner.small {
  width: 16px;
  height: 16px;
  border-width: 2px;
  margin-right: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state {
  display: flex;
  align-items: center;
  color: #718096;
  font-style: italic;
}

.results-summary {
  background: #f7fafc;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  color: #4a5568;
  font-size: 0.9rem;
}

.plants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.plant-card {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 1rem;
  background: white;
  transition: box-shadow 0.2s, transform 0.2s;
}

.plant-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 0.75rem;
}

.plant-info h4 {
  margin: 0;
  color: #2d3748;
  font-size: 1rem;
}

.card-activities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.activity-tag {
  background: #edf2f7;
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.activity-tag.sowing {
  background: #c6f6d5;
  color: #22543d;
}

.activity-tag.harvesting {
  background: #feebc8;
  color: #c05621;
}

.activity-tag.transplanting {
  background: #bee3f8;
  color: #2a69ac;
}

.activity-tag.planting {
  background: #d4edda;
  color: #155724;
}

.activity-tag.flowering {
  background: #f8d7da;
  color: #721c24;
}

.activity-tag.pruning {
  background: #e2e3e5;
  color: #383d41;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-link {
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  transition: background 0.2s;
  text-align: center;
}

.btn-link:hover {
  background: #5a67d8;
}

.btn-calendar {
  background: #48bb78;
}

.btn-calendar:hover {
  background: #38a169;
}

.quick-actions {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  padding: 1rem 0;
  border-top: 1px solid #e2e8f0;
  margin-top: 0.5rem;
}

.quick-btn {
  background: #edf2f7;
  color: #4a5568;
  border: 1px solid #cbd5e0;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}

.quick-btn:hover {
  background: #e2e8f0;
  border-color: #a0aec0;
  transform: translateY(-1px);
}

.quick-btn:active {
  transform: translateY(0);
}

.quick-btn.active {
  background: #667eea;
  color: white;
  border-color: #5a67d8;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
}

.quick-btn.active:hover {
  background: #5a67d8;
  border-color: #4c51bf;
}

/* Skeleton loading styles */
.skeleton-card {
  opacity: 0.7;
  pointer-events: none;
}

.skeleton-header {
  margin-bottom: 0.75rem;
}

.skeleton-line {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  height: 1rem;
}

.skeleton-title {
  width: 80%;
  height: 1.2rem;
}

.skeleton-activities {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.skeleton-tag {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  width: 60px;
  height: 24px;
  border-radius: 12px;
}

.skeleton-actions {
  display: flex;
  gap: 0.5rem;
}

.skeleton-button {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  width: 100px;
  height: 32px;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Enhanced no-results styles */
.no-results {
  text-align: center;
  padding: 3rem 1rem;
}

.no-results-content {
  max-width: 400px;
  margin: 0 auto;
}

.no-results-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-results h3 {
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.no-results p {
  color: #718096;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.clear-filters-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.clear-filters-btn:hover {
  background: #5a67d8;
}

@media (max-width: 768px) {
  .calendar-filters {
    padding: var(--space-md);
  }
  
  .filters-header {
    flex-direction: column;
    gap: var(--space-sm);
    text-align: center;
  }
  
  .filters-row {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
  
  .filter-item select {
    min-height: 48px; /* Larger touch target */
    font-size: 16px; /* Prevent zoom on iOS */
    padding: var(--space-sm) var(--space-md);
  }
  
  .search-input {
    min-height: 48px;
    font-size: 16px;
    padding: var(--space-sm) var(--space-md);
  }
  
  .quick-actions {
    flex-direction: column;
    gap: var(--space-xs);
  }
  
  .quick-btn {
    width: 100%;
    min-height: 44px;
    padding: var(--space-sm);
    font-size: var(--font-size-base);
  }
  
  .plants-grid {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
  
  .plant-card {
    padding: var(--space-sm);
  }
  
  .card-actions {
    flex-direction: column;
    gap: var(--space-xs);
  }
  
  .btn-link {
    width: 100%;
    min-height: 44px;
    text-align: center;
  }
  
  /* Mobile loading states */
  .loading-spinner {
    width: 18px;
    height: 18px;
  }
  
  .skeleton-activities {
    flex-wrap: wrap;
  }
  
  .skeleton-actions {
    flex-direction: column;
    gap: var(--space-xs);
  }
  
  .skeleton-button {
    width: 100%;
  }
  
  .no-results {
    padding: var(--space-xl) var(--space-sm);
  }
  
  .no-results-icon {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .calendar-filters {
    padding: var(--space-sm);
    margin: var(--space-sm);
  }
  
  .plant-card {
    padding: var(--space-xs) var(--space-sm);
  }
  
  .plant-info h4 {
    font-size: var(--font-size-base);
  }
  
  .activity-tag {
    font-size: 0.7rem;
    padding: calc(var(--space-xs) * 0.25) calc(var(--space-xs) * 0.5);
  }
}
</style>