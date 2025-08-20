<template>
  <div class="calendar-link-card" v-if="showCalendarLink">
    <div class="calendar-card-content">
      <div class="calendar-icon-section">
        <div class="calendar-icon">📅</div>
        <div class="calendar-pulse"></div>
      </div>
      
      <div class="calendar-text-section">
        <h3 class="calendar-title">Calendario de Cultivo</h3>
        <p class="calendar-description">
          <strong>Guía completa {{ currentYear }}</strong>: Descubre las fechas exactas para sembrar, trasplantar y cosechar {{ plantName.toLowerCase() }} en España. Calendario adaptado a tu zona climática con consejos de experto.
        </p>
        <div class="calendar-features">
          <span class="feature-badge">🗓️ Fechas {{ currentYear }}</span>
          <span class="feature-badge">🇪🇸 España</span>
          <span class="feature-badge">📈 Mejores cosechas</span>
        </div>
      </div>
      
      <div class="calendar-action-section">
        <a 
          :href="calendarUrl" 
          class="calendar-button"
          :title="`Calendario de cultivo ${plantName} ${currentYear} - Fechas siembra, trasplante y cosecha`"
          :aria-label="`Ver calendario completo de cultivo para ${plantName} con fechas de siembra, trasplante y cosecha`"
          rel="nofollow"
        >
          📅 Calendario {{ plantName }} {{ currentYear }}
          <svg class="calendar-arrow" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </a>
        
        <div class="calendar-benefits">
          <div class="benefit-item">
            <span class="benefit-icon">🌱</span>
            <span class="benefit-text">Mejores cosechas</span>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">⏰</span>
            <span class="benefit-text">Timing perfecto</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="calendar-card-decoration">
      <div class="decoration-dots">
        <div class="dot dot-1"></div>
        <div class="dot dot-2"></div>
        <div class="dot dot-3"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalendarLinkCard',
  props: {
    plantName: {
      type: String,
      required: true
    },
    categorySlug: {
      type: String,
      required: true
    },
    plantSlug: {
      type: String,
      required: true
    }
  },
  computed: {
    calendarUrl() {
      return `/calendario/${this.categorySlug}/${this.plantSlug}/`;
    },
    currentYear() {
      return new Date().getFullYear();
    },
    showCalendarLink() {
      // Solo mostrar si tenemos los datos necesarios
      return this.plantName && this.categorySlug && this.plantSlug;
    }
  }
}
</script>

<style scoped>
.calendar-link-card {
  position: relative;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%);
  border: 2px solid #22c55e;
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0 3rem 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.15);
}

.calendar-link-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(34, 197, 94, 0.25);
  border-color: #16a34a;
}

.calendar-card-content {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  align-items: center;
  position: relative;
  z-index: 2;
}

.calendar-icon-section {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-icon {
  font-size: 3rem;
  background: white;
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.2);
  position: relative;
  z-index: 2;
}

.calendar-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  background: rgba(34, 197, 94, 0.2);
  border-radius: 16px;
  transform: translate(-50%, -50%);
  animation: pulse 2s infinite;
  z-index: 1;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.3;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.7;
  }
}

.calendar-text-section {
  flex: 1;
  min-width: 0;
}

.calendar-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #166534;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.calendar-description {
  color: #15803d;
  margin: 0 0 1rem 0;
  line-height: 1.5;
  font-size: 0.95rem;
}

.calendar-features {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.feature-badge {
  background: rgba(255, 255, 255, 0.8);
  color: #166534;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.calendar-action-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.calendar-button {
  background: #22c55e;
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
  white-space: nowrap;
}

.calendar-button:hover {
  background: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(34, 197, 94, 0.4);
}

.calendar-arrow {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.calendar-button:hover .calendar-arrow {
  transform: translateX(4px);
}

.calendar-benefits {
  display: flex;
  gap: 1rem;
}

.benefit-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.benefit-icon {
  font-size: 1.25rem;
}

.benefit-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #166534;
  text-align: center;
}

.calendar-card-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  overflow: hidden;
  pointer-events: none;
}

.decoration-dots {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
}

.dot {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
}

.dot-1 {
  width: 12px;
  height: 12px;
  top: 20px;
  right: 30px;
  animation: float 3s ease-in-out infinite;
}

.dot-2 {
  width: 8px;
  height: 8px;
  top: 40px;
  right: 15px;
  animation: float 3s ease-in-out infinite 0.5s;
}

.dot-3 {
  width: 6px;
  height: 6px;
  top: 60px;
  right: 40px;
  animation: float 3s ease-in-out infinite 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-10px) rotate(180deg);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .calendar-link-card {
    margin: 1.5rem 0 2rem 0;
    padding: 1.5rem;
  }
  
  .calendar-card-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.5rem;
  }
  
  .calendar-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }
  
  .calendar-pulse {
    width: 60px;
    height: 60px;
  }
  
  .calendar-title {
    font-size: 1.25rem;
  }
  
  .calendar-features {
    justify-content: center;
  }
  
  .calendar-benefits {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .calendar-link-card {
    padding: 1.25rem;
    margin: 1rem 0;
  }
  
  .calendar-card-content {
    gap: 1rem;
  }
  
  .calendar-title {
    font-size: 1.125rem;
  }
  
  .calendar-description {
    font-size: 0.875rem;
  }
  
  .calendar-button {
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
  }
  
  .feature-badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
  }
}
</style>