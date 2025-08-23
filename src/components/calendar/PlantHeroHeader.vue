<template>
  <header class="hero-header">
    <div class="container">
      <div class="hero-content">
        <div class="category-badge">
          <span class="category-badge-icon">{{ categoryIcon }}</span>
          <span>Calendario de Cultivo</span>
        </div>
        <h1 class="plant-title">
          <span class="plant-icon-large">{{ categoryIcon }}</span>
          <span class="title-text">Calendario de {{ plantName }}</span>
        </h1>
        <p v-if="scientificName" class="scientific-name">{{ scientificName }}</p>
        <p class="plant-description">
          Guía completa de cultivo para {{ plantName.toLowerCase() }}. Encuentra las mejores fechas para sembrar, 
          trasplantar y cosechar, adaptadas a tu zona climática.
        </p>
        
        <!-- Plant Info Cards -->
        <div class="plant-info-grid">
          <div v-if="plantInfo.family" class="info-card">
            <span class="info-icon">🏛️</span>
            <div class="info-content">
              <span class="info-label">Familia</span>
              <span class="info-value">{{ plantInfo.family }}</span>
            </div>
          </div>
          <div v-if="plantInfo.type" class="info-card">
            <span class="info-icon">🔄</span>
            <div class="info-content">
              <span class="info-label">Tipo</span>
              <span class="info-value">{{ formatTaskName(plantInfo.type) }}</span>
            </div>
          </div>
          <div v-if="plantInfo.difficulty" class="info-card">
            <span class="info-icon">{{ getDifficultyIcon(plantInfo.difficulty) }}</span>
            <div class="info-content">
              <span class="info-label">Dificultad</span>
              <span class="info-value">{{ formatTaskName(plantInfo.difficulty) }}</span>
            </div>
          </div>
          <div v-if="plantInfo.origin" class="info-card">
            <span class="info-icon">{{ originFlag }}</span>
            <div class="info-content">
              <span class="info-label">Origen</span>
              <span class="info-value">{{ formatOriginName(plantInfo.origin) }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <slot name="export-button" />
          <a v-if="articleLink" :href="articleLink" class="main-article-btn">
            📖 Ver Artículo Completo
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'PlantHeroHeader',
  props: {
    plantName: {
      type: String,
      required: true
    },
    categoryIcon: {
      type: String,
      required: true
    },
    scientificName: {
      type: String,
      default: null
    },
    plantInfo: {
      type: Object,
      required: true
    },
    originFlag: {
      type: String,
      default: '🌍'
    },
    articleLink: {
      type: String,
      default: null
    },
  },
  methods: {
    formatTaskName(task) {
      const translations = {
        'annual': 'Anual',
        'biennial': 'Bienal',
        'perennial': 'Perenne',
        'perennial_bulb': 'Bulbo Perenne',
        'perennial_tree': 'Árbol Perenne',
        'deciduous_tree': 'Árbol Caducifolio',
        'herb': 'Hierba',
        'shrub': 'Arbusto',
        'tree': 'Árbol',
        'vine': 'Enredadera',
        'easy': 'Fácil',
        'beginner': 'Principiante',
        'intermediate': 'Intermedio',
        'advanced': 'Avanzado',
        'difficult': 'Difícil'
      };
      return translations[task] || task;
    },
    formatOriginName(origin) {
      const origins = {
        'mediterranean': 'Mediterráneo',
        'tropical': 'Tropical',
        'temperate': 'Templado',
        'subtropical': 'Subtropical',
        'europe': 'Europa',
        'asia': 'Asia',
        'americas': 'América',
        'africa': 'África',
        'oceania': 'Oceanía',
        'FR': 'Francia',
        'ES': 'España',
        'IT': 'Italia',
        'GR': 'Grecia',
        'US': 'Estados Unidos',
        'Central_America': 'América Central',
        'Mediterranean': 'Mediterráneo',
        'Mediterranean_Europe': 'Europa Mediterránea',
        'Eastern_Mediterranean': 'Mediterráneo Oriental',
        'Europe_Asia': 'Europa y Asia',
        'North_America': 'América del Norte',
        'East_Asia': 'Asia Oriental'
      };
      return origins[origin] || origin.replace(/_/g, ' ');
    },
    getDifficultyIcon(difficulty) {
      switch(difficulty) {
        case 'easy': return '😊';
        case 'beginner': return '😊';
        case 'intermediate': return '🤔';
        case 'advanced': return '😰';
        default: return '😰';
      }
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

.hero-content {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.category-badge {
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

.category-badge-icon {
  font-size: 1rem;
}

.plant-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 1rem;
  line-height: 1.1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.plant-icon-large {
  font-size: 3.5rem;
}

.title-text {
  color: #1a202c;
  font-weight: 800;
}

.scientific-name {
  font-size: 1.3rem;
  font-style: italic;
  color: #4a5568;
  margin-bottom: 1.5rem;
  font-weight: 400;
}

.plant-description {
  font-size: 1.2rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.plant-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.info-card {
  background: #fcfdfe;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-card:hover {
  background: #f7fafc;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.info-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.info-content {
  text-align: left;
}

.info-label {
  display: block;
  font-size: 0.8rem;
  color: #718096;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.info-value {
  display: block;
  font-size: 1rem;
  color: #2d3748;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.main-article-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #48bb78;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.main-article-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (max-width: 768px) {
  .plant-title {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .plant-icon-large {
    font-size: 2.5rem;
  }

  .plant-description {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .plant-info-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .info-card {
    padding: 1rem;
  }

  .hero-header {
    padding: 3rem 0 4rem 0;
  }

  .category-badge {
    margin-bottom: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>