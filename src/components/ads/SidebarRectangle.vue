<template>
  <div class="ad-container sidebar-rectangle">
    <ins class="adsbygoogle"
         style="display:inline-block;width:320px;height:250px"
         data-ad-client="ca-pub-1623099484223246"
         data-ad-slot="8980721998"></ins>
  </div>
</template>

<script>
export default {
  name: 'SidebarRectangle',
  mounted() {
    if (typeof window !== 'undefined') {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }
}
</script>

<style scoped>
.ad-container {
  margin: 1rem 0;
}

.sidebar-rectangle {
  text-align: center;
  max-width: 320px;
}

@media (max-width: 768px) {
  .sidebar-rectangle {
    max-width: 100%;
  }
  
  .sidebar-rectangle .adsbygoogle {
    width: 100% !important;
    height: auto !important;
  }
}
</style>