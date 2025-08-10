<template>
  <nav class="navigation">
    <div class="nav-container">
      <div class="nav-logo">
        <a href="/" class="logo-link">
          <img src="/brand/logo.png" alt="Plantas y Flores" class="logo-image">
          <span class="logo-text">Plantas y Flores</span>
        </a>
      </div>
      
      <button class="nav-toggle" @click="isMenuOpen = !isMenuOpen" :aria-expanded="isMenuOpen">
        <span class="nav-toggle-icon"></span>
      </button>
      
      <div class="nav-menu" :class="{ 'nav-menu--open': isMenuOpen }">
        <ul class="nav-list">
          <li class="nav-item">
            <a href="/" class="nav-link">Inicio</a>
          </li>
          <li class="nav-item nav-item--dropdown" @mouseover="activeDropdown = 'plantas'" @mouseleave="activeDropdown = null">
            <a href="/plantas/" class="nav-link">Plantas</a>
            <div class="dropdown" :class="{ 'dropdown--active': activeDropdown === 'plantas' }">
              <div class="dropdown-content">
                <a href="/plantas-medicinales/" class="dropdown-link">Plantas Medicinales</a>
                <a href="/plantas-exterior/" class="dropdown-link">Plantas de Exterior</a>
                <a href="/plantas-interior/" class="dropdown-link">Plantas de Interior</a>
                <a href="/plantas-aromaticas/" class="dropdown-link">Plantas Aromáticas</a>
                <a href="/plantas-comestibles/" class="dropdown-link">Plantas Comestibles</a>
              </div>
            </div>
          </li>
          <li class="nav-item">
            <a href="/rosa/" class="nav-link">Rosas</a>
          </li>
          <li class="nav-item">
            <a href="/hibiscus/" class="nav-link">Hibiscus</a>
          </li>
          <li class="nav-item">
            <a href="/tomate/" class="nav-link">Tomates</a>
          </li>
          <li class="nav-item">
            <a href="/albahaca/" class="nav-link">Albahaca</a>
          </li>
          <li class="nav-item">
            <a href="/contacto/" class="nav-link">Contacto</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)
const activeDropdown = ref(null)
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

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 70px;
}

.nav-logo {
  display: flex;
  align-items: center;
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

.nav-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  display: flex;
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
  z-index: 100;
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

/* Mobile Styles */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }
  
  .nav-toggle {
    display: flex;
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
  }
  
  .nav-menu--open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
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
  }
  
  .dropdown-link {
    padding: 0.75rem 2rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .logo-text {
    display: none;
  }
  
  .logo-image {
    margin-right: 0;
  }
}
</style>