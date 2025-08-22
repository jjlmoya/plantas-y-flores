<template>
  <section 
    v-if="hasNutritionalData" 
    class="details-card enhanced-nutrition-section"
  >
    <h3>🍎 Información Nutricional</h3>
    
    <!-- Basic Nutritional Stats -->
    <div class="nutrition-stats-grid">
      <div v-if="nutritionalData.calories_per_100g" class="nutrition-stat primary">
        <div class="stat-icon">⚡</div>
        <div class="stat-content">
          <div class="stat-value">{{ nutritionalData.calories_per_100g }}</div>
          <div class="stat-label">kcal/100g</div>
        </div>
      </div>

      <div v-if="nutritionalData.water_content" class="nutrition-stat secondary">
        <div class="stat-icon">💧</div>
        <div class="stat-content">
          <div class="stat-value">{{ nutritionalData.water_content }}%</div>
          <div class="stat-label">agua</div>
        </div>
      </div>

      <div v-if="nutritionalData.sugar_content" class="nutrition-stat secondary">
        <div class="stat-icon">🍯</div>
        <div class="stat-content">
          <div class="stat-value">{{ formatTaskName(nutritionalData.sugar_content) }}</div>
          <div class="stat-label">azúcares</div>
        </div>
      </div>

      <div v-if="nutritionalData.acidity" class="nutrition-stat secondary">
        <div class="stat-icon">🍋</div>
        <div class="stat-content">
          <div class="stat-value">{{ formatTaskName(nutritionalData.acidity) }}</div>
          <div class="stat-label">acidez</div>
        </div>
      </div>
    </div>

    <!-- Flavor Profile -->
    <div v-if="nutritionalData.flavor_profile" class="nutrition-section flavor-section">
      <div class="section-title">
        <span class="section-icon">👅</span>
        <span>Perfil de Sabor</span>
      </div>
      <div class="flavor-badge">
        {{ formatTaskName(nutritionalData.flavor_profile) }}
      </div>
    </div>

    <!-- Main Nutrients & Vitamins -->
    <div 
      v-if="nutritionalData.main_nutrients || nutritionalData.vitamin_content || fruitNutritionalHighlights" 
      class="nutrition-section nutrients-section"
    >
      <div class="section-title">
        <span class="section-icon">🧬</span>
        <span>Nutrientes Principales</span>
      </div>
      <div class="nutrients-grid">
        <div 
          v-for="nutrient in nutritionalData.main_nutrients || []" 
          :key="nutrient" 
          class="nutrient-badge"
        >
          <span class="nutrient-icon">{{ getNutrientIcon(nutrient) }}</span>
          <span class="nutrient-name">{{ formatTaskName(nutrient) }}</span>
        </div>
        
        <div 
          v-for="vitamin in nutritionalData.vitamin_content || []" 
          :key="vitamin" 
          class="nutrient-badge"
        >
          <span class="nutrient-icon">{{ getNutrientIcon(`vitamin_${vitamin.toLowerCase()}`) }}</span>
          <span class="nutrient-name">Vitamina {{ vitamin }}</span>
        </div>

        <div 
          v-for="highlight in fruitNutritionalHighlights || []" 
          :key="highlight" 
          class="nutrient-badge"
        >
          <span class="nutrient-icon">{{ getNutrientIcon(highlight) }}</span>
          <span class="nutrient-name">{{ formatTaskName(highlight) }}</span>
        </div>
      </div>
    </div>

    <!-- Health Benefits -->
    <div 
      v-if="nutritionalData.health_benefits && nutritionalData.health_benefits.length > 0" 
      class="nutrition-section benefits-section"
    >
      <div class="section-title">
        <span class="section-icon">💪</span>
        <span>Beneficios para la Salud</span>
      </div>
      <div class="benefits-list">
        <div 
          v-for="benefit in nutritionalData.health_benefits" 
          :key="benefit" 
          class="benefit-item"
        >
          <span class="benefit-icon">✓</span>
          <span class="benefit-text">{{ formatTaskName(benefit) }}</span>
        </div>
      </div>
    </div>

    <!-- Additional Properties -->
    <div 
      v-if="nutritionalData.properties && nutritionalData.properties.length > 0" 
      class="nutrition-section properties-section"
    >
      <div class="section-title">
        <span class="section-icon">⭐</span>
        <span>Propiedades Adicionales</span>
      </div>
      <div class="properties-tags">
        <span 
          v-for="property in nutritionalData.properties" 
          :key="property" 
          class="property-tag"
        >
          {{ formatTaskName(property) }}
        </span>
      </div>
    </div>

    <!-- Technical Details -->
    <div v-if="nutritionalData.brix_level" class="nutrition-section technical-section">
      <div class="section-title">
        <span class="section-icon">🔬</span>
        <span>Detalles Técnicos</span>
      </div>
      <div class="technical-details">
        <div class="technical-item">
          <span class="tech-label">Nivel Brix:</span>
          <span class="tech-value">{{ nutritionalData.brix_level[0] }}-{{ nutritionalData.brix_level[1] }}°</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'NutritionalInfo',
  props: {
    nutritionalData: {
      type: Object,
      default: () => ({})
    },
    fruitNutritionalHighlights: {
      type: Array,
      default: () => []
    },
    formatTaskName: {
      type: Function,
      required: true
    }
  },
  computed: {
    hasNutritionalData() {
      return Object.keys(this.nutritionalData).length > 0 || 
             (this.fruitNutritionalHighlights && this.fruitNutritionalHighlights.length > 0);
    }
  },
  methods: {
    getNutrientIcon(nutrient) {
      const iconMap = {
        // Vitamins
        'vitamin_c': '🍊',
        'vitamin_a': '🥕',
        'vitamin_k': '🥬',
        'vitamin_b9': '🌿',
        'vitamin_d': '☀️',
        'vitamin_e': '🌰',
        'vitamin_b': '🌾',
        'vitamina_c': '🍊',
        'vitamina_k': '🥬',
        'vitamina_a': '🥕',
        
        // Minerals
        'potasio': '🍌',
        'potassium': '🍌',
        'iron': '🔨',
        'calcium': '🦴',
        'magnesium': '⚡',
        'phosphorus': '🧠',
        'zinc': '⚙️',
        'manganese': '⚙️',
        'manganeso': '⚙️',
        
        // Other nutrients
        'fiber': '🌾',
        'fibra': '🌾',
        'protein': '🥩',
        'proteina': '🥩',
        'antioxidants': '🛡️',
        'antioxidantes': '🛡️',
        'folate': '🌿',
        'folatos': '🌿',
        'licopeno': '🍅',
        'beta_carotene': '🥕',
        'capsaicin': '🌶️',
        
        // Default
        'default': '💊'
      };
      
      const key = nutrient.toLowerCase().replace(/\s+/g, '_');
      return iconMap[key] || iconMap.default;
    }
  }
}
</script>

