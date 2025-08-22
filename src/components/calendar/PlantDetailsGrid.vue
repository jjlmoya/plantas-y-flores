<template>
  <div>
    <!-- Growing Conditions -->
    <section class="details-card">
      <h3>🌱 Condiciones de Cultivo</h3>
      <div class="conditions-grid">
        <div v-if="growingConditions.sun_requirements" class="condition-item">
          <span class="condition-icon">☀️</span>
          <div>
            <strong>Luz</strong>
            <p>{{ formatTaskName(growingConditions.sun_requirements) }}</p>
          </div>
        </div>

        <div v-if="growingConditions.water_needs" class="condition-item">
          <span class="condition-icon">💧</span>
          <div>
            <strong>Agua</strong>
            <p>{{ formatTaskName(growingConditions.water_needs) }}</p>
          </div>
        </div>

        <div v-if="growingConditions.soil_type" class="condition-item">
          <span class="condition-icon">🌍</span>
          <div>
            <strong>Suelo</strong>
            <p>{{ formatTaskName(growingConditions.soil_type) }}</p>
          </div>
        </div>

        <div v-if="growingConditions.soil_ph" class="condition-item">
          <span class="condition-icon">⚗️</span>
          <div>
            <strong>pH</strong>
            <p>{{ growingConditions.soil_ph[0] }} - {{ growingConditions.soil_ph[1] }}</p>
          </div>
        </div>

        <div v-if="growingConditions.spacing" class="condition-item">
          <span class="condition-icon">📏</span>
          <div>
            <strong>Espaciado</strong>
            <p>{{ growingConditions.spacing.plant_distance }}cm entre plantas</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Harvest Information -->
    <section 
      v-if="harvestData.storage_life || harvestData.weight_range || harvestData.preservation_methods" 
      class="details-card"
    >
      <h3>🌾 Información de Cosecha</h3>
      <div class="harvest-info">
        <div v-if="harvestData.storage_life" class="harvest-item">
          <span class="harvest-icon">📦</span>
          <div>
            <strong>Conservación</strong>
            <p>{{ harvestData.storage_life }} días</p>
          </div>
        </div>

        <div v-if="harvestData.weight_range" class="harvest-item">
          <span class="harvest-icon">⚖️</span>
          <div>
            <strong>Peso</strong>
            <p>{{ harvestData.weight_range[0] }}-{{ harvestData.weight_range[1] }}g</p>
          </div>
        </div>

        <div v-if="harvestData.preservation_methods" class="harvest-item">
          <span class="harvest-icon">🥫</span>
          <div>
            <strong>Conservación</strong>
            <p>{{ harvestData.preservation_methods.map(method => formatTaskName(method)).join(', ') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Companion Plants -->
    <section v-if="processedCompanions.length > 0 || processedAvoidPlants.length > 0" class="details-card">
      <h3>🤝 Plantas Compañeras</h3>
      
      <div v-if="processedCompanions.length > 0" class="companions-section">
        <h4 class="companions-title good">✅ Buenas Compañeras</h4>
        <div class="companions-list">
          <template v-for="companion in processedCompanions" :key="companion.originalName">
            <a 
              v-if="companion.hasCategory" 
              :href="`/calendario/categoria/${companion.categorySlug}/`"
              class="companion-tag good clickable"
              :title="`Ver calendario de ${companion.translatedName}`"
            >
              <span class="companion-icon">{{ getCategoryIcon(companion.categorySlug || 'default') }}</span>
              {{ companion.translatedName }}
            </a>
            <span 
              v-else
              class="companion-tag good no-link"
              :title="`${companion.translatedName} (no disponible)`"
            >
              <span class="companion-icon">{{ getCategoryIcon(companion.categorySlug || 'default') }}</span>
              {{ companion.translatedName }}
              <span class="no-link-indicator">*</span>
            </span>
          </template>
        </div>
        <p v-if="processedCompanions.some(c => !c.hasCategory)" class="companions-note">
          * Estas plantas no tienen guía de cultivo disponible
        </p>
      </div>

      <div v-if="processedAvoidPlants.length > 0" class="companions-section">
        <h4 class="companions-title bad">❌ Evitar Plantar Cerca</h4>
        <div class="companions-list">
          <template v-for="avoid in processedAvoidPlants" :key="avoid.originalName">
            <a 
              v-if="avoid.hasCategory" 
              :href="`/calendario/categoria/${avoid.categorySlug}/`"
              class="companion-tag bad clickable"
              :title="`Ver calendario de ${avoid.translatedName}`"
            >
              <span class="companion-icon">{{ getCategoryIcon(avoid.categorySlug || 'default') }}</span>
              {{ avoid.translatedName }}
            </a>
            <span 
              v-else
              class="companion-tag bad no-link"
              :title="`${avoid.translatedName} (no disponible)`"
            >
              <span class="companion-icon">{{ getCategoryIcon(avoid.categorySlug || 'default') }}</span>
              {{ avoid.translatedName }}
              <span class="no-link-indicator">*</span>
            </span>
          </template>
        </div>
        <p v-if="processedAvoidPlants.some(a => !a.hasCategory)" class="companions-note">
          * Estas plantas no tienen guía de cultivo disponible
        </p>
      </div>
    </section>

    <!-- Plant Details -->
    <section class="details-card">
      <h3>🌿 Información de la Planta</h3>
      <div class="plant-details-grid">
        <div v-if="plantInfo.family" class="plant-detail-item">
          <span class="detail-icon">🏛️</span>
          <div>
            <strong>Familia</strong>
            <p>{{ plantInfo.family }}</p>
          </div>
        </div>

        <div v-if="plantInfo.type" class="plant-detail-item">
          <span class="detail-icon">🔄</span>
          <div>
            <strong>Tipo</strong>
            <p>{{ formatTaskName(plantInfo.type) }}</p>
          </div>
        </div>

        <div v-if="plantInfo.difficulty" class="plant-detail-item">
          <span class="detail-icon">{{ getDifficultyIcon(plantInfo.difficulty) }}</span>
          <div>
            <strong>Dificultad</strong>
            <p>{{ formatTaskName(plantInfo.difficulty) }}</p>
          </div>
        </div>

        <div v-if="plantInfo.origin" class="plant-detail-item">
          <span class="detail-icon">{{ originFlag }}</span>
          <div>
            <strong>Origen</strong>
            <p>{{ formatOriginName(plantInfo.origin) }}</p>
          </div>
        </div>

        <div v-if="plantInfo.common_names && plantInfo.common_names.length > 0" class="plant-detail-item">
          <span class="detail-icon">📝</span>
          <div>
            <strong>Otros Nombres</strong>
            <p>{{ plantInfo.common_names.join(', ') }}</p>
          </div>
        </div>

        <div v-if="growingConditions.special_care" class="plant-detail-item special-care">
          <span class="detail-icon">⚠️</span>
          <div>
            <strong>Cuidados Especiales</strong>
            <p v-if="typeof growingConditions.special_care === 'string'">
              {{ growingConditions.special_care }}
            </p>
            <div v-else class="special-care-details">
              <p v-if="growingConditions.special_care.water_restriction">
                <strong>Restricción de riego:</strong> 
                <template v-if="growingConditions.special_care.water_restriction.months">
                  Durante {{ growingConditions.special_care.water_restriction.months.map(m => getMonthName(m)).join(', ') }} 
                </template>
                <template v-if="growingConditions.special_care.water_restriction.purpose === 'flavor_intensification'">
                  para intensificar el sabor
                </template>
              </p>
              <template v-for="[key, value] in Object.entries(growingConditions.special_care).filter(([key]) => key !== 'water_restriction')" :key="key">
                <p><strong>{{ formatTaskName(key) }}:</strong> {{ typeof value === 'string' ? value : JSON.stringify(value) }}</p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// Client-side helper functions for Vue components
function formatTaskName(task) {
  const translations = {
    'sowing': 'Siembra',
    'transplanting': 'Trasplante', 
    'harvesting': 'Cosecha',
    'flowering': 'Floración',
    'planting': 'Plantación',
    'pruning': 'Poda',
    'watering': 'Riego',
    'fertilizing': 'Fertilización',
    'weeding': 'Deshierbe',
    'mulching': 'Acolchado',
    'prepare_seedbeds': 'Preparar Semilleros',
    'plant_protection': 'Protección',
    'thinning': 'Aclareo',
    'pest_control': 'Control de Plagas',
    'disease_prevention': 'Prevención de Enfermedades',
    'soil_preparation': 'Preparación del Suelo',
    'companion_planting': 'Plantación Asociada',
    'succession_planting': 'Siembra Escalonada',
    'deadheading': 'Despunte',
    'full_sun': 'Sol directo',
    'partial_sun': 'Sol parcial',
    'partial_shade': 'Sombra parcial',
    'full_shade': 'Sombra total',
    'high': 'Alto',
    'moderate': 'Moderado',
    'low': 'Bajo',
    'well_drained': 'Bien drenado',
    'moist': 'Húmedo',
    'dry': 'Seco',
    'acidic': 'Ácido',
    'neutral': 'Neutro',
    'alkaline': 'Alcalino',
    'loamy': 'Franco',
    'sandy': 'Arenoso',
    'clay': 'Arcilloso',
    'fertile': 'Fértil',
    'rich_organic': 'Rico en materia orgánica',
    'well_drained_fertile': 'Bien drenado y fértil',
    // Plant types
    'annual': 'Anual',
    'perennial': 'Perenne',
    'biennial': 'Bienal',
    'shrub': 'Arbusto',
    'tree': 'Árbol',
    // Difficulty levels
    'beginner': 'Principiante',
    'intermediate': 'Intermedio',
    'advanced': 'Avanzado',
    'expert': 'Experto'
  };
  return translations[task] || task;
}

function formatOriginName(origin) {
  const origins = {
    'mediterranean': 'Mediterráneo',
    'tropical': 'Tropical',
    'temperate': 'Templado',
    'subtropical': 'Subtropical',
    'europe': 'Europa',
    'asia': 'Asia',
    'americas': 'América',
    'africa': 'África',
    'oceania': 'Oceanía'
  };
  return origins[origin] || origin;
}

function getCategoryIcon(category) {
  const icons = {
    'rosa': '🌹',
    'hibiscus': '🌺',
    'lirios': '🌸',
    'tomate': '🍅',
    'patata': '🥔',
    'albahaca': '🌿',
    'default': '🌱'
  };
  return icons[category] || icons.default;
}

function getMonthName(monthNumber) {
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return months[monthNumber - 1] || '';
}

export default {
  name: 'PlantDetailsGrid',
  props: {
    growingConditions: {
      type: Object,
      default: () => ({})
    },
    harvestData: {
      type: Object,
      default: () => ({})
    },
    plantInfo: {
      type: Object,
      required: true
    },
    processedCompanions: {
      type: Array,
      default: () => []
    },
    processedAvoidPlants: {
      type: Array,
      default: () => []
    },
    originFlag: {
      type: String,
      default: '🌍'
    }
  },
  methods: {
    formatTaskName,
    formatOriginName,
    getCategoryIcon,
    getMonthName,
    getDifficultyIcon(difficulty) {
      switch(difficulty) {
        case 'easy': return '😊';
        case 'intermediate': return '🤔';
        default: return '😰';
      }
    }
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

.conditions-grid, .harvest-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.condition-item, .harvest-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.condition-icon, .harvest-icon {
  font-size: 1.5rem;
  width: 32px;
  text-align: center;
  flex-shrink: 0;
}

.condition-item strong, .harvest-item strong {
  display: block;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.condition-item p, .harvest-item p {
  color: #4a5568;
  margin: 0;
  font-size: 0.9rem;
}

.companions-section {
  margin-bottom: 1.5rem;
}

.companions-section:last-child {
  margin-bottom: 0;
}

.companions-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.companions-title.good {
  color: #38a169;
}

.companions-title.bad {
  color: #e53e3e;
}

.companions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.companion-tag {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.companion-tag.good {
  background: #c6f6d5;
  color: #22543d;
  border: 1px solid #9ae6b4;
}

.companion-tag.good.clickable:hover {
  background: #9ae6b4;
  transform: translateY(-1px);
}

.companion-tag.bad {
  background: #fed7d7;
  color: #742a2a;
  border: 1px solid #feb2b2;
}

.companion-tag.bad.clickable:hover {
  background: #feb2b2;
  transform: translateY(-1px);
}

.companion-tag.no-link {
  cursor: default;
  opacity: 0.7;
}

.no-link-indicator {
  font-size: 0.7rem;
  opacity: 0.6;
  margin-left: 0.25rem;
}

.companions-note {
  font-size: 0.8rem;
  color: #718096;
  margin-top: 0.5rem;
  margin-bottom: 0;
  font-style: italic;
}

.companion-icon {
  font-size: 1rem;
}

.plant-details-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.plant-detail-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.plant-detail-item.special-care {
  background: #fffbf0;
  border-left: 4px solid #ed8936;
}

.detail-icon {
  font-size: 1.5rem;
  width: 32px;
  text-align: center;
  flex-shrink: 0;
}

.plant-detail-item strong {
  display: block;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.plant-detail-item p {
  color: #4a5568;
  margin: 0;
  font-size: 0.9rem;
}

.special-care-details p {
  margin-bottom: 0.5rem;
}

.special-care-details p:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .details-card {
    padding: 1rem;
  }
}
</style>