<template>
  <div class="search-section">
    <div class="search-container">
      
      <div class="search-wrapper" :class="{ 'search-focused': isFocused, 'search-active': isActive }">
        <div class="search-input-group">
          <input
            ref="searchInput"
            v-model="searchQuery"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
            @keydown="onKeydown"
            type="text"
            placeholder="Buscar plantas, flores, categorías..."
            class="search-input"
            aria-label="Buscar plantas y flores"
            autocomplete="off"
          />
          
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="clear-button"
            type="button"
            aria-label="Limpiar búsqueda"
          >
            ×
          </button>
        </div>
      
        <!-- Results Dropdown -->
        <div v-if="showResults && (filteredResults.length > 0 || showCategories)" class="search-results">
          <div class="search-results-content">
            
            <!-- Quick Categories -->
            <div v-if="showCategories && !searchQuery.trim()" class="results-section">
              <div class="results-section-title">
                Categorías Populares
              </div>
              <div class="category-grid">
                <button
                  v-for="category in popularCategories"
                  :key="category.slug"
                  @click="goToCategory(category.slug)"
                  class="category-item"
                >
                  <span class="category-name">{{ category.name }}</span>
                  <span class="category-count">{{ category.count }} plantas</span>
                </button>
              </div>
            </div>
            
            <!-- Search Results -->
            <div v-if="filteredResults.length > 0" class="results-section">
              <div class="results-section-title">
                Resultados encontrados ({{ filteredResults.length }})
              </div>
              <div class="results-list">
                <button
                  v-for="(result, index) in filteredResults.slice(0, 8)"
                  :key="result.id"
                  :class="['result-item', { 'result-selected': selectedIndex === index }]"
                  @click="goToPlant(result)"
                  @mouseenter="selectedIndex = index"
                >
                  <div class="result-content">
                    <div class="result-main">
                      <span class="result-title" v-html="highlightMatch(result.title)"></span>
                      <span v-if="result.category" class="result-category">{{ result.category }}</span>
                    </div>
                    <div v-if="result.excerpt" class="result-excerpt" v-html="highlightMatch(result.excerpt)"></div>
                  </div>
                </button>
              </div>
              
              <div v-if="filteredResults.length > 8" class="search-footer">
                <button @click="showAllResults" class="show-all-button">
                  Ver todos los {{ filteredResults.length }} resultados
                </button>
              </div>
            </div>
            
            <!-- No Results -->
            <div v-if="searchQuery.trim() && filteredResults.length === 0" class="results-section">
              <div class="no-results">
                <p class="no-results-title">No encontramos plantas con "{{ searchQuery }}"</p>
                <p class="no-results-suggestion">
                  Intenta buscar por: nombre de planta, categoría (ej: "aromáticas") o cuidados
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
    
    <!-- Backdrop -->
    <div
      v-if="showResults"
      class="search-backdrop"
      @click="closeResults"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const searchQuery = ref('')
const isFocused = ref(false)
const showResults = ref(false)
const isActive = ref(false)
const selectedIndex = ref(-1)
const isMobile = ref(false)
const plants = ref([])
const searchInput = ref(null)

const popularCategories = ref([
  { name: 'Rosas', slug: 'rosa', emoji: '🌹', count: 14 },
  { name: 'Hibiscus', slug: 'hibiscus', emoji: '🌺', count: 13 },
  { name: 'Lirios', slug: 'lirios', emoji: '🪷', count: 9 },
  { name: 'Tomate', slug: 'tomate', emoji: '🍅', count: 8 },
  { name: 'Albahaca', slug: 'albahaca', emoji: '🌿', count: 6 },
  { name: 'Fresa', slug: 'fresa', emoji: '🍓', count: 6 }
])

