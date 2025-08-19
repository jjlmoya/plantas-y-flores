<template>
  <aside class="calendar-sidebar" :class="{ 'collapsed': collapsed }">
    <!-- Toggle Button -->
    <button 
      @click="toggleSidebar" 
      class="sidebar-toggle"
      :title="collapsed ? 'Expandir menú' : 'Contraer menú'"
    >
      <span v-if="collapsed">→</span>
      <span v-else>←</span>
    </button>

    <!-- Quick Navigation -->
    <nav class="sidebar-nav" v-show="!collapsed">
      <h3 class="nav-title">Navegación Rápida</h3>
      
      <!-- Current Month -->
      <div class="nav-section">
        <h4 class="nav-section-title">
          <span class="nav-icon">📅</span>
          <span class="nav-text">Este Mes</span>
        </h4>
        <ul class="nav-list">
          <li class="nav-item">
            <a :href="`/calendario/mes/${currentMonthSlug}/`" class="nav-link">
              <span class="nav-icon">🌱</span>
              <span class="nav-text">{{ currentMonthName }}</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="/calendario/" class="nav-link">
              <span class="nav-icon">🏠</span>
              <span class="nav-text">Dashboard</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Activities -->
      <div class="nav-section">
        <h4 class="nav-section-title">
          <span class="nav-icon">⚡</span>
          <span class="nav-text">Actividades</span>
        </h4>
        <ul class="nav-list">
          <li class="nav-item" v-for="activity in activities" :key="activity.slug">
            <a :href="`/calendario/actividad/${activity.slug}/`" class="nav-link">
              <span class="nav-icon">{{ activity.icon }}</span>
              <span class="nav-text">{{ activity.name }}</span>
              <span class="nav-count" v-if="activity.count">{{ activity.count }}</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Popular Categories -->
      <div class="nav-section">
        <h4 class="nav-section-title">
          <span class="nav-icon">🌿</span>
          <span class="nav-text">Categorías</span>
        </h4>
        <ul class="nav-list">
          <li class="nav-item" v-for="category in popularCategories" :key="category.slug">
            <a :href="`/calendario/categoria/${category.slug}/`" class="nav-link">
              <span class="nav-icon">{{ category.icon }}</span>
              <span class="nav-text">{{ category.name }}</span>
              <span class="nav-count">{{ category.count }}</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="/categorias/" class="nav-link secondary">
              <span class="nav-icon">📋</span>
              <span class="nav-text">Ver todas</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Quick Months -->
      <div class="nav-section">
        <h4 class="nav-section-title">
          <span class="nav-icon">📆</span>
          <span class="nav-text">Meses</span>
        </h4>
        <div class="months-grid">
          <a 
            v-for="month in months" 
            :key="month.number"
            :href="`/calendario/mes/${month.slug}/`" 
            class="month-button"
            :class="{ 'current': month.isCurrent }"
            :title="`Ver calendario de ${month.name}`"
          >
            {{ month.name.substring(0, 3) }}
          </a>
        </div>
      </div>
    </nav>

    <!-- Help Section -->
    <div class="sidebar-help" v-show="!collapsed">
      <div class="help-card">
        <h4 class="help-title">💡 Consejo</h4>
        <p class="help-text">{{ currentTip }}</p>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'CalendarSidebar',
  props: {
    currentMonthName: {
      type: String,
      required: true
    },
    currentMonthSlug: {
      type: String,
      required: true
    },
    activities: {
      type: Array,
      default: () => []
    },
    popularCategories: {
      type: Array,
      default: () => []
    },
    months: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      collapsed: false,
      tips: [
        'Siembra en luna creciente para mejor germinación',
        'Las plantas aromáticas mejoran el sabor de tus vegetales',
        'Rota los cultivos para mantener el suelo saludable',
        'Mulch orgánico conserva la humedad y nutrientes',
        'Plantas compañeras protegen contra plagas naturalmente'
      ]
    }
  },
  computed: {
    currentTip() {
      // Rotate tips based on current date
      const tipIndex = new Date().getDate() % this.tips.length;
      return this.tips[tipIndex];
    }
  },
  methods: {
    toggleSidebar() {
      this.collapsed = !this.collapsed;
      // Save preference
      localStorage.setItem('calendar-sidebar-collapsed', this.collapsed);
    }
  },
  mounted() {
    // Restore sidebar state
    const savedState = localStorage.getItem('calendar-sidebar-collapsed');
    if (savedState !== null) {
      this.collapsed = savedState === 'true';
    }
    
    // Auto-collapse on mobile
    if (window.innerWidth <= 768) {
      this.collapsed = true;
    }
  }
}
</script>

<style scoped>
.calendar-sidebar {
  position: sticky;
  top: var(--space-4);
  width: 280px;
  max-height: calc(100vh - var(--space-8));
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  overflow-y: auto;
  transition: all 0.3s ease;
  z-index: 10;
}

.calendar-sidebar.collapsed {
  width: 60px;
}

.sidebar-toggle {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  background: var(--color-primary);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: var(--font-size-sm);
  z-index: 11;
}

.sidebar-toggle:hover {
  background: var(--color-primary-light);
  transform: scale(1.1);
}

.sidebar-nav {
  padding: var(--space-6) var(--space-4) var(--space-4);
}

.nav-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4) 0;
  padding-bottom: var(--space-2);
  border-bottom: 2px solid var(--color-border-light);
}

.nav-section {
  margin-bottom: var(--space-6);
}

.nav-section:last-child {
  margin-bottom: 0;
}

.nav-section-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-3) 0;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-bottom: var(--space-1);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  background: var(--bg-subtle);
  color: var(--color-primary);
  transform: translateX(2px);
}

.nav-link.secondary {
  color: var(--color-text-muted);
  font-weight: var(--font-weight-normal);
}

.nav-icon {
  font-size: var(--font-size-base);
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.nav-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-count {
  background: var(--color-primary);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-xl);
  min-width: 20px;
  text-align: center;
}

.months-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-1);
}

.month-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2);
  background: var(--bg-subtle);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.month-button:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-1px);
}

.month-button.current {
  background: var(--color-primary);
  color: white;
  font-weight: var(--font-weight-semibold);
}

.sidebar-help {
  padding: var(--space-4);
  border-top: 1px solid var(--color-border-light);
}

.help-card {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: white;
  padding: var(--space-4);
  border-radius: var(--radius-md);
}

.help-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--space-2) 0;
}

.help-text {
  font-size: var(--font-size-xs);
  line-height: var(--line-height-relaxed);
  margin: 0;
  opacity: 0.9;
}

/* Mobile Responsiveness */
@media (max-width: 1024px) {
  .calendar-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    border-radius: 0;
    border-left: none;
    transform: translateX(-100%);
  }
  
  .calendar-sidebar:not(.collapsed) {
    transform: translateX(0);
  }
  
  .calendar-sidebar.collapsed {
    transform: translateX(-100%);
    width: 280px;
  }
}

@media (max-width: 768px) {
  .months-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .month-button {
    padding: var(--space-1);
    font-size: 10px;
  }
}
</style>