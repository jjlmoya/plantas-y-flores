import { createCanvas, loadImage, registerFont } from 'canvas'
import QRCode from 'qrcode'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

/**
 * Generador de tarjetas QR para plantas en build-time
 * Genera imágenes WebP optimizadas para Open Graph
 */

const CONFIG = {
  canvas: {
    width: 1004,
    height: 650
  },
  qr: {
    x: 55,
    y: 150,
    size: 415
  },
  title: {
    x: 65,  // 10px más a la derecha
    y: 50,  // 10px más abajo
    fontSize: 60,
    fontFamily: 'Arial Black',
    color: '#000000',
    maxWidth: 905,
    lineHeight: 1.1
  },
  template: './public/assets/print/plant-card-template.png',
  outputDir: './public/plant-cards',
  baseUrl: 'https://plantasyflores.online'
}

async function generatePlantCard(plant) {
  console.log(`🌱 Generando tarjeta para: ${plant.name}`)
  
  try {
    // 1. Crear canvas
    const canvas = createCanvas(CONFIG.canvas.width, CONFIG.canvas.height)
    const ctx = canvas.getContext('2d')
    
    // 2. Cargar template base
    const template = await loadImage(CONFIG.template)
    ctx.drawImage(template, 0, 0, CONFIG.canvas.width, CONFIG.canvas.height)
    
    // 3. Generar QR code
    const qrUrl = `${CONFIG.baseUrl}/calendario/${plant.category}/${plant.slug}/`
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      width: CONFIG.qr.size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    
    // 4. Dibujar QR
    const qrImage = await loadImage(qrDataUrl)
    ctx.drawImage(qrImage, CONFIG.qr.x, CONFIG.qr.y, CONFIG.qr.size, CONFIG.qr.size)
    
    // 5. Dibujar título
    drawTitle(ctx, plant.name)
    
    // 6. Convertir a WebP y guardar
    const buffer = canvas.toBuffer('image/png')
    const webpBuffer = await sharp(buffer)
      .webp({ 
        quality: 90,
        effort: 6 
      })
      .toBuffer()
    
    const outputPath = path.join(CONFIG.outputDir, `${plant.slug}.webp`)
    fs.writeFileSync(outputPath, webpBuffer)
    
    console.log(`✅ Tarjeta generada: ${plant.slug}.webp`)
    
    return {
      slug: plant.slug,
      name: plant.name,
      category: plant.category,
      cardPath: `/plant-cards/${plant.slug}.webp`,
      success: true
    }
    
  } catch (error) {
    console.error(`❌ Error generando tarjeta para ${plant.name}:`, error.message)
    return {
      slug: plant.slug,
      name: plant.name,
      success: false,
      error: error.message
    }
  }
}

function drawTitle(ctx, plantName) {
  const { x, y, fontFamily, color, maxWidth, lineHeight } = CONFIG.title
  
  // Ajustar tamaño de fuente según longitud del texto
  let fontSize = CONFIG.title.fontSize
  if (plantName.length > 20) {
    fontSize = Math.max(28, fontSize - Math.floor((plantName.length - 20) * 1.5))
  }
  
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  ctx.fillStyle = color
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  
  // Word wrap para nombres largos
  const words = plantName.toUpperCase().split(' ')
  let line = ''
  let currentY = y
  const lineHeightPx = fontSize * lineHeight
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' '
    const metrics = ctx.measureText(testLine)
    
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, currentY)
      line = words[i] + ' '
      currentY += lineHeightPx
    } else {
      line = testLine
    }
  }
  
  if (line.trim()) {
    ctx.fillText(line.trim(), x, currentY)
  }
}

