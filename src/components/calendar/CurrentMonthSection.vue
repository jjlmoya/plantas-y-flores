<template>
  <section class="current-month-section">
    <h2>🌱 Este Mes: {{ currentMonthName }}</h2>

    <div class="grid-responsive">
      <!-- Loading Skeleton -->
      <div
        class="dashboard-skeleton"
        id="dashboard-skeleton"
        style="display: none;"
      >
        <div class="skeleton-stats-grid">
          <div class="skeleton-stats-card">
            <div class="skeleton-card-header">
              <div class="skeleton-line skeleton-title"></div>
              <div class="skeleton-icon"></div>
            </div>
            <div class="skeleton-card-content">
              <div class="skeleton-line skeleton-text"></div>
              <div class="skeleton-line skeleton-text"></div>
              <div class="skeleton-line skeleton-text short"></div>
            </div>
          </div>
          <div class="skeleton-stats-card">
            <div class="skeleton-card-header">
              <div class="skeleton-line skeleton-title"></div>
              <div class="skeleton-icon"></div>
            </div>
            <div class="skeleton-card-content">
              <div class="skeleton-line skeleton-text"></div>
              <div class="skeleton-line skeleton-text short"></div>
            </div>
          </div>
          <div class="skeleton-stats-card">
            <div class="skeleton-card-header">
              <div class="skeleton-line skeleton-title"></div>
              <div class="skeleton-icon"></div>
            </div>
            <div class="skeleton-card-content">
              <div class="skeleton-grid">
                <div class="skeleton-grid-item"></div>
                <div class="skeleton-grid-item"></div>
                <div class="skeleton-grid-item"></div>
                <div class="skeleton-grid-item"></div>
                <div class="skeleton-grid-item"></div>
                <div class="skeleton-grid-item"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tasks Widget -->
      <StatsCard
        client:visible
        title="En Este Mes"
        icon="🛠️"
        variant="warning"
        :footerLink="`/calendario/mes/${getMonthSlug(currentMonth)}/`"
        footerText="Ver calendario del mes"
      >
        <div v-if="hasMonthlyTasks" class="tasks-list">
          <div 
            v-for="[category, plants] in Object.entries(monthlyTasks)" 
            :key="category" 
            class="category-tasks collapsible"
          >
            <h4
              class="category-header"
              @click="toggleCategory(category)"
            >
              <span class="category-icon">
                {{ getCategoryIcon(category) }}
              </span>
              <span class="category-name">
                {{ formatCategoryName(category) }}
              </span>
              <span class="plants-count">
                ({{ Object.keys(plants).length }} plantas)
              </span>
              <span class="collapse-icon">▼</span>
            </h4>
            <div class="category-content" :id="`category-${category}`">
              <div 
                v-for="[plantSlug, tasks] in Object.entries(plants)" 
                :key="plantSlug" 
                class="plant-tasks"
              >
                <strong>{{ formatPlantName(plantSlug) }}</strong>
                <ul>
                  <li
                    v-for="task in tasks"
                    :key="task"
                    :class="`task-priority-${getTaskPriority(task)}`"
                  >
                    <span class="task-icon">
                      {{ getTaskIcon(task) }}
                    </span>
                    {{ formatTaskName(task) }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="no-tasks">No hay tareas específicas este mes</p>
      </StatsCard>

      <!-- Categories Overview -->
      <StatsCard
        client:visible
        title="Categorías Disponibles"
        icon="🌿"
        variant="success"
      >
        <CategoryGrid
          client:visible
          :categories="categoryData"
          baseUrl="/calendario/categoria/"
          columns="3"
          minWidth="100px"
        />
      </StatsCard>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CurrentMonthSection',
  props: {
    currentMonthName: {
      type: String,
      required: true
    },
    currentMonth: {
      type: Number,
      required: true
    },
    monthlyTasks: {
      type: Object,
      required: true
    },
    categories: {
      type: Array,
      required: true
    },
    // UI Helper methods
    formatCategoryName: {
      type: Function,
      required: true
    },
    formatPlantName: {
      type: Function,
      required: true
    },
    formatTaskName: {
      type: Function,
      required: true
    },
    getCategoryIcon: {
      type: Function,
      required: true
    },
    getTaskIcon: {
      type: Function,
      required: true
    },
    getTaskPriority: {
      type: Function,
      required: true
    },
    getMonthSlug: {
      type: Function,
      required: true
    }
  },
  computed: {
    hasMonthlyTasks() {
      return Object.keys(this.monthlyTasks).length > 0;
    },
    categoryData() {
      return this.categories.map(cat => ({ slug: cat, name: cat }));
    }
  },
  methods: {
    toggleCategory(category) {
      const content = document.getElementById(`category-${category}`);
      const header = content.previousElementSibling;
      const icon = header.querySelector('.collapse-icon');
      
      if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
        icon.textContent = '▲';
        header.classList.add('expanded');
      } else {
        content.style.display = 'none';
        icon.textContent = '▼';
        header.classList.remove('expanded');
      }
    }
  }
}
</script>

