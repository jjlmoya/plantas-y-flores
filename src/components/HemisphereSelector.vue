<template>
  <div class="hemisphere-selector-widget">
    <div class="selector-header">
      <h4>
        <span class="header-icon">🌍</span>
        Hemisferio
      </h4>
      <div class="current-location" v-if="showLocationInfo">
        <span class="location-icon">📍</span>
        <span class="location-text">{{ locationText }}</span>
      </div>
    </div>

    <div class="selector-content">
      <!-- Toggle Switch -->
      <div class="hemisphere-toggle">
        <button
          @click="setHemisphere('northern')"
          :class="['hemisphere-btn', 'northern', { active: currentHemisphere === 'northern' }]"
          :disabled="loading"
        >
          <span class="hemisphere-icon">🌎</span>
          <div class="hemisphere-info">
            <span class="hemisphere-name">Norte</span>
            <span class="hemisphere-detail">Estacional</span>
          </div>
        </button>

        <button
          @click="setHemisphere('southern')"
          :class="['hemisphere-btn', 'southern', { active: currentHemisphere === 'southern' }]"
          :disabled="loading"
        >
          <span class="hemisphere-icon">🌏</span>
          <div class="hemisphere-info">
            <span class="hemisphere-name">Sur</span>
            <span class="hemisphere-detail">+6 meses</span>
          </div>
        </button>
      </div>

      <!-- Current Season Info -->
      <div class="season-info">
        <div class="info-section">
          <span class="info-label">Estación Actual:</span>
          <span class="season-name">{{ currentSeason.name }}</span>
          <span class="season-icon">{{ currentSeason.icon }}</span>
        </div>
        
        <div class="info-section">
          <span class="info-label">Mes Activo:</span>
          <span class="current-month">{{ ui.getMonthName(adjustedCurrentMonth) }}</span>
        </div>
      </div>

      <!-- Quick Comparison -->
      <div v-if="showComparison" class="hemisphere-comparison">
        <h5>🔄 Comparación de Hemisferios</h5>
        <div class="comparison-grid">
          <div class="comparison-row">
            <div class="comparison-label">Ahora es:</div>
            <div class="comparison-value north">
              🌎 {{ ui.getMonthName(currentMonth) }} (Norte)
            </div>
            <div class="comparison-value south">
              🌏 {{ ui.getMonthName(adjustedCurrentMonth) }} (Sur)
            </div>
          </div>
          
          <div class="comparison-row">
            <div class="comparison-label">Primavera:</div>
            <div class="comparison-value north">Mar-May (Norte)</div>
            <div class="comparison-value south">Sep-Nov (Sur)</div>
          </div>
          
          <div class="comparison-row">
            <div class="comparison-label">Verano:</div>
            <div class="comparison-value north">Jun-Ago (Norte)</div>
            <div class="comparison-value south">Dec-Feb (Sur)</div>
          </div>
        </div>
      </div>

      <!-- Seasonal Tips -->
      <div class="seasonal-tips" v-if="seasonalTips && Object.keys(seasonalTips).length > 0">
        <h5>
          <span class="tips-icon">💡</span>
          Consejos de Temporada
        </h5>
        <div class="tips-content">
          <div v-if="seasonalTips.temperature" class="tip-item">
            <span class="tip-icon">🌡️</span>
            <span class="tip-text">{{ seasonalTips.temperature }}</span>
          </div>
          
          <div v-if="seasonalTips.planting" class="tip-item">
            <span class="tip-icon">🌱</span>
            <span class="tip-text">{{ seasonalTips.planting }}</span>
          </div>
          
          <div v-if="seasonalTips.care" class="tip-item">
            <span class="tip-icon">🌿</span>
            <span class="tip-text">{{ seasonalTips.care }}</span>
          </div>
        </div>
      </div>

      <!-- Auto-detection Section -->
      <div v-if="showAutoDetect" class="auto-detect-section">
        <button
          @click="detectLocation"
          class="detect-btn"
          :disabled="loading || isDetecting"
        >
          <span class="detect-icon">{{ isDetecting ? '⏳' : '🎯' }}</span>
          {{ isDetecting ? 'Detectando...' : 'Detectar Ubicación' }}
        </button>
        
        <div v-if="detectionResult" class="detection-result">
          <div class="result-success" v-if="detectionResult.success">
            ✅ Ubicación detectada: {{ detectionResult.hemisphere === 'northern' ? 'Hemisferio Norte' : 'Hemisferio Sur' }}
            <button @click="applyDetection" class="apply-detection-btn">Aplicar</button>
          </div>
          
          <div class="result-error" v-else>
            ❌ No se pudo detectar la ubicación. {{ detectionResult.error }}
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <div class="actions-grid">
          <button
            @click="$emit('view-current-month')"
            class="quick-action-btn"
            :disabled="loading"
          >
            📅 Ver Mes Actual
          </button>
          
          <button
            @click="$emit('view-season-plants')"
            class="quick-action-btn"
            :disabled="loading"
          >
            🌱 Plantas de Temporada
          </button>
          
          <button
            v-if="showResetBtn"
            @click="resetToDefault"
            class="quick-action-btn reset"
            :disabled="loading"
          >
            🔄 Restablecer
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Actualizando calendario...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HemisphereSelector',
  props: {
    ui: {
      type: Object,
      required: true
    },
    hemisphere: {
      type: String,
      default: 'northern',
      validator: (value) => ['northern', 'southern'].includes(value)
    },
    loading: {
      type: Boolean,
      default: false
    },
    showLocationInfo: {
      type: Boolean,
      default: true
    },
    showComparison: {
      type: Boolean,
      default: false
    },
    showAutoDetect: {
      type: Boolean,
      default: true
    },
    showResetBtn: {
      type: Boolean,
      default: false
    }
  },
  emits: ['hemisphere-change', 'view-current-month', 'view-season-plants'],
  data() {
    return {
      currentHemisphere: this.hemisphere,
      isDetecting: false,
      detectionResult: null,
      currentMonth: new Date().getMonth() + 1
    }
  },
  computed: {
    adjustedCurrentMonth() {
      if (this.currentHemisphere === 'southern') {
        const adjusted = this.currentMonth + 6;
        return adjusted > 12 ? adjusted - 12 : adjusted;
      }
      return this.currentMonth;
    },
    currentSeason() {
      const month = this.adjustedCurrentMonth;
      
      if (month >= 3 && month <= 5) {
        return { name: 'Primavera', icon: '🌸' };
      } else if (month >= 6 && month <= 8) {
        return { name: 'Verano', icon: '☀️' };
      } else if (month >= 9 && month <= 11) {
        return { name: 'Otoño', icon: '🍂' };
      } else {
        return { name: 'Invierno', icon: '❄️' };
      }
    },
    seasonalTips() {
      return this.ui.getSeasonalTips(this.adjustedCurrentMonth);
    },
    locationText() {
      return this.currentHemisphere === 'northern' 
        ? 'Hemisferio Norte' 
        : 'Hemisferio Sur (+6 meses)';
    }
  },
  methods: {
    setHemisphere(hemisphere) {
      if (hemisphere === this.currentHemisphere || this.loading) return;
      
      this.currentHemisphere = hemisphere;
      this.$emit('hemisphere-change', {
        hemisphere,
        adjustedMonth: this.adjustedCurrentMonth,
        season: this.currentSeason
      });
      
      // Save preference to localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('calendar-hemisphere', hemisphere);
      }
    },
    async detectLocation() {
      if (!navigator.geolocation) {
        this.detectionResult = {
          success: false,
          error: 'Geolocalización no soportada en este navegador'
        };
        return;
      }
      
      this.isDetecting = true;
      this.detectionResult = null;
      
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          });
        });
        
        const latitude = position.coords.latitude;
        const hemisphere = latitude >= 0 ? 'northern' : 'southern';
        
        this.detectionResult = {
          success: true,
          hemisphere,
          latitude,
          detected: true
        };
      } catch (error) {
        let errorMessage = 'Error desconocido';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Ubicación no disponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado';
            break;
        }
        
        this.detectionResult = {
          success: false,
          error: errorMessage
        };
      } finally {
        this.isDetecting = false;
      }
    },
    applyDetection() {
      if (this.detectionResult?.success) {
        this.setHemisphere(this.detectionResult.hemisphere);
        this.detectionResult = null;
      }
    },
    resetToDefault() {
      this.setHemisphere('northern');
      this.detectionResult = null;
      
      // Remove from localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('calendar-hemisphere');
      }
    }
  },
  mounted() {
    // Load saved hemisphere preference
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('calendar-hemisphere');
      if (saved && ['northern', 'southern'].includes(saved)) {
        this.currentHemisphere = saved;
        // Don't emit on mount to avoid conflicts
      }
    }
  },
  watch: {
    hemisphere(newVal) {
      if (newVal !== this.currentHemisphere) {
        this.currentHemisphere = newVal;
      }
    }
  }
}
</script>

