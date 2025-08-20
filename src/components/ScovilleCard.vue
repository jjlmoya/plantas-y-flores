<template>
  <div v-if="scovilleData" class="scoville-card">
    <div class="scoville-header">
      <div class="heat-icon">🌶️</div>
      <h3 class="scoville-title">Escala Scoville</h3>
      <div class="heat-level-badge" :class="`heat-${scovilleData.heat_level}`">
        {{ formatHeatLevel(scovilleData.heat_level) }}
      </div>
    </div>

    <div class="scoville-content">
      <!-- Número principal animado -->
      <div class="scoville-number">
        <span class="number-value" ref="numberDisplay">0</span>
        <span class="number-units">SHU</span>
      </div>

      <!-- Rango si existe -->
      <div v-if="scovilleData.scoville_range" class="scoville-range">
        Rango: {{ scovilleData.scoville_range[0].toLocaleString() }} - {{ scovilleData.scoville_range[1].toLocaleString() }} SHU
      </div>

      <!-- Barra de calor animada -->
      <div class="heat-bar-container">
        <div class="heat-bar-bg">
          <div 
            class="heat-bar-fill" 
            :class="`heat-${scovilleData.heat_level}`"
            :style="{ width: heatPercentage + '%' }"
            ref="heatBar"
          ></div>
        </div>
        <div class="heat-scale">
          <span>0</span>
          <span>75K</span>
          <span>150K</span>
          <span>300K</span>
        </div>
      </div>

      <!-- Descripción -->
      <div class="heat-description">
        {{ scovilleData.heat_description }}
      </div>

      <!-- Comparación visual con chilis -->
      <div class="chili-comparison">
        <div class="chili-item" v-for="(chili, index) in getComparisonChilis()" :key="index">
          <div class="chili-emoji" :class="{ active: index <= currentChiliLevel }">🌶️</div>
        </div>
      </div>
    </div>

    <!-- Efectos de fuego para niveles altos -->
    <div v-if="isVeryHot" class="fire-effects">
      <div class="fire-particle" v-for="n in 6" :key="n"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScovilleCard',
  props: {
    scovilleData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      animatedNumber: 0,
      currentChiliLevel: 0,
      isAnimating: false
    }
  },
  computed: {
    heatPercentage() {
      const units = this.scovilleData.scoville_units || 0;
      // Escala simple y directa: 0 a 300K = 0% a 100%
      const maxScoville = 300000;
      return Math.min((units / maxScoville) * 100, 100);
    },
    isVeryHot() {
      return ['very_hot', 'extreme'].includes(this.scovilleData.heat_level);
    }
  },
  mounted() {
    this.startAnimation();
  },
  methods: {
    formatHeatLevel(level) {
      const levels = {
        'mild': 'Suave',
        'medium': 'Medio',
        'hot': 'Picante',
        'very_hot': 'Muy Picante',
        'extreme': 'Extremo'
      };
      return levels[level] || level;
    },
    getComparisonChilis() {
      const units = this.scovilleData.scoville_units || 0;
      if (units < 1000) return new Array(1).fill(null);
      if (units < 10000) return new Array(2).fill(null);
      if (units < 30000) return new Array(3).fill(null);
      if (units < 100000) return new Array(4).fill(null);
      return new Array(5).fill(null);
    },
    startAnimation() {
      this.isAnimating = true;
      
      // Animar número
      this.animateNumber();
      
      // Animar barra de calor
      setTimeout(() => {
        if (this.$refs.heatBar) {
          this.$refs.heatBar.style.width = this.heatPercentage + '%';
        }
      }, 500);
      
      // Animar chilis progresivamente
      this.animateChilis();
    },
    animateNumber() {
      const target = this.scovilleData.scoville_units || 0;
      const duration = 2000; // 2 segundos
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        
        if (this.$refs.numberDisplay) {
          this.$refs.numberDisplay.textContent = Math.floor(current).toLocaleString();
        }
      }, duration / steps);
    },
    animateChilis() {
      const maxLevel = this.getComparisonChilis().length - 1;
      let level = 0;
      
      const chiliTimer = setInterval(() => {
        this.currentChiliLevel = level;
        level++;
        
        if (level > maxLevel) {
          clearInterval(chiliTimer);
        }
      }, 300);
    }
  }
}
</script>

