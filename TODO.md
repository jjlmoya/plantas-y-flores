# TODO: Calendario de Plantación - Implementación Completa

## ✅ COMPLETADO
- [x] Sistema de herencia jerárquico (Global → Categoría → Planta)
- [x] Enlaces automáticos a artículos existentes
- [x] Configuración UI dinámica en global-config.json
- [x] Helpers UI sin hardcode
- [x] Página dashboard principal (/calendario/)
- [x] Estructura básica de páginas

## 🚧 EN PROGRESO

### 1. **Completar Páginas Base** 
- [ ] **1.1** Refactorizar `/calendario/mes/[month].astro` para usar datos dinámicos
- [ ] **1.2** Crear `/calendario/categoria/[category].astro` para vista por categoría
- [ ] **1.3** Crear `/calendario/planta/[category]/[plant].astro` para plantas individuales

### 2. **Componentes Vue Principales**
- [ ] **2.1** Refactorizar `MonthlyTasks.vue` (ya empezado)
- [ ] **2.2** Crear `CalendarGrid.vue` - Vista calendario mensual interactivo
- [ ] **2.3** Crear `PlantTimeline.vue` - Timeline Gantt anual por planta
- [ ] **2.4** Crear `CalendarFilters.vue` - Filtros interactivos
- [ ] **2.5** Crear `PlantCalendarCard.vue` - Tarjeta de planta con datos de calendario

### 3. **Funcionalidades de Calendario**
- [ ] **3.1** Sistema de generación de calendario mensual con días
- [ ] **3.2** Indicadores visuales de actividades por día
- [ ] **3.3** Vista timeline anual (estilo Gantt)
- [ ] **3.4** Filtros por hemisferio (Norte/Sur +6 meses)
- [ ] **3.5** Filtros por actividad (siembra, trasplante, cosecha, etc.)

### 4. **Páginas Dinámicas Avanzadas**
- [ ] **4.1** `/calendario/actividad/[activity].astro` - Vista por tipo de actividad
- [ ] **4.2** `/calendario/hemisferio/[hemisphere].astro` - Vista por hemisferio
- [ ] **4.3** Generación automática de rutas estáticas

### 5. **Interactividad y UX**
- [ ] **5.1** Cambio de hemisferio en tiempo real
- [ ] **5.2** Filtros interactivos sin reload
- [ ] **5.3** Navegación entre meses fluida
- [ ] **5.4** Enlaces a artículos con indicadores visuales

### 6. **Responsive y Mobile**
- [ ] **6.1** Adaptar calendario para móvil
- [ ] **6.2** Vista compacta para pantallas pequeñas
- [ ] **6.3** Touch interactions para calendarios

### 7. **Features Avanzadas**
- [ ] **7.1** Exportación a PDF del calendario mensual
- [ ] **7.2** Exportación a calendario .ics
- [ ] **7.3** Widget de "próximas tareas"
- [ ] **7.4** Sistema de recordatorios visuales

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
**Completar FASE 1** - Tener todas las páginas base funcionales con datos dinámicos y navegación fluida entre vistas.

## 📝 NOTAS TÉCNICAS
- Todo debe usar `getPlantCalendarWithUI()` y helpers dinámicos
- Sin hardcode de iconos, nombres o condicionales
- Mantener compatibilidad con sistema de enlaces automáticos
- Usar componentes Vue para interactividad, Astro para páginas estáticas