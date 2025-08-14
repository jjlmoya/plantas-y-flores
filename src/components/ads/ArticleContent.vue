<template>
  <AdSenseAd 
    ad-slot="6785803497"
    ad-type="in-article"
    container-class="article-content"
  />
</template>

<script>
import AdSenseAd from './AdSenseAd.vue'

export default {
  name: 'ArticleContent',
  components: {
    AdSenseAd
  }
}
</script>

<style scoped>
.article-content {
  text-align: center;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin: 2rem 0;
}
</style>