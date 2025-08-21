<template>
  <div class="plant-calendar-card" :class="{ loading }">
    <div v-if="loading" class="loading-state">
      <div class="skeleton-header"></div>
      <div class="skeleton-content"></div>
      <div class="skeleton-footer"></div>
    </div>

    <div v-else class="card-content">
      <!-- Card Header -->
      <div class="card-header">
        <div class="plant-title-section">
          <h3 class="plant-name">
            <span class="plant-icon">{{ ui.getCategoryIcon(plant.category) }}</span>
            {{ ui.formatPlantName(plant.slug) }}
          </h3>
          
          <div class="plant-meta">
            <span class="category-tag">
              {{ ui.formatCategoryName(plant.category) }}
            </span>
            
            <div class="plant-badges">
              <span 
                v-if="plant.calendar.plant_info?.type" 
                :class="['badge', 'type', plant.calendar.plant_info.type]"
              >
                {{ ui.formatTaskName(plant.calendar.plant_info.type) }}
              </span>
              
              <span 
                v-if="plant.calendar.growing_conditions?.difficulty" 
                :class="['badge', 'difficulty', plant.calendar.growing_conditions.difficulty]"
              >
                {{ ui.formatTaskName(plant.calendar.growing_conditions.difficulty) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card-actions">
          <button 
            v-if="plant.calendar._article_links?.resolved_link"
            @click="openArticle"
            class="action-btn article-btn"
            :title="'Ver artículo completo de ' + ui.formatPlantName(plant.slug)"
          >
            📖
          </button>
          
          <button 
            @click="openCalendar"
            class="action-btn calendar-btn"
            :title="'Ver calendario de ' + ui.formatPlantName(plant.slug)"
          >
            📅
          </button>
          
          <button 
            v-if="showFavorite"
            @click="toggleFavorite"
            :class="['action-btn', 'favorite-btn', { active: isFavorite }]"
            :title="isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
          >
            {{ isFavorite ? '❤️' : '🤍' }}
          </button>
        </div>
      </div>

      <!-- Scientific Name -->
      <div v-if="plant.calendar.plant_info?.scientific_name" class="scientific-name">
        <em>{{ plant.calendar.plant_info.scientific_name }}</em>
      </div>

      <!-- Current Activity Status -->
      <div class="current-status">
        <div v-if="currentActivities.length > 0" class="active-period">
          <div class="status-header">
            <span class="status-icon">🌟</span>
            <span class="status-text">Actividades Actuales</span>
          </div>
          <div class="activities-list">
            <div 
              v-for="activity in currentActivities" 
              :key="activity.type"
              class="activity-chip"
              :style="{ backgroundColor: ui.getActivityColor(activity.type) + '20', borderColor: ui.getActivityColor(activity.type) }"
            >
              <span class="activity-icon">{{ ui.getTaskIcon(activity.type) }}</span>
              <span class="activity-name">{{ ui.formatTaskName(activity.type) }}</span>
              <span v-if="activity.subtype" class="activity-subtype">{{ activity.subtype }}</span>
            </div>
          </div>
        </div>
        
        <div v-else class="inactive-period">
          <span class="inactive-icon">💤</span>
          <span class="inactive-text">Sin actividades específicas este mes</span>
        </div>
      </div>

      <!-- Growing Conditions Summary -->
      <div v-if="hasGrowingConditions" class="growing-conditions">
        <h4 class="conditions-title">
          <span class="title-icon">🌱</span>
          Condiciones de Cultivo
        </h4>
        
        <div class="conditions-grid">
          <div v-if="plant.calendar.growing_conditions?.sun_requirements" class="condition-item">
            <span class="condition-icon">☀️</span>
            <span class="condition-value">{{ ui.formatTaskName(plant.calendar.growing_conditions.sun_requirements) }}</span>
          </div>
          
          <div v-if="plant.calendar.growing_conditions?.water_needs" class="condition-item">
            <span class="condition-icon">💧</span>
            <span class="condition-value">{{ ui.formatTaskName(plant.calendar.growing_conditions.water_needs) }}</span>
          </div>
          
          <div v-if="plant.calendar.growing_conditions?.soil_type" class="condition-item">
            <span class="condition-icon">🌍</span>
            <span class="condition-value">{{ ui.formatTaskName(plant.calendar.growing_conditions.soil_type) }}</span>
          </div>
          
          <div v-if="plant.calendar.growing_conditions?.spacing?.plant_distance" class="condition-item">
            <span class="condition-icon">📏</span>
            <span class="condition-value">{{ plant.calendar.growing_conditions.spacing.plant_distance }}cm</span>
          </div>
        </div>
      </div>

      <!-- Timeline Preview -->
      <div class="timeline-preview">
        <h4 class="timeline-title">
          <span class="title-icon">📊</span>
          Vista Anual
        </h4>
        
        <div class="mini-timeline">
          <div 
            v-for="month in 12" 
            :key="month"
            :class="['timeline-month', { active: hasActivityInMonth(month) }]"
            :title="getMonthTooltip(month)"
          >
            <div class="month-indicator">
              <div 
                v-for="activity in getMonthActivities(month)" 
                :key="activity"
                class="activity-dot"
                :style="{ backgroundColor: ui.getActivityColor(activity) }"
              ></div>
            </div>
          </div>
        </div>
        
        <div class="timeline-labels">
          <span class="timeline-label start">Ene</span>
          <span class="timeline-label mid">Jun</span>
          <span class="timeline-label end">Dec</span>
        </div>
      </div>

      <!-- Harvest Information -->
      <div v-if="hasHarvestInfo" class="harvest-info">
        <h4 class="harvest-title">
          <span class="title-icon">🌾</span>
          Información de Cosecha
        </h4>
        
        <div class="harvest-details">
          <div v-if="plant.calendar.calendar_data?.harvesting?.days_to_harvest" class="harvest-item">
            <span class="harvest-label">Días hasta cosecha:</span>
            <span class="harvest-value">
              {{ plant.calendar.calendar_data.harvesting.days_to_harvest[0] }}-{{ plant.calendar.calendar_data.harvesting.days_to_harvest[1] }}
            </span>
          </div>
          
          <div v-if="plant.calendar.harvest_data?.storage_life" class="harvest-item">
            <span class="harvest-label">Conservación:</span>
            <span class="harvest-value">{{ plant.calendar.harvest_data.storage_life }} días</span>
          </div>
          
          <div v-if="plant.calendar.calendar_data?.harvesting?.continuous_harvest" class="harvest-item">
            <span class="harvest-badge continuous">🔄 Cosecha Continua</span>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="quick-stats">
        <div class="stat-item">
          <span class="stat-icon">📅</span>
          <span class="stat-value">{{ totalActiveMonths }}</span>
          <span class="stat-label">meses activos</span>
        </div>
        
        <div class="stat-item">
          <span class="stat-icon">🌟</span>
          <span class="stat-value">{{ totalActivities }}</span>
          <span class="stat-label">actividades</span>
        </div>
        
        <div v-if="plant.calendar.growing_conditions?.companion_plants?.length" class="stat-item">
          <span class="stat-icon">🤝</span>
          <span class="stat-value">{{ plant.calendar.growing_conditions.companion_plants.length }}</span>
          <span class="stat-label">compañeras</span>
        </div>
      </div>

      <!-- Card Footer -->
      <div class="card-footer">
        <div class="origin-info" v-if="plant.calendar.plant_info?.origin">
          <span class="origin-icon">📍</span>
          <span class="origin-text">{{ plant.calendar.plant_info.origin }}</span>
        </div>
        
        <button 
          @click="toggleExpanded" 
          class="expand-btn"
          :title="isExpanded ? 'Ver menos' : 'Ver más detalles'"
        >
          {{ isExpanded ? 'Ver Menos' : 'Ver Más' }}
          <span :class="['expand-icon', { rotated: isExpanded }]">▼</span>
        </button>
      </div>

      <!-- Expanded Content -->
      <div v-if="isExpanded" class="expanded-content">
        <div class="expanded-section" v-if="plant.calendar.growing_conditions?.companion_plants?.length">
          <h5>🤝 Plantas Compañeras</h5>
          <div class="companion-tags">
            <span 
              v-for="companion in plant.calendar.growing_conditions.companion_plants" 
              :key="companion"
              class="companion-tag"
            >
              {{ ui.getCategoryIcon(companion) }} {{ ui.formatCategoryName(companion) }}
            </span>
          </div>
        </div>
        
        <div class="expanded-section" v-if="plant.calendar.nutritional_data">
          <h5>📊 Información Nutricional</h5>
          <div class="nutritional-grid">
            <div v-if="plant.calendar.nutritional_data.calories_per_100g" class="nutritional-item">
              <span class="nutritional-label">Calorías:</span>
              <span class="nutritional-value">{{ plant.calendar.nutritional_data.calories_per_100g }} kcal</span>
            </div>
            <div v-if="plant.calendar.nutritional_data.properties?.length" class="nutritional-vitamins">
              <span class="nutritional-label">Vitaminas y Nutrientes:</span>
              <div class="vitamin-tags">
                <span 
                  v-for="property in plant.calendar.nutritional_data.properties" 
                  :key="property"
                  class="vitamin-tag"
                >
                  {{ ui.formatTaskName(property) }}
                </span>
              </div>
            </div>
            <div v-if="plant.calendar.nutritional_data.flavor_profile" class="nutritional-item">
              <span class="nutritional-label">Perfil de Sabor:</span>
              <span class="nutritional-value">{{ ui.formatTaskName(plant.calendar.nutritional_data.flavor_profile) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlantCalendarCard',
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
    showFavorite: {
      type: Boolean,
      default: false
    },
    currentMonth: {
      type: Number,
      default: () => new Date().getMonth() + 1
    },
    hemisphere: {
      type: String,
      default: 'northern'
    }
  },
  emits: ['article-click', 'calendar-click', 'favorite-toggle'],
  data() {
    return {
      isExpanded: false,
      isFavorite: false
    }
  },
  computed: {
    currentActivities() {
      const activities = [];
      const calendar = this.plant.calendar?.calendar_data;
      
      if (!calendar) return activities;

      const adjustedMonth = this.getAdjustedMonth(this.currentMonth);

      Object.entries(calendar).forEach(([activityType, activityData]) => {
        if (['sowing', 'transplanting', 'harvesting', 'flowering', 'planting'].includes(activityType)) {
          // Check direct month arrays
          if (activityData?.best_months?.includes(adjustedMonth)) {
            activities.push({ type: activityType, priority: 'best' });
          } else if (activityData?.alternative_months?.includes(adjustedMonth)) {
            activities.push({ type: activityType, priority: 'alternative' });
          }
          
          // Check sub-activities (like sowing indoor/outdoor)
          if (typeof activityData === 'object' && activityData !== null) {
            Object.entries(activityData).forEach(([subType, subData]) => {
              if (subData?.best_months?.includes(adjustedMonth)) {
                activities.push({ 
                  type: activityType, 
                  subtype: subType === 'indoor' ? 'interior' : subType === 'outdoor' ? 'exterior' : subType,
                  priority: 'best' 
                });
              }
            });
          }
        }
      });

      return activities;
    },
    hasGrowingConditions() {
      const conditions = this.plant.calendar?.growing_conditions;
      return conditions && (
        conditions.sun_requirements ||
        conditions.water_needs ||
        conditions.soil_type ||
        conditions.spacing
      );
    },
    hasHarvestInfo() {
      return this.plant.calendar?.calendar_data?.harvesting || 
             this.plant.calendar?.harvest_data?.storage_life;
    },
    totalActiveMonths() {
      const activeMonths = new Set();
      const calendar = this.plant.calendar?.calendar_data;
      
      if (!calendar) return 0;

      Object.values(calendar).forEach(activityData => {
        if (activityData?.best_months) {
          activityData.best_months.forEach(month => activeMonths.add(month));
        }
        if (activityData?.alternative_months) {
          activityData.alternative_months.forEach(month => activeMonths.add(month));
        }
        
        // Check sub-activities
        if (typeof activityData === 'object' && activityData !== null) {
          Object.values(activityData).forEach(subData => {
            if (subData?.best_months) {
              subData.best_months.forEach(month => activeMonths.add(month));
            }
          });
        }
      });

      return activeMonths.size;
    },
    totalActivities() {
      const calendar = this.plant.calendar?.calendar_data;
      if (!calendar) return 0;
      
      return Object.keys(calendar).filter(key => 
        ['sowing', 'transplanting', 'harvesting', 'flowering', 'planting', 'pruning'].includes(key)
      ).length;
    }
  },
  methods: {
    openArticle() {
      if (this.plant.calendar._article_links?.resolved_link) {
        this.$emit('article-click', this.plant.calendar._article_links.resolved_link);
      }
    },
    openCalendar() {
      const calendarUrl = `/calendario/planta/${this.plant.category}/${this.plant.slug}/`;
      this.$emit('calendar-click', calendarUrl);
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      this.$emit('favorite-toggle', { plant: this.plant, isFavorite: this.isFavorite });
    },
    toggleExpanded() {
      this.isExpanded = !this.isExpanded;
    },
    getAdjustedMonth(month) {
      if (this.hemisphere === 'southern') {
        const adjusted = month + 6;
        return adjusted > 12 ? adjusted - 12 : adjusted;
      }
      return month;
    },
    hasActivityInMonth(month) {
      const calendar = this.plant.calendar?.calendar_data;
      if (!calendar) return false;

      const adjustedMonth = this.getAdjustedMonth(month);

      return Object.values(calendar).some(activityData => {
        if (activityData?.best_months?.includes(adjustedMonth)) return true;
        if (activityData?.alternative_months?.includes(adjustedMonth)) return true;
        
        // Check sub-activities
        if (typeof activityData === 'object' && activityData !== null) {
          return Object.values(activityData).some(subData => {
            return subData?.best_months?.includes(adjustedMonth);
          });
        }
        
        return false;
      });
    },
    getMonthActivities(month) {
      const activities = new Set();
      const calendar = this.plant.calendar?.calendar_data;
      
      if (!calendar) return [];

      const adjustedMonth = this.getAdjustedMonth(month);

      Object.entries(calendar).forEach(([activityType, activityData]) => {
        if (['sowing', 'transplanting', 'harvesting', 'flowering', 'planting'].includes(activityType)) {
          if (activityData?.best_months?.includes(adjustedMonth) || 
              activityData?.alternative_months?.includes(adjustedMonth)) {
            activities.add(activityType);
          }
          
          // Check sub-activities
          if (typeof activityData === 'object' && activityData !== null) {
            Object.values(activityData).forEach(subData => {
              if (subData?.best_months?.includes(adjustedMonth)) {
                activities.add(activityType);
              }
            });
          }
        }
      });

      return Array.from(activities);
    },
    getMonthTooltip(month) {
      const activities = this.getMonthActivities(month);
      const monthName = this.ui.getMonthName(month);
      
      if (activities.length === 0) {
        return `${monthName}: Sin actividades`;
      }
      
      const activityNames = activities.map(activity => this.ui.formatTaskName(activity)).join(', ');
      return `${monthName}: ${activityNames}`;
    }
  }
}
</script>

<style scoped>
.plant-calendar-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.plant-calendar-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.plant-calendar-card.loading {
  pointer-events: none;
}

.loading-state {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-header, .skeleton-content, .skeleton-footer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-header {
  height: 60px;
}

.skeleton-content {
  height: 120px;
}

.skeleton-footer {
  height: 40px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.plant-title-section {
  flex-grow: 1;
}

.plant-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1.2;
}

.plant-icon {
  font-size: 1.5rem;
}

.plant-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-tag {
  color: #667eea;
  font-weight: 500;
  font-size: 0.9rem;
  text-transform: capitalize;
}

.plant-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
}

.badge.type.annual {
  background: #c6f6d5;
  color: #22543d;
}

.badge.type.perennial {
  background: #bee3f8;
  color: #2c5282;
}

.badge.type.biennial {
  background: #feebc8;
  color: #c05621;
}

.badge.difficulty.beginner {
  background: #c6f6d5;
  color: #22543d;
}

.badge.difficulty.intermediate {
  background: #feebc8;
  color: #c05621;
}

.badge.difficulty.advanced {
  background: #fed7d7;
  color: #c53030;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  color: #4a5568;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #edf2f7;
  transform: scale(1.05);
}

.action-btn.favorite-btn.active {
  background: #fed7d7;
  border-color: #feb2b2;
}

.scientific-name {
  font-style: italic;
  color: #718096;
  font-size: 0.9rem;
  margin-top: -0.5rem;
}

.current-status {
  background: #f7fafc;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
}

.active-period .status-header,
.inactive-period {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #2d3748;
}

.inactive-period {
  margin-bottom: 0;
  color: #718096;
  justify-content: center;
  font-weight: normal;
}

.activities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.activity-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  border: 1px solid;
  font-size: 0.8rem;
  font-weight: 500;
}

.activity-subtype {
  font-size: 0.7rem;
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.5);
  padding: 0.1rem 0.4rem;
  border-radius: 8px;
}

