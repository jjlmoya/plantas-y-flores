# 📝 GUÍA COMPLETA PARA REDACTORES DE CONTENIDO
## Creación de Plantas en PlantasyFlores.online

---

## 🎯 INTRODUCCIÓN

Esta guía te enseña cómo crear contenido completo para nuevas plantas en el sitio web. Cada planta necesita **dos componentes**:

1. **Calendario de cultivo** (archivo JSON con datos técnicos)
2. **Artículo informativo** (entrada en pages.json con contenido HTML)

**Tiempo estimado por planta**: 2-3 horas

### 📂 **Archivos que vas a crear/editar:**

1. **Calendario**: `public/data/calendar/{categoria}/{planta-slug}.json`
   - Datos técnicos de cultivo en formato JSON
   
2. **Artículo**: Añadir entrada en `public/data/pages.json`
   - Información del artículo + HTML en campo `seo_html`

---

## 🌱 PASO 1: INFORMACIÓN BÁSICA

### ✅ Datos Obligatorios que Debes Investigar

#### 📋 **Información Botánica**
- **Nombres comunes**: Mínimo 2 (ej: "Rosa, Rosal" o "Tomate, Tomatera")
- **Nombre científico**: Completo con género, especie y cultivar
  - ✅ Correcto: `Rosa 'Princesa de Mónaco'`
  - ✅ Correcto: `Solanum lycopersicum`
  - ❌ Incorrecto: `Rosa` (incompleto)
- **Familia botánica**: De esta lista oficial:
  - Rosaceae, Solanaceae, Lamiaceae, Brassicaceae, Cucurbitaceae, Leguminosae, Asteraceae, Liliaceae, Amaryllidaceae, Orchidaceae, Malvaceae, Apiaceae, Caryophyllaceae, Ranunculaceae, Papaveraceae
- **País de origen**: Código de 2 letras (ES=España, MX=México, IT=Italia, US=Estados Unidos, FR=Francia, UK=Reino Unido, NL=Holanda, etc.)

#### 🎖️ **Clasificación**
**Dificultad de cultivo:**
- **beginner** (Principiante): Muy fácil, perdona errores, resistente
- **intermediate** (Intermedio): Requiere conocimientos básicos, cuidados regulares
- **advanced** (Avanzado): Necesita experiencia, cuidados específicos
- **expert** (Experto): Muy difícil, técnicas especializadas

**Tipo de planta:**
- **annual**: Vive 1 año (tomates, lechugas, cosmos)
- **perennial**: Vive varios años (rosas, hibiscus, lavanda)
- **perennial_bulb**: Bulbo que rebrota anualmente (tulipanes, lirios)
- **biennial**: Vive 2 años (algunas coles)
- **shrub**: Arbusto leñoso (azaleas, hortensias)
- **tree**: Árbol (mango, plátano)

---

## 📄 ESTRUCTURA DEL ARCHIVO JSON DEL CALENDARIO

### 🔧 **Crear archivo**: `public/data/calendar/{categoria}/{planta-slug}.json`

