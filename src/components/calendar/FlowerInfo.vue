<template>
  <section v-if="hasFlowerData" class="details-card flower-info-card">
    <div class="card-header">
      <h3>🌸 Características de la Flor</h3>
      <div class="flower-preview">
        <div class="flower-visual">
          <div 
            v-for="(color, index) in getPreviewColors" 
            :key="color"
            class="color-petal" 
            :class="`petal-${index + 1}`"
            :style="{ background: getColorGradient(color) }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Flower Color Palette -->
    <div v-if="getFlowerColors().length > 0" class="color-section">
      <div class="section-header">
        <div class="section-icon">🎨</div>
        <h4>Paleta de Colores</h4>
      </div>
      <div class="color-palette">
        <div 
          v-for="color in getFlowerColors()" 
          :key="color" 
          class="color-card"
          :title="formatTaskName(color)"
        >
          <div 
            class="color-swatch" 
            :style="{ background: getColorGradient(color) }"
          ></div>
          <span class="color-name">{{ formatTaskName(color) }}</span>
        </div>
      </div>
    </div>

    <!-- Flower Characteristics Grid -->
    <div class="flower-characteristics">
      <div class="char-grid">
        <!-- Fragrance -->
        <div v-if="flowerData.fragrance" class="char-card fragrance">
          <div class="char-icon-wrapper">
            <div class="char-icon">{{ getFragranceIcon(flowerData.fragrance) }}</div>
          </div>
          <div class="char-content">
            <div class="char-label">Fragancia</div>
            <div class="char-value">{{ formatTaskName(flowerData.fragrance) }}</div>
            <div class="char-description">{{ getFragranceDescription(flowerData.fragrance) }}</div>
          </div>
          <div class="intensity-bar">
            <div 
              class="intensity-fill fragrance-intensity" 
              :style="{ width: getFragranceIntensity(flowerData.fragrance) + '%' }"
            ></div>
          </div>
        </div>

        <!-- Size -->
        <div v-if="flowerData.size || flowerData.flower_size" class="char-card size">
          <div class="char-icon-wrapper">
            <div class="char-icon">📐</div>
          </div>
          <div class="char-content">
            <div class="char-label">Tamaño</div>
            <div class="char-value">
              {{ formatTaskName(flowerData.flower_size || flowerData.size) }}
            </div>
            <div class="char-description">{{ getSizeDescription(flowerData.flower_size || flowerData.size) }}</div>
          </div>
          <div class="size-indicator">
            <div class="size-scale">
              <div 
                v-for="sizeOption in getSizeScale()" 
                :key="sizeOption.key"
                class="size-option"
                :class="{ 'active': sizeOption.active }"
                :title="sizeOption.label"
              >
                <div class="size-circle" :class="`size-${sizeOption.key}`"></div>
                <span class="size-label">{{ sizeOption.short }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Shape -->
        <div v-if="flowerData.flower_shape" class="char-card shape">
          <div class="char-icon-wrapper">
            <div class="char-icon">{{ getShapeIcon(flowerData.flower_shape) }}</div>
          </div>
          <div class="char-content">
            <div class="char-label">Forma</div>
            <div class="char-value">{{ formatTaskName(flowerData.flower_shape) }}</div>
            <div class="char-description">{{ getShapeDescription(flowerData.flower_shape) }}</div>
          </div>
        </div>

        <!-- Bloom Duration -->
        <div v-if="flowerData.bloom_duration" class="char-card duration">
          <div class="char-icon-wrapper">
            <div class="char-icon">⏰</div>
          </div>
          <div class="char-content">
            <div class="char-label">Duración de Floración</div>
            <div class="char-value">{{ formatTaskName(flowerData.bloom_duration) }}</div>
            <div class="char-description">Tiempo de vida de cada flor</div>
          </div>
          <div class="duration-timeline">
            <div class="timeline-bar">
              <div 
                class="duration-fill" 
                :style="{ width: getDurationWidth(flowerData.bloom_duration) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Special Features -->
      <div v-if="hasSpecialFeatures" class="special-features">
        <div class="features-header">
          <div class="features-icon">✨</div>
          <h4>Características Especiales</h4>
        </div>
        <div class="features-grid">
          <div v-if="flowerData.edible_parts" class="feature-tag edible">
            <span class="feature-icon">🍽️</span>
            <div class="feature-info">
              <span class="feature-title">Comestible</span>
              <span class="feature-detail">{{ formatTaskName(flowerData.edible_parts) }}</span>
            </div>
          </div>
          
          <div v-if="flowerData.calyx_color" class="feature-tag calyx">
            <span class="feature-icon">🎯</span>
            <div class="feature-info">
              <span class="feature-title">Color de Cáliz</span>
              <span class="feature-detail">{{ formatTaskName(flowerData.calyx_color) }}</span>
            </div>
          </div>

          <div v-if="flowerData.petal_texture" class="feature-tag texture">
            <span class="feature-icon">✨</span>
            <div class="feature-info">
              <span class="feature-title">Textura</span>
              <span class="feature-detail">{{ formatTaskName(flowerData.petal_texture) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Flower Care Tips -->
    <div class="flower-tips">
      <div class="tip-icon">🌺</div>
      <div class="tip-content">
        <strong>Consejo de Floración:</strong> 
        <span v-if="flowerData.fragrance === 'strong'">
          Las flores muy fragantes suelen ser más intensas en las primeras horas de la mañana.
        </span>
        <span v-else-if="flowerData.bloom_duration === '1 día' || flowerData.bloom_duration === '1_day'">
          Disfruta de estas flores efímeras durante su corta pero intensa floración.
        </span>
        <span v-else-if="flowerData.edible_parts">
          Las partes comestibles se pueden cosechar cuando las flores están completamente abiertas.
        </span>
        <span v-else>
          Para prolongar la floración, retira las flores marchitas regularmente.
        </span>
      </div>
    </div>
  </section>
</template>

<script>
// Client-side helper function for Vue components
function formatTaskName(task) {
  const translations = {
    // Colors
    'white': 'Blanco',
    'pink': 'Rosa',
    'red': 'Rojo',
    'blue': 'Azul',
    'yellow': 'Amarillo',
    'purple': 'Morado',
    'orange': 'Naranja',
    'green': 'Verde',
    'cream': 'Crema',
    'salmon': 'Salmón',
    'deep_red': 'Rojo Intenso',
    'light_pink': 'Rosa Claro',
    'dark_purple': 'Morado Oscuro',
    // Fragrance
    'none': 'Sin Fragancia',
    'light': 'Ligera',
    'mild': 'Suave',
    'moderate': 'Moderada',
    'strong': 'Intensa',
    'very_strong': 'Muy Intensa',
    'mild_sweet': 'Suave Dulce',
    // Size
    'tiny': 'Diminuta',
    'very_small': 'Muy Pequeña',
    'small': 'Pequeña',
    'medium': 'Mediana',
    'large': 'Grande',
    'very_large': 'Muy Grande',
    'extra_large': 'Extra Grande',
    // Shape
    'single': 'Simple',
    'double': 'Doble',
    'cup_shaped': 'Copa',
    'large_cup_shaped': 'Copa Grande',
    'trumpet': 'Trompeta',
    'hibisco': 'Hibisco',
    'bell_shaped': 'Campanilla',
    'star_shaped': 'Estrella',
    'small_star': 'Estrella Pequeña',
    'tubular': 'Tubular',
    // Duration
    '1_day': '1 Día',
    '1 día': '1 Día',
    '1_week': '1 Semana',
    '1_semana': '1 Semana',
    '3_days': '3 Días',
    '3 días': '3 Días',
    '2_weeks': '2 Semanas',
    '2_semanas': '2 Semanas',
    '3_weeks': '3 Semanas',
    '3_semanas': '3 Semanas',
    'few_hours': 'Pocas Horas',
    '4_weeks': '4 Semanas',
    '4_semanas': '4 Semanas',
    '6_weeks': '6 Semanas',
    '6_semanas': '6 Semanas',
    '8_weeks': '8 Semanas',
    '8_semanas': '8 Semanas',
    '10_weeks': '10 Semanas',
    '10_semanas': '10 Semanas',
    '12_weeks': '12 Semanas',
    '14_weeks': '14 Semanas',
    '14_semanas': '14 Semanas',
    '12_semanas': '12 Semanas',
    '16_weeks': '16 Semanas',
    '16_semanas': '16 Semanas',
    // Edible parts
    'cálices': 'Cálices',
    'petals': 'Pétalos',
    'whole_flower': 'Flor Completa',
    // Textures
    'papery_delicate': 'Delicada Papelosa',
    'delicate_striped': 'Delicada Rayada',
    'silky_smooth': 'Sedosa y Suave',
    'silky': 'Sedosa',
    'waxy': 'Cerosa',
    'velvety': 'Aterciopelada'
  };
  return translations[task] || task;
}

export default {
  name: 'FlowerInfo',
  props: {
    flowerData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    hasFlowerData() {
      return this.flowerData && Object.keys(this.flowerData).length > 0;
    },
    hasSpecialFeatures() {
      return this.flowerData.edible_parts || 
             this.flowerData.calyx_color || 
             this.flowerData.petal_texture;
    },
    getPreviewColors() {
      if (!this.flowerData.colors) return [];
      return this.flowerData.colors.slice(0, 3);
    }
  },
  methods: {
    formatTaskName,
    getFlowerColors() {
      // Primera prioridad: colors en inglés
      if (this.flowerData.colors && this.flowerData.colors.length > 0) {
        return this.flowerData.colors;
      }
      
      // Segunda prioridad: flower_color como fallback
      if (this.flowerData.flower_color) {
        const colorMap = {
          'rosa_palido': ['pink', 'white'],
          'rosa_intenso': ['pink', 'red'],
          'rosa': ['pink'],
          'rojo': ['red'],
          'blanco': ['white'],
          'amarillo': ['yellow'],
          'magenta_rosa': ['pink', 'magenta'],
          'blanco_crema': ['white', 'cream']
        };
        
        if (Array.isArray(this.flowerData.flower_color)) {
          // Si es array de colores en español, convertir a inglés
          return this.flowerData.flower_color.map(color => 
            colorMap[color] ? colorMap[color][0] : 'pink'
          );
        } else {
          // Si es string, usar el mapeo
          return colorMap[this.flowerData.flower_color] || ['pink'];
        }
      }
      
      return [];
    },
    getColorGradient(color) {
      const colorMap = {
        'white': 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        'pink': 'linear-gradient(135deg, #fce7f3 0%, #f9a8d4 100%)',
        'red': 'linear-gradient(135deg, #fee2e2 0%, #f87171 100%)',
        'blue': 'linear-gradient(135deg, #dbeafe 0%, #60a5fa 100%)',
        'yellow': 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
        'purple': 'linear-gradient(135deg, #e9d5ff 0%, #a78bfa 100%)',
        'orange': 'linear-gradient(135deg, #fed7aa 0%, #fb923c 100%)',
        'green': 'linear-gradient(135deg, #d1fae5 0%, #34d399 100%)',
        'cream': 'linear-gradient(135deg, #fffbeb 0%, #fde68a 100%)',
        'salmon': 'linear-gradient(135deg, #fed7d7 0%, #fb7185 100%)',
        'deep_red': 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
        'light_pink': 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)'
      };
      return colorMap[color] || 'linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%)';
    },
    getFragranceIcon(fragrance) {
      const icons = {
        'none': '🚫',
        'light': '👃',
        'moderate': '🌸',
        'strong': '💐',
        'very_strong': '🌹'
      };
      return icons[fragrance] || '👃';
    },
    getFragranceDescription(fragrance) {
      const descriptions = {
        'none': 'Sin aroma detectable',
        'light': 'Aroma sutil y delicado',
        'mild': 'Aroma suave y agradable',
        'mild_sweet': 'Aroma suave con notas dulces',
        'moderate': 'Aroma claramente perceptible',
        'strong': 'Aroma intenso y duradero',
        'very_strong': 'Aroma muy potente'
      };
      return descriptions[fragrance] || '';
    },
    getFragranceIntensity(fragrance) {
      const intensity = {
        'none': 0,
        'light': 25,
        'mild': 35,
        'mild_sweet': 40,
        'moderate': 50,
        'strong': 75,
        'very_strong': 100
      };
      return intensity[fragrance] || 0;
    },
    getSizeDescription(size) {
      const descriptions = {
        'tiny': 'Menos de 2cm',
        'very_small': '1-3cm de diámetro',
        'small': '2-5cm de diámetro',
        'medium': '5-8cm de diámetro',
        'large': '8-12cm de diámetro',
        'very_large': '12-15cm de diámetro',
        'extra_large': 'Más de 15cm'
      };
      return descriptions[size] || '';
    },
    getSizeClass(size) {
      return size ? `size-${size}` : 'size-medium';
    },
    getSizeScale() {
      const currentSize = this.flowerData.flower_size || this.flowerData.size || 'medium';
      const sizes = [
        { key: 'tiny', label: 'Diminuta', short: 'XS' },
        { key: 'very_small', label: 'Muy Pequeña', short: 'XXS' },
        { key: 'small', label: 'Pequeña', short: 'S' },
        { key: 'medium', label: 'Mediana', short: 'M' },
        { key: 'large', label: 'Grande', short: 'L' },
        { key: 'very_large', label: 'Muy Grande', short: 'XL' },
        { key: 'extra_large', label: 'Extra Grande', short: 'XXL' }
      ];
      
      return sizes.map(size => ({
        ...size,
        active: size.key === currentSize
      }));
    },
    getShapeIcon(shape) {
      const icons = {
        'single': '🌼',
        'double': '🌸',
        'cup_shaped': '🏆',
        'large_cup_shaped': '🏆',
        'trumpet': '🎺',
        'hibisco': '🌺',
        'bell_shaped': '🔔',
        'star_shaped': '⭐',
        'tubular': '🧪'
      };
      return icons[shape] || '🌻';
    },
    getShapeDescription(shape) {
      const descriptions = {
        'single': 'Una sola capa de pétalos',
        'double': 'Múltiples capas de pétalos',
        'cup_shaped': 'Forma de copa o cuenco',
        'large_cup_shaped': 'Copa grande y profunda',
        'trumpet': 'Forma alargada tipo trompeta',
        'hibisco': 'Cinco pétalos grandes y abiertos',
        'bell_shaped': 'Forma de campanilla',
        'star_shaped': 'Pétalos en forma de estrella',
        'tubular': 'Forma alargada y estrecha'
      };
      return descriptions[shape] || '';
    },
    getDurationWidth(duration) {
      const widths = {
        'few_hours': 15,
        '1_day': 25,
        '1 día': 25,
        '3_days': 40,
        '3 días': 40,
        '1_week': 55,
        '4_weeks': 85,
        '6_weeks': 100
      };
      return widths[duration] || 50;
    }
  }
}
</script>

<style scoped>
.flower-info-card {
  position: relative;
  overflow: hidden;
}

.flower-info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f472b6 0%, #ec4899 50%, #db2777 100%);
}

.flower-info-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.flower-info-card h3 {
  color: #1f2937;
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.flower-preview {
  position: relative;
  width: 60px;
  height: 60px;
}

.flower-visual {
  position: relative;
  width: 100%;
  height: 100%;
}

.color-petal {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.petal-1 {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.petal-2 {
  bottom: 0;
  left: 0;
}

.petal-3 {
  bottom: 0;
  right: 0;
}

.color-section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.section-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fce7f3 0%, #f9a8d4 100%);
  border-radius: 50%;
  border: 2px solid #f472b6;
}

.section-header h4 {
  margin: 0;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
}

.color-palette {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.color-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 80px;
}

.color-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e0;
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
}

.color-swatch::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(45deg, rgba(255,255,255,0.8), transparent);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
}

.color-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #4b5563;
  text-align: center;
}

