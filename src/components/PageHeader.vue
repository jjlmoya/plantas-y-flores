<template>
  <header class="page-header">
    <div class="header-content">
      <nav class="breadcrumb" v-if="breadcrumbs.length > 0">
        <a 
          v-for="(crumb, index) in breadcrumbs" 
          :key="index"
          :href="crumb.href"
          class="breadcrumb-link"
          :class="{ 'breadcrumb-current': index === breadcrumbs.length - 1 }"
        >
          {{ crumb.text }}
          <span v-if="index < breadcrumbs.length - 1" class="breadcrumb__separator">›</span>
        </a>
      </nav>
      
      <div class="header-main">
        <h1 class="page-title">{{ title }}</h1>
        <p v-if="description" class="page-description">{{ description }}</p>
        <div v-if="stats" class="stats">
          <span class="stats-number">{{ stats.number }}</span>
          <span class="stats-label">{{ stats.label }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    breadcrumbs: {
      type: Array,
      default: () => []
    },
    stats: {
      type: Object,
      default: null
    }
  }
}
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, #4a7c23 0%, #2d5016 100%);
  color: white;
  padding: 3rem 2rem 4rem 2rem;
  border-radius: 0 0 32px 32px;
  margin: -3rem -2rem 3rem -2rem;
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
  opacity: 0.3;
}

.header-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
}

.breadcrumb {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-link {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-link:not(.breadcrumb-current):hover {
  opacity: 0.8;
}

.breadcrumb-current {
  opacity: 0.8;
  font-weight: 600;
}

.breadcrumb__separator {
  opacity: 0.7;
}

.header-main {
  text-align: center;
}

.page-title {
  font-size: 3rem;
  font-weight: 900;
  margin: 0 0 1.5rem 0;
  line-height: 1.1;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-description {
  font-size: 1.2rem;
  line-height: 1.6;
  margin: 0 0 2rem 0;
  opacity: 0.95;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.stats-number {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 700;
}

.stats-label {
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    padding: 2rem 1.5rem 3rem 1.5rem;
    margin: -2rem -1.5rem 2rem -1.5rem;
  }
  
  .page-title {
    font-size: 2.2rem;
  }
  
  .breadcrumb {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 1.5rem 1rem 2.5rem 1rem;
    margin: -1.5rem -1rem 1.5rem -1rem;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .stats {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>