```json
{
  "key": "planta-slug",
  "plant_info": {
    "common_names": ["Nombre Principal", "Nombre Alternativo"],
    "scientific_name": "Genus species 'Cultivar'",
    "origin": "ES",
    "type": "perennial",
    "difficulty": "beginner",
    "family": "Rosaceae"
  },
  "calendar_data": {
    "planting": {
      "best_months": [3, 4, 5],
      "alternative_months": [2, 6]
    },
    "flowering": {
      "best_months": [6, 7, 8],
      "peak_months": [7]
    },
    "harvesting": {
      "best_months": [8, 9, 10],
      "peak_months": [9],
      "days_to_harvest": [90, 120],
      "harvest_indicators": "Descripción de cuándo cosechar"
    },
    "care_calendar": {
      "monthly_tasks": {
        "1": ["dormant_protection"],
        "2": ["prune_main", "fertilize"],
        "3": ["planting", "soil_preparation"],
        "4": ["transplant", "moderate_watering"],
        "5": ["moderate_watering", "fertilize"],
        "6": ["harvest_early", "pest_monitoring"],
        "7": ["harvest_main"],
        "8": ["harvest_main"],
        "9": ["harvest_late", "reduce_watering"],
        "10": ["plant_cleanup"],
        "11": ["prepare_winter"],
        "12": ["dormant_protection"]
      }
    }
  },
  "growing_conditions": {
    "sun_requirements": "full_sun",
    "water_needs": "moderate",
    "soil_type": "well_drained",
    "soil_ph": [6.0, 7.5],
    "spacing": {
      "plant_distance": 30,
      "row_distance": 60
    },
    "companion_plants": ["ajo", "albahaca"],
    "avoid_plants": ["tomate", "patata"],
    "temperature_range": [15, 25],
    "special_care": "Descripción de cuidados especiales"
  },
  "flower_data": {
    "colors": ["red", "pink", "white"],
    "flower_shape": "single",
    "size": "large",
    "bloom_duration": "1 semana",
    "fragrance": "strong"
  },
  "harvest_data": {
    "days_to_harvest": [60, 90],
    "storage_life": 7,
    "preservation_methods": ["drying", "freezing"],
    "harvest_tips": "Cosechar por la mañana"
  },
  "nutritional_data": {
    "calories_per_100g": 25,
    "water_content": 85,
    "properties": ["high_vitamin_c", "antioxidant_rich"]
  },
  "culinary_data": {
    "uses": ["fresh", "sauce"],
    "flavor_profile": "sweet",
    "preparation": "Lavar antes de consumir"
  },
  "_meta": {
    "main_image": "/wp-content/uploads/path/image.webp",
    "article_date": "2024-01-20T10:00:00",
    "excerpt": "Descripción SEO optimizada de la planta..."
  }
}
```

### ⚠️ **IMPORTANTE**: 
- El campo `"key"` debe ser EXACTAMENTE igual al nombre del archivo sin `.json`
- Solo incluye las secciones que aplican a tu tipo de planta:
  - `flower_data`: Solo para ornamentales
  - `harvest_data`, `nutritional_data`, `culinary_data`: Solo para comestibles
  - `pollination_data`: Solo para orquídeas especiales

---

## 📄 ESTRUCTURA DEL ARTÍCULO EN PAGES.JSON

### 🔧 **Editar archivo**: `public/data/pages.json`

Añadir esta estructura al final del array (antes del `]` final):

```json
{
  "id": 9999,
  "type": "page",
  "slug": "planta-slug",
  "date": "2024-01-20T10:00:00",
  "title": "Título de la Planta (máx 60 caracteres)",
  "excerpt": "Descripción atractiva de 150-160 caracteres que aparece en búsquedas y redes sociales.",
  "featured_image": null,
  "categories": [
    {
      "slug": "categoria",
      "name": "Categoría"
    }
  ],
  "tags": [],
  "seo_html": "AQUÍ VA TODO EL HTML DEL ARTÍCULO",
  "main_image": "/wp-content/uploads/path/image.webp"
}
```

### 📝 **CAMPO CRÍTICO: `seo_html`**

**Este campo contiene TODO el contenido del artículo en HTML**. Aquí es donde escribes el artículo completo siguiendo la estructura que se explica más abajo.

### ⚠️ **IMPORTANTE**: 
- El `"id"` debe ser único - usa el siguiente número disponible
- El `"slug"` debe ser EXACTAMENTE igual al `"key"` del calendario JSON
- La `"categoria"` debe coincidir con el directorio del calendario
- Añade una coma `,` después del objeto anterior antes de añadir el tuyo

### 🔍 **Cómo encontrar el ID correcto:**
1. Abre `public/data/pages.json`
2. Busca el último objeto en el array
3. Mira el campo `"id"` del último objeto
4. Tu nuevo ID será ese número + 1

### 📍 **URLs que se generan:**
- **Categoría**: `https://plantasyflores.online/{categoria}/`
- **Planta**: `https://plantasyflores.online/{categoria}/{slug}/`
- **Calendario**: `https://plantasyflores.online/calendario/{categoria}/{slug}/`

---

