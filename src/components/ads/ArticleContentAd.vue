<template>
  <div class="article-content-ad">
    <AdSenseAd 
      ad-slot="6785803497"
      ad-type="in-article"
      ad-format="fluid"
      class="article-ad"
    />
  </div>
</template>

<script>
import AdSenseAd from './AdSenseAd.vue'

export default {
  name: 'ArticleContentAd',
  components: {
    AdSenseAd
  }
}
</script>

<style scoped>
.article-content-ad {
  margin: 3rem auto;
  padding: 2rem 1rem;
  text-align: center;
  background: #fafafa;
  border-radius: 8px;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.article-ad {
  width: 100%;
  min-height: 120px;
  max-width: 600px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .article-content-ad {
    margin: 2rem auto;
    padding: 1rem 0.5rem;
  }
  
  .article-ad {
    min-height: 100px;
  }
}
</style>