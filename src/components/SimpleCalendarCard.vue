<template>
  <div class="plant-card" role="article" :aria-label="`Información de cultivo para ${plantName}`">
    <div class="card-header">
      <div class="plant-info">
        <h4>{{ plantName }}</h4>
      </div>
    </div>

    <div class="card-activities">
      <span v-if="sowingMonths.length > 0" class="activity-tag sowing">
        🌱 {{ sowingMonths.map(m => getMonthName(m).slice(0,3)).join(', ') }}
      </span>
      <span v-if="harvestingMonths.length > 0" class="activity-tag harvesting">
        🌾 {{ harvestingMonths.map(m => getMonthName(m).slice(0,3)).join(', ') }}
      </span>
      <span v-if="transplantingMonths.length > 0" class="activity-tag transplanting">
        🌿 {{ transplantingMonths.map(m => getMonthName(m).slice(0,3)).join(', ') }}
      </span>
    </div>

    <div class="card-actions">
      <a v-if="articleLink" 
         :href="articleLink" 
         class="btn-link"
         :aria-label="`Ver artículo completo de ${plantName}`">
        Ver artículo
      </a>
      <a v-if="plantSlug && categorySlug" 
         :href="`/calendario/${categorySlug}/${plantSlug}/`" 
         class="btn-link btn-calendar"
         :aria-label="`Ver calendario de cultivo de ${plantName}`">
        Ver calendario
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimpleCalendarCard',
  props: {
    plantName: {
      type: String,
      required: true
    },
    plantSlug: {
      type: String,
      default: ''
    },
    categorySlug: {
      type: String,
      default: ''
    },
    sowingMonths: {
      type: Array,
      default: () => []
    },
    harvestingMonths: {
      type: Array,
      default: () => []
    },
    transplantingMonths: {
      type: Array,
      default: () => []
    },
    articleLink: {
      type: String,
      default: ''
    }
  },
  methods: {
    getMonthName(monthNumber) {
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                         'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      return monthNames[monthNumber - 1] || `Mes ${monthNumber}`;
    }
  }
}
</script>

<style scoped>
.plant-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-md);
  background: var(--bg-card);
  transition: box-shadow 0.2s, transform 0.2s;
}

.plant-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.card-header {
  margin-bottom: var(--space-sm);
}

.plant-info h4 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
}

.card-activities {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
}

.activity-tag {
  background: var(--bg-subtle);
  color: var(--color-text-secondary);
  padding: calc(var(--space-xs) * 0.5) var(--space-xs);
  border-radius: var(--radius-xl);
  font-size: var(--font-size-xs);
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
  gap: var(--space-xs);
}

.btn-link {
  background: var(--color-primary);
  color: white;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-size: var(--font-size-xs);
  font-weight: 500;
  transition: background 0.2s;
  text-align: center;
  flex: 1;
}

.btn-link:hover {
  background: var(--color-primary-dark);
}

.btn-calendar {
  background: #48bb78;
}

.btn-calendar:hover {
  background: #38a169;
}
</style>