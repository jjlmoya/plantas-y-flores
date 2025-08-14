import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapeo de plantas con nuevas main_image elegidas del contenido de cada artículo
const imageUpdates = {
  // Chile Habanero - cambiar imagen genérica por habaneros reales
  'chili-habanero': '/wp-content/uploads/2017/07/habaneros-499057_1280-325x244.jpg',
  
  // Chile Cayena - cambiar imagen genérica por cayena específica  
  'chili-cayena': '/wp-content/uploads/2017/07/cayenne-pepper-1715925_1280-325x217.jpg',
  
  // Tomate Corazón de Buey - cambiar semillas por tomates reales
  'tomate-corazon-de-buey': '/wp-content/uploads/2017/08/tomatoes-2218963_1280-325x217.jpg',
  
  // Plátano Rojo - cambiar captura de pantalla por imagen de la planta
  'platano-rojo': '/wp-content/uploads/2017/09/turmeric-plant-2250837_1920-243x325.jpg'
};

function updatePostFiles() {
  const postsDir = path.join(__dirname, '..', 'public', 'data', 'posts');
  
  // Leer todos los archivos JSON
  const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.json'));
  
  files.forEach(file => {
    const filePath = path.join(postsDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let updated = false;
    
    data.forEach(post => {
      // Crear clave de búsqueda basada en categoría y slug
      const category = post.categories?.[0]?.slug || '';
      const searchKey = `${category}-${post.slug}`;
      
      if (imageUpdates[searchKey]) {
        console.log(`Actualizando ${searchKey}: ${post.main_image} -> ${imageUpdates[searchKey]}`);
        post.main_image = imageUpdates[searchKey];
        updated = true;
      }
    });
    
    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Actualizado archivo: ${file}`);
    }
  });
}

// Función para buscar mejores imágenes en el contenido HTML
function findBetterImages() {
  const postsDir = path.join(__dirname, '..', 'public', 'data', 'posts');
  const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.json'));
  
  const targetSlugs = ['habanero', 'cayena', 'pera', 'corazon-de-buey', 'rojo', 'morada', 'kennebec', 'cannabinus', 'ataulfo', 'manila'];
  
  files.forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(postsDir, file), 'utf8'));
    
    data.forEach(post => {
      if (targetSlugs.includes(post.slug)) {
        console.log(`\n🔍 ${post.title} (${post.slug}):`);
        console.log(`📸 Main image actual: ${post.main_image}`);
        
        // Extraer todas las imágenes del HTML
        const imgRegex = /src="([^"]*wp-content\/uploads[^"]*)"/g;
        const images = [];
        let match;
        
        while ((match = imgRegex.exec(post.seo_html)) !== null) {
          if (!images.includes(match[1])) {
            images.push(match[1]);
          }
        }
        
        if (images.length > 0) {
          console.log('🖼️  Imágenes disponibles en el artículo:');
          images.forEach((img, index) => {
            console.log(`   ${index + 1}. ${img}`);
          });
        }
      }
    });
  });
}

// Ejecutar funciones
console.log('🔍 Buscando mejores imágenes...');
findBetterImages();

console.log('\n📝 Aplicando actualizaciones de imágenes...');
updatePostFiles();

console.log('\n✅ Proceso completado');