<template>
  <section class="details-card growing-conditions">
    <div class="card-header">
      <h3>🌱 Condiciones de Cultivo</h3>
      <div class="difficulty-badge" v-if="plantInfo.difficulty">
        <span class="difficulty-icon">{{ getDifficultyIcon(plantInfo.difficulty) }}</span>
        {{ formatTaskName(plantInfo.difficulty) }}
      </div>
    </div>
    
    <!-- Environmental Requirements -->
    <div class="env-requirements">
      <div class="requirement-row">
        <!-- Sun Requirement -->
        <div v-if="growingConditions.sun_requirements" class="requirement-card sun">
          <div class="req-icon">☀️</div>
          <div class="req-content">
            <h4>Exposición Solar</h4>
            <div class="req-value sun-level" :class="getSunLevel(growingConditions.sun_requirements)">
              <div class="sun-indicator"></div>
              {{ formatTaskName(growingConditions.sun_requirements) }}
            </div>
          </div>
        </div>

        <!-- Water Needs -->
        <div v-if="growingConditions.water_needs" class="requirement-card water">
          <div class="req-icon">💧</div>
          <div class="req-content">
            <h4>Necesidades de Agua</h4>
            <div class="req-value water-level">
              <div class="water-drops" :class="getWaterLevel(growingConditions.water_needs)">
                <span class="drop"></span>
                <span class="drop"></span>
                <span class="drop"></span>
              </div>
              {{ formatTaskName(growingConditions.water_needs) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Temperature Range -->
      <div v-if="growingConditions.temperature_range" class="temperature-range">
        <div class="temp-header">
          <div class="req-icon">🌡️</div>
          <h4>Rango de Temperatura</h4>
        </div>
        <div class="temp-scale">
          <div class="temp-bar">
            <div class="temp-range-indicator" :style="getTempRangeStyle(growingConditions.temperature_range)"></div>
          </div>
          <div class="temp-labels">
            <span class="temp-min">{{ growingConditions.temperature_range[0] }}°C</span>
            <span class="temp-optimal">Rango Óptimo</span>
            <span class="temp-max">{{ growingConditions.temperature_range[1] }}°C</span>
          </div>
        </div>
      </div>

      <!-- Soil & pH -->
      <div class="soil-ph-row">
        <div v-if="growingConditions.soil_type" class="requirement-card soil">
          <div class="req-icon">🌍</div>
          <div class="req-content">
            <h4>Tipo de Suelo</h4>
            <div class="req-value soil-type">
              {{ formatTaskName(growingConditions.soil_type) }}
            </div>
          </div>
        </div>

        <div v-if="growingConditions.soil_ph" class="requirement-card ph">
          <div class="req-icon">⚗️</div>
          <div class="req-content">
            <h4>pH del Suelo</h4>
            <div class="req-value ph-range">
              <div class="ph-scale">
                <div class="ph-indicator" :style="getPhRangeStyle(growingConditions.soil_ph)"></div>
              </div>
              <span class="ph-values">{{ growingConditions.soil_ph[0] }} - {{ growingConditions.soil_ph[1] }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Spacing Information -->
      <div v-if="growingConditions.spacing" class="spacing-info">
        <div class="spacing-header">
          <div class="req-icon">📏</div>
          <h4>Espaciado de Plantación</h4>
        </div>
        <div class="spacing-visual">
          <div class="plant-spacing">
            <div class="spacing-item">
              <div class="spacing-icon plant-icon">🌱</div>
              <span>{{ growingConditions.spacing.plant_distance }}cm</span>
              <small>entre plantas</small>
            </div>
            <div v-if="growingConditions.spacing.row_distance" class="spacing-item">
              <div class="spacing-icon row-icon">📎</div>
              <span>{{ growingConditions.spacing.row_distance }}cm</span>
              <small>entre filas</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Special Purposes -->
      <div v-if="growingConditions.special_purposes && growingConditions.special_purposes.length > 0" class="special-purposes">
        <div class="purposes-header">
          <div class="req-icon">✨</div>
          <h4>Características Especiales</h4>
        </div>
        <div class="purposes-tags">
          <span v-for="purpose in growingConditions.special_purposes" :key="purpose" class="purpose-tag">
            {{ formatTaskName(purpose) }}
          </span>
        </div>
      </div>

      <!-- Special Care -->
      <div v-if="growingConditions.special_care" class="special-care-alert">
        <div class="care-icon">⚠️</div>
        <div class="care-content">
          <h4>Cuidados Especiales</h4>
          <p>{{ growingConditions.special_care }}</p>
        </div>
      </div>
    </div>
  </section>
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
    'full_sun_morning_shade': 'Sol directo - Sombra matutina',
    'moderate_spring_low_summer': 'Primavera moderada - Verano bajo',
    'partial_sun': 'Sol parcial',
    'partial_shade': 'Sombra parcial',
    'full_shade': 'Sombra total',
    'full_sun_partial_shade': 'Sol Directo/Sombra Parcial',
    'very_low': 'Muy bajo',
    'high': 'Alto',
    'moderate': 'Moderado',
    'low': 'Bajo',
    'well_drained': 'Bien drenado',
    'moist': 'Húmedo',
    'dry': 'Seco',
    'moist_well_drained': 'Húmedo Bien Drenado',
    'organic_rich': 'Rico en Materia Orgánica',
    'acidic': 'Ácido',
    'neutral': 'Neutro',
    'alkaline': 'Alcalino',
    'loamy': 'Franco',
    'sandy': 'Arenoso',
    'clay': 'Arcilloso',
    'fertile': 'Fértil',
    'rich_organic': 'Rico en materia orgánica',
    'well_drained_fertile': 'Bien drenado y fértil',
    'well_drained_poor': 'Bien drenado y pobre',
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
    'expert': 'Experto',
    // Special purposes
    'fresh_eating': 'Consumo Fresco',
    'slicing': 'Para Cortar',
    'gourmet': 'Gourmet',
    'attracts_pollinators': 'Atrae Polinizadores',
    'repels_insects': 'Repele Insectos',
    'companion_benefit': 'Beneficio como Compañera',
    'pest_deterrent': 'Disuade Plagas',
    'ground_cover': 'Cubresuelos',
    'windbreak': 'Cortavientos',
    'privacy_screen': 'Pantalla de Privacidad',
    'nitrogen_fixing': 'Fija Nitrógeno',
    'color_enhancement': 'Mejora el Color',
    'flavor_intensification': 'Intensifica el Sabor',
    'container': 'Cultivo en Maceta',
    'hanging_baskets': 'Cestas Colgantes',
    'continuous_harvest': 'Cosecha Continua',
    'culinary': 'Culinario',
    'versatile_cooking': 'Cocina Versátil',
    'commercial': 'Cultivo Comercial',
    'medicinal': 'Medicinal',
    'ornamental': 'Ornamental',
    'cut_flowers': 'Flores de Corte',
    'cut_flower': 'Flor de Corte',
    'borders': 'Bordes',
    'border_plant': 'Planta de Borde',
    'specimen': 'Ejemplar',
    'mass_planting': 'Plantación Masiva',
    'hedges': 'Setos',
    'hedging': 'Formación de Setos',
    'climbing': 'Trepadora',
    'coastal': 'Costero',
    'low_maintenance': 'Bajo Mantenimiento',
    'wildlife': 'Vida Silvestre',
    'rock_gardens': 'Jardines de Rocas',
    'containers': 'Contenedores',
    'indoor_plants': 'Plantas de Interior',
    'greenhouse_cultivation': 'Cultivo en Invernadero',
    'coastal_gardens': 'Jardines Costeros',
    'xerophytic': 'Xerófila',
    'wildflower_gardens': 'Jardines de Flores Silvestres',
    'prairie_gardens': 'Jardines de Pradera',
    'processing': 'Procesamiento',
    'canning': 'Enlatado',
    'sauce': 'Salsa',
    'paste': 'Pasta',
    'concentrate': 'Concentrado',
    'gazpacho': 'Gazpacho',
    'fresh_market': 'Mercado Fresco',
    'long_storage': 'Almacenamiento Largo',
    'cluster_harvest': 'Cosecha en Racimo',
    'antioxidant': 'Antioxidante',
    'unique_appearance': 'Apariencia Única',
    'novelty': 'Novedad',
    'premium_market': 'Mercado Premium',
    'sandwich': 'Sándwich',
    'perfume': 'Perfume',
    'essential_oil': 'Aceite Esencial',
    'cosmetic': 'Cosmético',
    'historical_garden': 'Jardín Histórico',
    'formal_garden': 'Jardín Formal',
    'modern_garden': 'Jardín Moderno',
    'compact_space': 'Espacio Compacto',
    'small_spaces': 'Espacios Pequeños',
    'indoor': 'Interior',
    'pergolas': 'Pérgolas',
    'walls': 'Muros',
    'large_structures': 'Estructuras Grandes',
    'low_hedges': 'Setos Bajos',
    'cold_climate': 'Clima Frío',
    'back_border': 'Borde Posterior',
    'naturalizing': 'Naturalización',
    'naturalized': 'Naturalizada',
    'spring_color': 'Color Primaveral',
    'wild_garden': 'Jardín Silvestre',
    'dual_purpose': 'Doble Propósito',
    'resistant': 'Resistente',
    'tropical_garden': 'Jardín Tropical',
    'commercial_production': 'Producción Comercial',
    'early_harvest': 'Cosecha Temprana',
    'container_growing': 'Cultivo en Contenedor',
    'fruit_production': 'Producción de Fruta',
    'shade_tree': 'Árbol de Sombra',
    'dessert': 'Postre',
    'juice': 'Jugo',
    'cooking': 'Cocina',
    'frying': 'Fritura',
    'plantas-comestibles': 'Plantas Comestibles'
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
        case 'easy':
        case 'beginner': return '😊';
        case 'intermediate': return '🤔';
        case 'advanced': return '😰';
        case 'expert': return '🔥';
        default: return '🤔';
      }
    },
    getSunLevel(sunRequirement) {
      return sunRequirement;
    },
    getWaterLevel(waterNeed) {
      switch(waterNeed) {
        case 'very_low':
        case 'low': return 'low';
        case 'moderate': 
        case 'moderate_to_high': return 'moderate';
        case 'high':
        case 'very_high': return 'high';
        default: return 'moderate';
      }
    },
    getTempRangeStyle(tempRange) {
      // Convert temperature range to percentage on a 0-50°C scale
      const minTemp = Math.max(0, tempRange[0]);
      const maxTemp = Math.min(50, tempRange[1]);
      const left = (minTemp / 50) * 100;
      const width = ((maxTemp - minTemp) / 50) * 100;
      return {
        left: `${left}%`,
        width: `${width}%`
      };
    },
    getPhRangeStyle(phRange) {
      // Convert pH range to percentage on a 0-14 scale
      const minPh = Math.max(0, phRange[0]);
      const maxPh = Math.min(14, phRange[1]);
      const left = (minPh / 14) * 100;
      const width = ((maxPh - minPh) / 14) * 100;
      return {
        left: `${left}%`,
        width: `${width}%`
      };
    }
  }
}
</script>

