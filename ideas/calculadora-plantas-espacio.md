# Calculadora de Plantas por Espacio - Garden Planner Interactive

## Concepto
Herramienta de planificación interactiva tipo "juego de gestión de inventario" pero para espacios reales. Drag & drop de plantas, optimización automática del espacio, y mapas detallados con compañeros perfectos.

## Propuesta de Valor
- ✅ **Maximiza tu espacio** → Aprovecha cada cm² disponible
- ✅ **Plantas compañeras automáticas** → Sinergia natural entre especies  
- ✅ **Visual e intuitivo** → Como un videojuego, pero real
- ✅ **Elimina errores de principiante** → No más plantas que se "pelean"
- ✅ **Plan de compra exacto** → Lista de compras perfecta generada

## Interfaz de Juego Interactivo
```
🏡 GARDEN PLANNER - Diseña tu espacio perfecto

📐 Define tu espacio:
┌─ CONFIGURACIÓN ─────────────────┐
│ Tipo: [Jardinera ▼]            │
│ Largo: [___] cm                 │ 
│ Ancho: [___] cm                 │
│ Sol: ☀️ ○ 🌤️ ● 🌥️ ○          │
│ [🔄 Crear Espacio]             │
└─────────────────────────────────┘

🎮 INVENTARIO DE PLANTAS:        📱 TU ESPACIO:
┌─────────────────────┐         ┌─────────────────────┐
│ 🍅 Tomate    30x30  │    ➜    │                     │
│ 🌿 Albahaca  15x15  │         │                     │ 
│ 🥬 Lechuga   20x20  │         │     [Arrastra]      │
│ 🌱 Perejil   10x10  │         │     [aquí tus]      │
│ 🧄 Ajo       5x5    │         │     [plantas]       │
│ 🌻 Girasol   40x40  │         │                     │
└─────────────────────┘         └─────────────────────┘

💡 SUGERENCIAS INTELIGENTES:
• "La albahaca va genial junto al tomate"
• "El ajo protege tus plantas de plagas"  
• "¡Espacio optimizado al 94%!"
```

## Mecánica de Juego
### Drag & Drop Visual
```javascript
// Cada planta es un "item" con propiedades
const plantItems = {
  tomate: {
    size: {width: 30, height: 30},      // cm reales
    companions: ["albahaca", "ajo"],     // Plantas amigas
    enemies: ["hinojo", "nogal"],        // Plantas enemigas  
    growth_time: 90,                     // días hasta cosecha
    season: "primavera-verano",
    color: "#ff6b6b"                     // Color en el mapa
  },
  albahaca: {
    size: {width: 15, height: 15},
    companions: ["tomate", "pimiento"], 
    enemies: ["ruda"],
    growth_time: 30,
    season: "primavera-verano",
    color: "#51cf66"
  }
};
```

### Sistema de Puntuación
```
🏆 OPTIMIZACIÓN DEL ESPACIO

Espacio usado: 85/90 cm² (94%) ⭐⭐⭐⭐⭐
Compañeros perfectos: 4/5     ⭐⭐⭐⭐☆
Sin conflictos: ✅           ⭐⭐⭐⭐⭐  
Cosecha escalonada: ✅       ⭐⭐⭐⭐⭐

🎯 PUNTUACIÓN TOTAL: 94/100

💰 COSTE ESTIMADO: 45€
📅 PRIMERA COSECHA: 30 días
🌱 PRODUCCIÓN ESTIMADA: 15kg/temporada
```

### Motor de Compatibilidad
```javascript
function calcularCompatibilidad(planta1, planta2, distancia) {
  // Plantas compañeras
  if (planta1.companions.includes(planta2.id)) {
    return {
      score: 10,
      reason: "¡Compañeros perfectos! Se ayudan mutuamente",
      effect: "+20% crecimiento para ambas"
    };
  }
  
  // Plantas enemigas  
  if (planta1.enemies.includes(planta2.id)) {
    return {
      score: -5,
      reason: "⚠️ No se llevan bien, competirán por nutrientes",
      effect: "-15% crecimiento para ambas"
    };
  }
  
  // Competencia por espacio
  if (distancia < (planta1.min_distance + planta2.min_distance)) {
    return {
      score: -3,
      reason: "Muy cerca, competirán por luz y nutrientes",
      effect: "Crecimiento más lento"
    };
  }
  
  return {score: 0, reason: "Neutrales", effect: "Sin efecto"};
}
```

