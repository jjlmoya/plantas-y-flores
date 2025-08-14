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
  /* Comportarse como una PlantCard para mantener consistencia */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0;
  min-height: 400px;
}

.category-native-ad:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.12);
  border-color: rgba(74, 124, 35, 0.2);
}

.category-ad {
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 1.8rem;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
}

@media (max-width: 768px) {
  .category-native-ad {
    border-radius: 16px;
    min-height: 350px;
  }
  
  .category-ad {
    padding: 1.5rem 1.3rem;
    min-height: 350px;
  }
}

@media (max-width: 480px) {
  .category-native-ad {
    border-radius: 12px;
    min-height: 300px;
  }
  
  .category-ad {
    padding: 1.2rem 1rem;
    min-height: 300px;
  }
}
</style>