<style scoped>
.scoville-card {
  position: relative;
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #fb923c 100%);
  border: 3px solid #ea580c;
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(234, 88, 12, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.scoville-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 50px rgba(234, 88, 12, 0.3);
}

.scoville-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.heat-icon {
  font-size: 2rem;
  animation: bounce 2s infinite;
}

.scoville-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #c2410c;
  margin: 0;
}

.heat-level-badge {
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.heat-mild { background: #dcfce7; color: #166534; }
.heat-medium { background: #fef3c7; color: #92400e; }
.heat-hot { background: #fed7aa; color: #c2410c; }
.heat-very_hot { background: #fecaca; color: #dc2626; }
.heat-extreme { background: #fda4af; color: #991b1b; }

.scoville-content {
  text-align: center;
}

.scoville-number {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.number-value {
  font-size: 3rem;
  font-weight: 800;
  color: #ea580c;
  text-shadow: 2px 2px 4px rgba(234, 88, 12, 0.3);
}

.number-units {
  font-size: 1.25rem;
  font-weight: 600;
  color: #c2410c;
}

.scoville-range {
  font-size: 0.875rem;
  color: #92400e;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.heat-bar-container {
  margin-bottom: 1.5rem;
}

.heat-bar-bg {
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.heat-bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 2s cubic-bezier(0.4, 0, 0.2, 1);
  width: 0%;
  position: relative;
}

.heat-bar-fill.heat-mild { background: linear-gradient(90deg, #16a34a, #22c55e); }
.heat-bar-fill.heat-medium { background: linear-gradient(90deg, #d97706, #f59e0b); }
.heat-bar-fill.heat-hot { background: linear-gradient(90deg, #ea580c, #f97316); }
.heat-bar-fill.heat-very_hot { background: linear-gradient(90deg, #dc2626, #ef4444); }
.heat-bar-fill.heat-extreme { background: linear-gradient(90deg, #991b1b, #dc2626); }

.heat-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 2s infinite;
}

.heat-scale {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #92400e;
  font-weight: 500;
}

.heat-description {
  background: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 12px;
  color: #92400e;
  font-weight: 500;
  margin-bottom: 1.5rem;
  border-left: 4px solid #ea580c;
}

.chili-comparison {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  align-items: center;
}

.chili-item .chili-emoji {
  font-size: 1.5rem;
  opacity: 0.3;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.chili-item .chili-emoji.active {
  opacity: 1;
  transform: scale(1);
  animation: chiliPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.fire-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.fire-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, #ff4444, #ff8800);
  border-radius: 50%;
  animation: fireFloat 3s infinite ease-in-out;
}

.fire-particle:nth-child(1) { left: 20%; animation-delay: 0s; }
.fire-particle:nth-child(2) { left: 40%; animation-delay: 0.5s; }
.fire-particle:nth-child(3) { left: 60%; animation-delay: 1s; }
.fire-particle:nth-child(4) { left: 80%; animation-delay: 1.5s; }
.fire-particle:nth-child(5) { left: 30%; animation-delay: 2s; }
.fire-particle:nth-child(6) { left: 70%; animation-delay: 2.5s; }

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes chiliPop {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes fireFloat {
  0% { 
    bottom: 0; 
    opacity: 1; 
    transform: translateX(0) scale(1);
  }
  100% { 
    bottom: 100%; 
    opacity: 0; 
    transform: translateX(20px) scale(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .scoville-card {
    padding: 1.5rem;
    margin: 1.5rem 0;
  }
  
  .scoville-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .number-value {
    font-size: 2.5rem;
  }
  
  .heat-description {
    padding: 0.875rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .number-value {
    font-size: 2rem;
  }
  
  .chili-comparison {
    gap: 0.25rem;
  }
  
  .chili-item .chili-emoji {
    font-size: 1.25rem;
  }
}
</style>