<template>
  <div class="category-native-ad">
    <AdSenseAd 
      ad-slot="1459123495"
      ad-type="in-feed"
      ad-format="fluid"
      class="category-ad"
    />
  </div>
</template>

<script>
import AdSenseAd from './AdSenseAd.vue'

export default {
  name: 'CategoryNativeAd',
  components: {
    AdSenseAd
  }
}
</script>

<style scoped>
.category-native-ad {
  margin: 2rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.category-ad {
  width: 100%;
  min-height: 100px;
}

@media (max-width: 768px) {
  .category-native-ad {
    margin: 1.5rem 0;
    padding: 0.75rem;
  }
}
</style>