async function generateAllCards() {
  console.log('🚀 Iniciando generación de tarjetas de plantas...')
  console.log('📁 Directorio de trabajo:', process.cwd())
  
  // Verificar que existe el template
  if (!fs.existsSync(CONFIG.template)) {
    console.error(`❌ Template no encontrado: ${CONFIG.template}`)
    console.log('📁 Asegúrate de subir tu diseño a: public/assets/print/plant-card-template.png')
    process.exit(1)
  }
  
  // Crear directorio de salida si no existe
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true })
  }
  
  try {
    // Importar utilidades del calendario
    const { getAvailableCalendarCategories, getCategoryPlantsWithCalendar } = await import('../src/utils/calendar-inheritance.js')
    
    // Obtener todas las plantas del calendario
    const categories = await getAvailableCalendarCategories()
    const plants = []
    
    for (const category of categories) {
      const categoryPlants = await getCategoryPlantsWithCalendar(category)
      
      for (const plant of categoryPlants) {
        // Función para normalizar texto (quitar tildes y caracteres especiales)
        const normalizeText = (text) => {
          return text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Quitar diacríticos
            .replace(/[^\w\s]/g, ''); // Quitar caracteres especiales
        };
        
        // Función para formatear nombres de categoría con tildes
        const formatCategoryName = (category) => {
          // Casos especiales
          if (category === 'pina') return 'Piña';
          if (category === 'tulipan') return 'Tulipán';
          if (category === 'oregano') return 'Orégano';
          if (category === 'curcuma') return 'Cúrcuma';
          if (category === 'platano') return 'Plátano';
          if (category === 'azafran') return 'Azafrán';
          return category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ');
        };
        
        // Función para convertir slug a nombre legible
        const formatPlantName = (slug) => {
          return slug.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
        };
        
        const categoryName = formatCategoryName(category);
        
        // Generar nombre de display
        let displayName;
        if (plant.slug === 'comun') {
          displayName = categoryName;
        } else {
          const plantName = formatPlantName(plant.slug);
          displayName = `${categoryName} ${plantName}`;
        }
        
        // Crear slug único con categoría para evitar conflictos
        let uniqueSlug;
        if (plant.slug === 'comun') {
          uniqueSlug = `${category}-comun`;
        } else if (plant.slug.startsWith(category + '-')) {
          // Ya tiene la categoría como prefijo
          uniqueSlug = plant.slug;
        } else {
          // Agregar categoría como prefijo
          uniqueSlug = `${category}-${plant.slug}`;
        }
        
        plants.push({
          slug: uniqueSlug,
          name: displayName,
          category,
          originalSlug: plant.slug
        })
      }
    }
    
    console.log(`📊 Encontradas ${plants.length} plantas para generar`)
    
    // Generar tarjetas en paralelo (en lotes para no sobrecargar)
    const batchSize = 5
    const results = []
    
    for (let i = 0; i < plants.length; i += batchSize) {
      const batch = plants.slice(i, i + batchSize)
      console.log(`\n📦 Procesando lote ${Math.floor(i/batchSize) + 1}/${Math.ceil(plants.length/batchSize)}`)
      
      const batchResults = await Promise.all(
        batch.map(plant => generatePlantCard(plant))
      )
      
      results.push(...batchResults)
    }
    
    // Estadísticas finales
    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length
    
    console.log('\n📈 RESUMEN DE GENERACIÓN:')
    console.log(`✅ Exitosas: ${successful}`)
    console.log(`❌ Fallidas: ${failed}`)
    console.log(`📁 Directorio: ${CONFIG.outputDir}`)
    
    // Guardar índice de tarjetas generadas
    const index = {
      generated: new Date().toISOString(),
      total: results.length,
      successful,
      failed,
      cards: results.filter(r => r.success).map(r => ({
        slug: r.slug,
        name: r.name,
        category: r.category,
        path: r.cardPath
      }))
    }
    
    fs.writeFileSync(
      path.join(CONFIG.outputDir, 'index.json'), 
      JSON.stringify(index, null, 2)
    )
    
    console.log(`\n🎯 ¡Generación completada! Índice guardado en: ${CONFIG.outputDir}/index.json`)
    
    if (failed > 0) {
      console.log('\n❌ ERRORES:')
      results.filter(r => !r.success).forEach(r => {
        console.log(`  - ${r.name}: ${r.error}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error fatal:', error)
    process.exit(1)
  }
}

// Ejecutar si se llama directamente
generateAllCards().catch(console.error)

export { generateAllCards, generatePlantCard }