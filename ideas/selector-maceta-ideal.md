# Selector de Maceta Ideal

## Concepto
Herramienta interactiva que recomienda el tamaño y tipo de maceta perfecto según la planta, evitando raíces apretadas y trasplantes fallidos.

## Propuesta de Valor
- ✅ **Evita raíces apretadas** → Crecimiento saludable
- ✅ **Previene trasplantes fallidos** → Reduce mortalidad de plantas
- ✅ **Ahorra dinero** → No comprar macetas incorrectas
- ✅ **Educación práctica** → Enseña principios de jardinería

## Funcionalidad Core
1. **Formulario interactivo** → Usuario introduce datos básicos
2. **Motor de reglas JSON** → Lógica de recomendación
3. **Recomendación visual** → Dibujo SVG de maceta + planta
4. **Especificaciones técnicas** → Medidas exactas y materiales
5. **Integración con tiendas** → Links a compra de macetas recomendadas

## Inputs del Usuario
```
┌─ FORMULARIO ─────────────────┐
│ Planta: [Tomate Cherry ▼]   │
│                              │
│ Diámetro actual: [___] cm    │
│ Altura prevista: [___] cm    │
│                              │
│ Ubicación:                   │
│ ○ Interior  ○ Exterior       │
│                              │
│ Material preferido:          │
│ ○ Terracota ○ Plástico      │
│ ○ Cerámica  ○ Cualquiera    │
│                              │
│ [🔍 Calcular Maceta Ideal]   │
└──────────────────────────────┘
```

## Output Visual
```
🎯 MACETA RECOMENDADA
┌──────────────────────────┐
│     ╭─────────╮          │ ← Dibujo SVG
│    ╱           ╲         │   proporcionado
│   ╱    🌱       ╲        │
│  │               │       │
│  │     RAÍCES    │       │
│  ╰─────────────────╯     │
│                          │
│ 📏 Diámetro: 25cm        │
│ 📏 Altura: 22cm          │
│ 🏺 Material: Terracota   │
│ 🕳️ Drenaje: 3-4 agujeros │
│                          │
│ [🛒 Comprar en Amazon]   │
│ [🛒 Ver en Leroy Merlin] │
└──────────────────────────┘
```

## Motor de Reglas JSON
```json
{
  "rules": {
    "tomate": {
      "type": "hortalizas_grandes",
      "root_space_multiplier": 2.5,
      "min_depth": 25,
      "material_preference": ["terracota", "plastico_grueso"],
      "drainage": "alta"
    },
    "albahaca": {
      "type": "hierbas_pequeñas", 
      "root_space_multiplier": 1.8,
      "min_depth": 15,
      "material_preference": ["cualquiera"],
      "drainage": "media"
    }
  },
  "materials": {
    "terracota": {
      "pros": ["Transpirable", "Estable"],
      "cons": ["Más pesado", "Se rompe"],
      "price_range": "€€"
    },
    "plastico": {
      "pros": ["Ligero", "Barato", "Duradero"],
      "cons": ["Menos transpirable"],
      "price_range": "€"
    }
  }
}
```

## Algoritmo de Cálculo
```javascript
function calcularMacetaIdeal(planta, diametroActual, alturaPlanta) {
  const reglas = plantRules[planta.type];
  
  // Cálculo diámetro recomendado
  const diametroRecomendado = diametroActual * reglas.root_space_multiplier;
  
  // Cálculo altura según tipo de raíz
  const alturaRecomendada = Math.max(
    reglas.min_depth,
    alturaPlanta * reglas.depth_ratio
  );
  
  // Material según ubicación y preferencias
  const materialIdeal = seleccionarMaterial(reglas, userPreferences);
  
  return {
    diameter: diametroRecomendado,
    height: alturaRecomendada, 
    material: materialIdeal,
    drainage: reglas.drainage,
    reasoning: generarExplicacion(reglas)
  };
}
```

