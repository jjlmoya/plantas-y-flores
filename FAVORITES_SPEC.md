# ⚠️ SISTEMA FAVORITOS - ESPECIFICACIÓN FÉRREA

**CREADO**: 2025-01-24  
**PROPÓSITO**: Evitar sobreingeniería en futuras sesiones de desarrollo

---

## ❌ PROHIBIDO ABSOLUTAMENTE

### **Arquitectura:**
- ❌ **EventBus propio** (usar Pinia/composables Vue nativos)
- ❌ **IndexedDB** en MVP (solo localStorage)
- ❌ **Repository pattern** complejo
- ❌ **Service layers** múltiples
- ❌ **Dependency injection**

### **Features:**
- ❌ **Colecciones/carpetas** en V1
- ❌ **Tags personalizados**
- ❌ **Export a PDF** en MVP
- ❌ **Calendario integrado** en V1
- ❌ **Recomendaciones "inteligentes"**
- ❌ **Sincronización cloud** en MVP
- ❌ **Analytics personales** avanzados

### **Promesas de marketing:**
- ❌ **Métricas inventadas** (73%, +142%, etc.)
- ❌ **Beneficios SEO directos** exagerados
- ❌ **ROI prometido** sin datos

---

## ✅ PERMITIDO ÚNICAMENTE

### **Arquitectura MVP:**
- ✅ **3 archivos máximo** para todo el sistema
- ✅ **localStorage** simple con try/catch
- ✅ **Composables Vue** para estado reactivo
- ✅ **Bundle <5KB** adicional gzipped

### **Funcionalidad MVP:**
- ✅ **Botón favorito** en PlantCard existente
- ✅ **Página /favoritos/** básica
- ✅ **Contador** en navegación
- ✅ **Límite 200 elementos**
- ✅ **Estado vacío** amigable

### **Integración:**
- ✅ **Modificar PlantCard.vue** (máximo 3 líneas)
- ✅ **Badge en Navigation.vue**
- ✅ **Reutilizar PlantGrid.vue** existente

---

## 🏗️ ESTRUCTURA PERMITIDA

```
src/
├── favorites-mvp/
│   ├── README.md          # Este archivo con restricciones
│   ├── storage.js         # SOLO localStorage
│   └── composable.js      # Estado Vue reactivo
└── pages/
    └── favoritos.astro    # Página nueva
```

**TOTAL: 3 archivos nuevos máximo**

---

## 📋 CRITERIOS ACEPTACIÓN

### **Funcionalidad:**
- [ ] Botón favorito persiste después de F5
- [ ] Página favoritos carga <2s con 100 plantas
- [ ] Contador actualiza sin FOUC
- [ ] localStorage deshabilitado no crashea
- [ ] Funciona con teclado + screen reader

### **Performance:**
- [ ] Bundle JS adicional <5KB gzipped
- [ ] Sin impacto en LCP/CLS existente
- [ ] Carga diferida en páginas que no usan favoritos

### **Código:**
- [ ] Máximo 3 archivos nuevos
- [ ] Solo localStorage (no IndexedDB)
- [ ] Sin EventBus propio
- [ ] Tests básicos incluidos

---

## 🧪 TESTS OBLIGATORIOS

```javascript
describe('Favorites MVP - SPEC FÉRREA', () => {
  test('solo localStorage, nunca IndexedDB')
  test('bundle size <5KB gzipped') 
  test('máximo 3 archivos sistema favoritos')
  test('persiste tras recarga página')
  test('límite 200 elementos respetado')
  test('localStorage disabled no crashea')
})
```

---

## 📊 MÉTRICAS REALISTAS

### **Objetivos medibles:**
- 📊 **Adopción**: % usuarios que guardan ≥1 favorito
- 📊 **Páginas/sesión**: usuarios con favoritos vs sin favoritos
- 📊 **Retención**: usuarios que vuelven a /favoritos/ en 7 días

### **SIN promesas infladas:**
- ❌ No prometer +X% engagement específico
- ❌ No inventar estadísticas del sector
- ❌ No prometer beneficios SEO directos

---

## ⚠️ CHECKPOINT DE VALIDACIÓN

**Antes de cualquier cambio, preguntar:**

1. ¿Respeta el límite de 3 archivos?
2. ¿Usa solo localStorage (no IndexedDB)?
3. ¿No añade EventBus propio?
4. ¿Bundle sigue siendo <5KB?
5. ¿Está en la lista de "PERMITIDO"?

**Si cualquier respuesta es NO → PARAR y revisar esta spec**

---

## 🎯 PRÓXIMAS VERSIONES (V2, V3...)

**Solo después de que MVP funcione 100%:**
- V2: Colecciones simples
- V3: Export básico
- V4: Integración calendario

**Cada versión requiere nueva spec y validación de usuario**

---

**⚠️ RECORDATORIO**: Si Claude sugiere algo fuera de esta spec, mostrarle este archivo y NO proceder hasta validar con usuario.