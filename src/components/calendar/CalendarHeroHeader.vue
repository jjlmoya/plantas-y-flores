<template>
  <header class="hero-header">
    <div class="container">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="hero-badge-icon">🌱</span>
          <span>Guía de Cultivo {{ currentYear }}</span>
        </div>
        <h1 class="hero-title">
          <span class="title-main">Calendario de</span>
          <span class="title-highlight">Plantación</span>
        </h1>
        <p class="hero-description">
          Planifica tu jardín y huerto siguiendo el calendario natural. 
          Descubre cuándo sembrar, trasplantar y cosechar más de 100 variedades de plantas.
        </p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">24</span>
            <span class="stat-label">Categorías</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">100+</span>
            <span class="stat-label">Plantas</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">12</span>
            <span class="stat-label">Meses</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'CalendarHeroHeader',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
}
</script>

<style scoped>
.hero-header {
  padding: 4rem 0 5rem 0;
  position: relative;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #48bb7820 0%, #48bb7840 100%);
  border-radius: 16px;
  margin: 16px;
}


.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero-content {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #f7fafc;
  color: #4a5568;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
}

.hero-badge-icon {
  font-size: 1rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 1rem;
  line-height: 1.1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.title-main {
  font-weight: 400;
  color: #2d3748;
  font-size: 0.7em;
}

.title-highlight {
  color: #1a202c;
  font-weight: 800;
}

.hero-description {
  font-size: 1.2rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
}

.stat-item {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #4a5568;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .hero-header {
    padding: 4rem 0 3rem 0;
  }

  .hero-title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .hero-description {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .hero-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
    max-width: 300px;
  }

  .stat-item {
    padding: 1rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }
}
</style>