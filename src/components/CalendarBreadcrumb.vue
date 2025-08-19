<template>
  <nav class="calendar-breadcrumb" aria-label="Navegación del calendario">
    <ol class="breadcrumb-list">
      <li class="breadcrumb-item">
        <a href="/" class="breadcrumb-link home" title="Ir al inicio">
          <span class="breadcrumb-icon">🏠</span>
          <span class="breadcrumb-text">Inicio</span>
        </a>
      </li>
      
      <li class="breadcrumb-separator" aria-hidden="true">→</li>
      
      <li class="breadcrumb-item">
        <a href="/calendario/" class="breadcrumb-link calendar" title="Ir al calendario principal">
          <span class="breadcrumb-icon">📅</span>
          <span class="breadcrumb-text">Calendario</span>
        </a>
      </li>
      
      <template v-if="currentPath && currentPath.type">
        <li class="breadcrumb-separator" aria-hidden="true">→</li>
        
        <li class="breadcrumb-item" v-if="currentPath.type === 'category'">
          <span class="breadcrumb-current">
            <span class="breadcrumb-icon">{{ currentPath.icon }}</span>
            <span class="breadcrumb-text">{{ currentPath.name }}</span>
          </span>
        </li>
        
        <li class="breadcrumb-item" v-else-if="currentPath.type === 'plant'">
          <a :href="`/calendario/categoria/${currentPath.category}/`" class="breadcrumb-link">
            <span class="breadcrumb-icon">{{ currentPath.categoryIcon }}</span>
            <span class="breadcrumb-text">{{ currentPath.categoryName }}</span>
          </a>
        </li>
        
        <li class="breadcrumb-item" v-else-if="currentPath.type === 'month'">
          <span class="breadcrumb-current">
            <span class="breadcrumb-icon">📆</span>
            <span class="breadcrumb-text">{{ currentPath.name }}</span>
          </span>
        </li>
        
        <li class="breadcrumb-item" v-else-if="currentPath.type === 'activity'">
          <span class="breadcrumb-current">
            <span class="breadcrumb-icon">{{ currentPath.icon }}</span>
            <span class="breadcrumb-text">{{ currentPath.name }}</span>
          </span>
        </li>
      </template>
      
      <template v-if="currentPath && currentPath.type === 'plant'">
        <li class="breadcrumb-separator" aria-hidden="true">→</li>
        <li class="breadcrumb-item">
          <span class="breadcrumb-current">
            <span class="breadcrumb-icon">{{ currentPath.icon }}</span>
            <span class="breadcrumb-text">{{ currentPath.name }}</span>
          </span>
        </li>
      </template>
    </ol>
    
    <!-- Quick Actions -->
    <div class="breadcrumb-actions" v-if="showActions">
      <button 
        @click="$emit('back')" 
        class="action-button back-button"
        title="Volver atrás"
        v-if="currentPath && currentPath.type !== 'calendar'"
      >
        ← Atrás
      </button>
      
      <button 
        @click="$emit('home')" 
        class="action-button home-button"
        title="Ir al calendario principal"
        v-if="currentPath"
      >
        Calendario
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'CalendarBreadcrumb',
  props: {
    currentPath: {
      type: Object,
      default: null
      // Expected structure:
      // {
      //   type: 'category' | 'plant' | 'month' | 'activity',
      //   name: string,
      //   icon: string,
      //   category?: string,
      //   categoryName?: string,
      //   categoryIcon?: string
      // }
    },
    showActions: {
      type: Boolean,
      default: true
    }
  },
  emits: ['back', 'home']
}
</script>

<style scoped>
.calendar-breadcrumb {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  padding: var(--space-3) 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  backdrop-filter: blur(8px);
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0 var(--space-4);
  flex-wrap: wrap;
  gap: var(--space-2);
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  transition: all 0.3s ease;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.breadcrumb-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.breadcrumb-link.home {
  color: rgba(255, 255, 255, 0.9);
}

.breadcrumb-current {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  color: white;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  padding: var(--space-1) var(--space-2);
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-sm);
}

.breadcrumb-separator {
  color: rgba(255, 255, 255, 0.6);
  margin: 0 var(--space-1);
  font-weight: var(--font-weight-medium);
}

.breadcrumb-icon {
  font-size: var(--font-size-base);
  line-height: 1;
}

.breadcrumb-text {
  white-space: nowrap;
}

.breadcrumb-actions {
  display: flex;
  gap: var(--space-2);
  padding: 0 var(--space-4);
}

.action-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.action-button:active {
  transform: translateY(0);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .calendar-breadcrumb {
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-3);
  }
  
  .breadcrumb-list {
    flex-wrap: wrap;
    justify-content: center;
    padding: 0;
  }
  
  .breadcrumb-text {
    display: none;
  }
  
  .breadcrumb-current .breadcrumb-text,
  .breadcrumb-link.home .breadcrumb-text {
    display: inline;
  }
  
  .breadcrumb-actions {
    padding: 0;
    width: 100%;
    justify-content: center;
  }
  
  .action-button {
    flex: 1;
    max-width: 120px;
  }
}

@media (max-width: 480px) {
  .breadcrumb-list {
    font-size: var(--font-size-xs);
  }
  
  .breadcrumb-icon {
    font-size: var(--font-size-sm);
  }
  
  .breadcrumb-separator {
    margin: 0 var(--space-1);
  }
}
</style>