## 📅 PASO 2: CALENDAR IO DE CULTIVO

### 🌱 **Meses de Actividad** (Usar números 1-12, donde 1=Enero, 12=Diciembre)

#### **Plantación**
- **Meses mejores**: Los 3-4 meses ideales para plantar
- **Meses alternativos**: Cuando también se puede plantar pero no es óptimo

#### **Floración**
- **Meses de floración**: Cuando florece la planta
- **Meses pico**: El mejor momento de floración

#### **Cosecha** (Solo para plantas comestibles)
- **Meses de cosecha**: Cuándo se puede cosechar
- **Cosecha pico**: Los mejores meses

### 📝 **Tareas Mensuales**

Para cada mes, selecciona las tareas aplicables de esta lista:

#### **🌱 Siembra y Plantación**
- `prepare_seedbeds` - Preparar semilleros
- `sowing_indoor` - Sembrar en interior
- `sowing_outdoor` - Sembrar al aire libre
- `transplant` - Trasplantar plantones
- `planting` - Plantar directamente

#### **💧 Riego**
- `heavy_watering` - Riego abundante (verano caluroso)
- `moderate_watering` - Riego moderado (primavera/otoño)
- `minimal_watering` - Riego mínimo (invierno)
- `water_restriction` - Restringir riego

#### **✂️ Podas y Mantenimiento**
- `prune_main` - Poda principal (invierno)
- `prune_shoots` - Podar brotes nuevos
- `deadhead` - Quitar flores marchitas
- `sucker_removal` - Quitar chupones
- `structural_pruning` - Poda de formación

#### **🌾 Cosecha**
- `harvest_early` - Cosecha temprana
- `harvest_main` - Cosecha principal
- `harvest_late` - Cosecha tardía
- `harvest_petals` - Cosechar pétalos (rosas)
- `harvest_leaves` - Cosechar hojas (hierbas)
- `harvest_calyces` - Cosechar cálices (hibiscus)

#### **🧪 Fertilización y Cuidados**
- `fertilize` - Fertilizar
- `mulching` - Poner acolchado
- `pest_monitoring` - Vigilar plagas
- `plant_cleanup` - Limpiar planta
- `prepare_winter` - Preparar para invierno
- `dormant_protection` - Protección en reposo

#### **🔧 Tareas Especiales**
- `hand_pollinate` - Polinización manual (orquídeas como vainilla)
- `hill_soil` - Aporcar (patatas)
- `cure` - Curar/secar (patatas post-cosecha, vainilla)
- `support_pods` - Soportar vainas (vainilla)
- `maintain_humidity` - Mantener humedad (orquídeas tropicales)
- `divide_bulbs` - Dividir bulbos
- `install_supports` - Instalar soportes/tutores

---

## 🌍 PASO 3: CONDICIONES DE CULTIVO

### ☀️ **Necesidades de Sol**
- `full_sun` - Sol directo todo el día (8+ horas)
- `partial_sun` - Sol parcial (4-6 horas)
- `partial_shade` - Sombra parcial (2-4 horas sol)
- `full_shade` - Sombra completa
- `morning_sun` - Sol solo por la mañana
- `afternoon_shade` - Sombra en las horas de más calor

### 💧 **Necesidades de Agua**
- `very_low` - Muy poco riego (cactus, suculentas)
- `low` - Poco riego (lavanda, romero)
- `moderate` - Riego moderado (mayoría de plantas)
- `moderate_to_high` - Riego moderado a alto
- `high` - Mucho riego (fresas, tomates)
- `very_high` - Riego constante (orquídeas, plantas acuáticas)

### 🌍 **Tipo de Suelo**
- `well_drained` - Bien drenado (sin encharcamientos)
- `well_drained_fertile` - Bien drenado y fértil
- `sandy` - Arenoso (drena rápido)
- `sandy_loam` - Franco-arenoso
- `clay` - Arcilloso (retiene humedad)
- `clay_loam` - Franco-arcilloso
- `organic_rich` - Rico en materia orgánica
- `moist` - Húmedo
- `moist_well_drained` - Húmedo pero con buen drenaje

