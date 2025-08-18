# TODO: Calendario de Plantación - Implementación Completa

## ✅ COMPLETADO
- [x] Sistema de herencia jerárquico (Global → Categoría → Planta)
- [x] Enlaces automáticos a artículos existentes
- [x] Configuración UI dinámica en global-config.json
- [x] Helpers UI sin hardcode
- [x] Página dashboard principal (/calendario/)
- [x] Estructura básica de páginas
- [x] **URLs de meses en castellano** - Cambio de `/calendario/mes/1/` a `/calendario/mes/enero/`

## 🚧 EN PROGRESO

### 1. **Completar Páginas Base** ✅ **FASE 1 COMPLETADA**
- [x] **1.1** Refactorizar `/calendario/mes/[month].astro` para usar datos dinámicos ✅ **COMPLETADO** 
- [x] **1.2** Crear `/calendario/categoria/[category].astro` para vista por categoría ✅ **COMPLETADO**
- [x] **1.3** Crear `/calendario/planta/[category]/[plant].astro` para plantas individuales ✅ **COMPLETADO**

### 2. **Componentes Vue Principales** ✅ **FASE 2 COMPLETADA**
- [x] **2.1** Refactorizar `MonthlyTasks.vue` ✅ **COMPLETADO** - Usa helpers UI
- [x] **2.2** Crear `CalendarGrid.vue` ✅ **COMPLETADO** - Vista calendario mensual interactivo
- [x] **2.3** Crear `PlantTimeline.vue` ✅ **COMPLETADO** - Timeline Gantt anual por planta
- [x] **2.4** Crear `CalendarFilters.vue` ✅ **COMPLETADO** - Filtros interactivos
- [x] **2.5** Crear `PlantCalendarCard.vue` ✅ **COMPLETADO** - Tarjeta de planta con datos de calendario

### 3. **Funcionalidades de Calendario** ✅ **COMPLETADO**
- [x] **3.1** Sistema de generación de calendario mensual con días ✅ **COMPLETADO**
- [x] **3.2** Indicadores visuales de actividades por día ✅ **COMPLETADO**
- [x] **3.3** Vista timeline anual (estilo Gantt) ✅ **COMPLETADO**
- [x] **3.4** Filtros por hemisferio (Norte/Sur +6 meses) ✅ **COMPLETADO**
- [x] **3.5** Filtros por actividad (siembra, trasplante, cosecha, etc.) ✅ **COMPLETADO**

### 4. **Páginas Dinámicas Avanzadas** ✅ **COMPLETADO**
- [x] **4.1** `/calendario/actividad/[activity].astro` - Vista por tipo de actividad ✅ **COMPLETADO**
- [x] **4.2** ~~`/calendario/hemisferio/[hemisphere].astro`~~ ✅ **ELIMINADO** - No necesario (se usa selector en componentes)
- [x] **4.3** Generación automática de rutas estáticas ✅ **COMPLETADO** - `getStaticPaths()`

### 5. **Interactividad y UX** ✅ **COMPLETADO**
- [x] **5.1** Cambio de hemisferio en tiempo real ✅ **COMPLETADO** - `HemisphereSelector.vue`
- [x] **5.2** Filtros interactivos sin reload ✅ **COMPLETADO** - `CalendarFilters.vue`
- [x] **5.3** Navegación entre meses fluida ✅ **COMPLETADO** - Enlaces dinámicos
- [x] **5.4** Enlaces a artículos con indicadores visuales ✅ **COMPLETADO** - `_article_links`

### 6. **Responsive y Mobile** ✅ **COMPLETADO**
- [x] **6.1** Adaptar calendario para móvil ✅ **COMPLETADO**
- [x] **6.2** Vista compacta para pantallas pequeñas ✅ **COMPLETADO**
- [x] **6.3** Touch interactions para calendarios ✅ **COMPLETADO**

### 7. **Features Avanzadas**
- [x] **7.1** Exportación a PDF del calendario mensual ✅ **COMPLETADO**
- [x] **7.2** Exportación a calendario .ics ✅ **COMPLETADO**
- [ ] **7.3** Widget de "próximas tareas"
- [ ] **7.4** Sistema de recordatorios visuales

### 9. **Mejoras Pendientes**
- [ ] **9.1** Traducir términos en inglés del JSON del calendario (oil_infusion, drying, freezing, etc.)
- [ ] **9.2** Mejorar UI de exportación: iconos más discretos en header en lugar de botones grandes
- [ ] **9.3** Optimizar PDF para ahorrar tinta y papel - versión minimalista sin tantos detalles

### 8. **Optimización y SEO**
- [ ] **8.1** Generar sitemap para todas las rutas del calendario
- [ ] **8.2** Meta tags específicas para SEO
- [ ] **8.3** Structured data para eventos de plantación
- [ ] **8.4** Optimización de performance

## 📋 PRIORIDADES INMEDIATAS (Orden de Ejecución)

### **FASE 1: Páginas Base Funcionales**
1. Refactorizar `/calendario/mes/[month].astro` 
2. Crear `CalendarGrid.vue`
3. Crear `/calendario/categoria/[category].astro`
4. Crear `/calendario/planta/[category]/[plant].astro`

### **FASE 2: Componentes Interactivos**
5. Crear `PlantTimeline.vue`
6. Crear `CalendarFilters.vue`
7. Integrar filtros en páginas principales

### **FASE 3: Features Avanzadas**
8. Sistema de hemisferios
9. Exportaciones
10. Mobile optimization

## 🎯 OBJETIVO ACTUAL  
✅ **FASE 1 COMPLETADA** - Todas las páginas base funcionales con datos dinámicos y navegación fluida  
✅ **FASE 2 COMPLETADA** - Componentes interactivos Vue.js implementados  
🚧 **INICIANDO FASE 3** - Features avanzadas y optimizaciones

## 📝 NOTAS TÉCNICAS
- Todo debe usar `getPlantCalendarWithUI()` y helpers dinámicos
- Sin hardcode de iconos, nombres o condicionales
- Mantener compatibilidad con sistema de enlaces automáticos
- Usar componentes Vue para interactividad, Astro para páginas estáticas