<style scoped>
.hemisphere-selector-widget {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.selector-header {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.selector-header h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-icon {
  font-size: 1.2rem;
}

.current-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.9;
}

.selector-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hemisphere-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.hemisphere-btn {
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  color: #4a5568;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
}

.hemisphere-btn:hover:not(:disabled) {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.hemisphere-btn.active {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  border-color: #3182ce;
  color: white;
  transform: scale(1.02);
}

.hemisphere-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hemisphere-icon {
  font-size: 1.5rem;
}

.hemisphere-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.hemisphere-name {
  font-weight: 600;
  font-size: 1rem;
}

.hemisphere-detail {
  font-size: 0.8rem;
  opacity: 0.8;
}

.season-info {
  background: #f7fafc;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
}

.info-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #718096;
  font-weight: 500;
}

.season-name,
.current-month {
  color: #2d3748;
  font-weight: 600;
}

.season-icon {
  font-size: 1.1rem;
}

.hemisphere-comparison {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.hemisphere-comparison h5 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 0.9rem;
  font-weight: 600;
}

.comparison-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.comparison-row {
  display: grid;
  grid-template-columns: 100px 1fr 1fr;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.comparison-label {
  color: #718096;
  font-weight: 500;
}

.comparison-value {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
  text-align: center;
}

.comparison-value.north {
  background: #e6fffa;
  color: #234e52;
}

.comparison-value.south {
  background: #fef5e7;
  color: #744210;
}

.seasonal-tips {
  background: #fffaf0;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #fbd38d;
}

.seasonal-tips h5 {
  margin: 0 0 0.75rem 0;
  color: #744210;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #744210;
  line-height: 1.4;
}

.tip-icon {
  font-size: 0.9rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.auto-detect-section {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detect-btn {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  border: none;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.detect-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(72, 187, 120, 0.3);
}

.detect-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.detection-result {
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

.result-success {
  background: #f0fff4;
  color: #22543d;
  border: 1px solid #c6f6d5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.result-error {
  background: #fff5f5;
  color: #c53030;
  border: 1px solid #fed7d7;
}

.apply-detection-btn {
  background: #38a169;
  border: none;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
}

.apply-detection-btn:hover {
  background: #2f855a;
}

.quick-actions {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.quick-action-btn {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  color: #4a5568;
  padding: 0.75rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
}

.quick-action-btn:hover:not(:disabled) {
  background: #edf2f7;
  color: #2d3748;
}

.quick-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quick-action-btn.reset {
  background: #fed7d7;
  color: #c53030;
  border-color: #feb2b2;
  grid-column: span 2;
}

.quick-action-btn.reset:hover:not(:disabled) {
  background: #fbb6ce;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #4a5568;
  font-size: 0.9rem;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .selector-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    gap: 0.75rem;
  }

  .hemisphere-toggle {
    grid-template-columns: 1fr;
  }

  .comparison-row {
    grid-template-columns: 80px 1fr 1fr;
    font-size: 0.7rem;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .quick-action-btn.reset {
    grid-column: span 1;
  }

  .result-success {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
}
</style>