<style scoped>
.enhanced-nutrition-section {
  background: #fcfdfe;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nutrition-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.nutrition-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fcfdfe;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.nutrition-stat.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: scale(1.05);
}

.nutrition-stat .stat-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.nutrition-stat.primary .stat-icon {
  font-size: 3rem;
}

.stat-content {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.nutrition-stat.primary .stat-value {
  font-size: 2rem;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
}

.nutrition-section {
  margin-bottom: 2rem;
}

.nutrition-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.section-icon {
  font-size: 1.25rem;
}

.flavor-badge {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  color: #8b4513;
  padding: 1rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  text-align: center;
  font-size: 1rem;
  text-transform: lowercase;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.flavor-badge::first-letter {
  text-transform: uppercase;
}

.nutrients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
}

.nutrient-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fcfdfe;
  padding: 0.75rem 1rem;
  border-radius: 25px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.nutrient-badge:hover {
  border-color: #48bb78;
}

.nutrient-icon {
  font-size: 1.25rem;
}

.nutrient-name {
  font-weight: 500;
  color: #2d3748;
  text-transform: capitalize;
}

.benefits-list {
  display: grid;
  gap: 0.75rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%);
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border-left: 4px solid #48bb78;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.benefit-item:hover {
  transform: translateX(2px);
}

.benefit-icon {
  color: #48bb78;
  font-weight: bold;
  font-size: 1.1rem;
}

.benefit-text {
  color: #2d3748;
  font-weight: 500;
  text-transform: capitalize;
}

.properties-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.property-tag {
  background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
  color: #234e52;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
  border: 1px solid #81e6d9;
  transition: all 0.3s ease;
}

.property-tag:hover {
  background: linear-gradient(135deg, #b2f5ea 0%, #81e6d9 100%);
  transform: translateY(-1px);
}

.technical-details {
  background: #fcfdfe;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-left: 4px solid #667eea;
}

.technical-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.tech-label {
  color: #4a5568;
  font-weight: 500;
}

.tech-value {
  color: #2d3748;
  font-weight: 600;
  background: #f7fafc;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
}

.enhanced-nutrition-section h3 {
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .nutrition-stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .nutrition-stat {
    padding: 1rem 0.75rem;
  }

  .nutrition-stat .stat-icon {
    font-size: 2rem;
    margin-bottom: 0.25rem;
  }

  .nutrition-stat.primary .stat-icon {
    font-size: 2.25rem;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .nutrition-stat.primary .stat-value {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }

  .nutrients-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.5rem;
  }

  .nutrient-badge {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }

  .benefit-item {
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
  }

  .properties-tags {
    gap: 0.4rem;
  }

  .property-tag {
    padding: 0.4rem 0.75rem;
    font-size: 0.75rem;
  }

  .flavor-badge {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .section-title {
    font-size: 1rem;
  }

  .enhanced-nutrition-section {
    padding: 1rem;
  }
}
</style>