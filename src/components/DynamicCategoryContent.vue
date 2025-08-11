<template>
  <div class="category-content-wrapper">
    <div class="content-body" v-html="processedContent"></div>
  </div>
</template>

<script>
export default {
  name: 'DynamicCategoryContent',
  props: {
    content: {
      type: String,
      default: ''
    },
    plants: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    processedContent() {
      return this.processContentHTML(this.content, this.plants);
    }
  },
  methods: {
    processContentHTML(content, plants) {
      if (!content) return '';
      
      let processedContent = content;
      
      // JSON ya está limpio, solo procesamiento básico de imágenes
      
      // Buscar imágenes seguidas de texto libre que actúa como pie de foto
      // Patrón: <img ...> TextoLibre <h2|h3|<p>|<ul>
      processedContent = processedContent.replace(
        /<img\s+([^>]*src="[^"]*"[^>]*)\s*\/?>(?:\s*<\/img>)?\s*([^<]+?)(?=\s*<[h2|h3|p|ul|ol|div])/gi,
        (match, imgAttrs, captionText) => {
          // Limpiar el texto del caption
          const cleanCaption = captionText.trim();
          
          return `<figure class="content-image">
            <img ${imgAttrs} />
            <figcaption>${cleanCaption}</figcaption>
          </figure>`;
        }
      );
      
      // Procesar imágenes restantes que no tienen texto libre después
      processedContent = processedContent.replace(
        /<img\s+([^>]*src="[^"]*"[^>]*)\s*\/?>(?:\s*<\/img>)?/gi,
        (match, imgAttrs) => {
          return `<figure class="content-image">
            <img ${imgAttrs} />
          </figure>`;
        }
      );
      
      
      return processedContent;
    }
  }
}
</script>

<style scoped>
.category-content-wrapper {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.content-body {
  padding: 3rem 2.5rem;
  line-height: 1.8;
  font-size: 1.05rem;
  color: #374151;
}

/* Tipografía mejorada */
.category-content-wrapper :deep(h2) {
  color: #1f2937;
  font-size: 2rem;
  font-weight: 800;
  margin: 3rem 0 1.5rem 0;
  line-height: 1.3;
  position: relative;
  padding-bottom: 0.75rem;
}

.category-content-wrapper :deep(h2::after) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #4a7c23 0%, #2d5016 100%);
  border-radius: 2px;
}

.category-content-wrapper :deep(h3) {
  color: #4a7c23;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 2.5rem 0 1rem 0;
  line-height: 1.4;
}

.category-content-wrapper :deep(p) {
  margin: 1.25rem 0;
  color: #4b5563;
  line-height: 1.8;
  text-align: justify;
}

/* Imágenes mejoradas con figure y figcaption */
.category-content-wrapper :deep(.content-image) {
  margin: 2rem auto;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  max-width: 500px;
  width: fit-content;
}

.category-content-wrapper :deep(.content-image:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
}