## SVG Generator
```javascript
function generarDibujoMaceta(specs) {
  return `
    <svg viewBox="0 0 200 300">
      <!-- Maceta -->
      <path d="M50 200 L150 200 L140 280 L60 280 Z" 
            fill="${specs.material.color}" 
            stroke="#333" />
      
      <!-- Planta -->
      <path d="M100 200 Q120 150 110 120" 
            stroke="green" 
            fill="none" />
      
      <!-- Sistema radicular (visible) -->
      <path d="M80 220 Q100 240 120 220" 
            stroke="brown" 
            opacity="0.6" />
      
      <!-- Etiquetas de medidas -->
      <text x="160" y="240">${specs.diameter}cm</text>
      <text x="30" y="240">${specs.height}cm</text>
    </svg>
  `;
}
```

## Casos de Uso Típicos
### Usuario Principiante
- "Compré albahaca en maceta pequeña, ¿cuándo trasplantar?"
- **Input**: Albahaca, 8cm actual, 15cm altura
- **Output**: Maceta 15cm diámetro, 18cm alto, terracota

### Usuario Experiencia Media
- "Quiero plantar tomates en terraza"
- **Input**: Tomate, 0cm (semilla), 60cm altura prevista
- **Output**: Maceta 30cm diámetro, 35cm alto, plástico resistente

### Usuario Avanzado
- "Optimizar espacio en invernadero"
- **Input**: Múltiples plantas, restricciones de espacio
- **Output**: Recomendaciones agrupadas + layout sugerido

## Ubicaciones en el Sitio
- **Widget homepage** → "¿Qué maceta necesitas?"
- **Página dedicada** → `/herramientas/selector-maceta/`
- **En artículos de plantas** → "Maceta recomendada para esta planta"
- **En calendario de tareas** → "Época de trasplante: nueva maceta recomendada"

## Monetización
- **Afiliación Amazon** → Links directos a macetas específicas
- **Partnership viveros** → Comisión por ventas referidas  
- **Contenido premium** → Guías avanzadas de trasplante
- **Anuncios contextuales** → Herramientas de jardinería

## Ventaja Competitiva
- ✅ **Primera herramienta específica** del sector en español
- ✅ **Integración con contenido existente** → No empezar de cero
- ✅ **Visual + práctico** → No solo texto, sino imagen
- ✅ **Basado en ciencia** → Reglas reales de botánica
- ✅ **Monetización clara** → Revenue directo

## Métricas Clave
- **Uso del selector** → ¿La gente lo encuentra útil?
- **Clicks a tiendas** → ¿Genera ventas reales?
- **Plantas por usuario** → ¿Vuelven para más plantas?
- **Accuracy feedback** → ¿Las recomendaciones funcionan?

## Implementación Técnica
### Frontend
- **Vue.js component** → Formulario reactivo
- **SVG dinámico** → Canvas o librería de dibujo
- **Responsive design** → Funciona en móvil

### Backend/Data
- **JSON estático** → Reglas de plantas (no necesita BBDD)
- **API externa** → Links dinámicos a tiendas
- **Analytics** → Track de uso y conversiones

### Integraciones
- **Amazon API** → Precios y stock en tiempo real
- **Tiendas locales** → APIs de viveros si disponible
- **Comparador precios** → Encuentra mejor oferta

## Roadmap de Desarrollo
### Fase 1: MVP
- Formulario básico (5-6 plantas populares)
- Recomendación texto + medidas
- Links manuales a Amazon

### Fase 2: Visual
- Generación SVG dinámico
- Más plantas en database
- Comparador de materiales

### Fase 3: Avanzado
- Detector de problemas (foto de planta actual)
- Calculadora de trasplante por fecha
- Integración con calendario existente
- App móvil para "escanear maceta"

---
**Estado**: 💡 Idea  
**Prioridad**: Alta  
**Complejidad**: Media  
**ROI Estimado**: Alto (monetización directa)