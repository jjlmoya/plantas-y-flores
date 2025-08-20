<template>
  <div v-if="showBanner" class="gdpr-banner" :class="{ 'gdpr-banner--mobile': isMobile }">
    <div class="gdpr-content">
      <div class="gdpr-text">
        <p>
          <strong>🍪 Este sitio usa cookies</strong> para mejorar tu experiencia y mostrar contenido personalizado.
        </p>
      </div>
      
      <div class="gdpr-buttons">
        <button @click="acceptAll" class="btn btn-accept">
          {{ texts.acceptButton }}
        </button>
        <button @click="toggleSettings" class="btn btn-configure">
          {{ texts.settingsButton }}
        </button>
        <button v-if="isStrictCountry" @click="rejectAll" class="btn btn-reject">
          {{ texts.rejectButton }}
        </button>
      </div>
    </div>

    <!-- Settings Panel -->
    <div v-if="showSettings" class="gdpr-settings">
      <div class="gdpr-settings-content">
        <h4>Configuración de Cookies</h4>
        
        <div class="cookie-category">
          <div class="cookie-header">
            <h5>Cookies Esenciales</h5>
            <span class="required">Requeridas</span>
          </div>
          <p>Necesarias para el funcionamiento básico del sitio web.</p>
          <label class="toggle">
            <input type="checkbox" checked disabled>
            <span class="slider disabled"></span>
          </label>
        </div>

        <div class="cookie-category">
          <div class="cookie-header">
            <h5>Cookies Analíticas</h5>
          </div>
          <p>Nos ayudan a entender cómo interactúas con el sitio.</p>
          <label class="toggle">
            <input type="checkbox" v-model="preferences.analytics">
            <span class="slider"></span>
          </label>
        </div>

        <div class="cookie-category">
          <div class="cookie-header">
            <h5>Cookies de Publicidad</h5>
          </div>
          <p>Permiten mostrar anuncios personalizados.</p>
          <label class="toggle">
            <input type="checkbox" v-model="preferences.advertising">
            <span class="slider"></span>
          </label>
        </div>

        <div class="gdpr-settings-buttons">
          <button @click="savePreferences" class="btn btn-save">Guardar</button>
          <button @click="toggleSettings" class="btn btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { detectUserCountry, isGdprRequired, isStrictPrivacyRequired, getPrivacyTexts, cookieConsent } from '../utils/gdpr.js';

export default {
  name: 'GDPRConsent',
  data() {
    return {
      showBanner: false,
      showSettings: false,
      isMobile: false,
      userCountry: 'US',
      isGdprCountry: false,
      isStrictCountry: false,
      texts: {
        title: 'Política de Privacidad y Cookies',
        message: 'Este sitio web utiliza cookies para mejorar tu experiencia de navegación.',
        acceptButton: 'Acepto',
        rejectButton: 'Rechazar',
        settingsButton: 'Configurar'
      },
      preferences: {
        analytics: false,
        advertising: false
      }
    }
  },
  async mounted() {
    await this.initializeGdpr()
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },
  methods: {
    async initializeGdpr() {
      try {
        // Check if consent already exists and is valid
        if (cookieConsent.hasConsent() && cookieConsent.isConsentValid()) {
          this.applyStoredConsent()
          return
        }

        // Detect user's country
        this.userCountry = await detectUserCountry()
        this.isGdprCountry = isGdprRequired(this.userCountry)
        this.isStrictCountry = isStrictPrivacyRequired(this.userCountry)
        this.texts = getPrivacyTexts(this.userCountry)

        // Auto-accept for non-GDPR countries (Spanish-speaking countries mainly)
        if (!this.isGdprCountry && !this.isStrictCountry) {
          this.autoAccept()
          return
        }

        // Show banner for GDPR/strict privacy countries
        this.showBanner = true

      } catch (error) {
        console.error('GDPR initialization failed:', error)
        // Fallback: auto-accept if detection fails
        this.autoAccept()
      }
    },

    autoAccept() {
      this.preferences.analytics = true
      this.preferences.advertising = true
      
      const autoConsent = {
        necessary: true,
        analytics: true,
        advertising: true,
        autoAccepted: true,
        country: this.userCountry,
        preferences: this.preferences
      }
      
      cookieConsent.setConsent(autoConsent)
      
      // Set global consent for AdSense
      if (typeof window !== 'undefined') {
        window.adConsentGiven = true
        
        // Dispatch consent events for ad components
        const consentEvent = new CustomEvent('gdpr-consent-updated', {
          detail: this.preferences
        })
        window.dispatchEvent(consentEvent)
        document.dispatchEvent(consentEvent)
      }
      
      this.loadScripts()
    },

    applyStoredConsent() {
      const stored = cookieConsent.getConsent()
      if (stored && stored.preferences) {
        this.preferences = stored.preferences
        
        // Set global consent for AdSense
        if (typeof window !== 'undefined') {
          window.adConsentGiven = this.preferences.advertising
          
          // Dispatch consent events for ad components
          const consentEvent = new CustomEvent('gdpr-consent-updated', {
            detail: this.preferences
          })
          window.dispatchEvent(consentEvent)
          document.dispatchEvent(consentEvent)
        }
        
        this.loadScripts()
      }
    },

    checkConsentStatus() {
      const consent = localStorage.getItem('gdpr-consent')
      if (!consent) {
        this.showBanner = true
      } else {
        const consentData = JSON.parse(consent)
        this.preferences = consentData.preferences
        this.loadScripts()
      }
    },
    
    checkMobile() {
      this.isMobile = window.innerWidth < 768
    },
    
    acceptAll() {
      this.preferences.analytics = true
      this.preferences.advertising = true
      this.saveConsentAndHide()
    },
    
    rejectAll() {
      this.preferences.analytics = false
      this.preferences.advertising = false
      this.saveConsentAndHide()
    },
    
    toggleSettings() {
      this.showSettings = !this.showSettings
    },
    
    savePreferences() {
      this.saveConsentAndHide()
      this.showSettings = false
    },
    
    saveConsentAndHide() {
      const consentData = {
        necessary: true,
        analytics: this.preferences.analytics,
        advertising: this.preferences.advertising,
        country: this.userCountry,
        preferences: this.preferences
      }
      
      cookieConsent.setConsent(consentData)
      
      // Legacy support
      localStorage.setItem('gdpr-consent', JSON.stringify({
        timestamp: Date.now(),
        preferences: this.preferences
      }))
      
      this.showBanner = false
      this.loadScripts()
      
      // Emit events for other components
      this.$emit('consent-updated', this.preferences)
      
      // Set global consent for AdSense
      if (typeof window !== 'undefined') {
        window.adConsentGiven = this.preferences.advertising
        
        // Dispatch consent events for ad components
        const consentEvent = new CustomEvent('gdpr-consent-updated', {
          detail: this.preferences
        })
        window.dispatchEvent(consentEvent)
        document.dispatchEvent(consentEvent)
      }
    },
    
    loadScripts() {
      if (this.preferences.advertising) {
        this.loadAdSense()
      }
      
      // Always update analytics consent (granted or denied)
      if (typeof window !== 'undefined' && window.updateAnalyticsConsent) {
        window.updateAnalyticsConsent(this.preferences.analytics)
      }
    },
    
    loadAdSense() {
      if (typeof window !== 'undefined' && !window.adsbygoogle && !document.querySelector('script[src*="adsbygoogle"]')) {
        const script = document.createElement('script')
        script.async = true
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1623099484223246'
        script.crossOrigin = 'anonymous'
        
        // Add error handling for script loading
        script.onerror = () => {
          console.warn('AdSense script failed to load')
          window.adsenseLoadError = true
        }
        
        script.onload = () => {
          window.adsenseLoaded = true
          
          // Notify all ad components that script is ready
          const scriptLoadedEvent = new CustomEvent('adsense-script-loaded')
          window.dispatchEvent(scriptLoadedEvent)
          document.dispatchEvent(scriptLoadedEvent)
        }
        
        document.head.appendChild(script)
      }
    },
    
    loadGoogleAnalytics() {
      if (typeof window !== 'undefined' && window.updateAnalyticsConsent) {
        window.updateAnalyticsConsent(true)
      }
    }
  }
}
</script>

