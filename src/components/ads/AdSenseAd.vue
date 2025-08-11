<template>
  <div class="adsense-container" :class="adClass">
    <ins
      class="adsbygoogle"
      :style="adStyle"
      :data-ad-client="adClient"
      :data-ad-slot="adSlot"
      :data-ad-format="adFormat"
      :data-full-width-responsive="isResponsive"
    ></ins>
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
      validator: value => ['display', 'in-feed', 'in-article'].includes(value)
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
    }
  },
  computed: {
    adClient() {
      return 'ca-pub-1623099484223246'
    },
    adClass() {
      return `ad-${this.adType}`
    },
    adStyle() {
      const style = { display: 'block' }
      if (this.width) style.width = typeof this.width === 'number' ? `${this.width}px` : this.width
      if (this.height) style.height = typeof this.height === 'number' ? `${this.height}px` : this.height
      return style
    }
  },
  mounted() {
    this.checkConsentAndLoadAd()
  },
  methods: {
    checkConsentAndLoadAd() {
      try {
        if (typeof window !== 'undefined') {
          // Check for GDPR consent
          const consent = localStorage.getItem('gdpr-consent')
          let hasAdConsent = false
          
          if (consent) {
            const consentData = JSON.parse(consent)
            hasAdConsent = consentData.preferences && consentData.preferences.advertising
          }
          
          // Only load ads if consent given or if global consent flag is set
          if (hasAdConsent || window.adConsentGiven) {
            if (window.adsbygoogle) {
              (window.adsbygoogle = window.adsbygoogle || []).push({})
            }
          }
        }
      } catch (e) {
        console.log('AdSense error:', e)
      }
    }
  }
}
</script>

<style scoped>
.adsense-container {
  margin: 1rem 0;
  text-align: center;
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

.adsbygoogle {
  display: block;
  text-align: center;
}
</style>