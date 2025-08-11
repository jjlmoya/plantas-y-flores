<template>
  <div class="section-divider-ad">
    <AdSenseAd 
      ad-slot="7538264929"
      ad-type="in-feed"
      ad-format="fluid"
      class="divider-ad"
    />
  </div>
</template>

<script>
import AdSenseAd from './AdSenseAd.vue'

export default {
  name: 'SectionDividerAd',
  components: {
    AdSenseAd
  }
}
</script>

<style scoped>
.section-divider-ad {
  margin: 3rem auto;
  padding: 2rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-top: 2px solid #e9ecef;
  border-bottom: 2px solid #e9ecef;
  text-align: center;
}

.divider-ad {
  width: 100%;
  min-height: 120px;
  max-width: 728px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .section-divider-ad {
    margin: 2rem auto;
    padding: 1rem 0.5rem;
  }
  
  .divider-ad {
    min-height: 100px;
  }
}
</style>