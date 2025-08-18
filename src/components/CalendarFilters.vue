<template>
  <div class="calendar-filters-widget">
    <div class="filters-header">
      <h3>
        <span class="filters-icon">🔍</span>
        Filtros
      </h3>
      <button 
        v-if="hasActiveFilters" 
        @click="clearAllFilters" 
        class="clear-all-btn"
        :disabled="loading"
      >
        Limpiar Filtros
      </button>
    </div>

    <div class="filters-content">
      <!-- Category Filter -->
      <div class="filter-group">
        <label class="filter-label">
          <span class="label-icon">🏷️</span>
          Categoría
        </label>
        <select 
          v-model="selectedCategory" 
          @change="updateFilters"
          class="filter-select"
          :disabled="loading"
        >
          <option value="">Todas las categorías</option>
          <option 
            v-for="category in availableCategories" 
            :key="category" 
            :value="category"
          >
            {{ ui.getCategoryIcon(category) }} {{ ui.formatCategoryName(category) }}
          </option>
        </select>
      </div>

      <!-- Activity Type Filter -->
      <div class="filter-group">
        <label class="filter-label">
          <span class="label-icon">📋</span>
          Tipo de Actividad
        </label>
        <div class="checkbox-group">
          <label 
            v-for="activity in availableActivities" 
            :key="activity"
            class="checkbox-label"
          >
            <input
              type="checkbox"
              :value="activity"
              v-model="selectedActivities"
              @change="updateFilters"
              :disabled="loading"
            />
            <span class="checkbox-custom"></span>
            <span 
              class="activity-dot" 
              :style="{ backgroundColor: ui.getActivityColor(activity) }"
            ></span>
            {{ ui.formatTaskName(activity) }}
          </label>
        </div>
      </div>

      <!-- Month/Season Filter -->
      <div class="filter-group">
        <label class="filter-label">
          <span class="label-icon">📅</span>
          Mes/Estación
        </label>
        <select 
          v-model="selectedMonth" 
          @change="updateFilters"
          class="filter-select"
          :disabled="loading"
        >
          <option value="">Todos los meses</option>
          <option 
            v-for="month in 12" 
            :key="month" 
            :value="month"
          >
            {{ ui.getMonthName(month) }}
          </option>
        </select>
      </div>

      <!-- Difficulty Filter -->
      <div class="filter-group">
        <label class="filter-label">
          <span class="label-icon">📊</span>
          Dificultad
        </label>
        <div class="difficulty-buttons">
          <button
            v-for="difficulty in availableDifficulties"
            :key="difficulty"
            @click="toggleDifficulty(difficulty)"
            :class="['difficulty-btn', difficulty, { 
              active: selectedDifficulties.includes(difficulty) 
            }]"
            :disabled="loading"
          >
            {{ ui.formatTaskName(difficulty) }}
          </button>
        </div>
      </div>

      <!-- Plant Type Filter -->
      <div class="filter-group">
        <label class="filter-label">
          <span class="label-icon">🌱</span>
          Tipo de Planta
        </label>
        <div class="type-buttons">
          <button
            v-for="type in availableTypes"
            :key="type"
            @click="togglePlantType(type)"
            :class="['type-btn', type, { 
              active: selectedTypes.includes(type) 
            }]"
            :disabled="loading"
          >
            {{ ui.formatTaskName(type) }}
          </button>
        </div>
      </div>

      <!-- Quick Filters -->
      <div class="filter-group quick-filters">
        <label class="filter-label">
          <span class="label-icon">⚡</span>
          Filtros Rápidos
        </label>
        <div class="quick-filter-buttons">
          <button
            @click="applyQuickFilter('beginner')"
            class="quick-filter-btn"
            :disabled="loading"
          >
            🌱 Para Principiantes
          </button>
          <button
            @click="applyQuickFilter('current_month')"
            class="quick-filter-btn"
            :disabled="loading"
          >
            📅 Actividades del Mes
          </button>
          <button
            @click="applyQuickFilter('harvest_ready')"
            class="quick-filter-btn"
            :disabled="loading"
          >
            🌾 Listas para Cosechar
          </button>
          <button
            @click="applyQuickFilter('continuous_harvest')"
            class="quick-filter-btn"
            :disabled="loading"
          >
            🔄 Cosecha Continua
          </button>
        </div>
      </div>

      <!-- Search Filter -->
      <div class="filter-group">
        <label class="filter-label">
          <span class="label-icon">🔍</span>
          Búsqueda
        </label>
        <div class="search-input-wrapper">
          <input
            type="text"
            v-model="searchQuery"
            @input="debounceSearch"
            placeholder="Buscar plantas..."
            class="search-input"
            :disabled="loading"
          />
          <button 
            v-if="searchQuery" 
            @click="clearSearch" 
            class="clear-search-btn"
            :disabled="loading"
          >
            ×
          </button>
        </div>
      </div>
    </div>

    <!-- Results Summary -->
    <div class="results-summary" v-if="!loading">
      <div class="summary-stats">
        <span class="stat-item">
          <strong>{{ filteredCount }}</strong> 
          {{ filteredCount === 1 ? 'planta encontrada' : 'plantas encontradas' }}
        </span>
        <span v-if="hasActiveFilters" class="stat-item">
          de {{ totalCount }} total
        </span>
      </div>
      
      <div v-if="hasActiveFilters" class="active-filters">
        <span class="active-filters-label">Filtros activos:</span>
        <div class="active-filter-tags">
          <span v-if="selectedCategory" class="filter-tag category">
            {{ ui.formatCategoryName(selectedCategory) }}
            <button @click="selectedCategory = ''; updateFilters()" class="remove-filter">×</button>
          </span>
          
          <span 
            v-for="activity in selectedActivities" 
            :key="activity"
            class="filter-tag activity"
          >
            {{ ui.formatTaskName(activity) }}
            <button @click="removeActivity(activity)" class="remove-filter">×</button>
          </span>
          
          <span v-if="selectedMonth" class="filter-tag month">
            {{ ui.getMonthName(selectedMonth) }}
            <button @click="selectedMonth = ''; updateFilters()" class="remove-filter">×</button>
          </span>
          
          <span 
            v-for="difficulty in selectedDifficulties" 
            :key="difficulty"
            class="filter-tag difficulty"
          >
            {{ ui.formatTaskName(difficulty) }}
            <button @click="removeDifficulty(difficulty)" class="remove-filter">×</button>
          </span>
          
          <span 
            v-for="type in selectedTypes" 
            :key="type"
            class="filter-tag type"
          >
            {{ ui.formatTaskName(type) }}
            <button @click="removeType(type)" class="remove-filter">×</button>
          </span>
        </div>
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
    ui: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    hemisphere: {
      type: String,
      default: 'northern'
    }
  },
  emits: ['filters-change'],
  data() {
    return {
      selectedCategory: '',
      selectedActivities: [],
      selectedMonth: '',
      selectedDifficulties: [],
      selectedTypes: [],
      searchQuery: '',
      searchDebounceTimer: null
    }
  },
  computed: {
    availableCategories() {
      const categories = new Set();
      this.plants.forEach(plant => {
        if (plant.category) {
          categories.add(plant.category);
        }
      });
      return Array.from(categories).sort();
    },
    availableActivities() {
      const activities = new Set();
      this.plants.forEach(plant => {
        if (plant.calendar?.calendar_data) {
          Object.keys(plant.calendar.calendar_data).forEach(activity => {
            if (['sowing', 'transplanting', 'harvesting', 'flowering', 'planting', 'pruning'].includes(activity)) {
              activities.add(activity);
            }
          });
        }
      });
      return Array.from(activities);
    },
    availableDifficulties() {
      const difficulties = new Set();
      this.plants.forEach(plant => {
        if (plant.calendar?.growing_conditions?.difficulty) {
          difficulties.add(plant.calendar.growing_conditions.difficulty);
        }
      });
      return Array.from(difficulties).sort();
    },
    availableTypes() {
      const types = new Set();
      this.plants.forEach(plant => {
        if (plant.calendar?.plant_info?.type) {
          types.add(plant.calendar.plant_info.type);
        }
      });
      return Array.from(types).sort();
    },
    hasActiveFilters() {
      return this.selectedCategory ||
             this.selectedActivities.length > 0 ||
             this.selectedMonth ||
             this.selectedDifficulties.length > 0 ||
             this.selectedTypes.length > 0 ||
             this.searchQuery.trim();
    },
    filteredPlants() {
      let filtered = [...this.plants];

      // Category filter
      if (this.selectedCategory) {
        filtered = filtered.filter(plant => plant.category === this.selectedCategory);
      }

      // Activity filter
      if (this.selectedActivities.length > 0) {
        filtered = filtered.filter(plant => {
          return this.selectedActivities.some(activity => {
            return plant.calendar?.calendar_data?.[activity];
          });
        });
      }

      // Month filter
      if (this.selectedMonth) {
        const adjustedMonth = this.getAdjustedMonth(this.selectedMonth);
        filtered = filtered.filter(plant => {
          return this.plantHasActivityInMonth(plant, adjustedMonth);
        });
      }

      // Difficulty filter
      if (this.selectedDifficulties.length > 0) {
        filtered = filtered.filter(plant => {
          return this.selectedDifficulties.includes(plant.calendar?.growing_conditions?.difficulty);
        });
      }

      // Type filter
      if (this.selectedTypes.length > 0) {
        filtered = filtered.filter(plant => {
          return this.selectedTypes.includes(plant.calendar?.plant_info?.type);
        });
      }

      // Search filter
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(plant => {
          const plantName = this.ui.formatPlantName(plant.slug).toLowerCase();
          const categoryName = this.ui.formatCategoryName(plant.category).toLowerCase();
          const scientificName = plant.calendar?.plant_info?.scientific_name?.toLowerCase() || '';
          
          return plantName.includes(query) ||
                 categoryName.includes(query) ||
                 scientificName.includes(query);
        });
      }

      return filtered;
    },
    filteredCount() {
      return this.filteredPlants.length;
    },
    totalCount() {
      return this.plants.length;
    }
  },
  methods: {
    updateFilters() {
      this.$emit('filters-change', {
        plants: this.filteredPlants,
        filters: {
          category: this.selectedCategory,
          activities: this.selectedActivities,
          month: this.selectedMonth,
          difficulties: this.selectedDifficulties,
          types: this.selectedTypes,
          search: this.searchQuery
        }
      });
    },
    clearAllFilters() {
      this.selectedCategory = '';
      this.selectedActivities = [];
      this.selectedMonth = '';
      this.selectedDifficulties = [];
      this.selectedTypes = [];
      this.searchQuery = '';
      this.updateFilters();
    },
    toggleDifficulty(difficulty) {
      const index = this.selectedDifficulties.indexOf(difficulty);
      if (index > -1) {
        this.selectedDifficulties.splice(index, 1);
      } else {
        this.selectedDifficulties.push(difficulty);
      }
      this.updateFilters();
    },
    togglePlantType(type) {
      const index = this.selectedTypes.indexOf(type);
      if (index > -1) {
        this.selectedTypes.splice(index, 1);
      } else {
        this.selectedTypes.push(type);
      }
      this.updateFilters();
    },
    removeActivity(activity) {
      const index = this.selectedActivities.indexOf(activity);
      if (index > -1) {
        this.selectedActivities.splice(index, 1);
        this.updateFilters();
      }
    },
    removeDifficulty(difficulty) {
      const index = this.selectedDifficulties.indexOf(difficulty);
      if (index > -1) {
        this.selectedDifficulties.splice(index, 1);
        this.updateFilters();
      }
    },
    removeType(type) {
      const index = this.selectedTypes.indexOf(type);
      if (index > -1) {
        this.selectedTypes.splice(index, 1);
        this.updateFilters();
      }
    },
    clearSearch() {
      this.searchQuery = '';
      this.updateFilters();
    },
    debounceSearch() {
      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = setTimeout(() => {
        this.updateFilters();
      }, 300);
    },
    applyQuickFilter(filterType) {
      this.clearAllFilters();
      
      const currentMonth = new Date().getMonth() + 1;
      
      switch (filterType) {
        case 'beginner':
          this.selectedDifficulties = ['beginner'];
          break;
        case 'current_month':
          this.selectedMonth = currentMonth;
          break;
        case 'harvest_ready':
          this.selectedActivities = ['harvesting'];
          this.selectedMonth = currentMonth;
          break;
        case 'continuous_harvest':
          // Filter for plants with continuous harvest capability
          // This would need to be implemented based on calendar data structure
          this.selectedActivities = ['harvesting'];
          break;
      }
      
      this.updateFilters();
    },
    getAdjustedMonth(month) {
      if (this.hemisphere === 'southern') {
        const adjusted = month + 6;
        return adjusted > 12 ? adjusted - 12 : adjusted;
      }
      return month;
    },
    plantHasActivityInMonth(plant, month) {
      const calendar = plant.calendar?.calendar_data;
      if (!calendar) return false;

      return Object.values(calendar).some(activityData => {
        if (activityData?.best_months?.includes(month)) return true;
        if (activityData?.alternative_months?.includes(month)) return true;
        
        // Check sub-activities
        if (typeof activityData === 'object' && activityData !== null) {
          return Object.values(activityData).some(subActivity => {
            return subActivity?.best_months?.includes(month);
          });
        }
        
        return false;
      });
    }
  },
  watch: {
    plants() {
      // Clear filters when plants change to avoid inconsistent state
      if (this.hasActiveFilters) {
        this.updateFilters();
      }
    }
  },
  mounted() {
    // Emit initial state
    this.updateFilters();
  }
}
</script>

