<template>
  <section class="smart-filters-section">
    <div class="section-header">
      <h2>🔍 Encuentra Tu Planta Ideal</h2>
      <button 
        v-if="hasActiveFilters" 
        @click="clearAllFilters" 
        class="clear-all-btn"
      >
        Limpiar filtros
      </button>
    </div>

    <!-- Smart suggestions based on current context -->
    <div class="smart-suggestions">
      <h3>💡 Sugerencias Inteligentes</h3>
      <div class="suggestions-grid">
        <button 
          v-for="suggestion in contextualSuggestions" 
          :key="suggestion.id"
          @click="applySuggestion(suggestion)"
          class="suggestion-card"
          :class="{ active: isActiveSuggestion(suggestion) }"
        >
          <span class="suggestion-icon">{{ suggestion.icon }}</span>
          <div class="suggestion-content">
            <strong>{{ suggestion.title }}</strong>
            <p>{{ suggestion.description }}</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Quick search bar -->
    <div class="search-section">
      <div class="search-wrapper">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="🔍 Buscar plantas, categorías o actividades..."
          class="search-input"
          :class="{ 'searching': isSearching }"
        />
        <div v-if="isSearching" class="search-spinner">
          <div class="spinner"></div>
        </div>
      </div>
      
      <!-- Search suggestions dropdown -->
      <div v-if="searchSuggestions.length > 0" class="search-suggestions">
        <button 
          v-for="suggestion in searchSuggestions.slice(0, 5)" 
          :key="suggestion.id"
          @click="selectSearchSuggestion(suggestion)"
          class="search-suggestion-item"
        >
          <span class="suggestion-type">{{ suggestion.type }}</span>
          <span class="suggestion-text">{{ suggestion.text }}</span>
        </button>
      </div>
    </div>

    <!-- Quick action filters -->
    <div class="quick-filters">
      <h3>🏃‍♂️ Filtros Rápidos</h3>
      <div class="filters-carousel">
        <div class="filters-track">
          <button 
            v-for="filter in quickFilters" 
            :key="filter.id"
            @click="applyQuickFilter(filter)"
            class="quick-filter-btn"
            :class="{ active: isActiveFilter(filter) }"
          >
            <span class="filter-icon">{{ filter.icon }}</span>
            <span class="filter-text">{{ filter.text }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Results summary and grid -->
    <div v-if="showResults" class="results-section">
      <div class="results-header">
        <h3>{{ resultsTitle }}</h3>
        <span class="results-count">{{ filteredResults.length }} resultados</span>
      </div>

      <div v-if="isLoading" class="loading-grid">
        <div v-for="n in 6" :key="n" class="skeleton-card">
          <div class="skeleton-header"></div>
          <div class="skeleton-content">
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
          </div>
        </div>
      </div>

      <div v-else-if="filteredResults.length > 0" class="results-grid">
        <a 
          v-for="result in filteredResults.slice(0, showMoreResults ? filteredResults.length : 6)" 
          :key="result.id"
          :href="result.url"
          class="result-card"
        >
          <div class="result-icon">{{ result.icon }}</div>
          <div class="result-content">
            <h4>{{ result.title }}</h4>
            <p>{{ result.description }}</p>
            <div class="result-tags">
              <span 
                v-for="tag in result.tags.slice(0, 3)" 
                :key="tag"
                class="result-tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </a>
      </div>

      <div v-if="filteredResults.length > 6 && !showMoreResults" class="show-more-section">
        <button @click="showMoreResults = true" class="show-more-btn">
          Ver más resultados ({{ filteredResults.length - 6 }} más)
        </button>
      </div>

      <div v-if="filteredResults.length === 0" class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No se encontraron resultados</h3>
        <p>Intenta ajustar los filtros o usar términos de búsqueda diferentes</p>
        <button @click="clearAllFilters" class="clear-filters-btn">
          Limpiar todos los filtros
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SmartFiltersSection',
  props: {
    currentMonth: {
      type: Number,
      default: () => new Date().getMonth() + 1
    },
    categories: {
      type: Array,
      default: () => []
    },
    availableActivities: {
      type: Array,
      default: () => []
    },
    allPlantsWithCalendar: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchQuery: '',
      isSearching: false,
      isLoading: false,
      showResults: false,
      showMoreResults: false,
      searchDebounceTimer: null,
      activeFilters: {
        activity: null,
        month: null,
        category: null,
        suggestion: null
      },
      filteredResults: []
    }
  },
  computed: {
    contextualSuggestions() {
      const currentMonthName = this.getMonthName(this.currentMonth);
      const nextMonth = this.currentMonth === 12 ? 1 : this.currentMonth + 1;
      const nextMonthName = this.getMonthName(nextMonth);
      
      return [
        {
          id: 'sow-now',
          icon: '🌱',
          title: `Qué plantar este mes`,
          description: `Plantas ideales para sembrar en ${currentMonthName}`,
          filters: { activity: 'sowing', month: this.currentMonth }
        },
        {
          id: 'next-month',
          icon: '📅',
          title: `Plantar el mes que viene`,
          description: `Preparar para ${nextMonthName}`,
          filters: { activity: 'sowing', month: nextMonth }
        },
        {
          id: 'harvest-now',
          icon: '🌾',
          title: 'Qué cosechar ahora',
          description: 'Plantas listas para recoger',
          filters: { activity: 'harvesting', month: this.currentMonth }
        }
      ];
    },
    quickFilters() {
      return [
        { id: 'vegetables', icon: '🥬', text: 'Vegetales', type: 'category_group', value: ['tomate', 'patata', 'col'] },
        { id: 'flowers', icon: '🌸', text: 'Flores', type: 'category_group', value: ['rosa', 'tulipan', 'margarita'] },
        { id: 'herbs', icon: '🌿', text: 'Hierbas', type: 'category_group', value: ['albahaca', 'tomillo', 'lavanda'] },
        { id: 'current-month', icon: '📅', text: 'Este Mes', type: 'month', value: this.currentMonth },
        { id: 'popular', icon: '🔥', text: 'Populares', type: 'popular', value: true },
        { id: 'easy', icon: '😊', text: 'Fáciles', type: 'difficulty', value: 'easy' }
      ];
    },
    searchSuggestions() {
      if (!this.searchQuery || this.searchQuery.length < 2) return [];
      
      const query = this.searchQuery.toLowerCase();
      const suggestions = [];
      
      // Category suggestions
      this.categories.forEach(category => {
        const name = this.formatCategoryName(category).toLowerCase();
        if (name.includes(query)) {
          suggestions.push({
            id: `category-${category}`,
            type: '🏷️',
            text: this.formatCategoryName(category),
            category: category
          });
        }
      });
      
      // Plant suggestions
      this.allPlantsWithCalendar.forEach(plant => {
        const plantName = plant.slug.replace(/-/g, ' ').toLowerCase();
        if (plantName.includes(query)) {
          suggestions.push({
            id: `plant-${plant.slug}`,
            type: '🌱',
            text: this.formatPlantName(plant.slug),
            plant: plant
          });
        }
      });
      
      return suggestions;
    },
    hasActiveFilters() {
      return Object.values(this.activeFilters).some(filter => filter !== null) || this.searchQuery.trim();
    },
    resultsTitle() {
      if (this.activeFilters.suggestion) {
        return this.activeFilters.suggestion.title;
      }
      if (this.searchQuery.trim()) {
        return `Resultados para "${this.searchQuery}"`;
      }
      return 'Resultados de búsqueda';
    }
  },
  methods: {
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
        // Difficulty levels
        'beginner': 'Fácil', 'intermediate': 'Medio', 'advanced': 'Difícil',
        // Plant types
        'annual': 'Anual', 'perennial': 'Perenne', 'biennial': 'Bienal',
        'shrub': 'Arbusto', 'tree': 'Árbol',
        // Soil types
        'fertile': 'Fértil', 'well_drained_fertile': 'Bien drenado y fértil',
        'rich_organic': 'Rico en materia orgánica', 'well_drained': 'Bien drenado',
        // Sun requirements
        'full_sun': 'Sol directo', 'partial_sun': 'Sol parcial', 'partial_shade': 'Sombra parcial',
        // Water needs
        'low': 'Bajo', 'moderate': 'Moderado', 'high': 'Alto'
      };
      return translations[task] || task.charAt(0).toUpperCase() + task.slice(1).replace(/_/g, ' ');
    },
    applySuggestion(suggestion) {
      this.activeFilters.suggestion = suggestion;
      this.activeFilters = { ...this.activeFilters, ...suggestion.filters };
      this.performSearch();
    },
    isActiveSuggestion(suggestion) {
      return this.activeFilters.suggestion?.id === suggestion.id;
    },
    applyQuickFilter(filter) {
      this.clearAllFilters();
      this.activeFilters[filter.type] = filter.value;
      this.performSearch();
    },
    isActiveFilter(filter) {
      return this.activeFilters[filter.type] === filter.value;
    },
    handleSearch() {
      this.isSearching = true;
      clearTimeout(this.searchDebounceTimer);
      
      this.searchDebounceTimer = setTimeout(() => {
        this.isSearching = false;
        if (this.searchQuery.trim()) {
          this.performSearch();
        } else {
          this.showResults = false;
        }
      }, 300);
    },
    selectSearchSuggestion(suggestion) {
      this.searchQuery = suggestion.text;
      if (suggestion.category) {
        this.activeFilters.category = suggestion.category;
      }
      this.performSearch();
    },
    performSearch() {
      this.isLoading = true;
      this.showResults = true;
      this.showMoreResults = false;
      
      // Simulate API delay for better UX
      setTimeout(() => {
        this.filteredResults = this.filterResults();
        this.isLoading = false;
      }, 200);
    },
    filterResults() {
      let results = [];
      
      // Add matching plants
      this.allPlantsWithCalendar.forEach(plant => {
        if (this.matchesFilters(plant)) {
          results.push({
            id: `plant-${plant.category}-${plant.slug}`,
            type: 'plant',
            title: `${this.formatCategoryName(plant.category)} ${this.formatPlantName(plant.slug)}`,
            description: this.getPlantDescription(plant),
            icon: this.getCategoryIcon(plant.category),
            url: `/calendario/${plant.category}/${plant.slug}/`,
            tags: this.getPlantTags(plant)
          });
        }
      });
      
      // Add matching categories
      this.categories.forEach(category => {
        if (this.matchesCategoryFilters(category)) {
          results.push({
            id: `category-${category}`,
            type: 'category',
            title: this.formatCategoryName(category),
            description: `Ver todas las plantas de ${this.formatCategoryName(category)}`,
            icon: this.getCategoryIcon(category),
            url: `/calendario/categoria/${category}/`,
            tags: ['Categoría']
          });
        }
      });
      
      return results;
    },
    matchesFilters(plant) {
      // Search query
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        const plantName = plant.slug.replace(/-/g, ' ').toLowerCase();
        const categoryName = this.formatCategoryName(plant.category).toLowerCase();
        if (!plantName.includes(query) && !categoryName.includes(query)) {
          return false;
        }
      }
      
      // Category filter
      if (this.activeFilters.category && plant.category !== this.activeFilters.category) {
        return false;
      }
      
      // Activity and month filter
      if (this.activeFilters.activity && this.activeFilters.month) {
        return this.hasActivityInMonth(plant, this.activeFilters.activity, this.activeFilters.month);
      }
      
      return true;
    },
    matchesCategoryFilters(category) {
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        const categoryName = this.formatCategoryName(category).toLowerCase();
        return categoryName.includes(query);
      }
      return false;
    },
    hasActivityInMonth(plant, activity, month) {
      const calendar = plant.calendar?.calendar_data;
      if (!calendar) return false;
      
      if (activity === 'sowing') {
        return (calendar.sowing?.indoor?.best_months?.includes(month)) ||
               (calendar.sowing?.outdoor?.best_months?.includes(month));
      }
      
      return calendar[activity]?.best_months?.includes(month);
    },
    getPlantDescription(plant) {
      // Generate a smart description based on current filters
      if (this.activeFilters.activity) {
        const activityName = this.formatTaskName(this.activeFilters.activity);
        return `Ideal para ${activityName.toLowerCase()} en ${this.getMonthName(this.activeFilters.month || this.currentMonth)}`;
      }
      return 'Ver calendario completo de cultivo';
    },
    getPlantTags(plant) {
      const tags = [];
      
      // Add difficulty tag
      if (plant.calendar?.plant_info?.difficulty) {
        tags.push(this.formatTaskName(plant.calendar.plant_info.difficulty));
      }
      
      // Add activity tags for current month
      const calendar = plant.calendar?.calendar_data;
      if (calendar) {
        if (this.hasActivityInMonth(plant, 'sowing', this.currentMonth)) {
          tags.push('Sembrar ahora');
        }
        if (this.hasActivityInMonth(plant, 'harvesting', this.currentMonth)) {
          tags.push('Cosechar');
        }
      }
      
      return tags;
    },
    formatPlantName(slug) {
      return slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    },
    clearAllFilters() {
      this.activeFilters = {
        activity: null,
        month: null,
        category: null,
        suggestion: null
      };
      this.searchQuery = '';
      this.showResults = false;
      this.filteredResults = [];
    }
  }
}
</script>

