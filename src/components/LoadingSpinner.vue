<template>
  <div class="loading-container" :class="{ 'fullscreen': fullscreen }">
    <div class="loading-content">
      <div :class="`loading-spinner-${size}`"></div>
      <div v-if="message" class="loading-text">
        <span class="loading-text-dots">{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    message: {
      type: String,
      default: 'Cargando...'
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
}

.loading-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.loading-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}
</style>