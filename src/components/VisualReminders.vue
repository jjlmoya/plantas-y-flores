<template>
  <div class="visual-reminders">
    <!-- Floating reminder notifications -->
    <div 
      v-for="reminder in activeReminders" 
      :key="reminder.id"
      class="reminder-notification"
      :class="[reminder.type, reminder.priority]"
      @click="dismissReminder(reminder.id)"
    >
      <div class="reminder-icon">{{ reminder.icon }}</div>
      <div class="reminder-content">
        <div class="reminder-title">{{ reminder.title }}</div>
        <div class="reminder-description">{{ reminder.description }}</div>
        <div class="reminder-time">{{ formatTimeLeft(reminder.dueDate) }}</div>
      </div>
      <button class="dismiss-btn" @click.stop="dismissReminder(reminder.id)">✕</button>
    </div>

    <!-- Calendar day indicators -->
    <div class="calendar-indicators" v-if="showCalendarIndicators">
      <div 
        v-for="indicator in todayIndicators"
        :key="indicator.id"
        class="day-indicator"
        :class="indicator.urgency"
      >
        <span class="indicator-dot"></span>
        <span class="indicator-text">{{ indicator.text }}</span>
      </div>
    </div>

    <!-- Seasonal reminders banner -->
    <div 
      v-if="seasonalReminder" 
      class="seasonal-reminder"
      :class="seasonalReminder.season"
    >
      <div class="seasonal-icon">{{ seasonalReminder.icon }}</div>
      <div class="seasonal-content">
        <h4>{{ seasonalReminder.title }}</h4>
        <p>{{ seasonalReminder.message }}</p>
      </div>
      <button class="close-seasonal" @click="dismissSeasonalReminder">✕</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getPlantCalendarWithUI } from '../utils/calendar-inheritance.js';

