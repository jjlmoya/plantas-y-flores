<template>
  <AdSenseAd 
    ad-slot="8980721998"
    ad-type="sidebar"
    :width="320"
    :height="250"
    is-responsive="false"
    container-class="sidebar-rectangle"
  />
</template>

<script>
import AdSenseAd from './AdSenseAd.vue'

export default {
  name: 'SidebarRectangle',
  components: {
    AdSenseAd
  }
}
</script>

<style scoped>
.sidebar-rectangle {
  text-align: center;
  max-width: 320px;
  margin: 1rem 0;
}

@media (max-width: 768px) {
  .sidebar-rectangle {
    max-width: 100%;
  }
}
</style>