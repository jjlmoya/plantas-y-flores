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
        <button @click="setQuickFilter('current-month')" class="quick-btn">
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
      <input
        type="text"
        v-model="searchQuery"
        @input="debounceSearch"
        placeholder="🔍 Buscar plantas..."
        class="search-input"
      />
    </div>

    <div class="results-summary">
      <strong>{{ filteredCount }}</strong> plantas encontradas
    </div>

    <div class="plants-grid">
      <div 
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
          <span v-if="getPlantActivity(plant, 'sowing').length > 0" class="activity-tag sowing">
            🌱 {{ getPlantActivity(plant, 'sowing').map(m => getMonthName(m).slice(0,3)).join(', ') }}
          </span>
          <span v-if="getPlantActivity(plant, 'harvesting').length > 0" class="activity-tag harvesting">
            🌾 {{ getPlantActivity(plant, 'harvesting').map(m => getMonthName(m).slice(0,3)).join(', ') }}
          </span>
          <span v-if="getPlantActivity(plant, 'transplanting').length > 0" class="activity-tag transplanting">
            🌿 {{ getPlantActivity(plant, 'transplanting').map(m => getMonthName(m).slice(0,3)).join(', ') }}
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

    <div v-if="filteredPlants.length === 0" class="no-results">
      🔍 No se encontraron plantas
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
      selectedActivity: '',
      selectedMonth: '',
      currentMonth: new Date().getMonth() + 1,
      searchQuery: '',
      searchDebounceTimer: null
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
    }
  },
  methods: {
    updateFilters() {
      // Just trigger reactivity
    },
    clearAllFilters() {
      this.selectedCategory = '';
      this.selectedActivity = '';
      this.selectedMonth = '';
      this.searchQuery = '';
    },
    debounceSearch() {
      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = setTimeout(() => {
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

.no-results {
  text-align: center;
  padding: 2rem;
  color: #718096;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .filters-row {
    grid-template-columns: 1fr;
  }
  
  .plants-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .quick-btn {
    width: 100%;
  }
}
</style>