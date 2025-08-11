<template>
  <div class="homepage-banner-ad">
    <AdSenseAd 
      ad-slot="7025476649"
      ad-type="display"
      ad-format="horizontal"
      class="banner-ad"
    />
  </div>
</template>

<script>
import AdSenseAd from './AdSenseAd.vue'

export default {
  name: 'HomepageBannerAd',
  components: {
    AdSenseAd
  }
}
</script>

<style scoped>
.homepage-banner-ad {
  margin: 2rem auto;
  text-align: center;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem;
}

.banner-ad {
  width: 100%;
  max-width: 728px;
  height: auto;
  min-height: 90px;
}

@media (max-width: 768px) {
  .banner-ad {
    min-height: 60px;
  }
}
</style>