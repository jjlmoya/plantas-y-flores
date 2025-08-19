# TODO: Mejoras del Sistema de Calendario

## 🚧 TAREAS PENDIENTES

### 1. **Mejoras Visuales y UX** 
- [ ] **1.1** Mejorar el estilo visual para que sea igual a la página principal
- [ ] **1.2** Crear componente reutilizable para las cards del calendario (evitar duplicación)
- [ ] **1.3** Mejorar layout y espaciados - definir sistema de espaciado consistente
- [ ] **1.4** Estandarizar colores con el resto de la página

### 2. **Sistema de Iconos**
- [ ] **2.1** Auditar y listar todos los iconos necesarios para reemplazar emojis
- [ ] **2.2** Crear archivo .md con listado completo de iconos requeridos
- [ ] **2.3** Minimizar uso de emojis y usar iconos propios para imagen profesional
- [ ] **2.4** Cambiar locale de países por banderas (reemplazar "España" por 🇪🇸, etc.)

### 3. **Pendiente de análisis adicional**
- [ ] **3.1** Identificar errores solucionables en el código actual
- [ ] **3.2** Optimizar performance y accesibilidad
- [ ] **3.3** Revisar responsive design en mobile

### 4. **Para más adelante**
- [ ] **4.1** Generar sitemap para todas las rutas del calendario *(en espera)*

## 📝 NOTAS

- **Prioridad**: Centrarse en UX/UI y profesionalidad visual
- **Emojis**: Solo para banderas de hemisferios, resto usar iconos SVG propios
- **Consistencia**: Mantener coherencia visual con el sitio principal
- **Componentes**: Reutilizar y no duplicar código

---

## ✅ COMPLETADO ANTERIORMENTE

### Sistema Base Implementado
- [x] Sistema de herencia jerárquico (Global → Categoría → Planta)
- [x] Enlaces automáticos a artículos existentes  
- [x] Configuración UI dinámica en global-config.json
- [x] Helpers UI sin hardcode
- [x] Páginas principales: dashboard, meses, categorías, plantas
- [x] Componentes Vue: CalendarGrid, PlantTimeline, CalendarFilters, etc.
- [x] Sistema de exportación PDF/ICS con iconos discretos
- [x] Widget de próximas tareas
- [x] Sistema de recordatorios visuales
- [x] URLs en castellano (/enero/, /febrero/, etc.)