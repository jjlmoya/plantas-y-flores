<template>
  <div class="upcoming-tasks-widget">
    <div class="widget-header">
      <h3>📅 Próximas Tareas</h3>
      <p class="widget-subtitle">Actividades urgentes para los próximos {{ daysAhead }} días</p>
    </div>
    
    <div class="tasks-container">
      <div v-if="loading" class="loading">
        Cargando tareas...
      </div>
      
      <div v-else-if="upcomingTasks.length === 0" class="no-tasks">
        ✅ No hay tareas urgentes programadas
      </div>
      
      <div v-else class="tasks-list">
        <div 
          v-for="task in upcomingTasks.slice(0, maxTasks)" 
          :key="`${task.plantSlug}-${task.activity}-${task.date}`"
          class="task-item"
          :class="task.priority"
        >
          <div class="task-date">
            <span class="day">{{ formatDay(task.date) }}</span>
            <span class="month">{{ formatMonth(task.date) }}</span>
          </div>
          
          <div class="task-content">
            <div class="task-header">
              <span class="activity-icon">{{ task.icon }}</span>
              <span class="activity-name">{{ task.activityName }}</span>
              <span class="urgency-badge" :class="task.urgency">{{ task.urgencyText }}</span>
            </div>
            
            <div class="plant-info">
              <span class="plant-icon">{{ task.plantIcon }}</span>
              <a 
                :href="`/calendario/${task.category}/${task.plantSlug}/`" 
                class="plant-link"
              >
                {{ task.plantName }}
              </a>
            </div>
            
            <div v-if="task.description" class="task-description">
              {{ task.description }}
            </div>
          </div>
        </div>
        
        <div v-if="upcomingTasks.length > maxTasks" class="show-more">
          <button @click="showMore" class="show-more-btn">
            Ver {{ upcomingTasks.length - maxTasks }} tareas más
          </button>
        </div>
      </div>
      
      <div class="widget-footer">
        <a href="/calendario/" class="view-calendar-link">
          📊 Ver calendario completo
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { getPlantCalendarWithUI } from '../utils/calendar-inheritance.js';

