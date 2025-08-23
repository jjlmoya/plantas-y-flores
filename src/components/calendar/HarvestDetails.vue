<template>
  <section v-if="hasHarvestDetails" class="harvest-info-section">
    <!-- Header with Gradient Background -->
    <div class="harvest-header">
      <div class="header-content">
        <div class="header-icon">📈</div>
        <div class="header-text">
          <h3>Detalles de Cosecha</h3>
          <p class="header-subtitle">Información especializada para optimizar tu cosecha</p>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="harvest-content">
      <!-- Yield Metrics -->
      <div v-if="hasYieldData" class="metrics-section">
        <div class="section-header">
          <div class="section-icon">📊</div>
          <h4>Métricas de Rendimiento</h4>
        </div>
        <div class="metrics-grid">
          
          <!-- Fiber Yield -->
          <div v-if="harvestData.fiber_yield" class="metric-card fiber">
            <div class="metric-icon">🧵</div>
            <div class="metric-content">
              <div class="metric-label">Rendimiento de Fibra</div>
              <div class="metric-value">{{ formatTaskName(harvestData.fiber_yield) }}</div>
              <div class="metric-bar">
                <div class="metric-fill fiber-yield" :style="{ width: getYieldPercentage(harvestData.fiber_yield) + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- Seed Yield -->
          <div v-if="harvestData.seed_yield" class="metric-card seeds">
            <div class="metric-icon">🌰</div>
            <div class="metric-content">
              <div class="metric-label">Rendimiento de Semillas</div>
              <div class="metric-value">{{ formatTaskName(harvestData.seed_yield) }}</div>
              <div class="metric-bar">
                <div class="metric-fill seed-yield" :style="{ width: getYieldPercentage(harvestData.seed_yield) + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- Per Plant Yield -->
          <div v-if="harvestData.yield_per_plant" class="metric-card plant">
            <div class="metric-icon">🌾</div>
            <div class="metric-content">
              <div class="metric-label">Por Planta</div>
              <div class="metric-value">{{ harvestData.yield_per_plant }}</div>
              <div class="metric-description">Rendimiento estimado</div>
            </div>
          </div>

        </div>
      </div>

      <!-- Quality & Uses Section -->
      <div v-if="hasQualityData" class="quality-section">
        <div class="section-header">
          <div class="section-icon">✨</div>
          <h4>Calidad y Usos</h4>
        </div>
        
        <!-- Fiber Quality -->
        <div v-if="harvestData.fiber_quality" class="quality-card">
          <div class="quality-icon">💪</div>
          <div class="quality-content">
            <div class="quality-label">Calidad de Fibra</div>
            <div class="quality-value">{{ formatTaskName(harvestData.fiber_quality) }}</div>
            <div class="quality-stars">
              <span v-for="n in getQualityStars(harvestData.fiber_quality)" :key="n" class="star filled">★</span>
              <span v-for="n in (5 - getQualityStars(harvestData.fiber_quality))" :key="'empty-' + n" class="star empty">☆</span>
            </div>
          </div>
        </div>

        <!-- Uses -->
        <div v-if="harvestData.uses && harvestData.uses.length > 0" class="uses-section">
          <div class="uses-header">
            <div class="uses-icon">🔧</div>
            <h5>Aplicaciones Principales</h5>
          </div>
          <div class="uses-tags">
            <span v-for="use in harvestData.uses" :key="use" class="use-tag" :class="getUseClass(use)">
              <span class="use-icon">{{ getUseIcon(use) }}</span>
              {{ formatTaskName(use) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Harvest Timing -->
      <div v-if="hasTimingData" class="timing-section">
        <div class="section-header">
          <div class="section-icon">⏰</div>
          <h4>Momento Óptimo</h4>
        </div>
        <div class="timing-content">
          
          <!-- Best Time -->
          <div v-if="harvestData.best_harvest_time" class="timing-item">
            <div class="timing-icon">🕐</div>
            <div class="timing-text">
              <strong>Mejor Momento:</strong> 
              <span class="timing-value">{{ formatTaskName(harvestData.best_harvest_time) }}</span>
            </div>
          </div>

          <!-- Indicators -->
          <div v-if="harvestData.harvest_indicators && harvestData.harvest_indicators.length > 0" class="indicators-item">
            <div class="indicators-icon">🎯</div>
            <div class="indicators-content">
              <strong>Señales de Cosecha:</strong>
              <div class="indicators-list">
                <span v-for="indicator in harvestData.harvest_indicators" :key="indicator" class="indicator-chip">
                  {{ formatTaskName(indicator) }}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Post-Harvest Care -->
      <div v-if="harvestData.post_harvest_care" class="care-section">
        <div class="care-header">
          <div class="care-icon">🧼</div>
          <h4>Cuidado Post-Cosecha</h4>
        </div>
        <div class="care-content">
          <p>{{ formatTaskName(harvestData.post_harvest_care) }}</p>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
// Client-side helper function for Vue components
function formatTaskName(task) {
  const translations = {
    'yellow_leaves': 'Hojas amarillas',
    'ripe_fruit': 'Fruto maduro',
    'firm_texture': 'Textura firme',
    'full_color': 'Color completo',
    'morning': 'Por la mañana',
    'afternoon': 'Por la tarde',
    'evening': 'Por la noche',
    'dry_storage': 'Almacenamiento seco',
    'cool_storage': 'Almacenamiento fresco',
    'immediate_use': 'Uso inmediato',
    'high': 'Alto',
    'moderate': 'Moderado',
    'low': 'Bajo',
    'excellent': 'Excelente',
    'good': 'Buena',
    'fair': 'Regular',
    'strong_durable': 'Fuerte y Durable',
    'fiber_production': 'Producción de Fibra',
    'ornamental': 'Ornamental',
    'seeds': 'Semillas',
    'textile': 'Textil',
    'food': 'Alimentario',
    'medicinal': 'Medicinal'
  };
  return translations[task] || task;
}

export default {
  name: 'HarvestDetails',
  props: {
    harvestData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    hasHarvestDetails() {
      return this.hasYieldData || this.hasQualityData || this.hasTimingData || this.harvestData.post_harvest_care;
    },
    hasYieldData() {
      return this.harvestData.fiber_yield || this.harvestData.seed_yield || this.harvestData.yield_per_plant;
    },
    hasQualityData() {
      return this.harvestData.fiber_quality || (this.harvestData.uses && this.harvestData.uses.length > 0);
    },
    hasTimingData() {
      return this.harvestData.best_harvest_time || (this.harvestData.harvest_indicators && this.harvestData.harvest_indicators.length > 0);
    }
  },
  methods: {
    formatTaskName,
    getYieldPercentage(yieldValue) {
      const yieldMap = {
        'high': 85,
        'moderate': 60,
        'low': 35,
        'excellent': 95,
        'good': 75,
        'fair': 45
      };
      return yieldMap[yieldValue] || 50;
    },
    getQualityStars(quality) {
      const qualityMap = {
        'excellent': 5,
        'strong_durable': 5,
        'good': 4,
        'fair': 3,
        'moderate': 3,
        'low': 2
      };
      return qualityMap[quality] || 3;
    },
    getUseIcon(use) {
      const iconMap = {
        'fiber_production': '🧵',
        'ornamental': '🌸',
        'seeds': '🌰',
        'textile': '👕',
        'food': '🍽️',
        'medicinal': '💊'
      };
      return iconMap[use] || '🔧';
    },
    getUseClass(use) {
      const classMap = {
        'fiber_production': 'fiber',
        'ornamental': 'ornamental',
        'seeds': 'seeds',
        'textile': 'textile',
        'food': 'food',
        'medicinal': 'medicinal'
      };
      return classMap[use] || 'default';
    }
  }
}
</script>

<style scoped>
.harvest-info-section {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Header */
.harvest-header {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: white;
  padding: 1.5rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.2);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-text h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.header-subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

/* Main Content */
.harvest-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Section Headers */
.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.section-icon {
  font-size: 1.25rem;
  background: linear-gradient(135deg, #059669, #10b981);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #1f2937;
  font-weight: 600;
}

/* Metrics Section */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
}

.metric-icon {
  font-size: 1.75rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-card.fiber .metric-icon {
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
}

.metric-card.seeds .metric-icon {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}

.metric-card.plant .metric-icon {
  background: linear-gradient(135deg, #059669, #10b981);
}

.metric-content {
  flex: 1;
}

.metric-label {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.metric-description {
  font-size: 0.75rem;
  color: #9ca3af;
}

.metric-bar {
  background: #f3f4f6;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.metric-fill.fiber-yield {
  background: linear-gradient(90deg, #8b5cf6, #a78bfa);
}

.metric-fill.seed-yield {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

/* Quality Section */
.quality-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.quality-icon {
  font-size: 1.75rem;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #ef4444, #f87171);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quality-label {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.quality-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.quality-stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 1rem;
}

.star.filled {
  color: #fbbf24;
}

.star.empty {
  color: #d1d5db;
}

/* Uses Section */
.uses-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.uses-icon {
  font-size: 1.1rem;
}

.uses-header h5 {
  margin: 0;
  font-size: 1rem;
  color: #374151;
  font-weight: 600;
}

.uses-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.use-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: transform 0.2s ease;
}

.use-tag:hover {
  transform: scale(1.05);
}

.use-tag.fiber {
  background: linear-gradient(135deg, #ddd6fe, #ede9fe);
  color: #7c3aed;
  border: 1px solid #c4b5fd;
}

.use-tag.ornamental {
  background: linear-gradient(135deg, #fce7f3, #fdf2f8);
  color: #be185d;
  border: 1px solid #f9a8d4;
}

.use-tag.seeds {
  background: linear-gradient(135deg, #fef3c7, #fef9c3);
  color: #d97706;
  border: 1px solid #fcd34d;
}

.use-tag.default {
  background: linear-gradient(135deg, #f3f4f6, #f9fafb);
  color: #374151;
  border: 1px solid #d1d5db;
}

/* Timing Section */
.timing-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timing-item, .indicators-item {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.timing-icon, .indicators-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.timing-value {
  color: #059669;
  font-weight: 600;
}

.indicators-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.indicator-chip {
  background: linear-gradient(135d, #dbeafe, #e0f2fe);
  color: #0369a1;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  border: 1px solid #bae6fd;
}

/* Care Section */
.care-section {
  background: linear-gradient(135deg, #fef7cd, #fefce8);
  border: 1px solid #fde047;
  border-radius: 12px;
  padding: 1.25rem;
}

.care-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.care-icon {
  font-size: 1.25rem;
  color: #d97706;
}

.care-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #92400e;
  font-weight: 600;
}

.care-content p {
  margin: 0;
  color: #a16207;
  font-size: 0.9rem;
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 768px) {
  .harvest-content {
    padding: 1rem;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .metric-card, .timing-item, .indicators-item {
    flex-direction: column;
    text-align: center;
  }
  
  .uses-tags {
    justify-content: center;
  }
}
</style>