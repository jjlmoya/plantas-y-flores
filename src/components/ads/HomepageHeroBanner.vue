<template>
  <div class="ad-container homepage-hero-banner">
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-1623099484223246"
         data-ad-slot="7632831361"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  </div>
</template>

<script>
export default {
  name: 'HomepageHeroBanner',
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

.homepage-hero-banner {
  text-align: center;
}
</style>