.category-content-wrapper :deep(.content-image img) {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.category-content-wrapper :deep(.content-image:hover img) {
  transform: scale(1.01);
}

.category-content-wrapper :deep(.content-image figcaption) {
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  color: #6b7280;
  font-size: 0.9rem;
  font-style: italic;
  text-align: center;
  border-top: 1px solid #e5e7eb;
}

/* Listas regulares mejoradas */
.category-content-wrapper :deep(ul:not(.dynamic-plants-list)) {
  margin: 1.5rem 0;
  padding: 0;
  list-style: none;
}

.category-content-wrapper :deep(ul:not(.dynamic-plants-list) li) {
  position: relative;
  margin: 0.75rem 0;
  padding-left: 1.75rem;
  color: #4b5563;
  line-height: 1.7;
}

.category-content-wrapper :deep(ul:not(.dynamic-plants-list) li::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0.75rem;
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #4a7c23 0%, #2d5016 100%);
  border-radius: 50%;
  transform: translateY(-50%);
}

.category-content-wrapper :deep(ol) {
  margin: 1.5rem 0;
  padding-left: 1.5rem;
  counter-reset: custom-counter;
}

.category-content-wrapper :deep(ol li) {
  position: relative;
  margin: 0.75rem 0;
  padding-left: 0.5rem;
  color: #4b5563;
  line-height: 1.7;
  counter-increment: custom-counter;
  list-style: none;
}

.category-content-wrapper :deep(ol li::before) {
  content: counter(custom-counter);
  position: absolute;
  left: -1.5rem;
  top: 0;
  background: linear-gradient(135deg, #4a7c23 0%, #2d5016 100%);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Enlaces mejorados */
.category-content-wrapper :deep(a:not(.read-more-btn)) {
  color: #4a7c23;
  text-decoration: none;
  font-weight: 600;
  position: relative;
  transition: all 0.3s ease;
}

.category-content-wrapper :deep(a:not(.read-more-btn)::after) {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background: linear-gradient(135deg, #4a7c23 0%, #2d5016 100%);
  transition: width 0.3s ease;
}

.category-content-wrapper :deep(a:not(.read-more-btn):hover) {
  color: #2d5016;
}

.category-content-wrapper :deep(a:not(.read-more-btn):hover::after) {
  width: 100%;
}

/* Listas dinámicas de plantas mejoradas */
.category-content-wrapper :deep(.dynamic-plants-list) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin: 2.5rem 0;
  padding: 0;
  list-style: none;
}

.category-content-wrapper :deep(.dynamic-plant-item) {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.75rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.category-content-wrapper :deep(.dynamic-plant-item::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #4a7c23 0%, #2d5016 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.category-content-wrapper :deep(.dynamic-plant-item:hover) {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(74, 124, 35, 0.15);
  border-color: #4a7c23;
}

.category-content-wrapper :deep(.dynamic-plant-item:hover::before) {
  transform: scaleX(1);
}

.category-content-wrapper :deep(.dynamic-plant-item h3) {
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  line-height: 1.3;
}

.category-content-wrapper :deep(.dynamic-plant-item h3 a) {
  color: #1f2937;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.3s ease;
}

.category-content-wrapper :deep(.dynamic-plant-item:hover h3 a) {
  color: #4a7c23;
}

.category-content-wrapper :deep(.dynamic-plant-item p) {
  margin: 1rem 0 1.5rem 0;
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.6;
}

.category-content-wrapper :deep(.read-more-btn) {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #4a7c23 0%, #2d5016 100%);
  color: white !important;
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.category-content-wrapper :deep(.read-more-btn::after) {
  content: '→';
  transition: transform 0.3s ease;
}

.category-content-wrapper :deep(.read-more-btn:hover) {
  transform: translateX(2px);
  box-shadow: 0 8px 20px rgba(74, 124, 35, 0.3);
}

.category-content-wrapper :deep(.read-more-btn:hover::after) {
  transform: translateX(4px);
}

/* Responsive */
@media (max-width: 768px) {
  .content-body {
    padding: 2rem 1.5rem;
    font-size: 1rem;
  }
  
  .category-content-wrapper :deep(h2) {
    font-size: 1.75rem;
    margin: 2.5rem 0 1.25rem 0;
  }
  
  .category-content-wrapper :deep(h3) {
    font-size: 1.25rem;
    margin: 2rem 0 0.75rem 0;
  }
  
  .category-content-wrapper :deep(.dynamic-plants-list) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .category-content-wrapper :deep(.dynamic-plant-item) {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .content-body {
    padding: 1.5rem 1rem;
  }
  
  .category-content-wrapper :deep(.content-image) {
    margin: 1.5rem 0;
    max-width: 100%;
    border-radius: 8px;
  }
  
  .category-content-wrapper :deep(.content-image img) {
    max-height: 250px;
  }
}
</style>