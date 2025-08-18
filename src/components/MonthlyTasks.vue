<template>
  <div class="monthly-tasks-widget">
    <div class="widget-header">
      <h3>
        <span class="icon">📋</span>
        Tareas de {{ monthName }}
      </h3>
      <div class="hemisphere-toggle" v-if="showHemisphereToggle">
        <button 
          @click="toggleHemisphere"
          :class="['toggle-btn', { active: hemisphere === 'southern' }]"
          :title="hemisphere === 'northern' ? 'Cambiar a Hemisferio Sur' : 'Cambiar a Hemisferio Norte'"
        >
          {{ hemisphere === 'northern' ? '🌎 Norte' : '🌏 Sur' }}
        </button>
      </div>
    </div>

    <div class="widget-content">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando tareas...</p>
      </div>

      <div v-else-if="hasTasksData" class="tasks-content">
        <div class="tasks-summary">
          <div class="summary-stats">
            <span class="stat">
              <span class="stat-number">{{ totalPlants }}</span>
              <span class="stat-label">plantas</span>
            </span>
            <span class="stat">
              <span class="stat-number">{{ totalTasks }}</span>
              <span class="stat-label">tareas</span>
            </span>
          </div>
        </div>

        <div class="categories-list">
          <div 
            v-for="(plants, category) in tasks" 
            :key="category"
            class="category-section"
          >
            <h4 class="category-title">
              <span class="category-icon">{{ ui.getCategoryIcon(category) }}</span>
              {{ ui.formatCategoryName(category) }}
            </h4>

            <div class="plants-grid">
              <div 
                v-for="(plantTasks, plantSlug) in plants"
                :key="plantSlug"
                class="plant-card"
              >
                <div class="plant-header">
                  <h5 class="plant-name">{{ ui.formatPlantName(plantSlug) }}</h5>
                  <span class="tasks-count">{{ plantTasks.length }} tareas</span>
                </div>

                <ul class="tasks-list">
                  <li 
                    v-for="task in plantTasks" 
                    :key="task"
                    class="task-item"
                    :class="`task-priority-${ui.getTaskPriority(task)}`"
                  >
                    <span class="task-icon">{{ ui.getTaskIcon(task) }}</span>
                    <span class="task-text">{{ ui.formatTaskName(task) }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">🌱</div>
        <h4>No hay tareas específicas</h4>
        <p>Este mes es perfecto para planificar y preparar el próximo periodo de cultivo.</p>
      </div>
    </div>

    <div class="widget-footer" v-if="hasTasksData">
      <button @click="$emit('view-calendar')" class="view-calendar-btn">
        Ver Calendario Completo
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MonthlyTasks',
  props: {
    month: {
      type: Number,
      required: true,
      validator: (value) => value >= 1 && value <= 12
    },
    tasks: {
      type: Object,
      default: () => ({})
    },
    ui: {
      type: Object,
      required: true
    },
    monthName: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    hemisphere: {
      type: String,
      default: 'northern',
      validator: (value) => ['northern', 'southern'].includes(value)
    },
    showHemisphereToggle: {
      type: Boolean,
      default: false
    }
  },
  emits: ['hemisphere-change', 'view-calendar'],
  computed: {
    hasTasksData() {
      return Object.keys(this.tasks).length > 0;
    },
    totalPlants() {
      return Object.values(this.tasks).reduce((total, plants) => {
        return total + Object.keys(plants).length;
      }, 0);
    },
    totalTasks() {
      return Object.values(this.tasks).reduce((total, plants) => {
        return total + Object.values(plants).reduce((plantTotal, tasks) => {
          return plantTotal + tasks.length;
        }, 0);
      }, 0);
    }
  },
  methods: {
    toggleHemisphere() {
      const newHemisphere = this.hemisphere === 'northern' ? 'southern' : 'northern';
      this.$emit('hemisphere-change', newHemisphere);
    }
  }
}
</script>

<style scoped>
.monthly-tasks-widget {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.widget-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.widget-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hemisphere-toggle {
  display: flex;
  gap: 0.5rem;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.toggle-btn.active {
  background: white;
  color: #667eea;
}

.widget-content {
  padding: 1.5rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: #718096;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.tasks-summary {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.summary-stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
  margin-top: 0.25rem;
}

.category-section {
  margin-bottom: 2rem;
}

.category-section:last-child {
  margin-bottom: 0;
}

.category-title {
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.category-icon {
  font-size: 1.25rem;
}

.plants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.plant-card {
  background: #f7fafc;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.plant-card:hover {
  background: #edf2f7;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.plant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.plant-name {
  margin: 0;
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
}

.tasks-count {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tasks-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
  color: #4a5568;
  font-size: 0.9rem;
}

.task-item:last-child {
  border-bottom: none;
}

.task-priority-high {
  color: #c53030;
  font-weight: 600;
}

.task-priority-medium {
  color: #d69e2e;
  font-weight: 500;
}

.task-priority-low {
  color: #718096;
}

.task-priority-normal {
  color: #4a5568;
}

.task-icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #718096;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h4 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 0.9rem;
  line-height: 1.6;
}

.widget-footer {
  background: #f7fafc;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  text-align: center;
}

.view-calendar-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}

.view-calendar-btn:hover {
  background: #5a67d8;
}

@media (max-width: 768px) {
  .widget-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .plants-grid {
    grid-template-columns: 1fr;
  }

  .summary-stats {
    gap: 1rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }
}
</style>