### 📏 **Espaciado y Medidas**
- **Distancia entre plantas**: Centímetros entre cada planta
- **Distancia entre filas**: Centímetros entre hileras
- **pH del suelo**: Rango entre 4.0 y 8.0 (ej: [6.0, 7.5])
- **Rango de temperatura**: Mínima y máxima en °C (ej: [-5, 35])

---

## 🌺 PASO 4: INFORMACIÓN ESPECIALIZADA

### **Para Plantas Ornamentales** 🌹

#### **Datos de Flor:**
- **Colores**: white, red, pink, yellow, orange, purple, blue, green, black, multicolor, cream, salmon, magenta, burgundy
- **Tamaño de flor**: small, medium, large, extra_large
- **Fragancia**: none, mild, moderate, strong, very_strong
- **Forma de flor**: Descripción libre (ej: "single_late", "trompeta", "orchid")
- **Duración floración**: Cuánto dura cada flor (ej: "1 día", "3 semanas")

### **Para Plantas Comestibles** 🍅

#### **Datos de Cosecha:**
- **Días hasta cosecha**: Rango desde plantación (ej: [75, 120])
- **Peso del fruto**: Gramos promedio (ej: [15, 30])
- **Vida útil**: Días que se conserva fresco
- **Métodos conservación**: fresh, drying, freezing, oil_infusion, vinegar_infusion, canning, dehydrating
- **Indicadores cosecha**: Descripción de cuándo cosechar

#### **Datos Nutricionales:**
- **Calorías por 100g**: Valor calórico
- **Contenido agua**: Porcentaje de agua
- **Propiedades nutricionales**: high_vitamin_c, high_vitamin_a, antioxidant_rich, fiber_rich, protein_rich, iron_rich, calcium_rich, potassium_rich

#### **Usos Culinarios:**
- **Usos principales**: fresh, sauce, paste, canning, drying, oil_extraction
- **Perfil de sabor**: sweet, sour, bitter, spicy, aromatic
- **Preparación**: Cómo preparar antes de consumir

### **Para Bulbosas** 🌷

#### **Cuidado de Bulbos:**
- **Profundidad plantación**: Descripción (ej: "3_times_bulb_height")
- **Método almacenaje**: cool_dry_ventilated, sand_storage
- **Cuándo levantar**: after_foliage_yellows, autumn
- **Frecuencia división**: every_3_years, every_4_years
- **Requerimientos frío**: Descripción (ej: "12_weeks_below_10c")

### **Para Plantas Especiales** 🌺

#### **Datos de Polinización** (Orquídeas como vainilla):
- **Método**: hand_pollination, natural
- **Momento**: morning_hours, afternoon
- **Herramientas**: toothpick, soft_brush, specialized_tools
- **Tasa éxito**: low_without_intervention, moderate, high

---

## 📖 PASO 5: REDACCIÓN DEL ARTÍCULO

### 📝 **Escribir en el campo `seo_html` de pages.json**

El contenido HTML del artículo va en el campo `"seo_html"` de la entrada en `pages.json`. 

**FORMATO CRÍTICO**:
```json
"seo_html": "<h2>Qué es la Rosa</h2><p>La <strong>rosa</strong> es una planta...</p><h3>Origen</h3><p>Descripción del origen...</p>"
```

**REGLAS IMPORTANTES**: 
- Todo el HTML debe estar **en una sola línea** (sin saltos de línea)
- No uses comillas dobles `"` dentro del HTML (usa `&quot;` si necesitas comillas)
- No uses caracteres especiales sin escapar
- Cada etiqueta HTML debe estar correctamente cerrada

### 📖 **Estructura HTML Obligatoria**

#### **🔤 Título del Artículo**
- Máximo 60 caracteres
- Incluye el nombre principal de la planta
- Atractivo y descriptivo
- ✅ Ejemplo: "Rosa Princesa de Mónaco: Cultivo y Cuidados"

#### **📝 Descripción (Excerpt)**
- 150-160 caracteres máximo
- Gancho atractivo que invite a leer
- Incluye beneficio principal
- ✅ Ejemplo: "Descubre cómo cultivar la elegante Rosa Princesa de Mónaco en tu jardín. Guía completa de plantación, cuidados y floración."

