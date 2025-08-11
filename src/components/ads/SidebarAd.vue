<template>
  <div class="sidebar-ad">
    <AdSenseAd 
      ad-slot="8980721998"
      ad-type="display"
      ad-format="rectangle"
      :width="300"
      :height="250"
      class="sidebar-rectangle"
    />
  </div>
</template>

<script>
import AdSenseAd from './AdSenseAd.vue'

export default {
  name: 'SidebarAd',
  components: {
    AdSenseAd
  }
}
</script>

<style scoped>
.sidebar-ad {
  margin: 2rem 0;
  padding: 1rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
  text-align: center;
}

.sidebar-rectangle {
  width: 100%;
  max-width: 300px;
  height: 250px;
}

@media (max-width: 992px) {
  .sidebar-ad {
    display: none;
  }
}

@media (max-width: 1200px) {
  .sidebar-rectangle {
    max-width: 250px;
    height: 200px;
  }
}
</style>