.growing-conditions,
.harvest-info {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.conditions-title,
.harvest-title,
.timeline-title {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.conditions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.condition-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.condition-icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.timeline-preview {
  background: #f7fafc;
  border-radius: 8px;
  padding: 1rem;
}

.mini-timeline {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2px;
  margin-bottom: 0.5rem;
  background: #e2e8f0;
  border-radius: 4px;
  padding: 4px;
}

.timeline-month {
  height: 20px;
  background: white;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.timeline-month.active {
  background: #c6f6d5;
}

.month-indicator {
  display: flex;
  gap: 1px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.activity-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  display: block;
}

.timeline-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #718096;
  font-weight: 500;
}

.harvest-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.harvest-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.harvest-label {
  color: #4a5568;
}

.harvest-value {
  color: #2d3748;
  font-weight: 500;
}

.harvest-badge.continuous {
  background: #c6f6d5;
  color: #22543d;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  align-self: flex-start;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.25rem;
}

.stat-icon {
  font-size: 1.2rem;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
}

.stat-label {
  font-size: 0.7rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.origin-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #718096;
}

.expand-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
}

.expand-btn:hover {
  color: #5a67d8;
}

.expand-icon {
  transition: transform 0.3s ease;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.expanded-content {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: expandContent 0.3s ease-out;
}

@keyframes expandContent {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 200px;
  }
}

.expanded-section h5 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
}

.companion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.companion-tag {
  background: #e6fffa;
  color: #234e52;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.nutritional-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.nutritional-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.nutritional-vitamins {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.nutritional-label {
  color: #4a5568;
  font-weight: 500;
}

.nutritional-value {
  color: #2d3748;
  font-weight: 500;
}

.vitamin-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.vitamin-tag {
  background: #e6fffa;
  color: #234e52;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: capitalize;
}

@media (max-width: 768px) {
  .card-content {
    padding: 1rem;
    gap: 0.75rem;
  }

  .card-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .card-actions {
    justify-content: center;
  }

  .plant-name {
    font-size: 1.1rem;
  }

  .conditions-grid {
    grid-template-columns: 1fr;
  }

  .quick-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    padding: 0.75rem;
  }

  .card-footer {
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }
}
</style>