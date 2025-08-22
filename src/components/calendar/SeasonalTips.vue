<template>
  <section class="tips-section">
    <h2>💡 Consejos de {{ currentMonthName }}</h2>
    <div class="tips-grid">
      <div v-if="seasonalTips.temperature" class="tip-card">
        <h3>🌡️ Temperatura</h3>
        <p>{{ seasonalTips.temperature }}</p>
      </div>

      <div v-if="seasonalTips.watering" class="tip-card">
        <h3>💧 Riego</h3>
        <p>{{ seasonalTips.watering }}</p>
      </div>

      <div v-if="seasonalTips.sunlight" class="tip-card">
        <h3>☀️ Sol</h3>
        <p>{{ seasonalTips.sunlight }}</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SeasonalTips',
  props: {
    currentMonthName: {
      type: String,
      required: true
    },
    seasonalTips: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.tips-section {
  background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%);
  padding: 4rem 2rem;
  border-radius: 16px;
  margin-bottom: 4rem;
  position: relative;
  overflow: hidden;
}

.tips-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(72, 187, 120, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.tips-section h2 {
  color: #22543d;
  margin-bottom: 3rem;
  font-size: 2rem;
  text-align: center;
  position: relative;
  z-index: 1;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.tip-card {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(72, 187, 120, 0.2);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.tip-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.tip-card:hover::before {
  transform: scaleX(1);
}

.tip-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(72, 187, 120, 0.2);
  border-color: rgba(72, 187, 120, 0.4);
  background: rgba(255, 255, 255, 0.95);
}

.tip-card h3 {
  color: #22543d;
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tip-card p {
  color: #2f855a;
  margin: 0;
  line-height: 1.6;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .tips-section {
    padding: 2rem 1rem;
    margin-bottom: 2rem;
  }

  .tips-section h2 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  .tips-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .tip-card {
    padding: 1.5rem;
  }

  .tip-card h3 {
    font-size: 1.1rem;
  }

  .tip-card p {
    font-size: 0.9rem;
  }
}
</style>