<style scoped>
.current-month-section {
  margin-bottom: 3rem;
}

.current-month-section h2 {
  color: #2d3748;
  margin-bottom: 2rem;
  font-size: 2rem;
  text-align: center;
}

.grid-responsive {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  align-items: start;
}

.tasks-list {
  max-height: 400px;
  overflow-y: auto;
}

.category-tasks {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.category-tasks:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.75rem;
  margin: 0;
  background: #f7fafc;
  border-radius: 8px;
  transition: all 0.3s ease;
  user-select: none;
}

.category-header:hover {
  background: #e2e8f0;
}

.category-header.expanded {
  background: #e6fffa;
  color: #234e52;
}

.category-icon {
  font-size: 1.2rem;
}

.category-name {
  font-weight: 600;
  flex: 1;
}

.plants-count {
  font-size: 0.8rem;
  color: #718096;
  background: #e2e8f0;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.collapse-icon {
  font-size: 0.8rem;
  color: #4a5568;
  transition: transform 0.3s ease;
}

.category-header.expanded .collapse-icon {
  transform: rotate(180deg);
}

.category-content {
  display: none;
  padding: 1rem 0.5rem 0.5rem 0.5rem;
}

.plant-tasks {
  margin-bottom: 1rem;
  padding-left: 1rem;
}

.plant-tasks:last-child {
  margin-bottom: 0;
}

.plant-tasks strong {
  color: #2d3748;
  display: block;
  margin-bottom: 0.5rem;
}

.plant-tasks ul {
  margin: 0;
  padding-left: 1rem;
  list-style: none;
}

.plant-tasks li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  font-size: 0.9rem;
  color: #4a5568;
}

.task-icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.task-priority-high {
  color: #e53e3e;
  font-weight: 600;
}

.task-priority-medium {
  color: #d69e2e;
  font-weight: 500;
}

.task-priority-low {
  color: #38a169;
}

.no-tasks {
  text-align: center;
  color: #718096;
  font-style: italic;
  padding: 2rem;
}

/* Skeleton Loading Styles */
.dashboard-skeleton {
  grid-column: 1 / -1;
}

.skeleton-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.skeleton-stats-card {
  background: #fcfdfe;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.skeleton-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.skeleton-line {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-title {
  height: 1.5rem;
  width: 60%;
}

.skeleton-text {
  height: 1rem;
  margin-bottom: 0.5rem;
}

.skeleton-text.short {
  width: 40%;
}

.skeleton-icon {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 50%;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.skeleton-grid-item {
  height: 2rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@media (max-width: 768px) {
  .grid-responsive {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .current-month-section h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .skeleton-stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .skeleton-stats-card {
    padding: 1rem;
  }

  .skeleton-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>