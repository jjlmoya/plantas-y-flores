<template>
  <AdSenseAd 
    ad-slot="7632831361"
    ad-type="hero"
    container-class="homepage-hero-banner"
  />
</template>

<script>
import AdSenseAd from './AdSenseAd.vue'

export default {
  name: 'HomepageHeroBanner',
  components: {
    AdSenseAd
  }
}
</script>

<style scoped>
.homepage-hero-banner {
  text-align: center;
}
</style>