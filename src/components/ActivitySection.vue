<template>
  <div class="activity-section">
    <div class="activity-header">
      <h3>
        <span class="activity-icon" v-html="activityIcon"></span>
        {{ activityTitle }}
      </h3>
      <div class="activity-count" v-if="plants.length > 0">
        {{ plants.length }} {{ plants.length === 1 ? 'planta' : 'plantas' }}
      </div>
    </div>

    <div class="plants-list" v-if="plants.length > 0">
      <CalendarPlantCard
        v-for="plant in plants"
        :key="plant.slug || plant.name"
        :plant-name="plant.name"
        :plant-icon="plant.icon || categoryIcon"
        :category="plant.category"
        :activity-type="activityType"
        :plant-slug="plant.slug"
        :category-slug="plant.category"
        :difficulty="plant.difficulty"
        :soil-type="plant.soilType"
        :sun-requirement="plant.sunRequirement"
        :water-need="plant.waterNeed"
        :days-to-harvest="plant.daysToHarvest"
        :storage-life="plant.storageLife"
        :origin="plant.origin"
        :show-details="showPlantDetails"
      />
    </div>

    <div class="no-plants" v-else>
      <p>No hay plantas programadas para {{ activityTitle.toLowerCase() }} este período.</p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import CalendarPlantCard from './CalendarPlantCard.vue';

export default {
  name: 'ActivitySection',
  components: {
    CalendarPlantCard
  },
  props: {
    activityType: {
      type: String,
      required: true,
      validator: value => ['sowing', 'transplanting', 'harvesting', 'tasks'].includes(value)
    },
    plants: {
      type: Array,
      default: () => []
    },
    customTitle: {
      type: String,
      default: ''
    },
    customIcon: {
      type: String,
      default: ''
    },
    showPlantDetails: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const activityConfig = {
      sowing: {
        title: 'Siembra',
        icon: '🌱'
      },
      transplanting: {
        title: 'Trasplante', 
        icon: '🪴'
      },
      harvesting: {
        title: 'Cosecha',
        icon: '🌾'
      },
      tasks: {
        title: 'Tareas de Mantenimiento',
        icon: '🛠️'
      }
    };

    const activityTitle = computed(() => {
      return props.customTitle || activityConfig[props.activityType]?.title || 'Actividad';
    });

    const activityIcon = computed(() => {
      return props.customIcon || activityConfig[props.activityType]?.icon || '📋';
    });

    const categoryIcon = computed(() => {
      // Default icon for plants without specific icons
      return '🌱';
    });

    return {
      activityTitle,
      activityIcon,
      categoryIcon
    };
  }
};
</script>

<style scoped>
.activity-section {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);
  border-bottom: 2px solid var(--color-border-light);
  padding-bottom: var(--space-xs);
}

.activity-header h3 {
  font-size: var(--font-size-xl);
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  flex: 1;
}

.activity-icon {
  font-size: var(--font-size-xl);
  flex-shrink: 0;
}

.activity-count {
  background: var(--bg-subtle);
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  padding: calc(var(--space-xs) * 0.5) var(--space-xs);
  border-radius: var(--radius-xl);
  white-space: nowrap;
}

.plants-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.no-plants {
  text-align: center;
  padding: var(--space-lg);
  color: var(--color-text-muted);
  font-style: italic;
}

.no-plants p {
  margin: 0;
}

/* Activity type specific styling */
.activity-section[data-activity="sowing"] .activity-header h3 {
  color: var(--color-sowing);
}

.activity-section[data-activity="transplanting"] .activity-header h3 {
  color: var(--color-transplanting);
}

.activity-section[data-activity="harvesting"] .activity-header h3 {
  color: var(--color-harvesting);
}

.activity-section[data-activity="tasks"] .activity-header h3 {
  color: var(--color-tasks);
}
</style>