.char-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.char-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.char-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e0;
}

.char-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--card-gradient);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.char-card:hover::before {
  opacity: 1;
}

.char-card.fragrance {
  --card-gradient: linear-gradient(90deg, #f472b6, #ec4899);
}

.char-card.size {
  --card-gradient: linear-gradient(90deg, #8b5cf6, #a78bfa);
}

.char-card.shape {
  --card-gradient: linear-gradient(90deg, #06b6d4, #67e8f9);
}

.char-card.duration {
  --card-gradient: linear-gradient(90deg, #10b981, #34d399);
}

.char-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid #bae6fd;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.char-icon {
  font-size: 1.5rem;
}

.char-content {
  margin-bottom: 1rem;
}

.char-label {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.char-value {
  font-size: 1.1rem;
  color: #1f2937;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.char-description {
  font-size: 0.85rem;
  color: #6b7280;
  line-height: 1.4;
}

.intensity-bar, .duration-timeline {
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.intensity-fill, .duration-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s ease;
}

.fragrance-intensity {
  background: linear-gradient(90deg, #f472b6, #ec4899);
}

.duration-fill {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.size-indicator {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  padding: 12px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 8px;
}

.size-scale {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 4px;
}

.size-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  opacity: 0.4;
  transition: all 0.3s ease;
  cursor: pointer;
}

.size-option.active {
  opacity: 1;
  transform: translateY(-2px);
}

.size-option:hover {
  opacity: 0.8;
}

.size-label {
  font-size: 10px;
  font-weight: 600;
  color: #8b5cf6;
  text-align: center;
  white-space: nowrap;
}

.size-circle {
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 25px;
  height: 25px;
  transition: all 0.3s ease;
}

.size-tiny .size-circle { width: 8px !important; height: 8px !important; }
.size-very_small .size-circle { width: 10px !important; height: 10px !important; }
.size-small .size-circle { width: 15px !important; height: 15px !important; }
.size-medium .size-circle { width: 25px !important; height: 25px !important; }
.size-large .size-circle { width: 35px !important; height: 35px !important; }
.size-very_large .size-circle { width: 45px !important; height: 45px !important; }
.size-extra_large .size-circle { width: 55px !important; height: 55px !important; }

.special-features {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.features-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.features-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 50%;
  border: 2px solid #f59e0b;
}

.features-header h4 {
  margin: 0;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
}

.features-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.feature-tag {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.feature-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.feature-tag.edible {
  border-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.feature-tag.calyx {
  border-color: #f472b6;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
}

.feature-tag.texture {
  border-color: #8b5cf6;
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
}

.feature-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.feature-info {
  display: flex;
  flex-direction: column;
}

.feature-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
}

.feature-detail {
  font-size: 0.75rem;
  color: #6b7280;
}

.flower-tips {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #f59e0b;
  border-radius: 12px;
  align-items: flex-start;
}

.tip-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.tip-content {
  color: #92400e;
  line-height: 1.5;
  font-size: 0.9rem;
}

.tip-content strong {
  color: #78350f;
}

@media (max-width: 768px) {
  .flower-info-card .card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .char-grid {
    grid-template-columns: 1fr;
  }

  .color-palette {
    justify-content: center;
  }

  .features-grid {
    flex-direction: column;
  }

  .flower-tips {
    flex-direction: column;
    text-align: center;
  }
}
</style>