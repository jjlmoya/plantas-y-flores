<template>
  <div class="companion-plants">
    <header class="companion-header">
      <h3>🌱 Plantas Compañeras</h3>
      <p class="companion-subtitle">
        Plantas que se benefician o deben evitarse al cultivar juntas
      </p>
    </header>

    <div class="companion-sections" v-if="hasCompanions">
      <!-- Beneficial Companions -->
      <section v-if="companions.beneficial.length > 0" class="companion-section beneficial">
        <h4 class="section-title">
          <span class="section-icon">✅</span>
          Plantas Beneficiosas
          <span class="count">({{ companions.beneficial.length }})</span>
        </h4>
        <div class="companion-grid">
          <div 
            v-for="plant in companions.beneficial" 
            :key="`beneficial-${plant.name}`"
            class="companion-card beneficial-card"
          >
            <component 
              :is="plant.hasLink ? 'a' : 'div'"
              :href="plant.link"
              :class="{ 'companion-link': plant.hasLink, 'companion-text': !plant.hasLink }"
              :title="plant.hasLink ? `Ver información sobre ${plant.name}` : plant.description"
            >
              <span class="companion-icon">{{ plant.icon }}</span>
              <span class="companion-name">{{ plant.name }}</span>
              <span v-if="plant.hasLink" class="link-indicator">→</span>
            </component>
            <p class="companion-description">{{ plant.description }}</p>
          </div>
        </div>
      </section>

      <!-- Neutral Companions -->
      <section v-if="companions.neutral.length > 0" class="companion-section neutral">
        <h4 class="section-title">
          <span class="section-icon">⚖️</span>
          Plantas Neutras
          <span class="count">({{ companions.neutral.length }})</span>
        </h4>
        <div class="companion-grid">
          <div 
            v-for="plant in companions.neutral" 
            :key="`neutral-${plant.name}`"
            class="companion-card neutral-card"
          >
            <component 
              :is="plant.hasLink ? 'a' : 'div'"
              :href="plant.link"
              :class="{ 'companion-link': plant.hasLink, 'companion-text': !plant.hasLink }"
              :title="plant.hasLink ? `Ver información sobre ${plant.name}` : plant.description"
            >
              <span class="companion-icon">{{ plant.icon }}</span>
              <span class="companion-name">{{ plant.name }}</span>
              <span v-if="plant.hasLink" class="link-indicator">→</span>
            </component>
            <p class="companion-description">{{ plant.description }}</p>
          </div>
        </div>
      </section>

      <!-- Plants to Avoid -->
      <section v-if="companions.avoid.length > 0" class="companion-section avoid">
        <h4 class="section-title">
          <span class="section-icon">❌</span>
          Plantas a Evitar
          <span class="count">({{ companions.avoid.length }})</span>
        </h4>
        <div class="companion-grid">
          <div 
            v-for="plant in companions.avoid" 
            :key="`avoid-${plant.name}`"
            class="companion-card avoid-card"
          >
            <component 
              :is="plant.hasLink ? 'a' : 'div'"
              :href="plant.link"
              :class="{ 'companion-link': plant.hasLink, 'companion-text': !plant.hasLink }"
              :title="plant.hasLink ? `Ver información sobre ${plant.name}` : plant.description"
            >
              <span class="companion-icon">{{ plant.icon }}</span>
              <span class="companion-name">{{ plant.name }}</span>
              <span v-if="plant.hasLink" class="link-indicator">→</span>
            </component>
            <p class="companion-description">{{ plant.description }}</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Empty State -->
    <div v-else class="companion-empty">
      <div class="empty-icon">🌿</div>
      <p>No hay información de plantas compañeras disponible para esta categoría.</p>
    </div>

    <!-- Tips Section -->
    <footer v-if="hasCompanions" class="companion-tips">
      <h4>💡 Consejos para Plantas Compañeras</h4>
      <ul class="tips-list">
        <li><strong>Planificación:</strong> Considera las plantas compañeras al diseñar tu jardín</li>
        <li><strong>Espaciado:</strong> Respeta las distancias de plantación recomendadas</li>
        <li><strong>Rotación:</strong> Rota las plantas compañeras junto con el cultivo principal</li>
        <li><strong>Observación:</strong> Monitorea las interacciones y ajusta según los resultados</li>
      </ul>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'CompanionPlants',
  props: {
    companions: {
      type: Object,
      required: true,
      default: () => ({
        beneficial: [],
        neutral: [],
        avoid: [],
        totalCount: 0
      })
    }
  },
  computed: {
    hasCompanions() {
      return this.companions.totalCount > 0;
    }
  }
}
</script>

<style scoped>
.companion-plants {
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-lg, 12px);
  padding: var(--space-lg, 1.5rem);
  box-shadow: var(--shadow-md, 0 4px 6px rgba(0, 0, 0, 0.1));
  border: 1px solid var(--color-border-light, #e2e8f0);
  margin-bottom: var(--space-lg, 1.5rem);
}