const filteredResults = computed(() => {
  if (!searchQuery.value.trim()) return [];
  
  const query = searchQuery.value.toLowerCase().trim();
  
  return plants.value.filter(plant => {
    // Búsqueda por título
    const titleMatch = plant.title.toLowerCase().includes(query);
    
    // Búsqueda por contenido/descripción
    const excerptMatch = plant.excerpt && plant.excerpt.toLowerCase().includes(query);
    
    // Búsqueda por categoría exacta y parcial
    const categoryMatch = plant.categories && 
      plant.categories.some(cat => {
        const catName = cat.name.toLowerCase();
        return catName.includes(query) || 
               catName.includes(query.replace('plantas ', '').replace('planta ', '')) ||
               catName.replace('plantas ', '').replace('planta ', '').includes(query);
      });
    
    // Búsqueda por tags
    const tagsMatch = plant.tags && 
      plant.tags.some(tag => tag.name.toLowerCase().includes(query));
    
    // Búsqueda por términos relacionados
    const relatedTerms = [
      'cuidados', 'cultivo', 'plantar', 'regar', 'sol', 'sombra', 
      'aromática', 'medicinal', 'comestible', 'interior', 'exterior',
      'flores', 'hojas', 'frutos', 'semillas'
    ];
    
    const relatedMatch = relatedTerms.some(term => {
      return query.includes(term) && (
        (plant.excerpt && plant.excerpt.toLowerCase().includes(term)) ||
        (plant.categories && plant.categories.some(cat => 
          cat.name.toLowerCase().includes(term)))
      );
    });
    
    return titleMatch || excerptMatch || categoryMatch || tagsMatch || relatedMatch;
  })
  .sort((a, b) => {
    // Sistema de puntuación más inteligente
    let scoreA = 0;
    let scoreB = 0;
    const queryLower = query.toLowerCase();
    
    // Puntuación por coincidencia exacta en título
    if (a.title.toLowerCase() === queryLower) scoreA += 100;
    if (b.title.toLowerCase() === queryLower) scoreB += 100;
    
    // Puntuación por inicio de título
    if (a.title.toLowerCase().startsWith(queryLower)) scoreA += 50;
    if (b.title.toLowerCase().startsWith(queryLower)) scoreB += 50;
    
    // Puntuación por categoría exacta
    if (a.categories && a.categories.some(cat => 
      cat.name.toLowerCase() === queryLower ||
      cat.name.toLowerCase().includes(queryLower))) scoreA += 30;
    if (b.categories && b.categories.some(cat => 
      cat.name.toLowerCase() === queryLower ||
      cat.name.toLowerCase().includes(queryLower))) scoreB += 30;
    
    // Puntuación por inclusión en título
    if (a.title.toLowerCase().includes(queryLower)) scoreA += 20;
    if (b.title.toLowerCase().includes(queryLower)) scoreB += 20;
    
    if (scoreA !== scoreB) return scoreB - scoreA;
    return a.title.localeCompare(b.title, 'es');
  });
})

const showCategories = computed(() => {
  return !searchQuery.value.trim() && isFocused.value;
})

onMounted(() => {
  loadPlants();
  checkMobile();
  window.addEventListener('resize', checkMobile);
  document.addEventListener('keydown', handleGlobalKeydown);
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  document.removeEventListener('keydown', handleGlobalKeydown);
})

async function loadPlants() {
  try {
    // Lista de todas las categorías con plantas
    const categories = [
      'albahaca', 'amapola', 'azalea', 'chili', 'col', 'cosmos', 
      'fresa', 'hibiscus', 'hortensias', 'lavanda', 'lirios', 
      'mango', 'manzanilla', 'margarita', 'orquidea', 'patata', 
      'pensamiento', 'peonia', 'pina', 'plantas-comestibles', 
      'platano', 'rosa', 'tomate', 'tomillo', 'tulipan'
    ];
    
    let allPlants = [];
    
    // Cargar plantas de cada categoría
    for (const category of categories) {
      try {
        const response = await fetch(`/data/posts/${category}.json`);
        if (response.ok) {
          const categoryPlants = await response.json();
          const formattedPlants = categoryPlants.map(plant => ({
            id: plant.id,
            title: plant.title,
            slug: plant.slug,
            excerpt: plant.excerpt ? plant.excerpt.replace(/<[^>]*>/g, '').substring(0, 150) : '',
            categories: plant.categories || [],
            tags: plant.tags || [],
            category: plant.categories?.[0]?.name || category
          }));
          allPlants.push(...formattedPlants);
        }
      } catch (error) {
        console.warn(`Error loading category ${category}:`, error);
      }
    }
    
    plants.value = allPlants;
    console.log(`Loaded ${plants.value.length} plants for search`);
  } catch (error) {
    console.error('Error loading plants data:', error);
  }
}

