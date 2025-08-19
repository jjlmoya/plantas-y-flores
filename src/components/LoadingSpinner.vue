<template>
  <div class="loading-container" :class="{ 'fullscreen': fullscreen }">
    <div class="loading-content">
      <div class="spinner" :class="size"></div>
      <p v-if="message" class="loading-message">{{ message }}</p>
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
}

.spinner {
  border: 2px solid var(--color-border-light);
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--space-sm);
}

.spinner.small {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.spinner.medium {
  width: 40px;
  height: 40px;
  border-width: 3px;
}

.spinner.large {
  width: 60px;
  height: 60px;
  border-width: 4px;
}

.loading-message {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
    border-top-color: var(--color-primary);
    opacity: 0.7;
  }
}
</style>