<template>
  <section class="novedades-recientes" v-if="news.length > 0">
    <div class="section-header">
      <div class="header-content">
        <h2 class="section-title">
          <span class="emoji">✨</span>
          Novedades Recientes
        </h2>
        <p class="section-subtitle">
          Descubre las últimas mejoras que hemos hecho para ti
        </p>
      </div>
      <a href="/novedades/" class="ver-todas-btn">
        Ver todas
        <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </a>
    </div>

    <div class="novedades-grid">
      <article 
        v-for="item in recentNews" 
        :key="item.id"
        class="novedad-card"
        :class="{ 'destacada': item.destacado }"
      >
        <div class="card-header">
          <span class="categoria-tag" :class="`categoria-${item.categoria.toLowerCase()}`">
            {{ item.etiqueta }}
          </span>
          <time class="fecha" :datetime="item.fecha">
            {{ formatDate(item.fecha) }}
          </time>
        </div>

        <div class="card-content">
          <h3 class="novedad-titulo">{{ item.titulo }}</h3>
          <p class="novedad-texto">{{ item.texto }}</p>
        </div>

        <div class="card-footer" v-if="item.boton">
          <a :href="item.boton.url" class="novedad-btn">
            {{ item.boton.texto }}
            <svg class="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        <!-- Featured indicator -->
        <div v-if="item.destacado" class="destacado-badge">
          ⭐ Nuevo
        </div>
      </article>
    </div>

    <!-- Call to action -->
    <div class="cta-section">
      <p class="cta-text">¿Quieres estar al día de todas nuestras mejoras?</p>
      <a href="/novedades/" class="cta-btn">
        Ver historial completo
      </a>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const news = ref([])

// Load news items
const loadNews = async () => {
  try {
    // Try loading from local API first
    const response = await fetch('/data/novedades.json')
    if (response.ok) {
      const data = await response.json()
      news.value = data
    } else {
      // Fallback for development/build
      news.value = []
    }
  } catch (error) {
    console.warn('Could not load news:', error)
    news.value = []
  }
}

// Get only the 3 most recent news items
const recentNews = computed(() => {
  return news.value
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 3)
})

// Format date in Spanish
const formatDate = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short',
    year: 'numeric' 
  })
}

onMounted(() => {
  loadNews()
})
</script>

<style scoped>
.novedades-recientes {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 3rem 2rem;
  border-radius: 16px;
  margin: 3rem 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.header-content {
  flex: 1;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.emoji {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.section-subtitle {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
}

.ver-todas-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #10b981;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.ver-todas-btn:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.novedades-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.novedad-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.novedad-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.novedad-card.destacada {
  border-left: 4px solid #10b981;
  box-shadow: 0 4px 6px rgba(16, 185, 129, 0.1);
}

.novedad-card.destacada:hover {
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.categoria-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.categoria-producto { background: #dbeafe; color: #1e40af; }
.categoria-servicio { background: #f3e8ff; color: #7c3aed; }
.categoria-experiencia { background: #d1fae5; color: #065f46; }
.categoria-sostenibilidad { background: #fef3c7; color: #92400e; }

.fecha {
  font-size: 0.8rem;
  color: #64748b;
}

.card-content {
  margin-bottom: 1.5rem;
}

.novedad-titulo {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.novedad-texto {
  color: #475569;
  line-height: 1.6;
  margin: 0;
  font-size: 0.9rem;
}

.card-footer {
  margin-top: auto;
}

.novedad-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  color: #475569;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
}

.novedad-btn:hover {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.btn-arrow {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}

.novedad-btn:hover .btn-arrow {
  transform: translateX(2px);
}

.destacado-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #10b981;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.cta-section {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(226, 232, 240, 0.6);
}

.cta-text {
  color: #475569;
  margin: 0 0 1rem 0;
  font-size: 1rem;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* Mobile Styles */
@media (max-width: 768px) {
  .novedades-recientes {
    padding: 2rem 1.5rem;
    margin: 2rem 0;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .novedades-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .ver-todas-btn {
    align-self: flex-start;
  }
}

@media (max-width: 480px) {
  .novedades-recientes {
    padding: 1.5rem 1rem;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .novedad-card {
    padding: 1.25rem;
  }
}
</style>