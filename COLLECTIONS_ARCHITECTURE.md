# Arquitectura de Colecciones - /colecciones/

## Estructura Dinámica

```
src/pages/colecciones/
├── [collection].astro           # Página dinámica reutilizable
src/utils/
├── collections.js              # Funciones de filtrado y extracción
public/data/
├── collections.json           # Configuración SEO y filtros
```

## Funcionamiento

### Sistema Dinámico Reutilizable
- **URL SEO**: `/colecciones/plantas-faciles-de-plantar/`
- **Configuración JSON**: Todo el contenido y SEO desde `collections.json`
- **Filtros inteligentes**: Funciones JavaScript extraen plantas del calendario
- **Componentes reutilizados**: PlantCard.vue + BaseLayout.astro

### Configuración JSON
```json
{
  "slug": "plantas-faciles-de-plantar",
  "h1": "Plantas Fáciles de Plantar para Principiantes",
  "title": "Meta title SEO completo",
  "description": "Meta description optimizada",
  "filters": {
    "care_difficulty": ["easy", "low"],
    "maintenance_level": ["low", "easy"],
    "limit": 30
  }
}
```

## Criterios de Filtrado (Plantas Fáciles)

```javascript
const difficulty = plant.calendar.care_difficulty || 'medium';
const maintenance = plant.calendar.maintenance_level || 'medium';

// Incluir si es fácil
if (difficulty === 'easy' || difficulty === 'low' || 
    maintenance === 'low' || maintenance === 'easy') {
  // Añadir a la colección
}
```

## Datos de Origen

- **Fuente**: JSONs del calendario en `public/data/calendar/`
- **Utilidades**: `src/utils/calendar-inheritance.js`
- **Funciones**: `getAvailableCalendarCategories()`, `getCategoryPlantsWithCalendar()`

## Reutilización de Componentes

- **PlantCard.vue**: Tarjetas de plantas existentes
- **BaseLayout.astro**: Layout SEO-optimizado
- **Enlaces**: Van a artículos originales, slugs compartidos

## Añadir Nueva Colección

Solo necesitas agregar un objeto al JSON:

```json
{
  "slug": "plantas-aromaticas-cocina",
  "h1": "Plantas Aromáticas para Cocina",
  "title": "Las Mejores Plantas Aromáticas para Cocina | Guía 2025",
  "description": "Cultiva tus propias hierbas aromáticas...",
  "filters": {
    "categories": ["albahaca", "oregano", "tomillo"],
    "tags": ["aromatic", "culinary"],
    "limit": 20
  }
}
```

**¡Y listo!** La página se genera automáticamente en `/colecciones/plantas-aromaticas-cocina/`

## SEO

- Meta tags optimizados por colección
- URLs amigables (`/colecciones/nombre-coleccion/`)
- Canonical URLs configuradas
- Descriptions dinámicas con conteos

## Ejemplos de Futuras Colecciones

- `plantas-aromaticas.astro`
- `plantas-medicinales.astro`  
- `plantas-de-interior.astro`
- `resistentes-sequia.astro`