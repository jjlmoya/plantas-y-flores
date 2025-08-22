<template>
  <section class="month-navigator-section">
    <div class="section-header">
      <h2>📅 Navegar por Mes</h2>
      <div class="current-month-indicator">
        <span class="current-badge">Actual: {{ getCurrentMonthName() }}</span>
      </div>
    </div>

    <div class="navigator-container">
      <!-- Month carousel -->
      <div class="months-carousel-wrapper">
        <button 
          @click="scrollMonthsLeft" 
          :disabled="!canScrollMonthsLeft"
          class="nav-scroll-btn left"
          aria-label="Meses anteriores"
        >
          ←
        </button>

        <div 
          ref="monthsCarousel"
          class="months-carousel"
          @scroll="updateMonthScrollButtons"
        >
          <div class="months-track">
            <button 
              v-for="month in monthsData" 
              :key="month.number"
              @click="selectMonth(month)"
              class="month-card"
              :class="{ 
                active: selectedMonth === month.number,
                current: month.isCurrent 
              }"
            >
              <div class="month-header">
                <span class="month-name">{{ month.name }}</span>
                <span v-if="month.isCurrent" class="current-indicator">●</span>
              </div>
              <div class="month-preview">
                <div class="activity-preview">
                  <span class="activity-icon">🌱</span>
                  <span class="activity-count">{{ getActivityCount(month.number, 'sowing') }}</span>
                </div>
                <div class="activity-preview">
                  <span class="activity-icon">🌾</span>
                  <span class="activity-count">{{ getActivityCount(month.number, 'harvesting') }}</span>
                </div>
                <div class="activity-preview">
                  <span class="activity-icon">🌸</span>
                  <span class="activity-count">{{ getActivityCount(month.number, 'flowering') }}</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        <button 
          @click="scrollMonthsRight" 
          :disabled="!canScrollMonthsRight"
          class="nav-scroll-btn right"
          aria-label="Meses siguientes"
        >
          →
        </button>
      </div>

      <!-- Selected month preview -->
      <div v-if="selectedMonthData" class="selected-month-preview">
        <div class="preview-header">
          <h3>{{ selectedMonthData.name }} {{ getCurrentYear() }}</h3>
          <div class="season-indicator">
            <span class="season-icon">{{ getSeasonIcon(selectedMonthData.number) }}</span>
            <span class="season-name">{{ getSeasonName(selectedMonthData.number) }}</span>
          </div>
        </div>

        <div class="preview-content">
          <!-- Weather info -->
          <div class="weather-info">
            <div class="weather-item">
              <span class="weather-icon">🌡️</span>
              <span class="weather-label">Temp</span>
              <span class="weather-value">{{ getTemperatureRange(selectedMonthData.number) }}</span>
            </div>
            <div class="weather-item">
              <span class="weather-icon">🌧️</span>
              <span class="weather-label">Lluvia</span>
              <span class="weather-value">{{ getRainfallLevel(selectedMonthData.number) }}</span>
            </div>
            <div class="weather-item">
              <span class="weather-icon">☀️</span>
              <span class="weather-label">Sol</span>
              <span class="weather-value">{{ getSunlightHours(selectedMonthData.number) }}h</span>
            </div>
          </div>

          <!-- Activities overview -->
          <div class="activities-overview">
            <div 
              v-for="activity in getMonthActivitiesOverview(selectedMonthData.number)" 
              :key="activity.type"
              class="activity-overview-item"
            >
              <div class="activity-overview-header">
                <span class="activity-overview-icon">{{ activity.icon }}</span>
                <span class="activity-overview-name">{{ activity.name }}</span>
                <span class="activity-overview-count">{{ activity.count }} plantas</span>
              </div>
              <div class="activity-overview-plants">
                <span 
                  v-for="plant in activity.plants.slice(0, 3)" 
                  :key="plant"
                  class="plant-tag"
                >
                  {{ plant }}
                </span>
                <span v-if="activity.plants.length > 3" class="more-plants-indicator">
                  +{{ activity.plants.length - 3 }}
                </span>
              </div>
            </div>
          </div>

          <!-- Action button -->
          <div class="preview-actions">
            <a 
              :href="`/calendario/mes/${getMonthSlug(selectedMonthData.number)}/`" 
              class="month-action-btn primary"
            >
              Ver calendario de {{ selectedMonthData.name }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'MonthNavigatorCarousel',
  props: {
    currentMonth: {
      type: Number,
      default: () => new Date().getMonth() + 1
    },
    monthsData: {
      type: Array,
      required: true
    },
    allPlantsWithCalendar: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedMonth: this.currentMonth,
      canScrollMonthsLeft: false,
      canScrollMonthsRight: true
    }
  },
  computed: {
    selectedMonthData() {
      return this.monthsData.find(month => month.number === this.selectedMonth);
    }
  },
  mounted() {
    this.updateMonthScrollButtons();
    this.scrollToCurrentMonth();
  },
  methods: {
    getMonthSlug(monthNumber) {
      const monthSlugs = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
      return monthSlugs[monthNumber - 1] || `mes-${monthNumber}`;
    },
    getCurrentMonthName() {
      const currentMonthData = this.monthsData.find(month => month.isCurrent);
      return currentMonthData ? currentMonthData.name : '';
    },
    getCurrentYear() {
      return new Date().getFullYear();
    },
    selectMonth(month) {
      this.selectedMonth = month.number;
      this.$emit('month-selected', month);
    },
    jumpToMonth(monthNumber) {
      // Emit event to scroll to activities section or update current view
      this.$emit('jump-to-month', monthNumber);
    },
    scrollMonthsLeft() {
      const carousel = this.$refs.monthsCarousel;
      if (carousel) {
        carousel.scrollBy({ left: -240, behavior: 'smooth' });
      }
    },
    scrollMonthsRight() {
      const carousel = this.$refs.monthsCarousel;
      if (carousel) {
        carousel.scrollBy({ left: 240, behavior: 'smooth' });
      }
    },
    updateMonthScrollButtons() {
      const carousel = this.$refs.monthsCarousel;
      if (!carousel) return;

      this.canScrollMonthsLeft = carousel.scrollLeft > 0;
      this.canScrollMonthsRight = carousel.scrollLeft < (carousel.scrollWidth - carousel.clientWidth);
    },
    scrollToCurrentMonth() {
      this.$nextTick(() => {
        const carousel = this.$refs.monthsCarousel;
        if (!carousel) return;

        const currentMonthIndex = this.monthsData.findIndex(month => month.isCurrent);
        if (currentMonthIndex >= 0) {
          const scrollPosition = currentMonthIndex * 120; // Approximate card width
          carousel.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        }
      });
    },
    getSeasonIcon(monthNumber) {
      if (monthNumber >= 3 && monthNumber <= 5) return '🌸'; // Spring
      if (monthNumber >= 6 && monthNumber <= 8) return '☀️'; // Summer
      if (monthNumber >= 9 && monthNumber <= 11) return '🍂'; // Autumn
      return '❄️'; // Winter
    },
    getSeasonName(monthNumber) {
      if (monthNumber >= 3 && monthNumber <= 5) return 'Primavera';
      if (monthNumber >= 6 && monthNumber <= 8) return 'Verano';
      if (monthNumber >= 9 && monthNumber <= 11) return 'Otoño';
      return 'Invierno';
    },
    getTemperatureRange(monthNumber) {
      // Simplified temperature ranges for Mediterranean climate
      const temps = {
        1: '5-15°C', 2: '6-16°C', 3: '8-18°C', 4: '12-22°C',
        5: '15-25°C', 6: '19-29°C', 7: '22-32°C', 8: '22-32°C',
        9: '18-28°C', 10: '14-24°C', 11: '9-19°C', 12: '6-16°C'
      };
      return temps[monthNumber] || '10-20°C';
    },
    getRainfallLevel(monthNumber) {
      // Simplified rainfall levels
      if (monthNumber >= 6 && monthNumber <= 8) return 'Baja';
      if (monthNumber >= 11 || monthNumber <= 2) return 'Alta';
      return 'Media';
    },
    getSunlightHours(monthNumber) {
      // Simplified sunlight hours
      const hours = {
        1: 9, 2: 10, 3: 11, 4: 13, 5: 14, 6: 15,
        7: 15, 8: 13, 9: 11, 10: 10, 11: 9, 12: 8
      };
      return hours[monthNumber] || 10;
    },
    getActivityCount(monthNumber, activityType) {
      let count = 0;
      this.allPlantsWithCalendar.forEach(plant => {
        if (this.hasActivityInMonth(plant, activityType, monthNumber)) {
          count++;
        }
      });
      return count;
    },
    hasActivityInMonth(plant, activity, month) {
      const calendar = plant.calendar?.calendar_data;
      if (!calendar) return false;
      
      if (activity === 'sowing') {
        return (calendar.sowing?.indoor?.best_months?.includes(month)) ||
               (calendar.sowing?.outdoor?.best_months?.includes(month));
      }
      
      return calendar[activity]?.best_months?.includes(month);
    },
    getMonthActivitiesOverview(monthNumber) {
      const activities = [
        {
          type: 'sowing',
          name: 'Sembrar',
          icon: '🌱',
          count: this.getActivityCount(monthNumber, 'sowing'),
          plants: this.getPlantsForActivity(monthNumber, 'sowing')
        },
        {
          type: 'harvesting',
          name: 'Cosechar',
          icon: '🌾',
          count: this.getActivityCount(monthNumber, 'harvesting'),
          plants: this.getPlantsForActivity(monthNumber, 'harvesting')
        },
        {
          type: 'flowering',
          name: 'Floración',
          icon: '🌸',
          count: this.getActivityCount(monthNumber, 'flowering'),
          plants: this.getPlantsForActivity(monthNumber, 'flowering')
        }
      ];
      
      return activities.filter(activity => activity.count > 0);
    },
    getPlantsForActivity(monthNumber, activityType) {
      return this.allPlantsWithCalendar
        .filter(plant => this.hasActivityInMonth(plant, activityType, monthNumber))
        .map(plant => this.formatPlantName(plant.slug))
        .slice(0, 6); // Limit to 6 plants for preview
    },
    formatPlantName(slug) {
      return slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  }
}
</script>

