<template>
  <section class="section-spacing">
    <h2>Explorar por Actividades</h2>
    <p>
      Encuentra todas las plantas organizadas por tipo de actividad de
      jardinería
    </p>

    <div class="activities-grid">
      <a
        v-for="activity in activities"
        :key="activity"
        :href="`/calendario/actividad/${activityToSlug(activity)}/`"
        class="activity-card"
      >
        <div class="activity-header">
          <span class="activity-icon">{{ getTaskIcon(activity) }}</span>
          <h3>{{ formatTaskName(activity) }}</h3>
        </div>
        <p>
          Ver todas las plantas para {{ formatTaskName(activity).toLowerCase() }}
        </p>
      </a>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ActivitiesGrid',
  props: {
    activities: {
      type: Array,
      required: true
    },
    activityToSlug: {
      type: Function,
      required: true
    },
    getTaskIcon: {
      type: Function,
      required: true
    },
    formatTaskName: {
      type: Function,
      required: true
    }
  }
}
</script>

<style scoped>
.section-spacing {
  margin-bottom: 4rem;
}

.section-spacing h2 {
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.75rem;
  text-align: center;
}

.section-spacing p {
  color: #4a5568;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.activity-card {
  background: #fcfdfe;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.activity-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.activity-card:hover::before {
  transform: scaleX(1);
}

.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.activity-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.activity-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
  border-radius: 12px;
  flex-shrink: 0;
}

.activity-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
}

.activity-card p {
  color: #718096;
  margin: 0;
  line-height: 1.6;
  font-size: 0.95rem;
}

.activity-card:hover .activity-header h3 {
  color: #667eea;
}

.activity-card:hover .activity-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .activities-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .activity-card {
    padding: 1.5rem;
  }

  .activity-header {
    gap: 0.75rem;
  }

  .activity-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .activity-header h3 {
    font-size: 1.1rem;
  }
}
</style>