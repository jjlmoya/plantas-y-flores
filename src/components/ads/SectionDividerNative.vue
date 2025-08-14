<template>
  <AdSenseAd 
    ad-slot="7538264929"
    ad-type="native"
    container-class="section-divider-native"
  />
</template>

<script>
import AdSenseAd from './AdSenseAd.vue'

export default {
  name: 'SectionDividerNative',
  components: {
    AdSenseAd
  }
}
</script>

<style scoped>
.section-divider-native {
  text-align: center;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem 0;
  margin: 2rem 0;
}
</style>