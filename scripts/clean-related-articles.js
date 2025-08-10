import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para limpiar el HTML de artículos relacionados hardcodeados
function cleanRelatedArticlesFromHtml(htmlContent) {
  if (!htmlContent) return htmlContent;
  
  let cleanedHtml = htmlContent;
  
  // Patrones para identificar secciones de artículos relacionados
  const patterns = [
    // Patrón 1: <h3> Artículos Relacionados </h3> + contenido hasta el final o siguiente h2/h3
    /<h3[^>]*>\s*Artículos?\s+Relacionados?[^<]*<\/h3>.*?(?=<h[23]|$)/gis,
    
    // Patrón 2: Secciones que empiezan con "Artículos Relacionados"
    /Artículos?\s+Relacionados?[\s\S]*?(?=<h[23]|$)/gi,
    
    // Patrón 3: Bloques de imágenes + enlaces que parecen relacionados
    /(?:<img[^>]+>\s*<a[^>]+>[\s\S]*?<\/a>\s*<p>[\s\S]*?<\/p>\s*){3,}/gi,
    
    // Patrón 4: Enlaces internos múltiples al final del contenido
    /(?:<a\s+href="\/[^"]+\/[^"]+\/"[^>]*>[\s\S]*?<\/a>[\s\S]*?){3,}$/gi
  ];
  
  // Aplicar cada patrón
  patterns.forEach(pattern => {
    cleanedHtml = cleanedHtml.replace(pattern, '');
  });
  
  // Limpiar espacios y saltos de línea excesivos
  cleanedHtml = cleanedHtml
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/\s+$/g, '')
    .trim();
  
  return cleanedHtml;
}

// Función principal
async function cleanRelatedArticles() {
  try {
    console.log('🧹 Iniciando limpieza de artículos relacionados hardcodeados...');
    
    // Leer el archivo pages.json
    const pagesPath = path.join(__dirname, '../data/pages.json');
    const pagesData = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
    
    let processedCount = 0;
    let cleanedCount = 0;
    
    // Procesar cada artículo
    const updatedPages = pagesData.map(page => {
      processedCount++;
      
      if (page.type === 'post' && page.seo_html) {
        const originalHtml = page.seo_html;
        const cleanedHtml = cleanRelatedArticlesFromHtml(originalHtml);
        
        // Verificar si se hicieron cambios
        if (originalHtml !== cleanedHtml) {
          page.seo_html = cleanedHtml;
          cleanedCount++;
          console.log(`✅ Limpiado: "${page.title}"`);
          
          // Mostrar ejemplo de lo que se removió (primeras 100 chars)
          const removed = originalHtml.replace(cleanedHtml, '').substring(0, 100);
          if (removed.trim()) {
            console.log(`   📝 Removido: "${removed.trim()}..."`);
          }
        }
      }
      
      return page;
    });
    
    // Crear backup del archivo original
    const backupPath = pagesPath + '.backup.' + Date.now();
    fs.writeFileSync(backupPath, JSON.stringify(pagesData, null, 2), 'utf8');
    console.log(`💾 Backup creado: ${path.basename(backupPath)}`);
    
    // Guardar el archivo actualizado
    fs.writeFileSync(pagesPath, JSON.stringify(updatedPages, null, 2), 'utf8');
    
    console.log(`\n🎉 ¡Proceso completado!`);
    console.log(`📊 Estadísticas:`);
    console.log(`   • Artículos procesados: ${processedCount}`);
    console.log(`   • Artículos limpiados: ${cleanedCount}`);
    console.log(`   • Artículos sin cambios: ${processedCount - cleanedCount}`);
    console.log(`   • Tasa de limpieza: ${Math.round((cleanedCount / processedCount) * 100)}%`);
    
    if (cleanedCount > 0) {
      console.log(`\n🔄 Regenerando contenido de Astro...`);
      // Aquí podrías llamar al script process-content.js si lo deseas
    }
    
  } catch (error) {
    console.error('❌ Error al limpiar los artículos relacionados:', error);
    process.exit(1);
  }
}

// Ejecutar el script
cleanRelatedArticles();