<style scoped>
.smart-filters-section {
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

.clear-all-btn {
  background: #f56565;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.clear-all-btn:hover {
  background: #e53e3e;
  transform: translateY(-1px);
}

.smart-suggestions {
  margin-bottom: 2rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.smart-suggestions h3 {
  color: #4a5568;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.suggestion-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.suggestion-card:hover {
  border-color: #48bb78;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.15);
}

.suggestion-card.active {
  border-color: #48bb78;
  background: #f0fff4;
}

.suggestion-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.suggestion-content strong {
  display: block;
  color: #2d3748;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.suggestion-content p {
  margin: 0;
  color: #718096;
  font-size: 0.9rem;
}

.search-section {
  margin-bottom: 2rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
}

.search-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #48bb78;
  box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
}

.search-input.searching {
  padding-right: 3rem;
}

.search-spinner {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-left: 2px solid #48bb78;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e2e8f0;
  border-top: none;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.search-suggestion-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
}

.search-suggestion-item:hover {
  background: #f7fafc;
}

.suggestion-type {
  font-size: 1rem;
}

.suggestion-text {
  color: #2d3748;
  font-weight: 500;
}

.quick-filters {
  margin-bottom: 2rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.quick-filters h3 {
  color: #4a5568;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.filters-carousel {
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.filters-carousel::-webkit-scrollbar {
  display: none;
}

.filters-track {
  display: flex;
  gap: 0.75rem;
  padding: 0.5rem 0;
  min-width: min-content;
}

.quick-filter-btn {
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

.quick-filter-btn:hover {
  border-color: #48bb78;
  background: #f0fff4;
}

.quick-filter-btn.active {
  border-color: #48bb78;
  background: #48bb78;
  color: white;
}

.filter-icon {
  font-size: 1rem;
}

.results-section {
  max-width: 1400px;
  margin: 0 auto;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.results-header h3 {
  color: #2d3748;
  margin: 0;
}

.results-count {
  color: #718096;
  font-size: 0.9rem;
  background: #f7fafc;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.loading-grid,
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.skeleton-card {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
}

.skeleton-header {
  width: 60%;
  height: 1.5rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-line {
  height: 1rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-line.short {
  width: 40%;
}

@keyframes skeleton-loading {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.result-card {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.result-card:hover {
  border-color: #48bb78;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.15);
}

.result-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.result-content h4 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.result-content p {
  margin: 0 0 0.75rem 0;
  color: #718096;
  font-size: 0.9rem;
}

.result-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.result-tag {
  background: #e2e8f0;
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.show-more-section {
  text-align: center;
  margin-bottom: 2rem;
}

.show-more-btn {
  background: #48bb78;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.show-more-btn:hover {
  background: #38a169;
  transform: translateY(-1px);
}

.no-results {
  text-align: center;
  padding: 3rem 1rem;
}

.no-results-icon {
  font-size: 4rem;
  opacity: 0.5;
  margin-bottom: 1rem;
}

.no-results h3 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.no-results p {
  color: #718096;
  margin-bottom: 1.5rem;
}

.clear-filters-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.clear-filters-btn:hover {
  background: #5a67d8;
}

@media (max-width: 768px) {
  .smart-filters-section {
    padding: 0 1rem;
    margin: 0 -1rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  
  .search-section {
    padding: 0 0.5rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .suggestions-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .suggestion-card {
    padding: 1rem;
  }

  .search-input {
    padding: 0.875rem 1rem;
    font-size: 16px; /* Prevent zoom on iOS */
  }

  .filters-track {
    padding: 0.25rem 0;
  }

  .results-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .result-card {
    padding: 1rem;
  }
}
</style>