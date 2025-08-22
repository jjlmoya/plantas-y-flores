<template>
  <section class="timeline-section">
    <h2>📅 Calendario Anual de {{ plantName }}</h2>
    
    <!-- Mobile Timeline -->
    <div class="timeline-mobile">
      <div 
        v-for="monthData in timelineData" 
        :key="`mobile-${monthData.month}`"
        :class="`timeline-month-mobile ${monthData.activities.length > 0 ? 'has-activities' : ''}`"
      >
        <div class="timeline-month-header-mobile">
          <div class="timeline-month-name-mobile">{{ monthData.monthName }}</div>
          <div class="timeline-month-number-mobile">{{ monthData.month }}</div>
        </div>
        
        <div v-if="monthData.activities.length > 0" class="timeline-activities-mobile">
          <div 
            v-for="(activity, index) in monthData.activities" 
            :key="`mobile-${index}`"
            :class="`timeline-activity-mobile ${activity.type} ${activity.priority || 'normal'}`"
          >
            <div class="timeline-activity-icon-mobile">
              {{ activity.icon }}
            </div>
            <div class="timeline-activity-content-mobile">
              <div class="timeline-activity-label-mobile">{{ activity.label }}</div>
              <div v-if="activity.details" class="timeline-activity-details-mobile">
                {{ activity.details }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="timeline-no-activities-mobile">
          Mantenimiento general
        </div>
      </div>
    </div>

    <!-- Desktop Timeline -->
    <div class="timeline-desktop">
      <div class="yearly-timeline">
        <div class="timeline-months">
          <div 
            v-for="monthData in timelineData" 
            :key="monthData.month"
            :class="`timeline-month ${monthData.activities.length > 0 ? 'has-activities' : ''}`"
          >
            <div class="month-header">
              <h3>{{ monthData.monthName }}</h3>
              <span class="month-number">{{ monthData.month }}</span>
            </div>
            
            <div class="month-activities">
              <div v-if="monthData.activities.length > 0" class="activities-list">
                <div 
                  v-for="(activity, index) in monthData.activities" 
                  :key="index"
                  :class="`activity-item ${activity.priority || 'normal'}`"
                  :style="`border-left-color: ${activity.color}`"
                >
                  <div class="activity-header">
                    <span class="activity-icon">{{ activity.icon }}</span>
                    <span class="activity-label">{{ activity.label }}</span>
                  </div>
                  <div v-if="activity.details" class="activity-details">
                    {{ activity.details }}
                  </div>
                </div>
              </div>
              <div v-else class="no-activities">
                <span>Mantenimiento general</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CalendarTimeline',
  props: {
    plantName: {
      type: String,
      required: true
    },
    timelineData: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.timeline-section {
  background: #fcfdfe;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.timeline-section h2 {
  color: #2d3748;
  margin-bottom: 2rem;
  font-size: 1.75rem;
  text-align: center;
}

.yearly-timeline {
  overflow-x: auto;
}

.timeline-months {
  display: grid;
  grid-template-columns: repeat(12, minmax(200px, 1fr));
  gap: 1rem;
  min-width: 1200px;
}

.timeline-month {
  background: #f7fafc;
  border-radius: 8px;
  padding: 1rem;
  min-height: 200px;
  transition: all 0.3s ease;
}

.timeline-month.has-activities {
  background: #f0fff4;
  border: 2px solid #c6f6d5;
}

.month-header {
  text-align: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.month-header h3 {
  margin: 0 0 0.25rem 0;
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
}

.month-number {
  color: #718096;
  font-size: 0.8rem;
  font-weight: 500;
}

.month-activities {
  min-height: 120px;
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.activity-item {
  background: #fcfdfe;
  border-radius: 4px;
  padding: 0.5rem;
  border-left: 3px solid #e2e8f0;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.activity-item.high {
  background: #fff5f5;
  border-left-color: #f56565;
}

.activity-item.medium {
  background: #fffbf0;
  border-left-color: #ed8936;
}

.activity-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.activity-icon {
  font-size: 0.9rem;
  width: 16px;
  text-align: center;
}

.activity-label {
  font-weight: 600;
  color: #2d3748;
}

.activity-details {
  color: #718096;
  font-size: 0.75rem;
  margin-left: 1.5rem;
}

.no-activities {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #a0aec0;
  font-style: italic;
  text-align: center;
}

/* Mobile Timeline Styles */
.timeline-mobile {
  display: none;
}

.timeline-desktop {
  display: block;
}

@media (max-width: 768px) {
  .timeline-mobile {
    display: block;
  }

  .timeline-desktop {
    display: none;
  }

  .timeline-month-mobile {
    background: #f7fafc;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    transition: all 0.3s ease;
  }

  .timeline-month-mobile.has-activities {
    background: #f0fff4;
    border: 2px solid #c6f6d5;
  }

  .timeline-month-header-mobile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .timeline-month-name-mobile {
    font-weight: 600;
    color: #2d3748;
    font-size: 1rem;
  }

  .timeline-month-number-mobile {
    color: #718096;
    font-size: 0.8rem;
    font-weight: 500;
    background: #f7fafc;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }

  .timeline-activities-mobile {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .timeline-activity-mobile {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    background: #fcfdfe;
    border-radius: 6px;
    padding: 0.75rem;
    border-left: 3px solid #e2e8f0;
  }

  .timeline-activity-mobile.high {
    background: #fff5f5;
    border-left-color: #f56565;
  }

  .timeline-activity-mobile.medium {
    background: #fffbf0;
    border-left-color: #ed8936;
  }

  .timeline-activity-icon-mobile {
    font-size: 1.25rem;
    flex-shrink: 0;
    width: 24px;
    text-align: center;
  }

  .timeline-activity-content-mobile {
    flex: 1;
  }

  .timeline-activity-label-mobile {
    font-weight: 600;
    color: #2d3748;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }

  .timeline-activity-details-mobile {
    color: #718096;
    font-size: 0.8rem;
  }

  .timeline-no-activities-mobile {
    text-align: center;
    color: #a0aec0;
    font-style: italic;
    padding: 2rem;
  }

  .timeline-section {
    padding: 1rem;
  }
}

/* Tablet styles */
@media (max-width: 1024px) and (min-width: 769px) {
  .timeline-months {
    grid-template-columns: repeat(12, 160px);
    gap: 0.75rem;
  }
  
  .timeline-month {
    min-height: 150px;
    padding: 0.75rem;
  }
  
  .month-header h3 {
    font-size: 0.9rem;
  }
  
  .activity-item {
    padding: 0.375rem;
    font-size: 0.75rem;
  }
  
  .activity-label {
    font-size: 0.75rem;
  }
  
  .activity-details {
    font-size: 0.7rem;
    margin-left: 1rem;
  }
}
</style>