export default {
  name: 'VisualReminders',
  props: {
    showCalendarIndicators: {
      type: Boolean,
      default: true
    },
    maxReminders: {
      type: Number,
      default: 3
    },
    hemisphere: {
      type: String,
      default: 'north',
      validator: value => ['north', 'south'].includes(value)
    }
  },
  setup(props) {
    const reminders = ref([]);
    const dismissedReminders = ref(new Set());
    const seasonalReminder = ref(null);
    const updateInterval = ref(null);

    const activeReminders = computed(() => {
      return reminders.value
        .filter(r => !dismissedReminders.value.has(r.id))
        .slice(0, props.maxReminders);
    });

    const todayIndicators = computed(() => {
      const today = new Date();
      const indicators = [];
      
      // Add indicators for today's urgent tasks
      reminders.value.forEach(reminder => {
        const daysUntil = Math.ceil((reminder.dueDate - today) / (1000 * 60 * 60 * 24));
        if (daysUntil <= 1 && !dismissedReminders.value.has(reminder.id)) {
          indicators.push({
            id: `indicator-${reminder.id}`,
            text: reminder.shortText || reminder.title,
            urgency: daysUntil === 0 ? 'today' : 'tomorrow'
          });
        }
      });

      return indicators.slice(0, 5);
    });

    const loadReminders = async () => {
      try {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
        
        const monthsToCheck = [currentMonth, nextMonth];
        const newReminders = [];

        for (const month of monthsToCheck) {
          const monthData = await getPlantCalendarWithUI(month, props.hemisphere);
          
          if (monthData && monthData.plants) {
            monthData.plants.forEach(plant => {
              const plantReminders = generatePlantReminders(plant, month, today);
              newReminders.push(...plantReminders);
            });
          }
        }

        // Add seasonal reminders
        const seasonal = generateSeasonalReminder(today, props.hemisphere);
        if (seasonal) {
          seasonalReminder.value = seasonal;
        }

        // Sort by urgency and priority
        newReminders.sort((a, b) => {
          const aDays = Math.ceil((a.dueDate - today) / (1000 * 60 * 60 * 24));
          const bDays = Math.ceil((b.dueDate - today) / (1000 * 60 * 60 * 24));
          
          if (aDays !== bDays) return aDays - bDays;
          
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        reminders.value = newReminders.slice(0, 10); // Limit total reminders
      } catch (error) {
        console.error('Error loading reminders:', error);
      }
    };

    const generatePlantReminders = (plant, month, today) => {
      const plantReminders = [];
      const year = today.getFullYear();
      
      if (!plant.calendar) return plantReminders;

      // Sowing reminders
      if (plant.calendar.sowing && plant.calendar.sowing.active) {
        const sowingDate = calculateOptimalDate(month, plant.calendar.sowing.optimal_days, 'early');
        if (sowingDate >= today) {
          plantReminders.push({
            id: `sowing-${plant.slug}-${month}`,
            type: 'sowing',
            priority: getPriorityByDaysLeft(sowingDate, today),
            title: `Sembrar ${plant.name}`,
            description: `Época ideal para la siembra${plant.calendar.sowing.indoor ? ' en interior' : ''}`,
            shortText: `Sembrar ${plant.name}`,
            dueDate: sowingDate,
            icon: '🌱',
            plantSlug: plant.slug,
            plantName: plant.name,
            category: plant.category,
            tips: plant.calendar.sowing.tips || []
          });
        }
      }

      // Transplanting reminders
      if (plant.calendar.transplanting && plant.calendar.transplanting.active) {
        const transplantDate = calculateOptimalDate(month, plant.calendar.transplanting.optimal_days, 'mid');
        if (transplantDate >= today) {
          plantReminders.push({
            id: `transplant-${plant.slug}-${month}`,
            type: 'transplanting',
            priority: getPriorityByDaysLeft(transplantDate, today),
            title: `Trasplantar ${plant.name}`,
            description: `Momento ideal para trasplantar al exterior`,
            shortText: `Trasplantar ${plant.name}`,
            dueDate: transplantDate,
            icon: '🪴',
            plantSlug: plant.slug,
            plantName: plant.name,
            category: plant.category
          });
        }
      }

      // Harvesting reminders
      if (plant.calendar.harvesting && plant.calendar.harvesting.active) {
        const harvestDate = calculateOptimalDate(month, plant.calendar.harvesting.optimal_days, 'late');
        if (harvestDate >= today) {
          plantReminders.push({
            id: `harvest-${plant.slug}-${month}`,
            type: 'harvesting',
            priority: getPriorityByDaysLeft(harvestDate, today),
            title: `Cosechar ${plant.name}`,
            description: `Época óptima de cosecha`,
            shortText: `Cosechar ${plant.name}`,
            dueDate: harvestDate,
            icon: '🌾',
            plantSlug: plant.slug,
            plantName: plant.name,
            category: plant.category
          });
        }
      }

      return plantReminders;
    };

    const calculateOptimalDate = (month, optimalDays, timing) => {
      const today = new Date();
      const year = today.getFullYear();
      
      let dayOfMonth;
      if (optimalDays && optimalDays.length >= 2) {
        const start = optimalDays[0];
        const end = optimalDays[1];
        
        if (timing === 'early') dayOfMonth = start;
        else if (timing === 'late') dayOfMonth = end;
        else dayOfMonth = Math.floor((start + end) / 2); // mid
      } else {
        if (timing === 'early') dayOfMonth = 5;
        else if (timing === 'late') dayOfMonth = 25;
        else dayOfMonth = 15;
      }
      
      const date = new Date(year, month - 1, dayOfMonth);
      
      // If date is in the past, move to next year
      if (date < today) {
        date.setFullYear(year + 1);
      }
      
      return date;
    };

    const getPriorityByDaysLeft = (dueDate, today) => {
      const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntil <= 2) return 'critical';
      if (daysUntil <= 7) return 'high';
      if (daysUntil <= 14) return 'medium';
      return 'low';
    };

    const generateSeasonalReminder = (today, hemisphere) => {
      const month = today.getMonth() + 1;
      const adjustedMonth = hemisphere === 'south' ? (month + 6) % 12 || 12 : month;
      
      const seasonalReminders = {
        3: { // March - Spring
          season: 'spring',
          icon: '🌸',
          title: 'Primavera - Época de Siembra',
          message: 'Es el momento ideal para preparar semilleros y comenzar con las siembras de primavera.'
        },
        6: { // June - Early Summer
          season: 'summer',
          icon: '☀️',
          title: 'Verano - Cuidados Intensivos',
          message: 'Aumenta el riego y protege las plantas del calor intenso. Época de trasplantes.'
        },
        9: { // September - Autumn
          season: 'autumn',
          icon: '🍂',
          title: 'Otoño - Preparación para Invierno',
          message: 'Tiempo de cosechar y preparar plantas para el invierno. Siembra cultivos de otoño.'
        },
        12: { // December - Winter
          season: 'winter',
          icon: '❄️',
          title: 'Invierno - Planificación',
          message: 'Época de planificación y preparación de semillas para la próxima temporada.'
        }
      };

      return seasonalReminders[adjustedMonth] || null;
    };

    const formatTimeLeft = (dueDate) => {
      const now = new Date();
      const diff = dueDate - now;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      
      if (days === 0) return 'Hoy';
      if (days === 1) return 'Mañana';
      if (days < 7) return `En ${days} días`;
      if (days < 30) return `En ${Math.ceil(days / 7)} semanas`;
      return `En ${Math.ceil(days / 30)} meses`;
    };

    const dismissReminder = (reminderId) => {
      dismissedReminders.value.add(reminderId);
      
      // Store in localStorage to persist across sessions
      const dismissed = Array.from(dismissedReminders.value);
      localStorage.setItem('dismissedReminders', JSON.stringify(dismissed));
    };

    const dismissSeasonalReminder = () => {
      seasonalReminder.value = null;
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('dismissedSeasonalReminder', today);
    };

    const loadDismissedReminders = () => {
      const stored = localStorage.getItem('dismissedReminders');
      if (stored) {
        dismissedReminders.value = new Set(JSON.parse(stored));
      }
      
      // Check if seasonal reminder was dismissed today
      const dismissedSeasonal = localStorage.getItem('dismissedSeasonalReminder');
      const today = new Date().toISOString().split('T')[0];
      if (dismissedSeasonal === today) {
        seasonalReminder.value = null;
      }
    };

    onMounted(() => {
      loadDismissedReminders();
      loadReminders();
      
      // Update reminders every hour
      updateInterval.value = setInterval(() => {
        loadReminders();
      }, 60 * 60 * 1000);
    });

    onUnmounted(() => {
      if (updateInterval.value) {
        clearInterval(updateInterval.value);
      }
    });

    return {
      activeReminders,
      todayIndicators,
      seasonalReminder,
      dismissReminder,
      dismissSeasonalReminder,
      formatTimeLeft
    };
  }
};
</script>

<style scoped>
.visual-reminders {
  position: relative;
  z-index: 100;
}

/* Floating reminder notifications */
.reminder-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-left: 4px solid #38a169;
  max-width: 320px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
}