### 📋 **Secciones del Artículo**

#### **1. Qué es la [Planta] (H2)**

**Ejemplo formateado para JSON:**
```json
"<h2>Qué es la Rosa Princesa de Mónaco</h2><p>La <strong>Rosa Princesa de Mónaco</strong> es una de las variedades más elegantes y refinadas del mundo de las rosas. Con sus <strong>pétalos bicolores</strong> blancos con bordes rosados, esta rosa híbrida de té cautiva por su belleza única y su <strong>fragancia delicada</strong>.</p><p>Esta variedad se caracteriza por su <strong>floración abundante</strong> desde primavera hasta otoño, produciendo flores de gran tamaño que pueden alcanzar los 12 cm de diámetro. Es perfecta tanto para <strong>jardines ornamentales</strong> como para <strong>flor cortada</strong>.</p>"
```

**Contenido (para redactar):**
- Descripción general en 2-3 párrafos  
- Características distintivas que la hacen especial
- Por qué vale la pena cultivarla
- Incluye palabras clave en **negritas**

#### **2. Características y Variedades (H3)**
```json
"<h3>Características y Variedades</h3><p>Su nombre científico es <strong><em>Rosa 'Princesa de Mónaco'</em></strong>. También conocida como <strong>Princess of Monaco</strong> o <strong>Rosa Meimagarmic</strong>.</p><p>Esta variedad pertenece al grupo de <strong>rosas híbridas de té</strong> y se caracteriza por sus flores de <strong>gran tamaño</strong> (10-12 cm), <strong>pétalos numerosos</strong> (25-30 por flor) y su distintivo <strong>patrón bicolor</strong> que la hace única entre las rosas.</p>"
```

#### **3. Origen e Historia (H3)**
```
- País o región de origen
- Historia interesante de la planta
- Cómo llegó a cultivarse en España
- Curiosidades relevantes
```

#### **4. Cómo Cultivar [Planta] (H2)**

**Cuándo plantar (H3)**
```
- Mejor época del año con meses específicos
- Diferencias según clima (mediterráneo vs continental)
- Consideraciones de temperatura
- Consejos para timing perfecto
```

**Dónde plantar (H3)**
```
- Requerimientos de luz solar
- Protección necesaria (viento, heladas)
- Interior vs exterior
- Consideraciones de espacio
```

**Tierra y suelo (H3)**
```
- Tipo de suelo específico
- Rango de pH requerido
- Preparación del terreno
- Mejoras necesarias del suelo
```

**Cómo plantar (H3)**
```
- Instrucciones paso a paso
- Profundidad de plantación
- Espaciado entre plantas
- Técnicas específicas
```

#### **5. Cuidados de la [Planta] (H2)**

**Riego (H3)**
```
- Frecuencia por estación del año
- Cantidad de agua necesaria
- Técnica de riego recomendada
- Señales de exceso o falta de agua
```

**Fertilización (H3)**
```
- Tipo de fertilizante recomendado
- Cuándo aplicar (meses específicos)
- Frecuencia de aplicación
- Signos de necesidad nutricional
```

**Poda (H3)**
```
- Cuándo podar (épocas específicas)
- Cómo realizar la poda
- Herramientas necesarias
- Cuidados post-poda
```

**Plagas y Enfermedades (H3)**
```
- Problemas más comunes
- Prevención efectiva
- Tratamientos naturales y químicos
- Cuándo buscar ayuda profesional
```

#### **6A. Para Comestibles: Cosecha y Usos (H2)**

**Cuándo y Cómo Cosechar (H3)**
```
- Indicadores de madurez
- Mejor momento del día
- Técnica de cosecha
- Herramientas necesarias
```

**Conservación y Almacenaje (H3)**
```
- Métodos de conservación
- Tiempo de almacenaje
- Condiciones óptimas
- Procesamiento para largo plazo
```

**Usos Culinarios y Beneficios (H3)**
```
- Aplicaciones en cocina
- Propiedades nutricionales
- Beneficios para la salud
- Recetas o preparaciones populares
```

