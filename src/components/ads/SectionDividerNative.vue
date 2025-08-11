<template>
  <div class="ad-container section-divider-native">
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-1623099484223246"
         data-ad-slot="7538264929"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  </div>
</template>

<script>
export default {
  name: 'SectionDividerNative',
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

.section-divider-native {
  text-align: center;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem 0;
}
</style>