function checkMobile() {
  isMobile.value = window.innerWidth < 768;
}

function onInput() {
  selectedIndex.value = -1;
  showResults.value = true;
}

function onFocus() {
  isFocused.value = true;
  isActive.value = true;
  showResults.value = true;
}

function onBlur() {
  // Delay to allow click events on results
  setTimeout(() => {
    isFocused.value = false;
    if (!searchQuery.value) {
      isActive.value = false;
    }
  }, 150);
}

function onKeydown(event) {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    selectedIndex.value = Math.min(selectedIndex.value + 1, Math.min(filteredResults.value.length - 1, 7));
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    if (selectedIndex.value >= 0 && filteredResults.value[selectedIndex.value]) {
      goToPlant(filteredResults.value[selectedIndex.value]);
    } else if (searchQuery.value.trim()) {
      showAllResults();
    }
  } else if (event.key === 'Escape') {
    closeResults();
    searchInput.value.blur();
  }
}

function handleGlobalKeydown(event) {
  if (event.key === '/' && !isFocused.value && 
      !['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) {
    event.preventDefault();
    searchInput.value.focus();
  }
}

function clearSearch() {
  searchQuery.value = '';
  selectedIndex.value = -1;
  showResults.value = true;
  searchInput.value.focus();
}

function closeResults() {
  showResults.value = false;
  selectedIndex.value = -1;
  if (!searchQuery.value) {
    isActive.value = false;
  }
}

function highlightMatch(text) {
  if (!text || !searchQuery.value.trim()) return text;
  
  const query = searchQuery.value.trim();
  const regex = new RegExp(`(${query})`, 'gi');
  
  return text.replace(regex, '<mark>$1</mark>');
}

function goToPlant(plant) {
  // Usar el slug de la categoría correctamente
  let categorySlug = 'plantas';
  
  if (plant.categories && plant.categories.length > 0) {
    // Mapear nombres de categoría a slugs
    const categoryName = plant.categories[0].name.toLowerCase();
    if (categoryName.includes('rosa')) categorySlug = 'rosa';
    else if (categoryName.includes('hibiscus')) categorySlug = 'hibiscus';
    else if (categoryName.includes('tomate')) categorySlug = 'tomate';
    else if (categoryName.includes('albahaca')) categorySlug = 'albahaca';
    else if (categoryName.includes('lirio')) categorySlug = 'lirios';
    else if (categoryName.includes('chili') || categoryName.includes('chile')) categorySlug = 'chili';
    else if (categoryName.includes('fresa')) categorySlug = 'fresa';
    else if (categoryName.includes('mango')) categorySlug = 'mango';
    else if (categoryName.includes('patata')) categorySlug = 'patata';
    else if (categoryName.includes('comestible')) categorySlug = 'plantas-comestibles';
    // Añadir más mapeos según sea necesario
    else {
      // Intentar usar el slug de la URL actual o el primer slug conocido
      const knownCategories = [
        'albahaca', 'amapola', 'azalea', 'chili', 'col', 'cosmos', 
        'fresa', 'hibiscus', 'hortensias', 'lavanda', 'lirios', 
        'mango', 'manzanilla', 'margarita', 'orquidea', 'patata', 
        'pensamiento', 'peonia', 'pina', 'plantas-comestibles', 
        'platano', 'rosa', 'tomate', 'tomillo', 'tulipan'
      ];
      
      for (const cat of knownCategories) {
        if (categoryName.includes(cat)) {
          categorySlug = cat;
          break;
        }
      }
    }
  }
  
  const url = `/${categorySlug}/${plant.slug}/`;
  
  closeResults();
  searchQuery.value = '';
  isActive.value = false;
  
  window.location.href = url;
}

function goToCategory(categorySlug) {
  closeResults();
  searchQuery.value = '';
  isActive.value = false;
  
  window.location.href = `/${categorySlug}/`;
}

function showAllResults() {
  const queryParam = encodeURIComponent(searchQuery.value);
  closeResults();
  
  window.location.href = `/plantas/?search=${queryParam}`;
}
</script>

<style scoped>
/* Force cache bust - v1.2 */
.search-section {
  position: relative;
  z-index: 1000;
  height: 100%;
  width: 100%;
}

.search-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.search-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  transition: all 0.3s ease;
  margin: 0;
}

