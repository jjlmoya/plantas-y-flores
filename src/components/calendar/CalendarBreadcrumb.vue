<template>
  <nav class="breadcrumb-nav">
    <div class="container">
      <div class="breadcrumb-container">
        <a href="/" class="breadcrumb-link">
          <span class="breadcrumb-icon">🏠</span>
          <span>Inicio</span>
        </a>
        <span class="breadcrumb-separator">→</span>
        <a href="/calendario/" class="breadcrumb-link">
          <span class="breadcrumb-icon">📅</span>
          <span>Calendario</span>
        </a>
        <template v-for="(crumb, index) in additionalCrumbs" :key="index">
          <span class="breadcrumb-separator">→</span>
          <a v-if="crumb.href" :href="crumb.href" class="breadcrumb-link">
            <span class="breadcrumb-icon">{{ crumb.icon }}</span>
            <span>{{ crumb.text }}</span>
          </a>
          <span v-else class="breadcrumb-current">
            <span class="breadcrumb-icon">{{ crumb.icon }}</span>
            <span>{{ crumb.text }}</span>
          </span>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'CalendarBreadcrumb',
  props: {
    additionalCrumbs: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.breadcrumb-nav {
  background: #fcfdfe;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 0 0 12px 12px;
  padding: 1rem 0;
}

.breadcrumb-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.breadcrumb-link:hover {
  background: #f7fafc;
  color: #2d3748;
}

.breadcrumb-separator {
  color: #a0aec0;
  font-weight: 300;
}

.breadcrumb-current {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 0.5rem 0.75rem;
  background: #f7fafc;
  border-radius: 6px;
}

.breadcrumb-icon {
  font-size: 0.9rem;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (max-width: 768px) {
  .breadcrumb-container {
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .breadcrumb-link, .breadcrumb-current {
    font-size: 0.8rem;
    padding: 0.5rem;
  }
}
</style>