<style scoped>
.gdpr-banner {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.98);
  color: #2c3e50;
  z-index: 9999;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 16px;
  max-width: 420px;
  animation: slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.gdpr-banner--mobile {
  position: fixed;
  bottom: 10px;
  left: 10px;
  right: 10px;
  max-width: none;
}

.gdpr-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.gdpr-text p {
  margin: 0;
  line-height: 1.5;
  color: #2c3e50;
  font-size: 0.95rem;
}

.gdpr-text strong {
  color: #1a1a1a;
}

.gdpr-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  white-space: nowrap;
}

.btn-accept {
  background: #10B981;
  color: white;
}

.btn-accept:hover {
  background: #059669;
  transform: translateY(-1px);
}

.btn-configure {
  background: transparent;
  color: #6B7280;
  border: 1px solid #D1D5DB;
}

.btn-configure:hover {
  background: #F3F4F6;
  color: #374151;
}

.btn-reject {
  background: transparent;
  color: #6B7280;
  border: 1px solid #D1D5DB;
}

.btn-reject:hover {
  background: #FEF2F2;
  color: #DC2626;
  border-color: #FCA5A5;
}

.gdpr-settings {
  background: rgba(255, 255, 255, 0.98);
  border-top: 1px solid #E5E7EB;
  border-radius: 0 0 16px 16px;
  animation: slideDown 0.3s ease-out;
  backdrop-filter: blur(10px);
}

.gdpr-settings-content {
  padding: 1.5rem;
}

.gdpr-settings-content h4 {
  margin: 0 0 1.5rem 0;
  color: #1F2937;
  font-size: 1.1rem;
  font-weight: 600;
}

.cookie-category {
  background: #F9FAFB;
  padding: 1rem;
  margin: 0.75rem 0;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.cookie-header {
  flex: 1;
  margin-right: 1rem;
}

.cookie-header h5 {
  margin: 0 0 0.25rem 0;
  color: #1F2937;
  font-size: 0.9rem;
  font-weight: 600;
}

.required {
  background: #F59E0B;
  color: white;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  margin-left: 0.5rem;
}

.cookie-category p {
  margin: 0;
  color: #6B7280;
  line-height: 1.4;
  font-size: 0.8rem;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #D1D5DB;
  transition: 0.3s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

input:checked + .slider {
  background-color: #10B981;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.slider.disabled {
  background-color: #9CA3AF;
  cursor: not-allowed;
}

.gdpr-settings-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
}

.btn-save {
  background: #10B981;
  color: white;
}

.btn-save:hover {
  background: #059669;
}

.btn-cancel {
  background: transparent;
  color: #6B7280;
  border: 1px solid #D1D5DB;
}

.btn-cancel:hover {
  background: #F3F4F6;
  color: #374151;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .gdpr-banner {
    bottom: 10px;
    left: 10px;
    right: 10px;
    max-width: none;
  }
  
  .gdpr-content {
    padding: 1rem;
  }
  
  .gdpr-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .btn {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
  
  .gdpr-settings-content {
    padding: 1rem;
  }
  
  .cookie-category {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .cookie-header {
    margin-right: 0;
  }
  
  .gdpr-settings-buttons {
    flex-direction: column;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(100px) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 400px;
    opacity: 1;
  }
}
</style>