<template>
  <div class="plant-card">
    <div class="card-header">
      <div class="plant-info">
        <h4>{{ formatCategoryName(plant.category) }} {{ formatPlantName(plant.slug) }}</h4>
      </div>
    </div>

    <div class="card-activities">
      <span v-if="getPlantActivity(plant, 'sowing').length > 0" class="activity-tag sowing">
        🌱 {{ getPlantActivity(plant, 'sowing').map(m => getMonthName(m).slice(0,3)).join(', ') }}
      </span>
      <span v-if="getPlantActivity(plant, 'harvesting').length > 0" class="activity-tag harvesting">
        🌾 {{ getPlantActivity(plant, 'harvesting').map(m => getMonthName(m).slice(0,3)).join(', ') }}
      </span>
      <span v-if="getPlantActivity(plant, 'transplanting').length > 0" class="activity-tag transplanting">
        🌿 {{ getPlantActivity(plant, 'transplanting').map(m => getMonthName(m).slice(0,3)).join(', ') }}
      </span>
    </div>

    <div class="card-actions">
      <a v-if="plant.calendar?._article_links?.resolved_link" 
         :href="plant.calendar._article_links.resolved_link" 
         class="btn-link">
        Ver artículo
      </a>
      <a :href="`/calendario/${plant.category}/${plant.slug}/`" 
         class="btn-link btn-calendar">
        Ver calendario
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterPlantCard',
  props: {
    plant: {
      type: Object,
      required: true
    }
  },
  methods: {
    getMonthName(monthNumber) {
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                         'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      return monthNames[monthNumber - 1] || `Mes ${monthNumber}`;
    },
    formatCategoryName(category) {
      if (!category || typeof category !== 'string') {
        return '';
      }
      return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
    },
    formatPlantName(slug) {
      if (!slug || typeof slug !== 'string') {
        return 'Sin nombre';
      }
      return slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    },
    getPlantActivity(plant, activityType) {
      const calendar = plant.calendar?.calendar_data;
      if (!calendar) return [];
      
      let months = [];
      
      if (activityType === 'sowing') {
        if (calendar.sowing?.indoor?.best_months) {
          months.push(...calendar.sowing.indoor.best_months);
        }
        if (calendar.sowing?.outdoor?.best_months) {
          months.push(...calendar.sowing.outdoor.best_months);
        }
      } else if (calendar[activityType]?.best_months) {
        months = calendar[activityType].best_months;
      }
      
      return [...new Set(months)]; // Remove duplicates
    }
  }
}
</script>

<style scoped>
.plant-card {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 1rem;
  background: white;
  transition: box-shadow 0.2s, transform 0.2s;
}

.plant-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 0.75rem;
}

.plant-info h4 {
  margin: 0;
  color: #2d3748;
  font-size: 1rem;
}

.card-activities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.activity-tag {
  background: #edf2f7;
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.activity-tag.sowing {
  background: #c6f6d5;
  color: #22543d;
}

.activity-tag.harvesting {
  background: #feebc8;
  color: #c05621;
}

.activity-tag.transplanting {
  background: #bee3f8;
  color: #2a69ac;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-link {
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  transition: background 0.2s;
  text-align: center;
}

.btn-link:hover {
  background: #5a67d8;
}

.btn-calendar {
  background: #48bb78;
}

.btn-calendar:hover {
  background: #38a169;
}
</style>