<template>
  <div class="stats-card" :class="variant">
    <div class="card-header" v-if="title">
      <h3 class="card-title">
        <span v-if="icon" class="card-icon" v-html="icon"></span>
        {{ title }}
      </h3>
    </div>

    <div class="card-content">
      <slot>
        <!-- Default content if no slot provided -->
        <div class="default-content" v-if="!hasSlotContent">
          <div class="stat-number" v-if="number">{{ number }}</div>
          <div class="stat-label" v-if="label">{{ label }}</div>
          <div class="stat-description" v-if="description">{{ description }}</div>
        </div>
      </slot>
    </div>

    <div class="card-footer" v-if="footerLink || footerText">
      <a v-if="footerLink" :href="footerLink" class="footer-link">
        {{ footerText || 'Ver más' }} →
      </a>
      <span v-else class="footer-text">{{ footerText }}</span>
    </div>
  </div>
</template>

<script>
import { computed, useSlots } from 'vue';

export default {
  name: 'StatsCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    number: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    variant: {
      type: String,
      default: 'default',
      validator: value => ['default', 'primary', 'success', 'warning', 'info'].includes(value)
    },
    footerLink: {
      type: String,
      default: ''
    },
    footerText: {
      type: String,
      default: ''
    }
  },
  setup() {
    const slots = useSlots();
    
    const hasSlotContent = computed(() => {
      return slots.default && slots.default().length > 0;
    });

    return {
      hasSlotContent
    };
  }
};
</script>

<style scoped>
.stats-card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.stats-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.stats-card.primary {
  border-left: 4px solid var(--color-primary);
}

.stats-card.success {
  border-left: 4px solid var(--color-success);
}

.stats-card.warning {
  border-left: 4px solid var(--color-warning);
}

.stats-card.info {
  border-left: 4px solid var(--color-info);
}

.card-header {
  margin-bottom: var(--space-sm);
}

.card-title {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.card-icon {
  font-size: var(--font-size-xl);
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.default-content {
  text-align: center;
}

.stat-number {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
  margin-bottom: var(--space-xs);
}

.stat-label {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
  font-weight: 500;
  margin-bottom: var(--space-xs);
}

.stat-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.card-footer {
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--color-border-light);
}

.footer-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
}

.footer-link:hover {
  color: var(--color-primary-light);
  text-decoration: underline;
}

.footer-text {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

/* Variant specific number colors */
.stats-card.success .stat-number {
  color: var(--color-success);
}

.stats-card.warning .stat-number {
  color: var(--color-warning);
}

.stats-card.info .stat-number {
  color: var(--color-info);
}
</style>