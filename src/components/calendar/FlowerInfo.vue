<template>
  <section v-if="hasFlowerData" class="details-card">
    <h3>🌸 Características de la Flor</h3>
    <div class="flower-details-grid">
      <div v-if="flowerData.colors && flowerData.colors.length > 0" class="flower-detail-item">
        <span class="detail-icon">🎨</span>
        <div>
          <strong>Colores</strong>
          <p>{{ flowerData.colors.map(color => formatTaskName(color)).join(', ') }}</p>
        </div>
      </div>

      <div v-if="flowerData.fragrance" class="flower-detail-item">
        <span class="detail-icon">👃</span>
        <div>
          <strong>Fragancia</strong>
          <p>{{ formatTaskName(flowerData.fragrance) }}</p>
        </div>
      </div>

      <div v-if="flowerData.size" class="flower-detail-item">
        <span class="detail-icon">📏</span>
        <div>
          <strong>Tamaño</strong>
          <p>{{ formatTaskName(flowerData.size) }}</p>
        </div>
      </div>

      <div v-if="flowerData.flower_shape" class="flower-detail-item">
        <span class="detail-icon">⭕</span>
        <div>
          <strong>Forma</strong>
          <p>{{ formatTaskName(flowerData.flower_shape) }}</p>
        </div>
      </div>

      <div v-if="flowerData.bloom_duration" class="flower-detail-item">
        <span class="detail-icon">⏰</span>
        <div>
          <strong>Duración de Floración</strong>
          <p>{{ formatTaskName(flowerData.bloom_duration) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FlowerInfo',
  props: {
    flowerData: {
      type: Object,
      default: () => ({})
    },
    formatTaskName: {
      type: Function,
      required: true
    }
  },
  computed: {
    hasFlowerData() {
      return Object.keys(this.flowerData).length > 0;
    }
  }
}
</script>

<style scoped>
.details-card {
  background: #fcfdfe;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.details-card h3 {
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.flower-details-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.flower-detail-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.detail-icon {
  font-size: 1.5rem;
  width: 32px;
  text-align: center;
  flex-shrink: 0;
}

.flower-detail-item strong {
  display: block;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.flower-detail-item p {
  color: #4a5568;
  margin: 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .details-card {
    padding: 1rem;
  }
}
</style>