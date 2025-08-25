# Imprimibles de Pictogramas para Plantas

## Concepto
Sistema de etiquetas imprimibles con iconos universales (sol, riego, poda) generadas automáticamente desde las fichas de plantas usando jsPDF en cliente.

## Propuesta de Valor
- ✅ **Comunicación visual universal** → Sin necesidad de leer texto
- ✅ **Perfecto para principiantes** → Iconos claros y simples
- ✅ **Jardines compartidos** → Funciona independiente del idioma
- ✅ **Recordatorio visual rápido** → Un vistazo y sabes qué hacer
- ✅ **Educativo para niños** → Aprender jardinería con símbolos

## Funcionalidad Core
1. **Extracción automática** → Lee cuidados de fichas existentes
2. **Generación de pictogramas** → Convierte texto a iconos
3. **PDF en cliente** → jsPDF genera archivo descargable
4. **Templates múltiples** → Diferentes tamaños y layouts
5. **Personalización básica** → Colores y tamaños de iconos

## Pictogramas Principales
```
☀️ SOL          🌤️ SOL PARCIAL    🌥️ SOMBRA
💧 RIEGO ALTO   💧💧 RIEGO MEDIO   💧💧💧 RIEGO BAJO
✂️ PODA         🌱 FERTILIZAR     🔄 TRASPLANTAR
🌡️ TEMPERATURA  🌿 HUMEDAD        🐛 PLAGAS
📅 ESTACIONAL   ⚠️ CUIDADO        ❄️ PROTEGER FRÍO
```

## Ejemplo Visual de Etiqueta
```
┌─────────────────────────┐
│      🌹 ROSA ROJA      │
│                         │
│  ☀️    💧💧    ✂️      │
│ Sol   Riego   Poda      │
│      Medio   Marzo      │
│                         │
│  🌡️ 15-25°C  🌱 Abril  │
│                         │
│ plantasyflores.online   │
└─────────────────────────┘
```

## Casos de Uso
### Jardín Familiar
- **Padre/Madre ocupados** → Hijos saben qué plantas regar
- **Abuelos cuidando** → Iconos claros sin leer instrucciones
- **Jardín compartido** → Vecinos entienden cuidados básicos

### Educación
- **Colegios** → Niños aprenden responsabilidades con símbolos
- **Talleres jardinería** → Material didáctico universal
- **Terapia ocupacional** → Actividades con personas mayores

### Profesional
- **Jardineros temporales** → Instrucciones rápidas para sustitutos
- **Viveros** → Etiquetas informativas para clientes
- **Hoteles/oficinas** → Personal de limpieza cuida plantas

## Templates Disponibles
### Formato Sticker (5x5cm)
- Solo iconos principales + nombre planta
- Perfecto para macetas pequeñas
- 12 etiquetas por hoja A4

### Formato Estaca (15x3cm)
- Iconos + texto mínimo + frecuencias
- Para plantas de jardín exterior
- 8 estacas por hoja A4

### Formato Cartel (10x15cm)
- Iconos grandes + explicaciones básicas
- Para jardines educativos/demostrativos
- 2 carteles por hoja A4

### Formato Pulsera (20x2cm)
- Tira con iconos secuenciales por mes
- Se enrolla alrededor de maceta
- 6 pulseras por hoja A4

## Mapeo de Datos a Pictogramas
```javascript
const pictogramMapping = {
  // Sol
  "pleno sol": "☀️",
  "sol directo": "☀️", 
  "semisombra": "🌤️",
  "sombra parcial": "🌤️",
  "sombra": "🌥️",
  
  // Riego  
  "riego abundante": "💧💧💧",
  "riego frecuente": "💧💧💧",
  "riego moderado": "💧💧",
  "riego escaso": "💧",
  "resist sequía": "💧",
  
  // Tareas por mes
  "podar": "✂️",
  "fertilizar": "🌱", 
  "trasplantar": "🔄",
  "sembrar": "🌰",
  
  // Condiciones
  "temperatura": "🌡️",
  "humedad": "🌿",
  "plagas": "🐛",
  "proteger frío": "❄️"
};
```

## Algoritmo de Generación
```javascript
function generarPictogramas(plantData) {
  const iconos = [];
  
  // Mapear luz solar
  if (plantData.light_requirements) {
    iconos.push(mapLightToPictogram(plantData.light_requirements));
  }
  
  // Mapear riego
  if (plantData.water_needs) {
    iconos.push(mapWaterToPictogram(plantData.water_needs));
  }
  
  // Mapear tareas del calendario actual
  const mesActual = new Date().getMonth();
  const tareasDelMes = plantData.calendar[mesActual];
  tareasDelMes.forEach(tarea => {
    iconos.push(mapTaskToPictogram(tarea));
  });
  
  return iconos;
}
```

