<template>
  <AdSenseAd 
    ad-slot="7025476649"
    ad-type="display"
    container-class="homepage-category-banner"
  />
</template>

<script>
import AdSenseAd from './AdSenseAd.vue'

export default {
  name: 'HomepageCategoryBanner',
  components: {
    AdSenseAd
  }
}
</script>

<style scoped>
.homepage-category-banner {
  text-align: center;
  padding: 1rem 0;
  margin: 2rem 0;
}
</style>