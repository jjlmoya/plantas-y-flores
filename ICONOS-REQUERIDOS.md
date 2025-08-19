# 🎨 Iconos Requeridos para el Sistema de Calendario

Este documento lista todos los iconos SVG necesarios para reemplazar emojis y crear una imagen más profesional.

## 📅 Iconos de Calendario

### Navegación y UI
- **calendar** - Icono principal de calendario
- **arrow-left** - Navegación mes anterior  
- **arrow-right** - Navegación mes siguiente
- **grid-view** - Vista de cuadrícula
- **list-view** - Vista de lista
- **filter** - Filtros
- **search** - Búsqueda
- **close** - Cerrar/dismiss
- **menu** - Menú hamburguesa

### Actividades de Plantas
- **seed** - Siembra (reemplaza 🌱)
- **plant-pot** - Trasplante (reemplaza 🪴) 
- **harvest** - Cosecha (reemplaza 🌾)
- **watering-can** - Riego (reemplaza 💧)
- **pruning-shears** - Poda (reemplaza ✂️)
- **fertilizer** - Fertilización (reemplaza 🧪)
- **thermometer** - Temperatura (reemplaza 🌡️)
- **sun** - Luz solar (reemplaza ☀️)
- **moon** - Sombra/noche (reemplaza 🌙)
- **droplet** - Humedad
- **wind** - Ventilación

### Estados y Niveles
- **difficulty-low** - Dificultad baja (reemplaza ✅)
- **difficulty-medium** - Dificultad media (reemplaza ⚠️) 
- **difficulty-high** - Dificultad alta (reemplaza ⛔)
- **priority-high** - Prioridad alta
- **priority-medium** - Prioridad media
- **priority-low** - Prioridad baja
- **check** - Completado
- **warning** - Advertencia
- **info** - Información

### Exportación y Acciones
- **download** - Descargar/exportar (reemplaza 📤)
- **pdf** - Archivo PDF (reemplaza 📄)
- **calendar-import** - Importar calendario (reemplaza 📅)
- **print** - Imprimir
- **share** - Compartir
- **bookmark** - Guardar/favorito
- **link** - Enlace externo

### Plantas y Categorías
- **leaf** - Planta genérica
- **flower** - Flores
- **herb** - Hierbas aromáticas  
- **vegetable** - Verduras/hortalizas
- **fruit** - Frutas
- **tree** - Árboles
- **indoor-plant** - Plantas de interior
- **outdoor-plant** - Plantas de exterior

### Herramientas de Jardín
- **shovel** - Pala (reemplaza 🔨)
- **rake** - Rastrillo
- **hoe** - Azada
- **trowel** - Transplantador
- **gloves** - Guantes
- **wheelbarrow** - Carretilla

### Tiempo y Estaciones
- **spring** - Primavera (reemplaza 🌸)
- **summer** - Verano (reemplaza ☀️)
- **autumn** - Otoño (reemplaza 🍂)
- **winter** - Invierno (reemplaza ❄️)
- **clock** - Tiempo/horario
- **timer** - Temporizador

### Recordatorios y Notificaciones
- **bell** - Recordatorio (reemplaza 🔔)
- **alert** - Alerta
- **reminder** - Recordatorio visual
- **notification** - Notificación
- **urgent** - Urgente

### Dashboard y Métricas
- **dashboard** - Panel principal (reemplaza 📊)
- **stats** - Estadísticas
- **chart** - Gráficos
- **progress** - Progreso
- **target** - Objetivo

## 🌍 Hemisferios (Mantener emojis de banderas)

### Norte (Usar emojis de países del hemisferio norte)
- 🇪🇸 España
- 🇫🇷 Francia  
- 🇩🇪 Alemania
- 🇺🇸 Estados Unidos

### Sur (Usar emojis de países del hemisferio sur)
- 🇦🇷 Argentina
- 🇨🇱 Chile
- 🇦🇺 Australia
- 🇿🇦 Sudáfrica

## 📂 Estructura de Archivos Sugerida

```
/public/icons/
├── calendar/
│   ├── calendar.svg
│   ├── arrow-left.svg
│   ├── arrow-right.svg
│   └── ...
├── activities/
│   ├── seed.svg
│   ├── plant-pot.svg
│   ├── harvest.svg
│   └── ...
├── tools/
│   ├── shovel.svg
│   ├── watering-can.svg
│   └── ...
└── ui/
    ├── check.svg
    ├── warning.svg
    └── ...
```

## 🎯 Especificaciones Técnicas

### Formato
- **Tipo**: SVG
- **Tamaño**: 24x24px (base)
- **Colores**: Monocromo con variantes
- **Estilo**: Líneas simples, consistente

### Colores Base del Sitio
- **Verde principal**: `#38a169`
- **Verde secundario**: `#48bb78`
- **Gris texto**: `#4a5568`
- **Gris claro**: `#a0aec0`

### Ubicaciones Actuales que Necesitan Iconos

#### Componentes Vue
- `src/components/CalendarGrid.vue` - múltiples emojis de navegación
- `src/components/PlantTimeline.vue` - emojis de actividades
- `src/components/UpcomingTasks.vue` - emojis de tareas
- `src/components/VisualReminders.vue` - emojis de recordatorios
- `src/components/HeaderExport.vue` - emojis de exportación
- `src/components/HemisphereSelector.vue` - necesita banderas

#### Páginas Astro
- `src/pages/calendario/index.astro` - dashboard con múltiples emojis
- `src/pages/calendario/mes/[month].astro` - navegación y actividades
- `src/pages/calendario/[category]/[plant].astro` - datos de plantas

#### Utilidades
- `src/utils/calendar-inheritance.js` - helpers UI con emojis hardcoded

## ✅ Tareas una vez tengamos los iconos

1. **Crear componente IconSVG.vue** - Wrapper para iconos
2. **Actualizar helpers UI** - Reemplazar emojis por llamadas a iconos
3. **Actualizar todos los componentes** - Usar IconSVG en lugar de emojis
4. **Mantener solo banderas** - Para hemisferios Norte/Sur
5. **Testing visual** - Verificar consistencia y profesionalidad

---

**Nota**: Este listado incluye ~60 iconos únicos. La mayoría son estándar y deberían estar disponibles en librerías como Heroicons, Lucide, o Feather Icons.