#### **6B. Para Ornamentales: Diseño de Jardín (H2)**

**Uso en Paisajismo (H3)**
```
- Mejores ubicaciones en el jardín
- Combinaciones de colores
- Uso como focal point o masa
- Consideraciones de diseño
```

**Plantas Compañeras (H3)**
```
- Mejores plantas de acompañamiento
- Plantas a evitar cerca
- Beneficios mutuos
- Esquemas de plantación
```

**Mantenimiento Estacional (H3)**
```
- Cuidados por estación
- Calendario de mantenimiento
- Preparación para invierno
- Renovación y división
```

### ✍️ **Estilo de Redacción**

#### **📝 Tono y Voz**
- **Usa "tú" directamente**: "Si quieres cultivar rosas..."
- **Tono cercano e instructivo**: Como un jardinero experto que aconseja
- **Alentador y positivo**: "Es más fácil de lo que parece"
- **Específico y práctico**: En lugar de "algo de agua", "2-3 veces por semana"

#### **📐 Formato**
- **Párrafos cortos**: 2-4 líneas máximo
- **Listas numeradas**: Para procesos paso a paso
- **Listas con viñetas**: Para opciones o características
- **Negritas**: Para **términos importantes** y **palabras clave**
- **Cursivas**: Para *nombres científicos* únicamente

#### **🔍 SEO y Palabras Clave**
- **Palabra clave principal**: Nombre de la planta, debe aparecer en:
  - Título del artículo
  - Primer H2
  - 2-3 veces en el texto
  - Alt text de la imagen
- **Palabras clave secundarias**: Incluir sinónimos y variaciones
- **Enlaces internos**: Mencionar plantas relacionadas con enlaces
- **Call-to-action**: Invitar a explorar plantas similares

---

### 💡 **HERRAMIENTA ÚTIL: Convertir HTML a una línea**

Para convertir tu HTML con saltos de línea a formato JSON:
1. Escribe tu artículo con saltos de línea normales
2. Usa un convertidor online de "HTML to JSON string"
3. O reemplaza manualmente: elimina todos los saltos de línea y espacios extra

**Ejemplo de conversión:**
```html
<!-- ANTES (para escribir): -->
<h2>Título</h2>
<p>Párrafo con <strong>negritas</strong>.</p>
<h3>Subtítulo</h3>

<!-- DESPUÉS (para JSON): -->
"<h2>Título</h2><p>Párrafo con <strong>negritas</strong>.</p><h3>Subtítulo</h3>"
```

---

## 📋 PLANTILLAS RÁPIDAS

### 🌹 **ORNAMENTAL (Ejemplo: Rosa)**

#### **Datos Básicos**
```
Nombres comunes: Rosa, Rosal
Científico: Rosa 'Cultivar'
Familia: Rosaceae
Origen: [FR/UK/US según variedad]
Tipo: perennial
Dificultad: intermediate
```

#### **Calendario Típico**
```
Plantación: [3, 4, 10, 11]
Floración: [5, 6, 7, 8, 9]
Pico floración: [6, 7]

Tareas por mes:
1: dormant_protection
2: prune_main, soil_preparation  
3: planting, fertilize, mulching
4: planting, moderate_watering
5: moderate_watering, fertilize, deadhead
6-9: moderate_watering, deadhead
10: planting, moderate_watering, plant_cleanup
11: planting, prune_shoots, mulching
12: dormant_protection
```

#### **Condiciones**
```
Sol: full_sun
Agua: moderate  
Suelo: well_drained_fertile
pH: [6.0, 7.5]
Espaciado: 60cm plantas, 80cm filas
Temperatura: [-15, 35]
```

---

### 🍅 **COMESTIBLE ANUAL (Ejemplo: Tomate)**

#### **Datos Básicos**
```
Nombres comunes: Tomate, Tomatera
Científico: Solanum lycopersicum
Familia: Solanaceae
Origen: MX
Tipo: annual
Dificultad: intermediate
```

