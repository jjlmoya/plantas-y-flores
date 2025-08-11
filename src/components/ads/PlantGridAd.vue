<template>
  <div class="plant-grid-ad">
    <AdSenseAd 
      :ad-slot="adSlot"
      ad-type="in-feed"
      ad-format="fluid"
      class="plant-ad"
    />
  </div>
</template>

<script>
import AdSenseAd from './AdSenseAd.vue'

export default {
  name: 'PlantGridAd',
  components: {
    AdSenseAd
  },
  props: {
    position: {
      type: Number,
      default: 1,
      validator: value => [1, 2, 3].includes(value)
    }
  },
  computed: {
    adSlot() {
      const slots = {
        1: '9146041824',
        2: '6519878481', 
        3: '2580633479'
      }
      return slots[this.position]
    }
  }
}
</script>

<style scoped>
.plant-grid-ad {
  grid-column: 1 / -1;
  margin: 2rem 0;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.plant-ad {
  width: 100%;
  min-height: 120px;
}

@media (max-width: 768px) {
  .plant-grid-ad {
    margin: 1rem 0;
    padding: 0.5rem;
  }
}
</style>