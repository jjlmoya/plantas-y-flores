<template>
  <nav class="breadcrumb-nav">
    <div class="container">
      <div class="breadcrumb-container">
        <a href="/" class="breadcrumb-link">
          <span class="breadcrumb-icon">🏠</span>
          <span>Inicio</span>
        </a>
        <span class="breadcrumb-separator">→</span>
        <span class="breadcrumb-current">
          <span class="breadcrumb-icon">📅</span>
          <span>Calendario</span>
        </span>
      </div>
      <!-- Hemisphere Selector -->
      <div class="hemisphere-selector">
        <button
          id="hemisphere-toggle"
          class="hemisphere-toggle"
          title="Cambiar hemisferio"
        >
          <span id="hemisphere-icon">🌎</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'CalendarMainBreadcrumb'
}
</script>

<style scoped>
.breadcrumb-nav {
  background: #fcfdfe;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 0 0 12px 12px;
  padding: 1rem 0;
}

.breadcrumb-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.breadcrumb-link:hover {
  background: #f7fafc;
  color: #2d3748;
}

.breadcrumb-separator {
  color: #a0aec0;
  font-weight: 300;
}

.breadcrumb-current {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 0.5rem 0.75rem;
  background: #f7fafc;
  border-radius: 6px;
}

.breadcrumb-icon {
  font-size: 0.9rem;
}

.hemisphere-selector {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.hemisphere-toggle {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.hemisphere-toggle:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.hemisphere-toggle:active {
  transform: scale(0.98);
}

#hemisphere-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .breadcrumb-container {
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .breadcrumb-link, .breadcrumb-current {
    font-size: 0.8rem;
    padding: 0.5rem;
  }

  .hemisphere-toggle {
    width: 36px;
    height: 36px;
  }

  #hemisphere-icon {
    font-size: 1rem;
  }
}
</style>