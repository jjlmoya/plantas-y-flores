<template>
  <div class="plant-timeline-widget">
    <div class="timeline-header">
      <div class="timeline-title">
        <h3>
          <span class="timeline-icon">📊</span>
          Timeline Anual
        </h3>
        <p v-if="plant">{{ ui.formatPlantName(plant.slug) }} - {{ ui.formatCategoryName(plant.category) }}</p>
      </div>
      
      <div class="timeline-controls">
        <div class="hemisphere-toggle" v-if="showHemisphereToggle">
          <button 
            @click="toggleHemisphere"
            :class="['hemisphere-btn', { active: hemisphere === 'southern' }]"
            :disabled="loading"
          >
            {{ hemisphere === 'northern' ? '🌎 Norte' : '🌏 Sur' }}
          </button>
        </div>

        <div class="view-toggle">
          <button 
            @click="toggleView" 
            class="view-btn"
            :disabled="loading"
          >
            {{ viewMode === 'compact' ? '📋 Vista Detallada' : '📊 Vista Compacta' }}
          </button>
        </div>
      </div>
    </div>

    <div class="timeline-content">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando timeline...</p>
      </div>

      <div v-else-if="timelineData.length > 0" class="timeline-container">
        <!-- Timeline Grid -->
        <div class="timeline-grid" :class="viewMode">
          <!-- Months Header -->
          <div class="months-header">
            <div class="months-row">
              <div class="activity-label">Actividad</div>
              <div 
                v-for="month in 12" 
                :key="month"
                class="month-cell header"
              >
                <div class="month-name">{{ ui.getMonthName(month) }}</div>
                <div class="month-number">{{ month }}</div>
              </div>
            </div>
          </div>

          <!-- Timeline Rows -->
          <div class="timeline-rows">
            <div 
              v-for="(activityData, activityType) in groupedActivities"
              :key="activityType"
              class="timeline-row"
            >
              <div class="activity-info">
                <div class="activity-header">
                  <span 
                    class="activity-dot"
                    :style="{ backgroundColor: ui.getActivityColor(activityType) }"
                  ></span>
                  <span class="activity-name">{{ ui.formatTaskName(activityType) }}</span>
                </div>
                
                <div v-if="viewMode === 'detailed' && activityData.description" class="activity-description">
                  {{ activityData.description }}
                </div>
              </div>

              <!-- Monthly cells for this activity -->
              <div 
                v-for="month in 12"
                :key="`${activityType}-${month}`"
                :class="['month-cell', 'activity', {
                  'active': isActivityActiveInMonth(activityData, month),
                  'peak': isActivityPeakInMonth(activityData, month),
                  'alternative': isActivityAlternativeInMonth(activityData, month)
                }]"
                :style="isActivityActiveInMonth(activityData, month) ? 
                  { backgroundColor: ui.getActivityColor(activityType) + '20', borderColor: ui.getActivityColor(activityType) } : 
                  {}"
                @click="selectMonthActivity(activityType, month)"
                :title="getActivityTooltip(activityType, activityData, month)"
              >
                <div v-if="isActivityActiveInMonth(activityData, month)" class="activity-indicator">
                  <span class="activity-icon">{{ getActivityIcon(activityType, activityData, month) }}</span>
                  
                  <div v-if="viewMode === 'detailed'" class="activity-details">
                    {{ getActivityDetails(activityType, activityData, month) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Activity Details -->
        <div v-if="selectedActivity" class="activity-details-panel">
          <div class="details-header">
            <h4>
              {{ ui.formatTaskName(selectedActivity.type) }} - {{ ui.getMonthName(selectedActivity.month) }}
            </h4>
            <button @click="clearSelection" class="close-btn">×</button>
          </div>
          
          <div class="details-content">
            <div class="detail-item" v-if="selectedActivity.details">
              <strong>Detalles:</strong> {{ selectedActivity.details }}
            </div>
            
            <div class="detail-item" v-if="selectedActivity.temperature">
              <strong>Temperatura:</strong> {{ selectedActivity.temperature }}
            </div>
            
            <div class="detail-item" v-if="selectedActivity.timing">
              <strong>Momento:</strong> {{ selectedActivity.timing }}
            </div>

            <div class="detail-item" v-if="selectedActivity.tips">
              <strong>Consejos:</strong> {{ selectedActivity.tips }}
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="timeline-legend">
          <h4>Leyenda</h4>
          <div class="legend-items">
            <div class="legend-item">
              <div class="legend-sample active"></div>
              <span>Época Principal</span>
            </div>
            <div class="legend-item">
              <div class="legend-sample peak"></div>
              <span>Época Óptima</span>
            </div>
            <div class="legend-item">
              <div class="legend-sample alternative"></div>
              <span>Época Alternativa</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📅</div>
        <h4>Sin datos de calendario</h4>
        <p>Esta planta no tiene información específica de calendario configurada.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlantTimeline',
  props: {
    plant: {
      type: Object,
      required: true
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
      default: true
    }
  },
  emits: ['hemisphere-change', 'activity-select'],
  data() {
    return {
      viewMode: 'compact', // 'compact' or 'detailed'
      selectedActivity: null
    }
  },
  computed: {
    timelineData() {
      if (!this.plant?.calendar?.calendar_data) return [];
      
      const calendarData = this.plant.calendar.calendar_data;
      const data = [];

      // Process each activity type
      Object.entries(calendarData).forEach(([activityType, activityInfo]) => {
        if (this.isValidActivity(activityType)) {
          data.push({
            type: activityType,
            data: activityInfo,
            description: this.getActivityDescription(activityType, activityInfo)
          });
        }
      });

      return data;
    },
    groupedActivities() {
      const grouped = {};
      
      this.timelineData.forEach(activity => {
        grouped[activity.type] = activity;
      });
      
      return grouped;
    }
  },
  methods: {
    toggleHemisphere() {
      const newHemisphere = this.hemisphere === 'northern' ? 'southern' : 'northern';
      this.$emit('hemisphere-change', newHemisphere);
    },
    toggleView() {
      this.viewMode = this.viewMode === 'compact' ? 'detailed' : 'compact';
    },
    selectMonthActivity(activityType, month) {
      const activityData = this.groupedActivities[activityType];
      
      if (!this.isActivityActiveInMonth(activityData, month)) {
        return;
      }

      this.selectedActivity = {
        type: activityType,
        month,
        details: this.getActivityDetails(activityType, activityData, month),
        temperature: this.getTemperatureInfo(activityType, activityData.data, month),
        timing: this.getTimingInfo(activityType, activityData.data, month),
        tips: this.getActivityTips(activityType, activityData.data, month)
      };

      this.$emit('activity-select', this.selectedActivity);
    },
    clearSelection() {
      this.selectedActivity = null;
    },
    isValidActivity(activityType) {
      return ['sowing', 'transplanting', 'harvesting', 'flowering', 'planting', 'pruning'].includes(activityType);
    },
    isActivityActiveInMonth(activityData, month) {
      const adjustedMonth = this.getAdjustedMonth(month);
      const data = activityData.data;
      
      // Check direct months
      if (data.best_months?.includes(adjustedMonth)) return true;
      if (data.alternative_months?.includes(adjustedMonth)) return true;
      
      // Check sub-activities (like sowing indoor/outdoor)
      if (typeof data === 'object' && data !== null) {
        return Object.values(data).some(subData => {
          if (typeof subData === 'object' && subData !== null) {
            return subData.best_months?.includes(adjustedMonth) || 
                   subData.alternative_months?.includes(adjustedMonth);
          }
          return false;
        });
      }
      
      return false;
    },
    isActivityPeakInMonth(activityData, month) {
      const adjustedMonth = this.getAdjustedMonth(month);
      const data = activityData.data;
      
      return data.peak_months?.includes(adjustedMonth);
    },
    isActivityAlternativeInMonth(activityData, month) {
      const adjustedMonth = this.getAdjustedMonth(month);
      const data = activityData.data;
      
      if (data.alternative_months?.includes(adjustedMonth)) return true;
      
      // Check sub-activities
      if (typeof data === 'object' && data !== null) {
        return Object.values(data).some(subData => {
          if (typeof subData === 'object' && subData !== null) {
            return subData.alternative_months?.includes(adjustedMonth);
          }
          return false;
        });
      }
      
      return false;
    },
    getAdjustedMonth(month) {
      if (this.hemisphere === 'southern') {
        const adjusted = month + 6;
        return adjusted > 12 ? adjusted - 12 : adjusted;
      }
      return month;
    },
    getActivityIcon(activityType, activityData, month) {
      if (this.isActivityPeakInMonth(activityData, month)) {
        return '⭐';
      }
      
      return this.ui.getTaskIcon(activityType);
    },
    getActivityDetails(activityType, activityData, month) {
      const data = activityData.data;
      
      if (activityType === 'sowing') {
        if (data.indoor?.best_months?.includes(this.getAdjustedMonth(month))) {
          return 'Siembra interior';
        }
        if (data.outdoor?.best_months?.includes(this.getAdjustedMonth(month))) {
          return 'Siembra exterior';
        }
      }
      
      if (this.isActivityPeakInMonth(activityData, month)) {
        return 'Época óptima';
      }
      
      if (this.isActivityAlternativeInMonth(activityData, month)) {
        return 'Época alternativa';
      }
      
      return 'Época recomendada';
    },
    getTemperatureInfo(activityType, data, month) {
      const adjustedMonth = this.getAdjustedMonth(month);
      
      if (activityType === 'sowing') {
        if (data.indoor?.best_months?.includes(adjustedMonth) && data.indoor.temperature_range) {
          return `${data.indoor.temperature_range[0]}-${data.indoor.temperature_range[1]}°C (interior)`;
        }
        if (data.outdoor?.best_months?.includes(adjustedMonth) && data.outdoor.temperature_range) {
          return `${data.outdoor.temperature_range[0]}-${data.outdoor.temperature_range[1]}°C (exterior)`;
        }
      }
      
      if (activityType === 'transplanting' && data.soil_temperature_min) {
        return `Suelo mín: ${data.soil_temperature_min}°C`;
      }
      
      return null;
    },
    getTimingInfo(activityType, data, month) {
      if (data.days_to_harvest) {
        return `${data.days_to_harvest[0]}-${data.days_to_harvest[1]} días hasta cosecha`;
      }
      
      return null;
    },
    getActivityTips(activityType, data, month) {
      // This could be expanded with specific tips per activity/month
      const seasonalTips = this.ui.getSeasonalTips(month);
      
      if (activityType === 'sowing') {
        return seasonalTips.temperature;
      }
      
      if (activityType === 'harvesting') {
        return 'Cosechar en horas tempranas del día';
      }
      
      return null;
    },
    getActivityDescription(activityType, activityInfo) {
      if (activityType === 'sowing') {
        const methods = [];
        if (activityInfo.indoor) methods.push('interior');
        if (activityInfo.outdoor) methods.push('exterior');
        return methods.length > 0 ? `Siembra ${methods.join(' y ')}` : 'Siembra';
      }
      
      if (activityType === 'harvesting' && activityInfo.continuous_harvest) {
        return 'Cosecha continua disponible';
      }
      
      return this.ui.formatTaskName(activityType);
    },
    getActivityTooltip(activityType, activityData, month) {
      if (!this.isActivityActiveInMonth(activityData, month)) {
        return `${this.ui.formatTaskName(activityType)} - No activo en ${this.ui.getMonthName(month)}`;
      }
      
      const parts = [
        `${this.ui.formatTaskName(activityType)} - ${this.ui.getMonthName(month)}`,
        this.getActivityDetails(activityType, activityData, month)
      ];
      
      const temperature = this.getTemperatureInfo(activityType, activityData.data, month);
      if (temperature) {
        parts.push(temperature);
      }
      
      return parts.join('\n');
    }
  }
}
</script>

<style scoped>
.plant-timeline-widget {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.timeline-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.timeline-title h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.timeline-title p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

.timeline-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hemisphere-btn, .view-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.hemisphere-btn:hover, .view-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.hemisphere-btn.active {
  background: white;
  color: #667eea;
}

.timeline-content {
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

.timeline-container {
  overflow-x: auto;
}

.timeline-grid {
  min-width: 1000px;
}

.months-header {
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 1rem;
}

.months-row {
  display: grid;
  grid-template-columns: 200px repeat(12, 1fr);
  gap: 1px;
}

.activity-label {
  background: #f7fafc;
  padding: 1rem;
  font-weight: 600;
  color: #2d3748;
  border-right: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.month-cell.header {
  background: #f7fafc;
  padding: 0.75rem 0.5rem;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
}

.month-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.month-number {
  font-size: 0.8rem;
  color: #718096;
}

.timeline-rows {
  display: flex;
  flex-direction: column;
}

.timeline-row {
  display: grid;
  grid-template-columns: 200px repeat(12, 1fr);
  gap: 1px;
  border-bottom: 1px solid #f1f5f9;
}

.timeline-row:hover {
  background: #f7fafc;
}

.activity-info {
  padding: 1rem;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.activity-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.activity-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: block;
}

.activity-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
}

.activity-description {
  font-size: 0.8rem;
  color: #718096;
  margin-top: 0.25rem;
}

.month-cell.activity {
  padding: 0.75rem 0.5rem;
  min-height: 60px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.month-cell.activity:hover {
  background: #f7fafc !important;
}

.month-cell.activity.active {
  border: 2px solid;
  border-radius: 4px;
}

.month-cell.activity.peak {
  border: 2px solid;
  border-radius: 4px;
  position: relative;
}

.month-cell.activity.peak::before {
  content: '⭐';
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 0.7rem;
}

.month-cell.activity.alternative {
  border: 1px dashed;
  border-radius: 4px;
  opacity: 0.7;
}

.activity-indicator {
  text-align: center;
  width: 100%;
}

.activity-icon {
  font-size: 1.2rem;
  display: block;
  margin-bottom: 0.25rem;
}

.timeline-grid.detailed .activity-details {
  font-size: 0.7rem;
  color: #4a5568;
  font-weight: 500;
}

.activity-details-panel {
  background: #f7fafc;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1.5rem;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.details-header h4 {
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

.details-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  font-size: 0.9rem;
  color: #4a5568;
}

.detail-item strong {
  color: #2d3748;
}

.timeline-legend {
  background: #f7fafc;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1.5rem;
}

.timeline-legend h4 {
  margin: 0 0 0.75rem 0;
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

.legend-sample {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  display: block;
}

.legend-sample.active {
  background: #48bb78;
  border: 2px solid #48bb78;
}

.legend-sample.peak {
  background: #ed8936;
  border: 2px solid #ed8936;
  position: relative;
}

.legend-sample.peak::after {
  content: '⭐';
  position: absolute;
  top: -2px;
  right: -2px;
  font-size: 0.6rem;
}

.legend-sample.alternative {
  background: #a0aec0;
  border: 1px dashed #a0aec0;
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

@media (max-width: 768px) {
  .timeline-header {
    flex-direction: column;
    align-items: stretch;
  }

  .timeline-controls {
    justify-content: center;
  }

  .timeline-grid {
    min-width: 800px;
  }

  .months-row {
    grid-template-columns: 150px repeat(12, 60px);
  }

  .timeline-row {
    grid-template-columns: 150px repeat(12, 60px);
  }

  .activity-label {
    padding: 0.75rem;
  }

  .month-cell.header {
    padding: 0.5rem 0.25rem;
  }

  .month-name {
    font-size: 0.8rem;
  }

  .month-number {
    font-size: 0.7rem;
  }

  .activity-name {
    font-size: 0.8rem;
  }

  .activity-description {
    font-size: 0.7rem;
  }
}
</style>