#### **Calendario Típico**
```
Plantación: [4, 5, 6]
Floración: [6, 7, 8]
Cosecha: [7, 8, 9, 10]
Pico cosecha: [8, 9]

Tareas por mes:
1: prepare_seedbeds, soil_preparation
2: sowing_indoor, fertilize
3: sowing_indoor, transplant
4: transplant, install_supports
5: moderate_watering, mulching
6: moderate_watering, fertilize, sucker_removal
7: harvest_early, moderate_watering
8-9: harvest_main, moderate_watering
10: harvest_late, plant_cleanup
11-12: soil_preparation
```

#### **Condiciones**
```
Sol: full_sun
Agua: moderate
Suelo: well_drained_fertile
pH: [6.0, 7.0]
Espaciado: 60cm plantas, 90cm filas
Temperatura: [10, 35]
```

#### **Datos Comestibles**
```
Días cosecha: [75, 120]
Peso fruto: [80, 200] gramos
Conservación: 7-14 días
Calorías: 18 por 100g
Propiedades: high_vitamin_c, antioxidant_rich
Sabor: sweet_acidic
```

---

### 🌷 **BULBOSA (Ejemplo: Tulipán)**

#### **Datos Básicos**
```
Nombres comunes: Tulipán
Científico: Tulipa 'Cultivar'
Familia: Liliaceae
Origen: NL
Tipo: perennial_bulb
Dificultad: beginner
```

#### **Calendario Típico**
```
Plantación: [10, 11, 12]
Floración: [4, 5]
Pico floración: [5]

Tareas por mes:
1-2: monitor_growth
3: remove_mulch, fertilize_light
4-5: water_moderately, enjoy_blooms
6: allow_foliage_yellow, reduce_watering
7: lift_bulbs_optional, store_dry
8-9: [reposo]
10: planting, prepare_beds
11: planting, mulch_protection
12: mulch_protection
```

#### **Condiciones**
```
Sol: full_sun
Agua: moderate
Suelo: well_drained
pH: [6.0, 7.5]
Espaciado: 12cm plantas, 18cm filas
Temperatura: [-20, 25]
Frío: 12_weeks_below_10c
```

#### **Datos Bulbosa**
```
Profundidad: 3_times_bulb_height
Almacenaje: cool_dry_ventilated
Levantar: after_foliage_yellows
División: every_4_years
```

---

### 🌿 **HIERBA AROMÁTICA (Ejemplo: Albahaca)**

#### **Datos Básicos**
```
Nombres comunes: Albahaca, Basilico
Científico: Ocimum basilicum
Familia: Lamiaceae
Origen: IN
Tipo: annual
Dificultad: beginner
```

#### **Calendario Típico**
```
Plantación: [4, 5, 6]
Floración: [7, 8, 9]
Cosecha: [5, 6, 7, 8, 9]
Pico cosecha: [7, 8]

Tareas por mes:
2-3: sowing_indoor, prepare_beds
4: transplant, planting
5-6: moderate_watering, harvest_leaves, pinching
7-8: moderate_watering, harvest_main
9: harvest_late, reduce_watering
10: plant_cleanup
```

#### **Condiciones**
```
Sol: full_sun
Agua: moderate
Suelo: well_drained_fertile
pH: [6.0, 7.5]
Espaciado: 20cm plantas, 30cm filas
Temperatura: [15, 30]
```

#### **Datos Comestibles**
```
Días cosecha: [60, 90]
Conservación: 10 días fresco
Métodos: drying, oil_infusion, freezing
Sabor: sweet_aromatic
Usos: pesto, sauces, seasoning
```

---

## ✅ CHECKLIST DE VALIDACIÓN

### **📋 Antes de Entregar - Revisa TODO:**

#### **✅ Datos Básicos Completos**
- [ ] Nombres comunes (mínimo 2)
- [ ] Nombre científico verificado y correcto
- [ ] Familia botánica de la lista oficial
- [ ] País origen con código 2 letras
- [ ] Tipo de planta correcto
- [ ] Dificultad apropiada según características

