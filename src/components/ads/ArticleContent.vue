<template>
  <div class="ad-container article-content">
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-1623099484223246"
         data-ad-slot="6785803497"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  </div>
</template>

<script>
export default {
  name: 'ArticleContent',
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

.article-content {
  text-align: center;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>