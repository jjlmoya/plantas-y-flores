<template>
  <div class="header-export">
    <CalendarExport 
      :exportData="exportData"
      :exportType="exportType"
      :title="title"
      :isCompact="true"
    />
  </div>
</template>

<script>
import CalendarExport from './CalendarExport.vue';

export default {
  name: 'HeaderExport',
  components: {
    CalendarExport
  },
  props: {
    exportData: {
      type: Object,
      required: true
    },
    exportType: {
      type: String,
      required: true,
      validator: value => ['month', 'plant', 'category'].includes(value)
    },
    title: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
.header-export {
  display: flex;
  align-items: center;
}

.header-export :deep(.calendar-export) {
  margin: 0;
}

.header-export :deep(.icon-btn) {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.25rem;
}

.header-export :deep(.icon-btn:hover) {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.header-export :deep(.icon-btn .icon) {
  font-size: 1.1rem;
}

.header-export :deep(.icon-btn:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.header-export :deep(.loading-dot) {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>