<template>
  <section class="section-spacing">
    <h2>Navegar por Meses</h2>
    <div class="months-grid">
      <a
        v-for="month in quickNavMonths"
        :key="month.number"
        :href="`/calendario/mes/${getMonthSlug(month.number)}/`"
        :class="`month-link ${month.isCurrent ? 'current' : ''}`"
      >
        <span class="month-number">{{ month.number }}</span>
        <span class="month-name">{{ month.name }}</span>
      </a>
    </div>
  </section>
</template>

<script>
export default {
  name: 'MonthNavigator',
  props: {
    quickNavMonths: {
      type: Array,
      required: true
    },
    getMonthSlug: {
      type: Function,
      required: true
    }
  }
}
</script>

<style scoped>
.section-spacing {
  margin-bottom: 4rem;
}

.section-spacing h2 {
  color: #2d3748;
  margin-bottom: 2rem;
  font-size: 1.75rem;
  text-align: center;
}

.months-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.month-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: #fcfdfe;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.month-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(72, 187, 120, 0.1), transparent);
  transition: left 0.5s ease;
}

.month-link:hover::before {
  left: 100%;
}

.month-link:hover {
  border-color: #48bb78;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(72, 187, 120, 0.15);
}

.month-link.current {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  border-color: #38a169;
  color: white;
  transform: scale(1.05);
}

.month-link.current:hover {
  transform: scale(1.08) translateY(-2px);
  box-shadow: 0 12px 30px rgba(72, 187, 120, 0.3);
}

.month-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: #48bb78;
}

.month-link.current .month-number {
  color: white;
}

.month-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568;
  text-transform: capitalize;
}

.month-link.current .month-name {
  color: rgba(255, 255, 255, 0.95);
}

@media (max-width: 768px) {
  .months-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }

  .month-link {
    padding: 1rem 0.5rem;
  }

  .month-number {
    font-size: 1.25rem;
  }

  .month-name {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .months-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>