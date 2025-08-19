<template>
  <div class="empty-state">
    <div class="empty-icon">{{ icon || '🌱' }}</div>
    <h3>{{ title || 'No hay datos disponibles' }}</h3>
    <p v-if="message">{{ message }}</p>
    
    <div class="empty-actions" v-if="hasActions">
      <slot name="actions">
        <button v-if="showRetry" @click="$emit('retry')" class="btn btn-primary">
          🔄 Intentar de nuevo
        </button>
        <a v-if="backLink" :href="backLink" class="btn btn-secondary">
          ← {{ backLabel || 'Volver' }}
        </a>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    icon: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    message: {
      type: String,
      default: null
    },
    showRetry: {
      type: Boolean,
      default: false
    },
    backLink: {
      type: String,
      default: null
    },
    backLabel: {
      type: String,
      default: null
    }
  },
  computed: {
    hasActions() {
      return this.showRetry || this.backLink || this.$slots.actions;
    }
  },
  emits: ['retry']
}
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-text-muted);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--space-lg);
  opacity: 0.6;
}

.empty-state h3 {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-sm);
}

.empty-state p {
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
  line-height: 1.6;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.empty-actions {
  display: flex;
  gap: var(--space-sm);
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .empty-state {
    padding: var(--space-lg) var(--space-sm);
  }
  
  .empty-icon {
    font-size: 3rem;
  }
  
  .empty-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .empty-actions .btn {
    width: 100%;
    max-width: 250px;
  }
}
</style>