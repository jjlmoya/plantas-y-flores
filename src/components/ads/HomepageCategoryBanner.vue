<template>
  <div class="ad-container homepage-category-banner">
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-1623099484223246"
         data-ad-slot="7025476649"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  </div>
</template>

<script>
export default {
  name: 'HomepageCategoryBanner',
  mounted() {
    if (typeof window !== 'undefined') {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }
}
</script>

<style scoped>
.ad-container {
  margin: 2rem 0;
}

.homepage-category-banner {
  text-align: center;
  padding: 1rem 0;
}
</style>