export default {
  name: 'UpcomingTasks',
  props: {
    daysAhead: {
      type: Number,
      default: 14
    },
    maxTasks: {
      type: Number,
      default: 5
    },
    hemisphere: {
      type: String,
      default: 'north',
      validator: value => ['north', 'south'].includes(value)
    }
  },
  setup(props) {
    const loading = ref(true);
    const allTasks = ref([]);
    const maxDisplayTasks = ref(props.maxTasks);
    
    const upcomingTasks = computed(() => {
      const today = new Date();
      const endDate = new Date(today.getTime() + (props.daysAhead * 24 * 60 * 60 * 1000));
      
      return allTasks.value
        .filter(task => {
          const taskDate = new Date(task.date);
          return taskDate >= today && taskDate <= endDate;
        })
        .sort((a, b) => {
          // Sort by date first, then by priority
          const dateCompare = new Date(a.date) - new Date(b.date);
          if (dateCompare !== 0) return dateCompare;
          
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        })
        .slice(0, maxDisplayTasks.value);
    });

    const loadUpcomingTasks = async () => {
      try {
        loading.value = true;
        const tasks = [];
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        
        // Get current and next month data
        const monthsToCheck = [currentMonth, currentMonth === 12 ? 1 : currentMonth + 1];
        
        for (const month of monthsToCheck) {
          const monthData = await getPlantCalendarWithUI(month, props.hemisphere);
          
          if (monthData && monthData.plants) {
            monthData.plants.forEach(plant => {
              const calendar = plant.calendar;
              if (!calendar) return;
              
              // Check sowing activities
              if (calendar.sowing && calendar.sowing.active) {
                tasks.push(createTask('sowing', plant, month, calendar.sowing));
              }
              
              // Check transplanting activities
              if (calendar.transplanting && calendar.transplanting.active) {
                tasks.push(createTask('transplanting', plant, month, calendar.transplanting));
              }
              
              // Check harvesting activities
              if (calendar.harvesting && calendar.harvesting.active) {
                tasks.push(createTask('harvesting', plant, month, calendar.harvesting));
              }
              
              // Check other tasks
              if (calendar.tasks && Array.isArray(calendar.tasks)) {
                calendar.tasks.forEach(task => {
                  tasks.push(createTask('task', plant, month, { task }));
                });
              }
            });
          }
        }
        
        allTasks.value = tasks;
      } catch (error) {
        console.error('Error loading upcoming tasks:', error);
      } finally {
        loading.value = false;
      }
    };

    const createTask = (activityType, plant, month, activityData) => {
      const today = new Date();
      const year = today.getFullYear();
      
      // Calculate optimal date within the month
      let dayOfMonth = 15; // Default to middle of month
      
      if (activityData.optimal_days) {
        dayOfMonth = Math.floor((activityData.optimal_days[0] + activityData.optimal_days[1]) / 2);
      } else if (activityType === 'sowing') {
        dayOfMonth = 1; // Early in month
      } else if (activityType === 'harvesting') {
        dayOfMonth = 25; // Late in month
      }
      
      const taskDate = new Date(year, month - 1, dayOfMonth);
      
      // If the date is in the past, move to next year
      if (taskDate < today) {
        taskDate.setFullYear(year + 1);
      }
      
      return {
        date: taskDate,
        plantSlug: plant.slug,
        plantName: plant.name,
        plantIcon: plant.ui?.icon || '🌱',
        category: plant.category,
        activity: activityType,
        activityName: getActivityName(activityType, activityData),
        icon: getActivityIcon(activityType),
        priority: getTaskPriority(activityType, taskDate, today),
        urgency: getTaskUrgency(taskDate, today),
        urgencyText: getUrgencyText(taskDate, today),
        description: getTaskDescription(activityType, activityData)
      };
    };

    const getActivityName = (activityType, activityData) => {
      const names = {
        sowing: 'Siembra',
        transplanting: 'Trasplante',
        harvesting: 'Cosecha',
        task: activityData.task || 'Tarea'
      };
      return names[activityType] || activityType;
    };

    const getActivityIcon = (activityType) => {
      const icons = {
        sowing: '🌱',
        transplanting: '🪴',
        harvesting: '🌾',
        task: '🛠️'
      };
      return icons[activityType] || '📋';
    };

    const getTaskPriority = (activityType, taskDate, today) => {
      const daysUntil = Math.ceil((taskDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntil <= 3) return 'high';
      if (daysUntil <= 7) return 'medium';
      return 'low';
    };

    const getTaskUrgency = (taskDate, today) => {
      const daysUntil = Math.ceil((taskDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntil <= 1) return 'urgent';
      if (daysUntil <= 3) return 'soon';
      if (daysUntil <= 7) return 'upcoming';
      return 'planned';
    };

    const getUrgencyText = (taskDate, today) => {
      const daysUntil = Math.ceil((taskDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntil === 0) return 'Hoy';
      if (daysUntil === 1) return 'Mañana';
      if (daysUntil <= 3) return `En ${daysUntil} días`;
      if (daysUntil <= 7) return 'Esta semana';
      return `En ${daysUntil} días`;
    };

    const getTaskDescription = (activityType, activityData) => {
      if (activityData.notes) return activityData.notes;
      if (activityData.optimal_conditions) return activityData.optimal_conditions;
      return '';
    };

    const formatDay = (date) => {
      return date.getDate().toString().padStart(2, '0');
    };

    const formatMonth = (date) => {
      const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
                     'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
      return months[date.getMonth()];
    };

    const showMore = () => {
      maxDisplayTasks.value = Math.min(maxDisplayTasks.value + 5, allTasks.value.length);
    };

    onMounted(() => {
      loadUpcomingTasks();
    });

    return {
      loading,
      upcomingTasks,
      formatDay,
      formatMonth,
      showMore
    };
  }
};
</script>

<style scoped>
.upcoming-tasks-widget {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #38a169;
}

.widget-header {
  margin-bottom: 1rem;
}

.widget-header h3 {
  margin: 0 0 0.25rem 0;
  color: #2d3748;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.widget-subtitle {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
}

.loading, .no-tasks {
  text-align: center;
  padding: 2rem;
  color: #718096;
}

.tasks-list {
  space-y: 0.75rem;
}

.task-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid #e2e8f0;
  background: #f7fafc;
  transition: all 0.3s ease;
}

.task-item:hover {
  background: #edf2f7;
  transform: translateX(2px);
}

.task-item.high {
  border-left-color: #e53e3e;
  background: #fed7d7;
}

.task-item.medium {
  border-left-color: #dd6b20;
  background: #feebc8;
}

.task-item.low {
  border-left-color: #38a169;
  background: #c6f6d5;
}

.task-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.task-date .day {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2d3748;
  line-height: 1;
}

.task-date .month {
  font-size: 0.7rem;
  color: #718096;
  font-weight: 500;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.activity-icon {
  font-size: 1.1rem;
}

.activity-name {
  font-weight: 600;
  color: #2d3748;
}

.urgency-badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
}

.urgency-badge.urgent {
  background: #fed7d7;
  color: #c53030;
}

.urgency-badge.soon {
  background: #feebc8;
  color: #c05621;
}

.urgency-badge.upcoming {
  background: #bee3f8;
  color: #2b77cb;
}

.urgency-badge.planned {
  background: #e2e8f0;
  color: #4a5568;
}

.plant-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.plant-icon {
  font-size: 1rem;
}

.plant-link {
  color: #3182ce;
  text-decoration: none;
  font-weight: 500;
}

.plant-link:hover {
  text-decoration: underline;
}

.task-description {
  font-size: 0.85rem;
  color: #718096;
  line-height: 1.4;
}

.show-more {
  text-align: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.show-more-btn {
  background: none;
  border: 1px solid #3182ce;
  color: #3182ce;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.show-more-btn:hover {
  background: #3182ce;
  color: white;
}

.widget-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  text-align: center;
}

.view-calendar-link {
  color: #38a169;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
}

.view-calendar-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .upcoming-tasks-widget {
    padding: 1rem;
  }
  
  .task-item {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .task-date {
    align-self: flex-start;
    min-width: auto;
  }
  
  .task-header {
    gap: 0.25rem;
  }
}
</style>