<style scoped>
.month-navigator-section {
  margin: 3rem 0;
  padding: 0 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.section-header h2 {
  color: #2d3748;
  font-size: 1.75rem;
  margin: 0;
}

.current-badge {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.navigator-container {
  max-width: 1400px;
  margin: 0 auto;
}

.months-carousel-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
}

.nav-scroll-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  background: white;
  color: #4a5568;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-scroll-btn:hover:not(:disabled) {
  border-color: #48bb78;
  color: #48bb78;
  background: #f0fff4;
  transform: scale(1.05);
}

.nav-scroll-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.months-carousel {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-snap-type: x mandatory;
}

.months-carousel::-webkit-scrollbar {
  display: none;
}

.months-track {
  display: flex;
  gap: 0.75rem;
  padding: 0.5rem 0;
  min-width: min-content;
}

.month-card {
  flex: 0 0 110px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  scroll-snap-align: center;
}

.month-card:hover {
  border-color: #48bb78;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.15);
}

.month-card.active {
  border-color: #48bb78;
  background: #f0fff4;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.2);
}

.month-card.current {
  border-color: #ed8936;
  background: #fffbf0;
}

.month-card.current.active {
  border-color: #48bb78;
  background: linear-gradient(135deg, #f0fff4 0%, #fffbf0 100%);
}

.month-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.month-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
}

