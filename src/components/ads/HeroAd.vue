<template>
  <div class="hero-ad">
    <AdSenseAd 
      ad-slot="7632831361"
      ad-type="display"
      ad-format="horizontal"
      class="hero-banner"
    />
  </div>
</template>

<script>
import AdSenseAd from './AdSenseAd.vue'

export default {
  name: 'HeroAd',
  components: {
    AdSenseAd
  }
}
</script>

<style scoped>
.hero-ad {
  margin: 2rem auto 3rem;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.hero-banner {
  width: 100%;
  max-width: 970px;
  min-height: 90px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .hero-ad {
    margin: 1.5rem auto 2rem;
    padding: 1rem 0.5rem;
  }
  
  .hero-banner {
    min-height: 60px;
  }
}
</style>