## Generación PDF con jsPDF
```javascript
import jsPDF from 'jspdf';

function generarPDFPictogramas(plantData, template = 'sticker') {
  const pdf = new jsPDF();
  const iconos = generarPictogramas(plantData);
  
  switch(template) {
    case 'sticker':
      generarStickers(pdf, iconos, plantData.name);
      break;
    case 'estaca':
      generarEstacas(pdf, iconos, plantData.name);
      break;
    case 'cartel':
      generarCarteles(pdf, iconos, plantData.name);
      break;
  }
  
  return pdf.output('blob');
}

function generarStickers(pdf, iconos, nombre) {
  // 12 stickers por página, 3x4 grid
  for(let i = 0; i < 12; i++) {
    const x = (i % 3) * 60 + 20;
    const y = Math.floor(i / 3) * 60 + 20;
    
    // Nombre de planta
    pdf.setFontSize(12);
    pdf.text(nombre, x + 25, y + 10, {align: 'center'});
    
    // Iconos principales
    iconos.slice(0, 3).forEach((icono, idx) => {
      pdf.setFontSize(20);
      pdf.text(icono.symbol, x + 10 + (idx * 15), y + 30);
      
      pdf.setFontSize(8);
      pdf.text(icono.label, x + 10 + (idx * 15), y + 40, {align: 'center'});
    });
    
    // Marco
    pdf.rect(x, y, 50, 50);
  }
}
```

## Ubicaciones en el Sitio
- **En cada ficha de planta** → "Descargar etiquetas pictogramas"
- **Página dedicada** → `/herramientas/pictogramas/`  
- **En calendario individual** → "Pictogramas para este mes"
- **Pack educativo** → "Descarga 20 plantas básicas para jardín escolar"

## Ventaja Competitiva
- ✅ **Primera implementación** en sector jardineríasecgitola
- ✅ **Generación automática** → No trabajo manual de diseño
- ✅ **Universal y accesible** → Funciona para todos los públicos
- ✅ **Integración con contenido** → Usa fichas existentes
- ✅ **Educativo y práctico** → Doble valor

## Monetización Indirecta
- **Engagement premium** → Usuarios descargan más, se quedan más
- **Branding fuerte** → Logo en cada etiqueta impresa
- **Lead generation** → Email para descargar packs premium
- **Partnerships educativos** → Colegios, asociaciones, talleres

## Métricas Clave
- **Descargas por template** → ¿Qué formato prefieren?
- **Plantas más populares** → ¿Cuáles se imprimen más?
- **Retención post-descarga** → ¿Vuelven por más plantas?
- **Sharing social** → ¿Comparten fotos de etiquetas en uso?

## Implementación Técnica
### Frontend
- **Vue.js component** → Selector de template y plantas
- **jsPDF integration** → Generación en cliente (no servidor)
- **Canvas preview** → Vista previa antes de descargar

### Data Processing
```javascript
// Leer desde fichas existentes
const plantData = await fetch(`/data/plants/${plantSlug}.json`);
const pictograms = extractPictogramsFromPlant(plantData);
const layouts = generateLayouts(pictograms, templateType);
const pdf = generatePDF(layouts);
```

### Iconografía
- **Unicode símbolos** → Compatibilidad universal
- **Font icons custom** → Para símbolos específicos
- **SVG embeds** → Si necesario mayor detalle

## Roadmap de Desarrollo
### Fase 1: MVP
- Templates básicos (sticker + estaca)
- 5-6 pictogramas principales
- Generación individual por planta

### Fase 2: Expansión
- Todos los templates
- Pack multi-plantas
- Preview interactivo

### Fase 3: Avanzado
- Editor de pictogramas personalizado
- Templates custom para usuarios
- Integración con impresoras (formato específico)
- App móvil con "scan & print"

## Notas Técnicas
- **Tamaño archivo PDF** → Optimizar para descarga rápida
- **Compatibilidad impresoras** → Testar en impresoras domésticas común
- **Escalabilidad iconos** → Que se vean bien en diferentes tamaños
- **Accesibilidad** → Contraste adecuado, tamaños legibles

---
**Estado**: 💡 Idea  
**Prioridad**: Media  
**Complejidad**: Baja-Media  
**ROI Estimado**: Medio-Alto (engagement + branding)