# Widget de Recomendación Inteligente

## Concepto
Widget que cruza mes actual + clima local + dificultad del usuario para recomendar plantas perfectas para plantar "ahora mismo".

## Funcionalidad Core
1. **Detecta mes actual** → "Estamos en agosto"
2. **Obtiene clima local** → Geolocalización + API meteorológica  
3. **Filtra por dificultad** → Usuario selecciona: Principiante/Intermedio/Avanzado
4. **Cruza con calendario existente** → Qué se puede plantar AHORA
5. **Muestra 3-4 plantas perfectas** con CTA directo

## Ejemplo Visual del Widget
```
🌟 "Perfectas para ti en Agosto"
┌─────────────────┐
│ 🍅 Tomates Cherry │ → "Ver guía + Comprar semillas"
│ 🌿 Albahaca      │ → "Ver guía + Comprar semillas"  
│ 🌹 Geranios      │ → "Ver guía + Comprar semillas"
└─────────────────┘
"Basado en tu ubicación (Madrid) y nivel (Principiante)"
```

## Ubicaciones Estratégicas
- **Homepage** (arriba, muy visible)
- **Sidebar** en artículos de plantas
- **Pop-up inteligente** después de X páginas visitadas
- **Footer widget** como alternativa

## Métricas Clave
- **CTR del widget** → ¿La gente hace clic?
- **Conversión ficha → tienda** → ¿Realmente compran?
- **Plantas más populares por mes/región** → Data para optimizar
- **Engagement por ubicación** → Dónde funciona mejor

## Ventaja Competitiva
- ✅ **Nadie más está haciendo esto** - Combinación única
- ✅ **Usa calendario existente** - No empezar de cero  
- ✅ **Personalización real** - Sin complexity innecesaria
- ✅ **CTA directo** - Monetización clara
- ✅ **Data valiosa** - Insights de comportamiento usuario

## Implementación Técnica
### APIs Necesarias
- **Geolocalización**: `navigator.geolocation`
- **Clima**: OpenWeatherMap API o similar
- **Calendario**: Sistema existente de la web

### Lógica de Filtrado
1. Filtrar plantas del calendario por mes actual
2. Filtrar por condiciones climáticas locales
3. Aplicar filtro de dificultad
4. Rankear por popularidad/éxito histórico
5. Mostrar top 3-4 con CTAs

## Notas de Desarrollo
- Usar sistema de calendario existente como base de datos
- Implementar cache para evitar llamadas API excesivas
- A/B testing en diferentes posiciones
- Tracking detallado para optimización continua

---
**Estado**: 💡 Idea  
**Prioridad**: Alta  
**Complejidad**: Media  
**ROI Estimado**: Alto