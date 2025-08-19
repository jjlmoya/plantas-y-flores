<template>
  <div class="plant-card" :class="activityType">
    <div class="plant-info">
      <h4>
        <span class="plant-icon" v-html="plantIcon"></span>
        {{ plantName }}
      </h4>
      <p class="plant-category">{{ formattedCategory }}</p>
      
      <a 
        v-if="plantLink" 
        :href="plantLink" 
        class="plant-link"
      >
        Ver calendario completo →
      </a>
    </div>

    <div class="plant-details" v-if="hasDetails">
      <div class="detail" v-if="difficulty">
        <strong>Dificultad:</strong> {{ formattedDifficulty }}
      </div>
      
      <div class="detail" v-if="soilType">
        <strong>Suelo:</strong> {{ formattedSoilType }}
      </div>
      
      <div class="detail" v-if="sunRequirement">
        <strong>Sol:</strong> {{ formattedSunRequirement }}
      </div>
      
      <div class="detail" v-if="waterNeed">
        <strong>Riego:</strong> {{ formattedWaterNeed }}
      </div>
      
      <div class="detail" v-if="daysToHarvest">
        <strong>Días hasta cosecha:</strong> {{ daysToHarvest }}
      </div>
      
      <div class="detail" v-if="storageLife">
        <strong>Conservación:</strong> {{ storageLife }} días
      </div>
      
      <div class="detail" v-if="origin">
        <strong>Origen:</strong> {{ origin }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'CalendarPlantCard',
  props: {
    plantName: {
      type: String,
      required: true
    },
    plantIcon: {
      type: String,
      default: '🌱'
    },
    category: {
      type: String,
      required: true
    },
    activityType: {
      type: String,
      default: 'general',
      validator: value => ['sowing', 'transplanting', 'harvesting', 'tasks', 'general'].includes(value)
    },
    plantSlug: {
      type: String,
      default: ''
    },
    categorySlug: {
      type: String,
      default: ''
    },
    // Plant details
    difficulty: {
      type: String,
      default: ''
    },
    soilType: {
      type: String,
      default: ''
    },
    sunRequirement: {
      type: String,
      default: ''
    },
    waterNeed: {
      type: String,
      default: ''
    },
    daysToHarvest: {
      type: [String, Number],
      default: ''
    },
    storageLife: {
      type: [String, Number],
      default: ''
    },
    origin: {
      type: String,
      default: ''
    },
    showDetails: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const plantLink = computed(() => {
      if (props.plantSlug && props.categorySlug) {
        return `/calendario/${props.categorySlug}/${props.plantSlug}/`;
      }
      return '';
    });

    const formattedCategory = computed(() => {
      return props.category.charAt(0).toUpperCase() + props.category.slice(1).replace(/-/g, ' ');
    });

    const formattedDifficulty = computed(() => {
      const difficultyMap = {
        'beginner': 'Principiante',
        'intermediate': 'Intermedio',
        'advanced': 'Avanzado',
        'expert': 'Experto'
      };
      return difficultyMap[props.difficulty] || props.difficulty;
    });

    const formattedSoilType = computed(() => {
      const soilMap = {
        'well_drained': 'Bien drenado',
        'well_drained_fertile': 'Bien drenado y fértil',
        'sandy': 'Arenoso',
        'sandy_loam': 'Franco arenoso',
        'clay': 'Arcilloso',
        'clay_loam': 'Franco arcilloso',
        'organic_rich': 'Rico en materia orgánica',
        'acidic': 'Ácido',
        'alkaline': 'Alcalino',
        'neutral': 'Neutro',
        'poor': 'Pobre',
        'rocky': 'Rocoso',
        'moist': 'Húmedo',
        'dry': 'Seco'
      };
      return soilMap[props.soilType] || props.soilType;
    });

    const formattedSunRequirement = computed(() => {
      const sunMap = {
        'full_sun': 'Pleno sol',
        'partial_sun': 'Sol parcial',
        'partial_shade': 'Sombra parcial',
        'full_shade': 'Sombra completa',
        'morning_sun': 'Sol matutino',
        'afternoon_shade': 'Sombra vespertina'
      };
      return sunMap[props.sunRequirement] || props.sunRequirement;
    });

    const formattedWaterNeed = computed(() => {
      const waterMap = {
        'very_low': 'Muy bajo',
        'low': 'Bajo',
        'moderate': 'Moderado',
        'moderate_to_high': 'Moderado a alto',
        'high': 'Alto',
        'very_high': 'Muy alto'
      };
      return waterMap[props.waterNeed] || props.waterNeed;
    });

    const hasDetails = computed(() => {
      return props.showDetails && (
        props.difficulty || 
        props.soilType || 
        props.sunRequirement || 
        props.waterNeed || 
        props.daysToHarvest || 
        props.storageLife || 
        props.origin
      );
    });

    return {
      plantLink,
      formattedCategory,
      formattedDifficulty,
      formattedSoilType,
      formattedSunRequirement,
      formattedWaterNeed,
      hasDetails
    };
  }
};
</script>

<style scoped>
.plant-card {
  background: var(--bg-card);
  border-radius: var(--radius-sm);
  padding: var(--space-md);
  box-shadow: var(--shadow-sm);
  border-left: 4px solid var(--color-border-light);
  transition: all 0.3s ease;
  border: 1px solid var(--color-border);
}

.plant-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.plant-card.sowing { 
  border-left-color: var(--color-sowing);
}

.plant-card.transplanting { 
  border-left-color: var(--color-transplanting);
}

.plant-card.harvesting { 
  border-left-color: var(--color-harvesting);
}

.plant-card.tasks { 
  border-left-color: var(--color-tasks);
}

.plant-info h4 {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
  margin-bottom: calc(var(--space-xs) * 0.5);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin: 0 0 calc(var(--space-xs) * 0.5) 0;
}

.plant-icon {
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.plant-category {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-sm);
  text-transform: capitalize;
  margin: 0 0 var(--space-sm) 0;
}

.plant-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  margin-top: var(--space-xs);
}

.plant-link:hover {
  color: var(--color-primary-light);
  text-decoration: underline;
}

.plant-details {
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--color-border-light);
}

.detail {
  margin-bottom: var(--space-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.detail:last-child {
  margin-bottom: 0;
}

.detail strong {
  color: var(--color-text-primary);
}
</style>