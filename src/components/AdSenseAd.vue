<template>
  <div class="adsense-container" :class="adContainerClass">
    <div class="ad-label" v-if="showLabel">Publicidad</div>
    <div
      class="adsense-ad"
      :id="adId"
      :style="adStyle"
    ></div>
  </div>
</template>

<script setup>
import { onMounted, computed, nextTick } from 'vue';

const props = defineProps({
  adSlot: {
    type: String,
    required: true
  },
  adFormat: {
    type: String,
    default: 'auto' // auto, rectangle, horizontal, vertical
  },
  adSize: {
    type: String,
    default: '' // e.g., '300x250', '728x90', '320x50'
  },
  responsive: {
    type: Boolean,
    default: true
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  adType: {
    type: String,
    default: 'display' // display, in-article, in-feed, matched-content
  },
  className: {
    type: String,
    default: ''
  }
});

const adId = computed(() => `adsense-${props.adSlot.replace(/\//g, '-')}`);

const adContainerClass = computed(() => {
  const classes = ['adsense-wrapper'];
  if (props.className) classes.push(props.className);
  if (props.adType) classes.push(`ad-type-${props.adType}`);
  if (props.adFormat) classes.push(`ad-format-${props.adFormat}`);
  
  // Clase especial para anuncios en grid
  if (props.className === 'grid-native-ad') {
    classes.push('grid-ad-container');
  }
  
  return classes.join(' ');
});

const adStyle = computed(() => {
  const styles = {
    display: 'block'
  };
  
  if (props.adSize && !props.responsive) {
    const [width, height] = props.adSize.split('x');
    styles.width = `${width}px`;
    styles.height = `${height}px`;
  } else if (props.responsive) {
    styles.width = '100%';
    styles.minHeight = '250px';
  }
  
  return styles;
});

onMounted(async () => {
  await nextTick();
  
  // Esperar a que AdSense esté disponible
  const waitForAdSense = () => {
    return new Promise((resolve) => {
      const checkAdSense = () => {
        if (window.adsbygoogle) {
          resolve();
        } else {
          setTimeout(checkAdSense, 100);
        }
      };
      checkAdSense();
    });
  };
  
  try {
    await waitForAdSense();
    
    // Crear el elemento del anuncio
    const adElement = document.getElementById(adId.value);
    if (adElement) {
      adElement.setAttribute('data-ad-client', 'ca-pub-1623099484223246');
      adElement.setAttribute('data-ad-slot', props.adSlot);
      
      if (props.responsive) {
        adElement.setAttribute('data-ad-format', 'auto');
        adElement.setAttribute('data-full-width-responsive', 'true');
      } else {
        adElement.setAttribute('data-ad-format', props.adFormat);
      }
      
      // Configuraciones específicas por tipo
      switch (props.adType) {
        case 'in-article':
          adElement.setAttribute('data-ad-layout', 'in-article');
          adElement.setAttribute('data-ad-format', 'fluid');
          break;
        case 'in-feed':
          adElement.setAttribute('data-ad-layout', 'in-feed');
          adElement.setAttribute('data-ad-format', 'fluid');
          break;
        case 'matched-content':
          adElement.setAttribute('data-matched-content-ui-type', 'image_stacked');
          adElement.setAttribute('data-matched-content-rows-num', '2');
          adElement.setAttribute('data-matched-content-columns-num', '1');
          break;
      }
      
      adElement.className = 'adsbygoogle';
      
      // Inicializar el anuncio
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      
      // Tracking para Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'ad_impression', {
          'ad_type': props.adType,
          'ad_slot': props.adSlot,
          'event_category': 'AdSense',
          'event_label': `${props.adType} - ${props.adSlot}`
        });
      }
    }
  } catch (error) {
    console.warn('Error initializing AdSense ad:', error);
  }
});
</script>

<style scoped>
.adsense-container {
  margin: 2rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  position: relative;
  box-sizing: border-box;
}

.ad-label {
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 0.5rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 3;
  display: inline-block;
}

/* Label específico para anuncios in-feed (como las plant cards) */
.ad-type-in-feed .ad-label {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.2);
  backdrop-filter: blur(10px);
}

.adsense-ad {
  margin: 0 auto;
}

/* Tipos específicos de anuncios */
.ad-type-in-article {
  background: transparent;
  padding: 1.5rem 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  margin: 3rem 0;
}

.ad-type-in-feed {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 0;
  margin: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-height: 400px;
  position: relative;
  overflow: hidden;
}

.ad-type-in-feed:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

/* Hacer que los anuncios in-feed se vean como plant cards */
.ad-type-in-feed::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%);
  z-index: 0;
}

.ad-type-in-feed::after {
  content: '🌿';
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 4rem;
  opacity: 0.3;
  z-index: 1;
}

.ad-type-in-feed .adsense-ad {
  position: relative;
  z-index: 2;
  background: white;
  margin-top: 200px;
  padding: 1.5rem;
  border-radius: 0 0 16px 16px;
}

.ad-type-matched-content {
  background: transparent;
  padding: 0;
}

/* Formatos específicos */
.ad-format-horizontal {
  max-width: 728px;
  margin: 0 auto;
}

.ad-format-rectangle {
  max-width: 300px;
  margin: 0 auto;
}

.ad-format-vertical {
  max-width: 160px;
  margin: 0 auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .adsense-container {
    margin: 1.5rem 0;
    padding: 0.75rem;
  }
  
  .ad-format-horizontal .adsense-ad {
    max-width: 320px;
    height: 50px;
  }
  
  .ad-type-in-feed {
    min-height: 320px;
  }
  
  .ad-type-in-feed::before {
    height: 150px;
  }
  
  .ad-type-in-feed::after {
    top: 60px;
    font-size: 3rem;
  }
  
  .ad-type-in-feed .adsense-ad {
    margin-top: 150px;
    padding: 1rem;
  }
  
  .ad-type-in-feed .ad-label {
    top: 0.75rem;
    right: 0.75rem;
    font-size: 0.65rem;
    padding: 0.2rem 0.6rem;
  }
}

@media (max-width: 480px) {
  .adsense-container {
    margin: 1rem 0;
    padding: 0.5rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .adsense-container {
    background: #2d3748;
  }
  
  .ad-label {
    color: #a0aec0;
  }
  
  .ad-type-in-feed {
    background: #1a202c;
    border-color: #4a5568;
  }
}

/* Hover effects for better UX */
.ad-type-in-feed:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

/* Estilos específicos para anuncios en grid */
.grid-ad-container.adsense-container {
  margin: 0;
  padding: 0;
  background: none;
  border-radius: 0;
  border: none;
  box-shadow: none;
  height: 100%;
  display: block;
}

.grid-ad-container .ad-label {
  position: static;
  background: none;
  border: none;
  backdrop-filter: none;
  padding: 0;
  margin: 0;
  display: none; /* Se mostrará con :deep() desde PlantGrid */
}

.grid-ad-container .adsense-ad {
  margin: 0;
  padding: 0;
  min-height: auto;
}

/* Loading state */
.adsense-ad:empty::after {
  content: "Cargando anuncio...";
  display: block;
  padding: 2rem;
  color: #999;
  font-size: 0.9rem;
  font-style: italic;
}
</style>