## Tipos de Espacio Soportados
### Jardineras (20-200cm)
- **Balcón pequeño**: 60x20cm
- **Jardinera grande**: 100x40cm  
- **Jardinera XL**: 200x50cm

### Huertos Urbanos (1-50m²)
- **Mesa de cultivo**: 120x80cm
- **Huerto pequeño**: 2x2m
- **Huerto familiar**: 4x4m

### Jardines (50m²+)
- **Parcela pequeña**: 5x10m
- **Jardín medio**: 10x15m
- **Jardín grande**: 20x30m+

### Espacios Especiales
- **Invernadero**: Con altura 3D
- **Terraza en L**: Formas irregulares
- **Bancales elevados**: Múltiples niveles

## Algoritmo de Optimización
```javascript
class GardenOptimizer {
  optimizarEspacio(plantas_deseadas, espacio_disponible) {
    let mejorCombinacion = null;
    let mejorPuntuacion = 0;
    
    // Probar todas las combinaciones posibles
    const combinaciones = generarCombinaciones(plantas_deseadas);
    
    combinaciones.forEach(combo => {
      if (this.cabeEnEspacio(combo, espacio_disponible)) {
        const layout = this.calcularMejorLayout(combo, espacio_disponible);
        const puntuacion = this.evaluarLayout(layout);
        
        if (puntuacion > mejorPuntuacion) {
          mejorPuntuacion = puntuacion;
          mejorCombinacion = {combo, layout, puntuacion};
        }
      }
    });
    
    return mejorCombinacion;
  }
  
  evaluarLayout(layout) {
    let score = 0;
    
    // Puntos por aprovechamiento del espacio
    score += layout.espacioUsado / layout.espacioTotal * 40;
    
    // Puntos por plantas compañeras
    layout.plantas.forEach((planta, i) => {
      layout.plantas.slice(i+1).forEach(otraPlanta => {
        const compatibilidad = calcularCompatibilidad(planta, otraPlanta);
        score += compatibilidad.score;
      });
    });
    
    // Puntos por diversidad de cosecha
    const tiposCosecha = new Set(layout.plantas.map(p => p.harvest_type));
    score += tiposCosecha.size * 5;
    
    return Math.min(score, 100); // Máximo 100 puntos
  }
}
```

## Output Final - Mapa Detallado
```
📋 TU PLAN MAESTRO DE JARDÍN

🗺️ MAPA VISUAL (Escala 1:10)
┌────────────────────────────────┐
│  🍅    🌿        🥬    🌱    │
│      (30d)    (20d)  (15d)   │
│                              │
│    🧄   🥕         🌽        │
│  (40d) (60d)      (90d)      │  
│                              │
│        🌻              🫘    │
│      (120d)          (45d)   │
└────────────────────────────────┘

📊 CRONOGRAMA DE COSECHA
Día 15: 🌱 Perejil (500g)
Día 20: 🥬 Lechuga (2 cabezas)  
Día 30: 🌿 Albahaca (200g)
Día 40: 🧄 Ajos (10 dientes)
Día 45: 🫘 Judías (1kg)
...

🛒 LISTA DE COMPRA EXACTA
□ Semillas tomate cherry x2    4€
□ Plantones albahaca x4        8€  
□ Semillas lechuga variada     3€
□ Dientes ajo x20              2€
□ Sustrato universal 50L      12€
□ Fertilizante orgánico        6€
─────────────────────────
💰 TOTAL: 35€

🎯 CONSEJOS EXPERTOS:
• Planta primero los ajos - protegen a todos
• La albahaca junto al tomate mejora el sabor
• Rota lechugas cada 3 semanas para cosecha continua
• El perejil se puede cosechar cortando hojas externas
```

## Casos de Uso Reales
### Familia con Balcón Pequeño
- **Input**: Jardinera 80x25cm, principiantes, quieren hierbas
- **Output**: Albahaca + Perejil + Orégano + Cherry tomates mini
- **Valor**: Máximo aprovechamiento espacio mínimo

### Huerto Escolar
- **Input**: Bancal 3x2m, niños 8-12 años, educativo
- **Output**: Plantas rápidas + llamativas (rábanos, girasoles, judías)
- **Valor**: Experiencia educativa optimizada

### Principiante con Terraza
- **Input**: 4x3m, primer año, quiere comida real
- **Output**: Mix hierbas + hortalizas fáciles + calendario detallado
- **Valor**: Éxito garantizado + comida para familia

