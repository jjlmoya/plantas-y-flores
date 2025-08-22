<template>
  <section class="quick-actions-section">
    <div class="quick-actions-grid">
      <!-- Próximo Mes -->
      <a :href="getNextMonthUrl()" class="action-card primary">
        <div class="card-icon">📅</div>
        <div class="card-content">
          <h3>Próximo Mes</h3>
          <p>Planifica {{ getNextMonthName() }}</p>
          <div class="card-arrow">→</div>
        </div>
      </a>

      <!-- Explorar todas las plantas -->
      <a href="/plantas/" class="action-card secondary">
        <div class="card-icon">🌿</div>
        <div class="card-content">
          <h3>Todas las Plantas</h3>
          <p>Explora nuestro catálogo completo de {{ getTotalPlantsCount() }} plantas</p>
          <div class="card-arrow">→</div>
        </div>
      </a>
    </div>
  </section>
</template>

<script>
export default {
  name: 'QuickActionCards',
  props: {
    currentMonth: {
      type: Number,
      default: () => new Date().getMonth() + 1
    },
    allPlantsWithCalendar: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getMonthName(monthNumber) {
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                         'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      return monthNames[monthNumber - 1] || `Mes ${monthNumber}`;
    },
    getCurrentMonthName() {
      return this.getMonthName(this.currentMonth);
    },
    getNextMonthName() {
      const nextMonth = this.currentMonth === 12 ? 1 : this.currentMonth + 1;
      return this.getMonthName(nextMonth);
    },
    getTotalPlantsCount() {
      return this.allPlantsWithCalendar.length || '100+';
    },
    getMonthSlug(monthNumber) {
      const monthSlugs = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
      return monthSlugs[monthNumber - 1] || `mes-${monthNumber}`;
    },
    getNextMonthUrl() {
      // Link to next month calendar  
      const nextMonth = this.currentMonth === 12 ? 1 : this.currentMonth + 1;
      const monthSlug = this.getMonthSlug(nextMonth);
      return `/calendario/mes/${monthSlug}/`;
    }
  }
}
</script>

<style scoped>
.quick-actions-section {
  margin: 2rem 0;
  padding: 0 1rem;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 14px;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.action-card:hover::before {
  opacity: 0.1;
}

.action-card:active {
  transform: translateY(-2px);
}

/* Primary Card - Sembrar */
.action-card.primary {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}

.action-card.primary::before {
  background: linear-gradient(135deg, #68d391 0%, #48bb78 100%);
}

.action-card.primary:hover {
  border-color: rgba(255, 255, 255, 0.3);
}

/* Secondary Card - Próximo Mes */
.action-card.secondary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-card.secondary::before {
  background: linear-gradient(135deg, #818cf8 0%, #8b5cf6 100%);
}

.action-card.secondary:hover {
  border-color: rgba(255, 255, 255, 0.3);
}

/* Accent Card - Cosechar */
.action-card.accent {
  background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
  color: white;
}

.action-card.accent::before {
  background: linear-gradient(135deg, #fbb040 0%, #f6ad55 100%);
}

.action-card.accent:hover {
  border-color: rgba(255, 255, 255, 0.3);
}

.card-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: inherit;
}

.card-content p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
  color: inherit;
}

.card-arrow {
  font-size: 1.5rem;
  font-weight: bold;
  opacity: 0.7;
  transition: transform 0.3s ease;
}

.action-card:hover .card-arrow {
  transform: translateX(4px);
  opacity: 1;
}

@media (max-width: 768px) {
  .quick-actions-section {
    margin: 1.5rem 0;
    padding: 0 0.5rem;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .action-card {
    padding: 1.25rem;
    gap: 0.75rem;
  }

  .card-icon {
    font-size: 2rem;
  }

  .card-content h3 {
    font-size: 1.1rem;
  }

  .card-content p {
    font-size: 0.85rem;
  }

  .card-arrow {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .action-card {
    padding: 1rem;
    border-radius: 12px;
  }

  .card-icon {
    font-size: 1.75rem;
  }

  .card-content h3 {
    font-size: 1rem;
  }

  .card-content p {
    font-size: 0.8rem;
  }
}
</style>