.reminder-notification:hover {
  transform: translateX(-5px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
}

.reminder-notification.critical {
  border-left-color: #e53e3e;
  animation: pulse-critical 2s infinite;
}

.reminder-notification.high {
  border-left-color: #dd6b20;
}

.reminder-notification.medium {
  border-left-color: #3182ce;
}

.reminder-notification.low {
  border-left-color: #38a169;
}

@keyframes pulse-critical {
  0%, 100% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); }
  50% { box-shadow: 0 4px 20px rgba(229, 62, 62, 0.3); }
}

/* Stack multiple notifications */
.reminder-notification:nth-child(2) {
  top: 100px;
}

.reminder-notification:nth-child(3) {
  top: 180px;
}

.reminder-notification:nth-child(4) {
  top: 260px;
}

.reminder-notification {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.reminder-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.reminder-content {
  flex: 1;
  min-width: 0;
}

.reminder-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.reminder-description {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.reminder-time {
  color: #4a5568;
  font-size: 0.8rem;
  font-weight: 500;
}

.dismiss-btn {
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  flex-shrink: 0;
}

.dismiss-btn:hover {
  color: #718096;
}

/* Calendar day indicators */
.calendar-indicators {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
}

.day-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 0.8rem;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #38a169;
  flex-shrink: 0;
}

.day-indicator.today .indicator-dot {
  background: #e53e3e;
  animation: pulse-dot 1.5s infinite;
}

.day-indicator.tomorrow .indicator-dot {
  background: #dd6b20;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.indicator-text {
  color: #4a5568;
  font-weight: 500;
}

/* Seasonal reminders banner */
.seasonal-reminder {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 500px;
  z-index: 1000;
}

.seasonal-reminder.spring {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
}

.seasonal-reminder.summer {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.seasonal-reminder.autumn {
  background: linear-gradient(135deg, #fceabb 0%, #f8b500 100%);
}

.seasonal-reminder.winter {
  background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
  color: #2d3748;
}

.seasonal-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.seasonal-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.seasonal-content p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.close-seasonal {
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: auto;
  opacity: 0.7;
  flex-shrink: 0;
}

.close-seasonal:hover {
  opacity: 1;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .reminder-notification {
    position: fixed;
    top: auto;
    bottom: 20px;
    right: 20px;
    left: 20px;
    max-width: none;
  }
  
  .reminder-notification:nth-child(2),
  .reminder-notification:nth-child(3),
  .reminder-notification:nth-child(4) {
    top: auto;
    bottom: 100px;
  }
  
  .seasonal-reminder {
    left: 20px;
    right: 20px;
    transform: none;
    bottom: 200px;
  }
  
  .calendar-indicators {
    top: 60px;
    left: 10px;
    right: 10px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>