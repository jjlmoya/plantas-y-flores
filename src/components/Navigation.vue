<template>
  <header class="navigation">
    <!-- Header principal -->
    <nav class="nav-main">
      <div class="nav-container">
        <div class="nav-logo">
          <a href="/" class="logo-link">
            <img src="/brand/logo-64.webp" alt="Plantas y Flores" class="logo-image">
            <span class="logo-text">Plantas y Flores</span>
          </a>
        </div>
        <button class="nav-toggle" @click="toggleMenu" :aria-expanded="isMenuOpen" aria-label="Abrir menú de navegación">
          <span class="nav-toggle-icon"></span>
        </button>
        <div class="nav-menu" :class="{ 'nav-menu--open': isMenuOpen }">
          <ul class="nav-list">
            <li class="nav-item">
              <a href="/" class="nav-link" :class="{ 'nav-link--active': isActive('/') }">Inicio</a>
            </li>
            <li class="nav-item nav-item--dropdown" @mouseenter="activeDropdown = 'plantas'" @mouseleave="activeDropdown = null">
              <a href="/plantas/" class="nav-link" :class="{ 'nav-link--active': isDropdownActive() }">Plantas</a>
              <div class="dropdown" :class="{ 'dropdown--active': activeDropdown === 'plantas' }">
                <div class="dropdown-content">
                  <a href="/categorias/" class="dropdown-link" :class="{ 'dropdown-link--active': isActive('/categorias/') }">Ver todas las categorías</a>
                  <div class="dropdown-divider"></div>
                  <a href="/plantas-medicinales/" class="dropdown-link" :class="{ 'dropdown-link--active': isActive('/plantas-medicinales/') }">Plantas Medicinales</a>
                  <a href="/plantas-aromaticas/" class="dropdown-link" :class="{ 'dropdown-link--active': isActive('/plantas-aromaticas/') }">Plantas Aromáticas</a>
                  <a href="/plantas-comestibles/" class="dropdown-link" :class="{ 'dropdown-link--active': isActive('/plantas-comestibles/') }">Plantas Comestibles</a>
                </div>
              </div>
            </li>
            <li class="nav-item nav-item--dropdown" @mouseenter="activeDropdown = 'calendario'" @mouseleave="activeDropdown = null">
              <a href="/calendario/" class="nav-link" :class="{ 'nav-link--active': isCalendarActive() }">
                Calendario
              </a>
              <div class="dropdown dropdown--calendar" :class="{ 'dropdown--active': activeDropdown === 'calendario' }">
                <div class="dropdown-content">
                  <a href="/calendario/" class="dropdown-link" :class="{ 'dropdown-link--active': isActive('/calendario/') }">Dashboard Calendario</a>
                  <div class="dropdown-divider"></div>
                  <div class="dropdown-section">
                    <span class="dropdown-section-title">Por Mes</span>
                    <div class="months-list">
                      <a 
                        v-for="(month, index) in getCurrentAndNextMonths()" 
                        :key="month.slug"
                        :href="`/calendario/mes/${month.slug}/`" 
                        :class="['dropdown-link', 'small', { 'current-month': index === 0 }]"
                      >
                        {{ month.display }}
                      </a>
                    </div>
                  </div>
                  <div class="dropdown-divider"></div>
                  <div class="dropdown-section">
                    <span class="dropdown-section-title">Por Actividad</span>
                    <a href="/calendario/actividad/siembra/" class="dropdown-link small">Siembra</a>
                    <a href="/calendario/actividad/trasplante/" class="dropdown-link small">Trasplante</a>
                    <a href="/calendario/actividad/cosecha/" class="dropdown-link small">Cosecha</a>
                  </div>
                </div>
              </div>
            </li>
            <li class="nav-item">
              <a href="/rosa/" class="nav-link" :class="{ 'nav-link--active': isActive('/rosa/') }">Rosas</a>
            </li>
            <li class="nav-item">
              <a href="/tomate/" class="nav-link" :class="{ 'nav-link--active': isActive('/tomate/') }">Tomates</a>
            </li>
            <li class="nav-item">
              <a href="/contacto/" class="nav-link" :class="{ 'nav-link--active': isActive('/contacto/') }">Contacto</a>
            </li>
            <li class="nav-item nav-item--favorites">
              <a href="/favoritos/" class="nav-link nav-link--favorites" :class="{ 'nav-link--active': isActive('/favoritos/') }">
                <span class="favorites-text">Favoritos</span>
                <span v-if="favoritesCount > 0" class="favorites-badge">{{ favoritesCount }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    
    <!-- Subheader con buscador lazy -->
    <div class="nav-subheader">
      <div class="nav-search">
        <!-- Fake SearchBox - maintains visual design -->
        <div v-if="!isSearchActive" class="search-section">
          <div class="search-container">
            <div class="search-wrapper">
              <div class="search-input-group">
                <input
                  @focus="activateSearch"
                  @click="activateSearch" 
                  @mousedown.prevent="activateSearch"
                  type="text"
                  placeholder="Buscar plantas, flores, categorías..."
                  class="search-input"
                  aria-label="Buscar plantas y flores"
                  autocomplete="off"
                  readonly
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Real SearchBox - lazy loaded -->
        <component :is="SearchBoxComponent" v-if="isSearchActive && SearchBoxComponent" ref="searchBoxRef" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useFavorites } from '../favorites-mvp/composable.js'