## Implementación Técnica
### Frontend Interactivo
```vue
<template>
  <div class="garden-planner">
    <!-- Canvas para drag & drop -->
    <canvas ref="gardenCanvas" 
            @drop="onDrop" 
            @dragover="allowDrop"
            @click="onCanvasClick">
    </canvas>
    
    <!-- Inventario de plantas -->
    <div class="plant-inventory">
      <div v-for="plant in availablePlants"
           :key="plant.id"
           :draggable="true"
           @dragstart="onDragStart($event, plant)"
           class="plant-item">
        {{ plant.name }} ({{ plant.size.width }}x{{ plant.size.height }}cm)
      </div>
    </div>
    
    <!-- Panel de optimización -->
    <div class="optimization-panel">
      <button @click="optimizeLayout">🎯 Optimizar Automáticamente</button>
      <button @click="generateShoppingList">🛒 Lista de Compras</button>
      <button @click="exportPlan">📄 Exportar Plan PDF</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gardenSpace: {width: 200, height: 100}, // cm
      placedPlants: [],
      availablePlants: plantDatabase
    };
  },
  
  methods: {
    onDrop(event) {
      const plantData = JSON.parse(event.dataTransfer.getData('text/plain'));
      const rect = this.$refs.gardenCanvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      if (this.canPlacePlant(plantData, x, y)) {
        this.placedPlants.push({...plantData, x, y});
        this.redrawCanvas();
        this.updateOptimizationScore();
      }
    },
    
    optimizeLayout() {
      const optimizer = new GardenOptimizer();
      const optimizedLayout = optimizer.optimizarEspacio(
        this.getSelectedPlants(),
        this.gardenSpace
      );
      
      this.placedPlants = optimizedLayout.plants;
      this.redrawCanvas();
    }
  }
};
</script>
```

### Motor de Física Simple
```javascript
class PlantPhysics {
  checkCollision(plant1, plant2) {
    return !(plant1.x + plant1.width < plant2.x || 
             plant2.x + plant2.width < plant1.x || 
             plant1.y + plant1.height < plant2.y || 
             plant2.y + plant2.height < plant1.y);
  }
  
  findValidPosition(plant, existingPlants, gardenBounds) {
    // Grid search para encontrar posición válida
    for (let y = 0; y <= gardenBounds.height - plant.height; y += 5) {
      for (let x = 0; x <= gardenBounds.width - plant.width; x += 5) {
        const testPosition = {x, y, ...plant};
        
        if (!existingPlants.some(existing => 
            this.checkCollision(testPosition, existing))) {
          return {x, y};
        }
      }
    }
    return null; // No cabe
  }
}
```

## Monetización y Valor
### Revenue Directo
- **Lista de compras afiliada** → Amazon, viveros locales
- **Planes premium PDF** → Diseños profesionales descargables
- **Consultoría virtual** → "Diseña MI jardín específico"

### Engagement Extremo
- **Tiempo en página** → Usuarios pasan 15-30 minutos jugando/diseñando
- **Compartir social** → "Mira mi jardín perfecto"
- **Return visits** → Vuelven a probar nuevas combinaciones

### Data Valiosa
- **Preferencias reales** → Qué plantas quiere la gente realmente
- **Limitaciones comunes** → Espacios típicos, problemas frecuentes
- **Optimización A/B** → Qué layouts funcionan mejor

## Roadmap de Desarrollo
### Fase 1: MVP Básico (2-3 semanas)
- Drag & drop básico en canvas
- 20 plantas populares con datos básicos
- 3 tipos de espacio (jardinera, huerto, jardín)
- Detección de colisiones simple

### Fase 2: Gamificación (3-4 semanas)
- Sistema de puntuación
- Optimización automática
- Plantas compañeras/enemigas
- Cronograma de cosecha

### Fase 3: Profesional (4-6 semanas)
- Export PDF con planos detallados
- Base de datos completa (100+ plantas)
- Espacios irregulares/3D
- Integración con calendario existente

### Fase 4: Avanzado (2-3 meses)
- AI para sugerencias personalizadas
- Realidad aumentada (móvil)
- Comunidad - compartir diseños
- Marketplace de planes premium

## Diferenciador Clave
**Otros planificadores**: Complicados, para expertos, sin feedback interactivo
**Nuestro**: Como un juego, divertido, feedback inmediato, optimización automática

---
**Estado**: 💡 Idea  
**Prioridad**: ALTÍSIMA  
**Complejidad**: Alta  
**ROI Estimado**: ENORME (engagement brutal + monetización múltiple)