.companion-header {
  text-align: center;
  margin-bottom: var(--space-lg, 1.5rem);
  padding-bottom: var(--space-md, 1rem);
  border-bottom: 2px solid var(--color-border-light, #e2e8f0);
}

.companion-header h3 {
  margin: 0 0 var(--space-sm, 0.75rem) 0;
  color: var(--color-text-primary, #2d3748);
  font-size: var(--font-size-xl, 1.25rem);
  font-weight: 700;
}

.companion-subtitle {
  margin: 0;
  color: var(--color-text-secondary, #718096);
  font-size: var(--font-size-sm, 0.875rem);
}

.companion-sections {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg, 1.5rem);
}

.companion-section {
  background: var(--bg-subtle, #f8fafc);
  border-radius: var(--radius-md, 8px);
  padding: var(--space-md, 1rem);
  border-left: 4px solid;
}

.companion-section.beneficial {
  border-left-color: var(--color-success, #48bb78);
}

.companion-section.neutral {
  border-left-color: var(--color-info, #4299e1);
}

.companion-section.avoid {
  border-left-color: var(--color-error, #f56565);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-xs, 0.5rem);
  margin: 0 0 var(--space-md, 1rem) 0;
  color: var(--color-text-primary, #2d3748);
  font-size: var(--font-size-lg, 1.125rem);
  font-weight: 600;
}

.section-icon {
  font-size: var(--font-size-lg, 1.125rem);
}

.count {
  font-size: var(--font-size-sm, 0.875rem);
  font-weight: 500;
  color: var(--color-text-muted, #a0aec0);
}

.companion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-sm, 0.75rem);
}

.companion-card {
  background: white;
  border-radius: var(--radius-sm, 6px);
  padding: var(--space-sm, 0.75rem);
  border: 1px solid var(--color-border-light, #e2e8f0);
  transition: all 0.3s ease;
}

.companion-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md, 0 4px 6px rgba(0, 0, 0, 0.1));
}

.beneficial-card:hover {
  border-color: var(--color-success, #48bb78);
}

.neutral-card:hover {
  border-color: var(--color-info, #4299e1);
}

.avoid-card:hover {
  border-color: var(--color-error, #f56565);
}

.companion-link, .companion-text {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs, 0.5rem);
  margin-bottom: var(--space-xs, 0.5rem);
  text-decoration: none;
  color: inherit;
}

.companion-link {
  cursor: pointer;
  transition: color 0.3s ease;
}

.companion-link:hover {
  color: var(--color-primary, #4a7c23);
}

.companion-icon {
  font-size: var(--font-size-lg, 1.125rem);
  flex-shrink: 0;
}

.companion-name {
  flex: 1;
  font-weight: 600;
  color: var(--color-text-primary, #2d3748);
  text-transform: capitalize;
}

.link-indicator {
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-primary, #4a7c23);
  font-weight: bold;
}

.companion-description {
  margin: 0;
  font-size: var(--font-size-xs, 0.75rem);
  color: var(--color-text-muted, #a0aec0);
  line-height: 1.4;
}

.companion-empty {
  text-align: center;
  padding: var(--space-xl, 2rem);
  color: var(--color-text-muted, #a0aec0);
}

.empty-icon {
  font-size: var(--font-size-4xl, 2.25rem);
  margin-bottom: var(--space-md, 1rem);
}

.companion-tips {
  margin-top: var(--space-lg, 1.5rem);
  padding-top: var(--space-lg, 1.5rem);
  border-top: 1px solid var(--color-border-light, #e2e8f0);
}

.companion-tips h4 {
  margin: 0 0 var(--space-md, 1rem) 0;
  color: var(--color-text-primary, #2d3748);
  font-size: var(--font-size-lg, 1.125rem);
  font-weight: 600;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--space-sm, 0.75rem);
}

.tips-list li {
  padding: var(--space-sm, 0.75rem);
  background: var(--bg-subtle, #f8fafc);
  border-radius: var(--radius-sm, 6px);
  border-left: 3px solid var(--color-primary, #4a7c23);
  font-size: var(--font-size-sm, 0.875rem);
  line-height: 1.5;
}

.tips-list strong {
  color: var(--color-primary, #4a7c23);
}

/* Responsive Design */
@media (max-width: 768px) {
  .companion-plants {
    padding: var(--space-md, 1rem);
  }
  
  .companion-grid {
    grid-template-columns: 1fr;
  }
  
  .companion-header h3 {
    font-size: var(--font-size-lg, 1.125rem);
  }
  
  .section-title {
    font-size: var(--font-size-md, 1rem);
  }
}

@media (max-width: 480px) {
  .companion-plants {
    padding: var(--space-sm, 0.75rem);
  }
  
  .companion-sections {
    gap: var(--space-md, 1rem);
  }
  
  .companion-section {
    padding: var(--space-sm, 0.75rem);
  }
}
</style>