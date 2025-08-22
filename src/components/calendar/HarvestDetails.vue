<template>
  <section v-if="hasHarvestDetails" class="details-card">
    <h3>📈 Detalles de Cosecha</h3>
    <div class="harvest-details-grid">
      <div v-if="harvestData.harvest_indicators && harvestData.harvest_indicators.length > 0" class="harvest-detail-item">
        <span class="detail-icon">🎯</span>
        <div>
          <strong>Indicadores de Cosecha</strong>
          <p>{{ harvestData.harvest_indicators.map(indicator => formatTaskName(indicator)).join(', ') }}</p>
        </div>
      </div>

      <div v-if="harvestData.yield_per_plant" class="harvest-detail-item">
        <span class="detail-icon">🌾</span>
        <div>
          <strong>Rendimiento por Planta</strong>
          <p>{{ harvestData.yield_per_plant }}</p>
        </div>
      </div>

      <div v-if="harvestData.best_harvest_time" class="harvest-detail-item">
        <span class="detail-icon">🕐</span>
        <div>
          <strong>Mejor Hora de Cosecha</strong>
          <p class="harvest-time-text">{{ formatTaskName(harvestData.best_harvest_time) }}</p>
        </div>
      </div>

      <div v-if="harvestData.post_harvest_care" class="harvest-detail-item">
        <span class="detail-icon">🧼</span>
        <div>
          <strong>Cuidado Post-Cosecha</strong>
          <p>{{ formatTaskName(harvestData.post_harvest_care) }}</p>
        </div>
      </div>

      <div v-if="harvestData.fiber_yield" class="harvest-detail-item">
        <span class="detail-icon">🧵</span>
        <div>
          <strong>Rendimiento de Fibra</strong>
          <p>{{ formatTaskName(harvestData.fiber_yield) }}</p>
        </div>
      </div>

      <div v-if="harvestData.seed_yield" class="harvest-detail-item">
        <span class="detail-icon">🌰</span>
        <div>
          <strong>Rendimiento de Semillas</strong>
          <p>{{ formatTaskName(harvestData.seed_yield) }}</p>
        </div>
      </div>

      <div v-if="harvestData.uses && harvestData.uses.length > 0" class="harvest-detail-item">
        <span class="detail-icon">🔧</span>
        <div>
          <strong>Usos</strong>
          <p>{{ harvestData.uses.map(use => formatTaskName(use)).join(', ') }}</p>
        </div>
      </div>

      <div v-if="harvestData.fiber_quality" class="harvest-detail-item">
        <span class="detail-icon">💪</span>
        <div>
          <strong>Calidad de Fibra</strong>
          <p>{{ formatTaskName(harvestData.fiber_quality) }}</p>
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
    'morning': 'Mañana',
    'afternoon': 'Tarde',
    'evening': 'Noche',
    'dry_storage': 'Almacenamiento seco',
    'cool_storage': 'Almacenamiento fresco',
    'immediate_use': 'Uso inmediato',
    'high': 'Alto',
    'moderate': 'Moderado',
    'low': 'Bajo',
    'food': 'Alimentario',
    'medicinal': 'Medicinal',
    'textile': 'Textil',
    'ornamental': 'Ornamental',
    'excellent': 'Excelente',
    'good': 'Buena',
    'fair': 'Regular'
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
      return this.harvestData.harvest_indicators || 
             this.harvestData.yield_per_plant || 
             this.harvestData.best_harvest_time || 
             this.harvestData.post_harvest_care || 
             this.harvestData.fiber_yield || 
             this.harvestData.seed_yield || 
             (this.harvestData.uses && this.harvestData.uses.length > 0) || 
             this.harvestData.fiber_quality;
    }
  },
  methods: {
    formatTaskName
  }
}
</script>

<style scoped>
.details-card {
  background: #fcfdfe;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.details-card h3 {
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.harvest-details-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.harvest-detail-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.detail-icon {
  font-size: 1.5rem;
  width: 32px;
  text-align: center;
  flex-shrink: 0;
}

.harvest-detail-item strong {
  display: block;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.harvest-detail-item p {
  color: #4a5568;
  margin: 0;
  font-size: 0.9rem;
}

.harvest-time-text {
  text-transform: lowercase;
}

.harvest-time-text::first-letter {
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .details-card {
    padding: 1rem;
  }
}
</style>