.current-indicator {
  color: #ed8936;
  font-size: 0.6rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.month-preview {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.activity-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
}

.activity-icon {
  font-size: 0.9rem;
}

.activity-count {
  font-weight: 600;
  color: #4a5568;
  background: #e2e8f0;
  padding: 0.125rem 0.375rem;
  border-radius: 8px;
  min-width: 20px;
  text-align: center;
}

.selected-month-preview {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-bottom: 1px solid #e2e8f0;
}

.preview-header h3 {
  color: #2d3748;
  margin: 0;
  font-size: 1.5rem;
}

.season-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.season-icon {
  font-size: 1.2rem;
}

.season-name {
  font-weight: 500;
  color: #4a5568;
}

.preview-content {
  padding: 2rem;
}

.weather-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
}

.weather-item {
  text-align: center;
}

.weather-icon {
  display: block;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.weather-label {
  display: block;
  font-size: 0.8rem;
  color: #718096;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.weather-value {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.activities-overview {
  margin-bottom: 2rem;
}

.activity-overview-item {
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: #fcfdfe;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.activity-overview-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.activity-overview-icon {
  font-size: 1.25rem;
}

.activity-overview-name {
  font-weight: 600;
  color: #2d3748;
  flex: 1;
}

.activity-overview-count {
  background: #e2e8f0;
  color: #4a5568;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.activity-overview-plants {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.plant-tag {
  background: #f0fff4;
  color: #22543d;
  border: 1px solid #c6f6d5;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.more-plants-indicator {
  background: #e2e8f0;
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  font-style: italic;
}

.preview-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.month-action-btn {
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.month-action-btn.primary {
  background: #48bb78;
  color: white;
}

.month-action-btn.primary:hover {
  background: #38a169;
  transform: translateY(-1px);
}

.month-action-btn.secondary {
  background: white;
  color: #48bb78;
  border: 2px solid #48bb78;
}

.month-action-btn.secondary:hover {
  background: #48bb78;
  color: white;
}

@media (max-width: 768px) {
  .month-navigator-section {
    padding: 0 0.5rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }

  .months-carousel-wrapper {
    gap: 0.5rem;
  }

  .nav-scroll-btn {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  .months-track {
    gap: 0.5rem;
  }

  .month-card {
    flex: 0 0 90px;
    padding: 0.75rem 0.5rem;
  }

  .month-name {
    font-size: 0.8rem;
  }

  .activity-preview {
    font-size: 0.7rem;
  }

  .preview-header {
    padding: 1.5rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .preview-header h3 {
    font-size: 1.25rem;
  }

  .preview-content {
    padding: 1.5rem;
  }

  .weather-info {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    padding: 1rem;
  }

  .weather-icon {
    font-size: 1.25rem;
  }

  .preview-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .month-action-btn {
    width: 100%;
    text-align: center;
  }
}
</style>