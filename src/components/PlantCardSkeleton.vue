<template>
  <div class="plant-card-loading">
    <div class="loading-skeleton loading-skeleton-header"></div>
    <div class="loading-skeleton-body">
      <div class="loading-skeleton loading-skeleton-text medium"></div>
      <div class="loading-skeleton loading-skeleton-text short"></div>
      <div class="loading-skeleton loading-skeleton-text long"></div>
    </div>
    <div class="loading-skeleton loading-skeleton-button" style="margin-top: var(--space-3);"></div>
  </div>
</template>

<script>
export default {
  name: 'PlantCardSkeleton'
}
</script>

<style scoped>
/* Styles are inherited from calendar-theme.css */
</style>