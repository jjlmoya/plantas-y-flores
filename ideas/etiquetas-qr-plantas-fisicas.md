# Etiquetas QR para Plantas Físicas

## Concepto
Etiquetas físicas imprimibles con QR que llevan directamente al calendario específico de cada planta, para usuarios que tengan las plantas reales en casa/jardín.

## Funcionalidad Core
1. **QR específico por planta** → Lleva directo a `/calendario/{categoria}/{planta}`
2. **Diseño imprimible** → PDF/PNG optimizado para stickers/etiquetas
3. **Información mínima visible** → Nombre común + QR + logo del sitio
4. **Resistente al exterior** → Diseño que funcione en etiquetas impermeables
5. **Generación automática** → Para todas las plantas del calendario existente

## Ejemplo Visual de Etiqueta
```
┌─────────────────────┐
│  🌹 Rosa Princesa   │
│   de Mónaco         │
│                     │
│    ████████████     │ ← QR Code
│    ██  ████  ██     │
│    ████████████     │
│                     │
│  plantasyflores.   │
│      online         │
└─────────────────────┘
```

## Casos de Uso
- **Jardineros principiantes** → "¿Cuándo riego esta planta?"
- **Jardines comunitarios** → Información compartida entre usuarios
- **Viveros/Tiendas** → Valor añadido con las plantas vendidas
- **Educación** → Colegios/institutos con huertos escolares
- **Recordatorio personal** → "¿Era ahora cuando se poda?"

## Flujo de Usuario
1. **Escanea QR** desde su teléfono junto a la planta
2. **Acceso directo** al calendario específico de ESA planta
3. **Ve tareas del mes actual** → "Regar 2x/semana, fertilizar"
4. **Acceso inmediato** a cuidados sin buscar

## Formatos de Descarga
- **Stickers redondos** (4cm diámetro) → Para macetas pequeñas
- **Etiquetas rectangulares** (6x4cm) → Para plantas de jardín  
- **Estacas plantables** (10cm altura) → Para plantas de exterior
- **PDF multipágina** → 20 etiquetas por hoja A4

## Ubicación en el Sitio
- **Botón "Descargar Etiqueta"** en cada página de planta
- **Sección dedicada** `/etiquetas/` con generador masivo
- **En calendario individual** → "Imprimir etiqueta para esta planta"
- **Pack descargable** → Top 20 plantas más populares

## Ventaja Competitiva
- ✅ **Conexión físico-digital** única en el sector
- ✅ **Usa calendario existente** → No desarrollo extra
- ✅ **Valor agregado real** → Utilidad práctica inmediata
- ✅ **Viral potencial** → La gente comparte etiquetas bonitas
- ✅ **Monetización indirecta** → Más engagement + branding

## Implementación Técnica
### QR Generation
- **Librería**: `qrcode.js` o similar
- **URL destino**: `https://plantasyflores.online/calendario/{categoria}/{planta}`
- **Formato**: PNG de alta resolución (300dpi)

### Diseño Template
- **Canvas API** para generar imagen final
- **Template base** con logo + diseño
- **Texto dinámico** → Nombre de la planta
- **QR dinámico** → URL específica

### Generación Masiva
```javascript
// Pseudo-código
plants.forEach(plant => {
  generateQRLabel({
    plantName: plant.name,
    qrUrl: `${baseUrl}/calendario/${plant.category}/${plant.slug}`,
    template: 'sticker-round'
  })
})
```

## Métricas Clave
- **Descargas por planta** → Qué plantas son más populares físicamente
- **Scans QR únicos** → Cuánta gente realmente los usa
- **Conversión scan → engagement** → ¿Navegan después del scan?
- **Top plantas físicas** → Insights para contenido futuro

## Casos de Éxito Esperados
- **Jardinero principiante** → "¡Perfecto! Ya no olvido cuándo regar"
- **Jardín comunitario** → "Todos saben cómo cuidar cada planta"
- **Vivero colaborador** → "Damos valor extra con nuestras plantas"
- **Profesor huerto escolar** → "Los niños aprenden escaneando"

## Roadmap de Desarrollo
### Fase 1: MVP
- Generador básico para plantas individuales
- Template único (sticker redondo)
- Descarga directa en PDF

### Fase 2: Expansión
- Múltiples templates (rectangular, estaca, etc.)
- Generador masivo por categoría
- Página dedicada `/etiquetas/`

### Fase 3: Avanzado
- Templates personalizables
- Integración con viveros (API)
- Estadísticas de uso por QR

---
**Estado**: 💡 Idea  
**Prioridad**: Media-Alta  
**Complejidad**: Baja-Media  
**ROI Estimado**: Alto (engagement + branding)