<style scoped>

.details-card {
  background: linear-gradient(135deg, #fcfdfe 0%, #f8fafc 100%);
  border-radius: 16px;
  padding: 2.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.details-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #48bb78 0%, #38b2ac 50%, #4299e1 100%);
}

.growing-conditions::before {
  background: linear-gradient(90deg, #48bb78 0%, #68d391 50%, #9ae6b4 100%);
}

/* Environmental Requirements Styling */
.env-requirements {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.requirement-row, .soil-ph-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.requirement-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.3s ease;
}

.requirement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e0;
}

.req-icon {
  font-size: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
}

.sun .req-icon {
  background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
}

.water .req-icon {
  background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
}

.soil .req-icon {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.ph .req-icon {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
}

.req-content {
  flex: 1;
}

.req-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.req-value {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

/* Sun Level Indicator */
.sun-level {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sun-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fbbf24;
}

.sun-level.full_sun .sun-indicator {
  background: #f59e0b;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.6);
}

.sun-level.partial_shade .sun-indicator {
  background: linear-gradient(45deg, #f59e0b 50%, #9ca3af 50%);
}

/* Water Level Drops */
.water-level {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.water-drops {
  display: flex;
  gap: 2px;
}

.drop {
  width: 8px;
  height: 10px;
  background: #e2e8f0;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
}

.water-drops.high .drop:nth-child(1),
.water-drops.high .drop:nth-child(2),
.water-drops.high .drop:nth-child(3) {
  background: #3b82f6;
}

.water-drops.moderate .drop:nth-child(1),
.water-drops.moderate .drop:nth-child(2) {
  background: #3b82f6;
}

.water-drops.low .drop:nth-child(1) {
  background: #3b82f6;
}

/* Temperature Range */
.temperature-range {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
}

.temp-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.temp-header .req-icon {
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
}

.temp-header h4 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.temp-scale {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.temp-bar {
  height: 8px;
  background: linear-gradient(90deg, #3b82f6 0%, #10b981 50%, #f59e0b 100%);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.temp-range-indicator {
  position: absolute;
  top: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid #ffffff;
  border-radius: 4px;
}

.temp-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #6b7280;
}

.temp-optimal {
  font-weight: 600;
  color: #059669;
}

/* pH Scale */
.ph-range {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ph-scale {
  height: 6px;
  background: linear-gradient(90deg, #ef4444 0%, #f59e0b 25%, #10b981 50%, #3b82f6 75%, #8b5cf6 100%);
  border-radius: 3px;
  position: relative;
}

.ph-indicator {
  position: absolute;
  top: -2px;
  height: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #374151;
  border-radius: 5px;
}

.ph-values {
  font-weight: 600;
  color: #374151;
  text-align: center;
}

/* Spacing Visual */
.spacing-info, .special-purposes {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
}

.spacing-header, .purposes-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.spacing-header .req-icon, .purposes-header .req-icon {
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%);
}

.spacing-header h4, .purposes-header h4 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.plant-spacing {
  display: flex;
  gap: 2rem;
}

.spacing-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.spacing-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.plant-icon {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.row-icon {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.spacing-item span {
  font-weight: 700;
  color: #1f2937;
}

.spacing-item small {
  color: #6b7280;
  font-size: 0.8rem;
}

/* Special Purposes Tags */
.purposes-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.purpose-tag {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  color: #0c4a6e;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid #7dd3fc;
}

/* Special Care Alert */
.special-care-alert {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid #f59e0b;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.care-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.care-content h4 {
  margin: 0 0 0.5rem 0;
  color: #92400e;
  font-size: 0.9rem;
  font-weight: 600;
}

.care-content p {
  margin: 0;
  color: #78350f;
  line-height: 1.4;
}

/* Difficulty Badge */
.difficulty-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  color: #0c4a6e;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid #7dd3fc;
}

.difficulty-icon {
  font-size: 1rem;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.card-header h3 {
  color: #2d3748;
  font-size: 1.35rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
}

@media (max-width: 768px) {
  .details-card {
    padding: 1.5rem;
  }
  
  .requirement-row, .soil-ph-row {
    grid-template-columns: 1fr;
  }
  
  .plant-spacing {
    flex-direction: column;
    gap: 1rem;
  }
  
  .temp-labels {
    font-size: 0.7rem;
  }
  
  .purposes-tags {
    justify-content: center;
  }
  
  .card-header {
    margin-bottom: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .req-icon {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
  
  .requirement-card {
    padding: 1rem;
  }
  
  .special-care-alert {
    flex-direction: column;
    text-align: center;
  }
}
</style>