<template>
  <div class="calendar-grid-widget">
    <div class="calendar-header">
      <div class="month-navigation">
        <button @click="previousMonth" class="nav-btn" :disabled="loading">
          ← {{ ui.getMonthName(prevMonthNumber) }}
        </button>
        
        <div class="current-month">
          <h2>{{ currentMonthName }} {{ currentYear }}</h2>
          <div class="month-summary" v-if="!loading">
            <span v-if="monthStats.totalActivities > 0" class="summary-text">
              {{ monthStats.totalActivities }} actividades en {{ monthStats.activePlants }} plantas
            </span>
            <span v-else class="summary-text">
              Sin actividades específicas
            </span>
          </div>
        </div>
        
        <button @click="nextMonth" class="nav-btn" :disabled="loading">
          {{ ui.getMonthName(nextMonthNumber) }} →
        </button>
      </div>

      <div class="hemisphere-toggle" v-if="showHemisphereToggle">
        <button 
          @click="toggleHemisphere"
          :class="['hemisphere-btn', { active: hemisphere === 'southern' }]"
          :disabled="loading"
        >
          {{ hemisphere === 'northern' ? '🌎 Norte' : '🌏 Sur' }}
        </button>
      </div>
    </div>

    <div class="calendar-content">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando calendario...</p>
      </div>

      <div v-else class="calendar-wrapper">
        <!-- Calendar Grid -->
        <div class="calendar-days">
          <!-- Day headers -->
          <div class="day-headers">
            <div class="day-header" v-for="dayName in dayNames" :key="dayName">
              {{ dayName }}
            </div>
          </div>

          <!-- Calendar days -->
          <div class="days-grid">
            <div 
              v-for="(day, index) in calendarDays" 
              :key="index"
              :class="['calendar-day', {
                'empty': !day,
                'current': day && isCurrentDay(day),
                'has-activities': day && getDayActivities(day).length > 0
              }]"
              @click="day && selectDay(day)"
            >
              <span v-if="day" class="day-number">{{ day }}</span>
              
              <div v-if="day" class="day-activities">
                <div 
                  v-for="activity in getDayActivities(day).slice(0, 3)"
                  :key="activity.type"
                  :class="['activity-indicator', activity.type]"
                  :style="{ backgroundColor: ui.getActivityColor(activity.type) }"
                  :title="activity.tooltip"
                ></div>
                <div 
                  v-if="getDayActivities(day).length > 3"
                  class="more-activities"
                  :title="`+${getDayActivities(day).length - 3} actividades más`"
                >
                  +{{ getDayActivities(day).length - 3 }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Day Details -->
        <div v-if="selectedDay" class="day-details">
          <div class="details-header">
            <h3>{{ selectedDay }} de {{ currentMonthName }}</h3>
            <button @click="clearSelection" class="close-btn">×</button>
          </div>
          
          <div class="details-content">
            <div v-if="getSelectedDayActivities().length > 0" class="activities-list">
              <div 
                v-for="activity in getSelectedDayActivities()"
                :key="`${activity.type}-${activity.plant}`"
                class="activity-item"
              >
                <div class="activity-header">
                  <span 
                    class="activity-dot" 
                    :style="{ backgroundColor: ui.getActivityColor(activity.type) }"
                  ></span>
                  <span class="activity-type">{{ ui.formatTaskName(activity.type) }}</span>
                  <span class="plant-name">{{ ui.formatPlantName(activity.plant) }}</span>
                </div>
                
                <div v-if="activity.details" class="activity-details">
                  <p>{{ activity.details }}</p>
                </div>

                <div v-if="activity.articleLink" class="activity-link">
                  <a :href="activity.articleLink" class="link-btn">
                    Ver más información →
                  </a>
                </div>
              </div>
            </div>

            <div v-else class="no-activities">
              <p>No hay actividades específicas para este día.</p>
              <p>Es un buen momento para tareas generales de jardín.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activities Legend -->
    <div class="calendar-legend">
      <h4>Leyenda</h4>
      <div class="legend-items">
        <div v-for="activity in availableActivities" :key="activity" class="legend-item">
          <span 
            class="legend-dot" 
            :style="{ backgroundColor: ui.getActivityColor(activity) }"
          ></span>
          <span>{{ ui.formatTaskName(activity) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalendarGrid',
  props: {
    month: {
      type: Number,
      required: true,
      validator: (value) => value >= 1 && value <= 12
    },
    year: {
      type: Number,
      default: () => new Date().getFullYear()
    },
    plants: {
      type: Array,
      default: () => []
    },
    ui: {
      type: Object,
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
  emits: ['month-change', 'hemisphere-change', 'day-select'],
  data() {
    return {
      selectedDay: null,
      dayNames: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
    }
  },
  computed: {
    currentYear() {
      return this.year;
    },
    currentMonthName() {
      return this.ui.getMonthName(this.month);
    },
    prevMonthNumber() {
      return this.month === 1 ? 12 : this.month - 1;
    },
    nextMonthNumber() {
      return this.month === 12 ? 1 : this.month + 1;
    },
    calendarDays() {
      const firstDay = new Date(this.year, this.month - 1, 1).getDay();
      const daysInMonth = new Date(this.year, this.month, 0).getDate();
      
      // Adjust for Monday start (0 = Monday)
      const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
      
      const days = [];
      
      // Empty cells for days before month starts
      for (let i = 0; i < adjustedFirstDay; i++) {
        days.push(null);
      }
      
      // Days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
      }
      
      return days;
    },
    monthStats() {
      if (this.plants.length === 0) {
        return { totalActivities: 0, activePlants: 0 };
      }

      const activePlants = new Set();
      let totalActivities = 0;

      this.plants.forEach(plant => {
        const hasActivity = this.plantHasActivityInMonth(plant);
        if (hasActivity) {
          activePlants.add(plant.slug);
          totalActivities += this.getPlantActivitiesCount(plant);
        }
      });

      return {
        totalActivities,
        activePlants: activePlants.size
      };
    },
    availableActivities() {
      const activities = new Set();
      
      this.plants.forEach(plant => {
        if (plant.calendar?.calendar_data) {
          Object.keys(plant.calendar.calendar_data).forEach(activity => {
            if (['sowing', 'transplanting', 'harvesting', 'flowering', 'planting'].includes(activity)) {
              activities.add(activity);
            }
          });
        }
      });

      return Array.from(activities);
    }
  },
  methods: {
    previousMonth() {
      const newMonth = this.month === 1 ? 12 : this.month - 1;
      const newYear = this.month === 1 ? this.year - 1 : this.year;
      this.selectedDay = null;
      this.$emit('month-change', { month: newMonth, year: newYear });
    },
    nextMonth() {
      const newMonth = this.month === 12 ? 1 : this.month + 1;
      const newYear = this.month === 12 ? this.year + 1 : this.year;
      this.selectedDay = null;
      this.$emit('month-change', { month: newMonth, year: newYear });
    },
    toggleHemisphere() {
      const newHemisphere = this.hemisphere === 'northern' ? 'southern' : 'northern';
      this.$emit('hemisphere-change', newHemisphere);
    },
    isCurrentDay(day) {
      const today = new Date();
      return today.getDate() === day && 
             today.getMonth() + 1 === this.month && 
             today.getFullYear() === this.year;
    },
    selectDay(day) {
      this.selectedDay = this.selectedDay === day ? null : day;
      this.$emit('day-select', day);
    },
    clearSelection() {
      this.selectedDay = null;
    },
    getDayActivities(day) {
      const activities = [];
      
      this.plants.forEach(plant => {
        const plantActivities = this.getPlantActivitiesForDay(plant, day);
        activities.push(...plantActivities);
      });
      
      return activities;
    },
    getSelectedDayActivities() {
      if (!this.selectedDay) return [];
      return this.getDayActivities(this.selectedDay);
    },
    getPlantActivitiesForDay(plant, day) {
      const activities = [];
      const calendar = plant.calendar?.calendar_data;
      
      if (!calendar) return activities;

      // Check each activity type
      Object.entries(calendar).forEach(([activityType, activityData]) => {
        if (['sowing', 'transplanting', 'harvesting', 'flowering', 'planting'].includes(activityType)) {
          if (this.isActivityActiveOnDay(activityData, day)) {
            activities.push({
              type: activityType,
              plant: plant.slug,
              category: plant.category,
              tooltip: `${this.ui.formatTaskName(activityType)}: ${this.ui.formatPlantName(plant.slug)}`,
              details: this.getActivityDetails(activityType, activityData),
              articleLink: plant.calendar._article_links?.resolved_link
            });
          }
        }
      });

      return activities;
    },
    isActivityActiveOnDay(activityData, day) {
      // For now, we'll show activities for the entire month if they're in best_months
      // This could be refined to show specific date ranges
      
      if (activityData.best_months?.includes(this.month)) {
        return day <= 15; // Show in first half of month
      }
      
      if (activityData.alternative_months?.includes(this.month)) {
        return day > 15; // Show in second half of month
      }

      // Check sub-activities (like indoor/outdoor sowing)
      if (typeof activityData === 'object' && activityData !== null) {
        return Object.values(activityData).some(subActivity => {
          if (subActivity?.best_months?.includes(this.month)) {
            return day <= 20;
          }
          return false;
        });
      }

      return false;
    },
    getActivityDetails(activityType, activityData) {
      if (activityType === 'sowing' && activityData.indoor?.temperature_range) {
        return `Temperatura: ${activityData.indoor.temperature_range[0]}-${activityData.indoor.temperature_range[1]}°C`;
      }
      
      if (activityType === 'harvesting' && activityData.days_to_harvest) {
        return `${activityData.days_to_harvest[0]}-${activityData.days_to_harvest[1]} días hasta cosecha`;
      }
      
      return null;
    },
    plantHasActivityInMonth(plant) {
      const calendar = plant.calendar?.calendar_data;
      if (!calendar) return false;

      return Object.values(calendar).some(activityData => {
        if (activityData?.best_months?.includes(this.month)) return true;
        if (activityData?.alternative_months?.includes(this.month)) return true;
        
        // Check sub-activities
        if (typeof activityData === 'object' && activityData !== null) {
          return Object.values(activityData).some(subActivity => {
            return subActivity?.best_months?.includes(this.month);
          });
        }
        
        return false;
      });
    },
    getPlantActivitiesCount(plant) {
      let count = 0;
      const calendar = plant.calendar?.calendar_data;
      
      if (!calendar) return count;

      Object.values(calendar).forEach(activityData => {
        if (activityData?.best_months?.includes(this.month)) count++;
        if (activityData?.alternative_months?.includes(this.month)) count++;
        
        // Check sub-activities
        if (typeof activityData === 'object' && activityData !== null) {
          Object.values(activityData).forEach(subActivity => {
            if (subActivity?.best_months?.includes(this.month)) count++;
          });
        }
      });

      return count;
    }
  }
}
</script>

<style scoped>
.calendar-grid-widget {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.calendar-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
}

.month-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.current-month {
  text-align: center;
  flex-grow: 1;
  margin: 0 1rem;
}

.current-month h2 {
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.month-summary {
  font-size: 0.9rem;
  opacity: 0.8;
}

.hemisphere-toggle {
  display: flex;
  justify-content: center;
}

.hemisphere-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.hemisphere-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.hemisphere-btn.active {
  background: white;
  color: #667eea;
}

.calendar-content {
  padding: 1.5rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
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

.calendar-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.day-headers {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 1px;
}

.day-header {
  background: #f7fafc;
  padding: 0.75rem 0.5rem;
  text-align: center;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e2e8f0;
}

.calendar-day {
  background: white;
  min-height: 80px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.calendar-day.empty {
  background: #f7fafc;
  cursor: default;
}

.calendar-day.current {
  background: #e6fffa;
  border: 2px solid #38b2ac;
}

.calendar-day.has-activities {
  background: #f0fff4;
}

.calendar-day:hover:not(.empty) {
  background: #edf2f7;
  transform: scale(1.02);
}

.day-number {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
  align-self: flex-start;
}

.day-activities {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-top: auto;
}

.activity-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: block;
}

.more-activities {
  font-size: 0.7rem;
  color: #718096;
  font-weight: 500;
}

.day-details {
  background: #f7fafc;
  border-radius: 8px;
  padding: 1rem;
  max-height: 500px;
  overflow-y: auto;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.details-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #718096;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #2d3748;
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  background: white;
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
}

.activity-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: block;
}

.activity-type {
  font-weight: 600;
  color: #2d3748;
}

.plant-name {
  color: #718096;
  font-size: 0.9rem;
}

.activity-details {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #4a5568;
}

.link-btn {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.link-btn:hover {
  text-decoration: underline;
}

.no-activities {
  text-align: center;
  padding: 2rem 1rem;
  color: #718096;
}

.calendar-legend {
  background: #f7fafc;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.calendar-legend h4 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 0.9rem;
  font-weight: 600;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #4a5568;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: block;
}

@media (max-width: 768px) {
  .calendar-wrapper {
    grid-template-columns: 1fr;
  }

  .month-navigation {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .current-month {
    margin: 0;
  }

  .calendar-day {
    min-height: 60px;
    padding: 0.25rem;
  }

  .day-number {
    font-size: 0.9rem;
  }

  .nav-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>