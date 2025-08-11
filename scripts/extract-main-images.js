import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para extraer la primera imagen de un texto HTML
function extractFirstImage(htmlContent) {
  if (!htmlContent) return null;
  
  // Regex para encontrar etiquetas img con src
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
  const match = htmlContent.match(imgRegex);
  
  if (match && match[1]) {
    let imageSrc = match[1];
    
    // Convertir URLs de WordPress a rutas locales
    if (imageSrc.includes('plantasyflores.online/wp-content/uploads/')) {
      imageSrc = imageSrc.replace('https://plantasyflores.online/wp-content/uploads/', '/wp-content/uploads/');
    }
    
    return imageSrc;
  }
  
  return null;
}

// Función principal
async function addMainImageField() {
  try {
    console.log('🚀 Iniciando extracción de imágenes principales...');
    
    // Leer el archivo pages.json
    const pagesPath = path.join(__dirname, '../public/data/pages.json');
    const pagesData = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
    
    let processedCount = 0;
    let imagesFound = 0;
    
    // Procesar cada artículo
    const updatedPages = pagesData.map(page => {
      processedCount++;
      
      // Si ya tiene featured_image, usarla como main_image
      if (page.featured_image) {
        page.main_image = page.featured_image.replace('https://plantasyflores.online/wp-content/uploads/', '/wp-content/uploads/');
        imagesFound++;
        return page;
      }
      
      // Si no tiene featured_image, buscar en seo_html
      const extractedImage = extractFirstImage(page.seo_html);
      if (extractedImage) {
        page.main_image = extractedImage;
        imagesFound++;
        console.log(`✅ Imagen encontrada para "${page.title}": ${extractedImage}`);
      } else {
        page.main_image = null;
        console.log(`⚠️  No se encontró imagen para "${page.title}"`);
      }
      
      return page;
    });
    
    // Guardar el archivo actualizado
    fs.writeFileSync(pagesPath, JSON.stringify(updatedPages, null, 2), 'utf8');
    
    console.log(`\n🎉 ¡Proceso completado!`);
    console.log(`📊 Estadísticas:`);
    console.log(`   • Artículos procesados: ${processedCount}`);
    console.log(`   • Imágenes encontradas: ${imagesFound}`);
    console.log(`   • Sin imagen: ${processedCount - imagesFound}`);
    console.log(`   • Tasa de éxito: ${Math.round((imagesFound / processedCount) * 100)}%`);
    
    // Mostrar algunos ejemplos de artículos con imágenes
    console.log(`\n📸 Ejemplos de artículos con imágenes:`);
    updatedPages
      .filter(page => page.main_image)
      .slice(0, 5)
      .forEach(page => {
        console.log(`   • ${page.title} -> ${page.main_image}`);
      });
    
  } catch (error) {
    console.error('❌ Error al procesar las imágenes:', error);
    process.exit(1);
  }
}

// Ejecutar el script
addMainImageField();