const isMenuOpen = ref(false)
const activeDropdown = ref(null)
const currentPath = ref('')
const isSearchActive = ref(false)
const searchBoxRef = ref(null)
const SearchBoxComponent = ref(null)

// Sistema de favoritos
const { stats } = useFavorites()
const favoritesCount = computed(() => stats.value.count)

// Lazy import SearchBox
const loadSearchBox = async () => {
  if (!SearchBoxComponent.value) {
    const module = await import('./SearchBox.vue')
    SearchBoxComponent.value = module.default
  }
  return SearchBoxComponent.value
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    currentPath.value = window.location.pathname
  }
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}


const activateSearch = async () => {
  // Load SearchBox component dynamically
  await loadSearchBox()
  isSearchActive.value = true
  
  // Focus on search input and trigger activation after component mounts
  await nextTick()
  
  // Use setTimeout to ensure the component is fully mounted
  setTimeout(() => {
    if (searchBoxRef.value?.focusInput) {
      searchBoxRef.value.focusInput()
    }
    if (searchBoxRef.value?.activateSearch) {
      searchBoxRef.value.activateSearch()
    }
  }, 10)
}

const isActive = (href) => {
  // Comparación exacta de URL
  return currentPath.value === href
}

const isDropdownActive = () => {
  // Solo activar "Plantas" para URLs específicas relacionadas con plantas
  return currentPath.value.startsWith('/plantas-') || 
         currentPath.value === '/categorias/' ||
         currentPath.value === '/plantas/'
}

const isCalendarActive = () => {
  // Activar "Calendario" para todas las URLs relacionadas con calendario
  return currentPath.value.startsWith('/calendario/')
}

const getCurrentAndNextMonths = () => {
  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  const monthDisplayNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11
  const months = [];
  
  for (let i = 0; i < 4; i++) {
    const monthIndex = (currentMonth + i) % 12;
    months.push({
      slug: monthNames[monthIndex],
      display: monthDisplayNames[monthIndex]
    });
  }
  
  return months;
}
</script>

<style scoped>
.navigation {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  margin-bottom: 2rem;
}

.nav-main {
  border-bottom: 1px solid #f3f4f6;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  min-height: 70px;
  gap: 2rem;
}

.nav-logo {
  display: flex;
  align-items: center;
  order: 1;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #2d5016;
  font-weight: 700;
  font-size: 1.5rem;
}

.logo-image {
  width: 40px;
  height: 40px;
  margin-right: 0.75rem;
}

.logo-text {
  color: #2d5016;
}

.nav-subheader {
  background: #f8f9fa;
  border-bottom: 1px solid #e5e7eb;
  height: 50px;
}

.nav-search {
  height: 100%;
  width: 100%;
}

.nav-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  order: 4;
}

.nav-toggle-icon {
  display: block;
  width: 25px;
  height: 3px;
  background: #2d5016;
  border-radius: 2px;
  position: relative;
  transition: all 0.3s ease;
}

.nav-toggle-icon::before,
.nav-toggle-icon::after {
  content: '';
  position: absolute;
  width: 25px;
  height: 3px;
  background: #2d5016;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.nav-toggle-icon::before {
  top: -8px;
}

.nav-toggle-icon::after {
  bottom: -8px;
}

.nav-menu {
  order: 3;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
}

.nav-item {
  position: relative;
  margin: 0 0.5rem;
}

.nav-link {
  display: block;
  padding: 1rem 1.25rem;
  color: #2d5016;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  border-radius: 6px;
}