<style scoped>
.calendar-filters-widget {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.filters-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filters-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filters-icon {
  font-size: 1.2rem;
}

.clear-all-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.clear-all-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.clear-all-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filters-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.label-icon {
  font-size: 1rem;
}

.filter-select {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.9rem;
  color: #2d3748;
  transition: border-color 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.filter-select:disabled {
  background: #f7fafc;
  color: #a0aec0;
  cursor: not-allowed;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
  font-size: 0.9rem;
  color: #4a5568;
}

.checkbox-label:hover {
  background: #f7fafc;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkbox-custom {
  width: 16px;
  height: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 3px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
  background: #667eea;
  border-color: #667eea;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 1px;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: block;
}

.difficulty-buttons, .type-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.difficulty-btn, .type-btn {
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  color: #4a5568;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-transform: capitalize;
}

.difficulty-btn:hover, .type-btn:hover {
  background: #edf2f7;
}

.difficulty-btn.active, .type-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.difficulty-btn:disabled, .type-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.difficulty-btn.beginner {
  border-color: #48bb78;
  color: #22543d;
}

.difficulty-btn.beginner.active {
  background: #48bb78;
  border-color: #48bb78;
}

.difficulty-btn.intermediate {
  border-color: #ed8936;
  color: #c05621;
}

.difficulty-btn.intermediate.active {
  background: #ed8936;
  border-color: #ed8936;
}

.difficulty-btn.advanced {
  border-color: #f56565;
  color: #c53030;
}

.difficulty-btn.advanced.active {
  background: #f56565;
  border-color: #f56565;
}

.type-btn.annual {
  border-color: #48bb78;
  color: #22543d;
}

.type-btn.annual.active {
  background: #48bb78;
  border-color: #48bb78;
}

.type-btn.perennial {
  border-color: #4299e1;
  color: #2a69ac;
}

.type-btn.perennial.active {
  background: #4299e1;
  border-color: #4299e1;
}

.type-btn.biennial {
  border-color: #ed8936;
  color: #c05621;
}

.type-btn.biennial.active {
  background: #ed8936;
  border-color: #ed8936;
}

.quick-filters {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.quick-filter-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.5rem;
}

.quick-filter-btn {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  border: none;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-align: center;
}

.quick-filter-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(72, 187, 120, 0.3);
}

.quick-filter-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.9rem;
  color: #2d3748;
  width: 100%;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-input:disabled {
  background: #f7fafc;
  color: #a0aec0;
  cursor: not-allowed;
}

.clear-search-btn {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  color: #a0aec0;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
}

.clear-search-btn:hover:not(:disabled) {
  color: #718096;
}

.results-summary {
  background: #f7fafc;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.summary-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.stat-item strong {
  color: #2d3748;
}

.active-filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.active-filters-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #4a5568;
}

.active-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tag {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-tag.category {
  background: #48bb78;
}

.filter-tag.activity {
  background: #ed8936;
}

.filter-tag.month {
  background: #4299e1;
}

.filter-tag.difficulty {
  background: #9f7aea;
}

.filter-tag.type {
  background: #38b2ac;
}

.remove-filter {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  cursor: pointer;
  font-size: 0.7rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.remove-filter:hover {
  background: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .filters-header {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }

  .filters-content {
    padding: 1rem;
    gap: 1rem;
  }

  .difficulty-buttons, .type-buttons {
    justify-content: center;
  }

  .quick-filter-buttons {
    grid-template-columns: 1fr;
  }

  .summary-stats {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .active-filter-tags {
    justify-content: center;
  }
}
</style>