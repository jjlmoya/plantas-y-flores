<template>
  <div class="qr-label-generator">
    <a 
      :href="qrImageUrl"
      :download="`tarjeta-qr-${plantSlug}.webp`"
      class="qr-download-btn"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="btn-icon">📱</span>
      Descargar Etiqueta QR
    </a>
  </div>
</template>

<script>
export default {
  name: 'QRLabelGenerator',
  props: {
    plantName: {
      type: String,
      required: true
    },
    categorySlug: {
      type: String,
      required: true
    },
    plantSlug: {
      type: String,
      required: true
    }
  },
  
  computed: {
    qrImageUrl() {
      // Crear slug único con categoría para evitar conflictos
      let uniqueSlug;
      if (this.plantSlug === 'comun') {
        uniqueSlug = `${this.categorySlug}-comun`;
      } else if (this.plantSlug.startsWith(this.categorySlug + '-')) {
        // Ya tiene la categoría como prefijo
        uniqueSlug = this.plantSlug;
      } else {
        // Agregar categoría como prefijo
        uniqueSlug = `${this.categorySlug}-${this.plantSlug}`;
      }
      return `/plant-cards/${uniqueSlug}.webp`
    }
  }
}
</script>

<style scoped>
.qr-label-generator {
  display: inline-block;
}

.qr-download-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4a7c23, #2d5016);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.qr-download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 124, 35, 0.3);
}

.btn-icon {
  font-size: 1.1em;
}
</style>