.nav-link:hover {
  color: #4a7c23;
  background: rgba(74, 124, 35, 0.1);
}

.nav-link--active {
  color: #4a7c23 !important;
  background: rgba(74, 124, 35, 0.15) !important;
  font-weight: 600;
}

/* Enlace de favoritos */
.nav-link--favorites {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.favorites-icon {
  font-size: 1.1rem;
  line-height: 1;
}

.favorites-text {
  line-height: 1;
}

.favorites-badge {
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  min-width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  margin-left: 0.25rem;
}

.nav-item--dropdown {
  position: relative;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  min-width: 200px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1100;
}

.dropdown--active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-content {
  padding: 0.5rem 0;
}

.dropdown-link {
  display: block;
  padding: 0.75rem 1.25rem;
  color: #2d5016;
  text-decoration: none;
  font-weight: 400;
  transition: background-color 0.2s ease;
}

.dropdown-link:hover {
  background: rgba(74, 124, 35, 0.1);
  color: #4a7c23;
}

.dropdown-link--active {
  background: rgba(74, 124, 35, 0.15) !important;
  color: #4a7c23 !important;
  font-weight: 600;
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.5rem 0;
}

/* Calendar-specific dropdown styles */

.dropdown--calendar {
  min-width: 280px;
}

.dropdown-section {
  padding: 0.5rem 0;
}

.dropdown-section-title {
  display: block;
  padding: 0.5rem 1.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dropdown-link.small {
  padding: 0.5rem 1.5rem;
  font-size: 0.875rem;
  color: #4a5568;
  border-left: 3px solid transparent;
  margin: 0 0.75rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.dropdown-link.small:hover {
  background: rgba(74, 124, 35, 0.08);
  border-left-color: rgba(74, 124, 35, 0.3);
  color: #2d5016;
  transform: translateX(2px);
}

.dropdown-link.current-month {
  background: rgba(74, 124, 35, 0.1);
  color: #2d5016;
  font-weight: 600;
  border-left-color: #4a7c23;
  margin: 0 0.75rem;
  border-radius: 4px;
}

.dropdown-link.current-month:hover {
  background: rgba(74, 124, 35, 0.15);
  transform: translateX(2px);
}

/* Mobile Styles */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .nav-logo {
    order: 1;
    flex: 0 0 auto;
  }
  
  .nav-toggle {
    display: flex;
    order: 2;
    flex: 0 0 auto;
  }
  
  .nav-subheader {
    height: 45px;
  }
  
  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-20px);
    transition: all 0.3s ease;
    order: 4;
    width: 100%;
    z-index: 1000;
    pointer-events: none;
  }
  
  .nav-menu--open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
  }
  
  .nav-list {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem 0;
  }
  
  .nav-item {
    margin: 0;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .nav-item:last-child {
    border-bottom: none;
  }
  
  .nav-link {
    padding: 1rem 1.5rem;
    border-radius: 0;
  }
  
  .dropdown {
    position: static;
    box-shadow: none;
    background: #f8f9fa;
    opacity: 1;
    visibility: visible;
    transform: none;
    margin-top: 0;
    border-radius: 0;
  }
  
  .dropdown-link {
    padding: 0.75rem 2rem;
    font-size: 0.9rem;
  }
  
  /* Favoritos en móvil */
  .nav-link--favorites {
    justify-content: space-between;
  }
  
  .favorites-badge {
    margin-left: auto;
  }
}

@media (max-width: 480px) {
  .nav-container {
    gap: 0.5rem;
    padding: 0 0.75rem;
  }
  
  .logo-text {
    display: none;
  }
  
  .logo-image {
    margin-right: 0;
    width: 32px;
    height: 32px;
  }
  
  
  .navigation {
    margin-bottom: 1.5rem;
  }
  
  /* Favoritos en móvil pequeño */
  .favorites-text {
    display: none;
  }
  
  .nav-link--favorites {
    justify-content: center;
    gap: 0.25rem;
  }
}

/* Fake SearchBox styles - matches real SearchBox exactly */
.search-section {
  position: relative;
  z-index: 500;
  height: 100%;
  width: 100%;
}

.search-container {
  width: 100%;
  height: 100%;
  margin: 0;
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
  cursor: pointer;
}

.search-input::placeholder {
  color: #6b7280;
  font-weight: 400;
}

/* Make readonly input look interactive */
.search-input[readonly] {
  cursor: pointer;
}
</style>