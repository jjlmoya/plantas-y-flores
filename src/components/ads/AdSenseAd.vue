<template>
  <div 
    v-if="shouldShowAd" 
    class="adsense-container" 
    :class="adClass"
  >
    <ins
      ref="adElement"
      class="adsbygoogle"
      :style="adStyle"
      :data-ad-client="adClient"
      :data-ad-slot="adSlot"
      :data-ad-format="adFormat"
      :data-full-width-responsive="isResponsive"
    ></ins>
    
    <!-- Loading placeholder -->
    <div v-if="isLoading" class="ad-loading">
      <div class="loading-skeleton"></div>
    </div>
    
    <!-- Error fallback -->
    <div v-if="hasError" class="ad-error">
      <small>Contenido patrocinado no disponible</small>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdSenseAd',
  props: {
    adSlot: {
      type: String,
      required: true
    },
    adFormat: {
      type: String,
      default: 'auto'
    },
    adType: {
      type: String,
      default: 'display',
      validator: value => ['display', 'in-feed', 'in-article', 'hero', 'sidebar', 'native'].includes(value)
    },
    width: {
      type: [String, Number],
      default: null
    },
    height: {
      type: [String, Number], 
      default: null
    },
    isResponsive: {
      type: String,
      default: 'true'
    },
    containerClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      shouldShowAd: false,
      isLoading: false,
      hasError: false,
      retryCount: 0,
      maxRetries: 3,
      consentListener: null
    }
  },
  computed: {
    adClient() {
      return 'ca-pub-1623099484223246'
    },
    adClass() {
      return [
        `ad-${this.adType}`,
        this.containerClass
      ].filter(Boolean).join(' ')
    },
    adStyle() {
      const style = { display: 'block' }
      if (this.width) style.width = typeof this.width === 'number' ? `${this.width}px` : this.width
      if (this.height) style.height = typeof this.height === 'number' ? `${this.height}px` : this.height
      return style
    }
  },
  mounted() {
    this.initializeAd()
    this.setupConsentListener()
  },
  beforeUnmount() {
    this.cleanup()
  },
  methods: {
    initializeAd() {
      if (!this.checkConsent()) {
        return
      }
      
      this.shouldShowAd = true
      this.$nextTick(() => {
        this.loadAd()
      })
    },

    checkConsent() {
      try {
        if (typeof window === 'undefined') return false
        
        // Check global consent flag first (set by GDPR component)
        if (window.adConsentGiven === true) {
          return true
        }
        
        // Check localStorage consent
        const consent = localStorage.getItem('gdpr-consent')
        if (!consent) return false
        
        const consentData = JSON.parse(consent)
        return consentData.preferences?.advertising === true
        
      } catch (e) {
        console.warn('AdSense consent check failed:', e)
        return false
      }
    },

    setupConsentListener() {
      // Listen for consent changes
      this.consentListener = () => {
        if (this.checkConsent() && !this.shouldShowAd) {
          this.initializeAd()
        } else if (!this.checkConsent() && this.shouldShowAd) {
          this.shouldShowAd = false
        }
      }
      
      if (typeof window !== 'undefined') {
        window.addEventListener('gdpr-consent-updated', this.consentListener)
        document.addEventListener('gdpr-consent-updated', this.consentListener)
      }
    },

    async loadAd() {
      if (!this.shouldShowAd) return
      
      try {
        this.isLoading = true
        this.hasError = false
        
        // Wait for AdSense script to be available
        await this.waitForAdSense()
        
        // Initialize the ad
        if (window.adsbygoogle && this.$refs.adElement) {
          (window.adsbygoogle = window.adsbygoogle || []).push({})
        }
        
        this.isLoading = false
        
      } catch (error) {
        console.error('AdSense load error:', error)
        this.handleAdError()
      }
    },

    async waitForAdSense(timeout = 10000) {
      const start = Date.now()
      
      // Check if script failed to load
      if (window.adsenseLoadError) {
        throw new Error('AdSense script failed to load')
      }
      
      // Wait for script or timeout
      while (!window.adsbygoogle && !window.adsenseLoadError && (Date.now() - start < timeout)) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      if (window.adsenseLoadError) {
        throw new Error('AdSense script failed to load')
      }
      
      if (!window.adsbygoogle) {
        throw new Error('AdSense script not loaded within timeout')
      }
    },

    handleAdError() {
      this.isLoading = false
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++
        setTimeout(() => {
          this.loadAd()
        }, 2000 * this.retryCount)
      } else {
        this.hasError = true
      }
    },

    cleanup() {
      if (this.consentListener && typeof window !== 'undefined') {
        window.removeEventListener('gdpr-consent-updated', this.consentListener)
        document.removeEventListener('gdpr-consent-updated', this.consentListener)
      }
    }
  }
}
</script>

<style scoped>
.adsense-container {
  position: relative;
  margin: 1rem 0;
  text-align: center;
  min-height: 50px;
}

.ad-display {
  margin: 2rem auto;
}

.ad-in-feed {
  margin: 1.5rem 0;
}

.ad-in-article {
  margin: 2rem auto;
  max-width: 100%;
}

.ad-hero {
  margin: 1rem 0;
}

.ad-sidebar {
  margin: 1rem 0;
  max-width: 320px;
}

.ad-native {
  margin: 2rem 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem 0;
}

.adsbygoogle {
  display: block;
  text-align: center;
}

.ad-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}

.loading-skeleton {
  width: 100%;
  height: 100px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.ad-error {
  padding: 2rem;
  color: #666;
  background: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes loading {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@media (max-width: 768px) {
  .ad-sidebar {
    max-width: 100%;
  }
  
  .ad-sidebar .adsbygoogle {
    width: 100% !important;
    height: auto !important;
  }
}
</style>