#### **✅ Calendario de Cultivo Completo**
- [ ] Meses de plantación establecidos
- [ ] Meses de floración definidos  
- [ ] Meses de cosecha (si es comestible)
- [ ] Tareas asignadas para LOS 12 MESES
- [ ] Todas las tareas seleccionadas de la lista oficial
- [ ] Tareas coherentes con el tipo de planta

#### **✅ Condiciones de Cultivo Especificadas**
- [ ] Requerimientos de sol de la lista oficial
- [ ] Necesidades de agua de la lista oficial
- [ ] Tipo de suelo de la lista oficial
- [ ] Rango de pH entre 4.0 y 8.0
- [ ] Espaciado en centímetros (ambos campos)
- [ ] Rango de temperatura en °C (mín, máx)

#### **✅ Información Especializada**
- [ ] Datos de flor (si es ornamental)
- [ ] Datos de cosecha (si es comestible)
- [ ] Datos nutricionales (si es comestible)
- [ ] Datos de bulbo (si es bulbosa)
- [ ] Todos los valores de listas oficiales

#### **✅ Artículo Bien Redactado**
- [ ] Estructura H2-H3 seguida correctamente
- [ ] Título SEO de máximo 60 caracteres
- [ ] Descripción de 150-160 caracteres
- [ ] Palabras clave en **negritas**
- [ ] Nombres científicos en *cursivas*
- [ ] Párrafos cortos (2-4 líneas)
- [ ] Tono cercano usando "tú"
- [ ] Información específica y práctica

#### **✅ Optimización SEO**
- [ ] Palabra clave principal en título
- [ ] Palabra clave en primer H2
- [ ] Palabra clave repetida 2-3 veces
- [ ] Sinónimos y variaciones incluidas  
- [ ] Enlaces internos a plantas relacionadas
- [ ] Alt text descriptivo para imagen
- [ ] Call-to-action incluido

#### **✅ Revisión Final**
- [ ] Ortografía y gramática perfectas
- [ ] Información verificada con fuentes confiables
- [ ] Coherencia entre calendario y artículo
- [ ] Datos específicos, no generalidades
- [ ] Consejos prácticos incluidos
- [ ] Formato HTML correcto aplicado

---

## 🎯 CONSEJOS FINALES PARA REDACTORES

### **🔍 Investigación Efectiva**
- **Fuentes confiables**: Universidades, centros de jardinería, libros especializados
- **Verifica nombres**: El nombre científico debe ser exacto
- **Confirma datos**: Si hay información contradictoria, usa la fuente más actual
- **Adapta al clima**: Ajusta recomendaciones al clima mediterráneo/continental español

### **✍️ Redacción Efectiva**
- **Sé específico**: "Riega 2 veces por semana" mejor que "riega regularmente"
- **Incluye consejos**: "Riega por la mañana para evitar hongos"
- **Anticipa problemas**: "Si las hojas amarillean, reduce el riego"
- **Usa ejemplos**: "Como los tomates, necesita mucho sol"

### **📊 SEO Natural**
- **Integra palabras clave naturalmente**: No fuerces repeticiones
- **Varía el vocabulario**: Usa sinónimos para evitar repetición
- **Enlaces útiles**: Solo enlaza a contenido realmente relacionado
- **Piensa en el usuario**: ¿Qué buscaría alguien interesado en esta planta?

### **⚡ Productividad**
- **Usa las plantillas**: Adapta según tipo de planta
- **Investiga primero**: Recopila toda la info antes de escribir
- **Escribe en bloques**: Completa secciones enteras de una vez
- **Revisa al final**: No edites mientras escribes

---

## 📞 CONTACTO Y SOPORTE

Si tienes dudas sobre:
- **Clasificación de plantas**: Consulta con el equipo técnico
- **Tareas específicas**: Revisa ejemplos de plantas similares  
- **SEO y estructura**: Sigue esta guía estrictamente
- **Información botánica**: Verifica en múltiples fuentes confiables

**¡Recuerda!** Cada planta creada con esta guía enriquece el conocimiento de miles de jardineros en España. Tu trabajo ayuda a cultivar más plantas hermosas y saludables.

---

*Última actualización: Enero 2025*
*PlantasyFlores.online - Guía para Redactores v1.0*