.search-wrapper.search-focused {
  background: white;
}

.search-wrapper.search-active {
  border-radius: 0;
}

.search-input-group {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  height: 100%;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  font-weight: 400;
  color: #2d5016;
  height: 100%;
}

.search-input::placeholder {
  color: #6b7280;
  font-weight: 400;
}

.clear-button {
  background: #f3f4f6;
  border: none;
  width: 28px;
  height: 28px;
  margin-left: 8px;
  color: #6b7280;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
}

.clear-button:hover {
  background: #e5e7eb;
  color: #374151;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  margin-top: -8px;
  padding-top: 8px;
  max-height: 70vh;
  overflow-y: auto;
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-results-content {
  padding: 12px;
}

.results-section {
  margin-bottom: 20px;
}

.results-section:last-child {
  margin-bottom: 0;
}

.results-section-title {
  padding: 12px 16px 12px;
  font-size: 14px;
  font-weight: 600;
  color: #4B5563;
  border-bottom: 1px solid #F3F4F6;
  margin-bottom: 8px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  padding: 0 8px;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border: none;
  background: #F9FAFB;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  border: 2px solid transparent;
}

.category-item:hover {
  background: #EFF6FF;
  border-color: #10b981;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

.category-name {
  font-weight: 600;
  font-size: 15px;
  color: #1F2937;
}

.category-count {
  font-size: 13px;
  color: #6B7280;
  font-weight: 500;
}

.results-list {
  padding: 0 8px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 16px;
  border: none;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.result-item:hover,
.result-selected {
  background: #F0FDF4;
  border-color: #10b981;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-main {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.result-title {
  font-weight: 600;
  font-size: 15px;
  color: #1F2937;
}

.result-title :deep(mark) {
  background: #FEF3C7;
  color: #92400E;
  padding: 2px 4px;
  border-radius: 4px;
  font-weight: 700;
}

.result-category {
  font-size: 12px;
  background: #E5E7EB;
  color: #6B7280;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.result-excerpt {
  font-size: 13px;
  color: #6B7280;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-excerpt :deep(mark) {
  background: #FEF3C7;
  color: #92400E;
  padding: 1px 2px;
  border-radius: 2px;
}

.result-arrow {
  color: #10b981;
  font-size: 16px;
  font-weight: bold;
  flex-shrink: 0;
  opacity: 0;
  transition: all 0.2s ease;
}

.result-item:hover .result-arrow,
.result-selected .result-arrow {
  opacity: 1;
  transform: translateX(4px);
}

.search-footer {
  padding: 12px 16px 8px;
  border-top: 1px solid #F3F4F6;
  margin-top: 8px;
}

.show-all-button {
  width: 100%;
  padding: 12px;
  border: 2px dashed #D1D5DB;
  background: transparent;
  border-radius: 12px;
  color: #6B7280;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.show-all-button:hover {
  border-color: #10b981;
  color: #10b981;
  background: #F0FDF4;
}

.no-results {
  text-align: center;
  padding: 32px 16px;
}

.no-results-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
}

.no-results-suggestion {
  font-size: 14px;
  color: #6B7280;
  margin: 0;
  line-height: 1.5;
}

.search-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Mobile Styles */
@media (max-width: 768px) {
  .search-input-group {
    padding: 0 1rem;
  }
  
  .search-input {
    font-size: 16px; /* Prevent zoom on iOS */
  }
  
  .category-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .category-item {
    padding: 14px 16px;
  }
  
  .search-results {
    max-height: 60vh;
  }
  
  .result-item {
    padding: 14px 16px;
  }
  
  .result-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .search-input-group {
    padding: 0 0.75rem;
  }
  
  .result-item {
    padding: 12px;
  }
}
</style>