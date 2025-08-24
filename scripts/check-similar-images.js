import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista de imágenes faltantes
const missingImages = [
    "/wp-content/uploads/2017/07/IMG_3560.webp-325x244.webp",
    "/wp-content/uploads/2017/07/book-419589_1280.webp",
    "/wp-content/uploads/2017/07/fresa-1.webp",
    "/wp-content/uploads/2017/07/calender-2389150_1280.webp",
    "/wp-content/uploads/2017/07/watering-can-1506750_1280.webp",
    "/wp-content/uploads/2017/07/fresas-plantadas-creciendo.webp",
    "/wp-content/uploads/2017/07/fresa-6.webp",
    "/wp-content/uploads/2017/07/fresa-9.webp",
    "/wp-content/uploads/2017/07/fresas-en-mercado.webp",
    "/wp-content/uploads/2017/07/herbal-tea-1410565_1280.webp",
    "/wp-content/uploads/2017/07/fresa-10.webp",
    "/wp-content/uploads/2017/07/fresa-7.webp",
    "/wp-content/uploads/2017/07/fresa-3.webp",
    "/wp-content/uploads/2017/07/CFjdh6aWgAAzjvx.webp",
    "/wp-content/uploads/2017/07/fresa-4.webp",
    "/wp-content/uploads/2017/07/rosa-21.webp",
    "/wp-content/uploads/2017/07/rosa-17.webp",
    "/wp-content/uploads/2017/07/rosa-8.webp",
    "/wp-content/uploads/2017/07/rosa-9.webp",
    "/wp-content/uploads/2017/07/rosa-7.webp",
    "/wp-content/uploads/2017/07/rosa-6.webp",
    "/wp-content/uploads/2017/07/rosa-19.webp",
    "/wp-content/uploads/2017/07/rosa-2.webp",
    "/wp-content/uploads/2017/07/rosa-3.webp",
    "/wp-content/uploads/2017/07/rosa-primer-plano-creciendo.webp",
    "/wp-content/uploads/2017/07/rosa-10.webp",
    "/wp-content/uploads/2017/07/rosa-1.webp",
    "/wp-content/uploads/2017/07/azafran-en-hebras.webp",
    "/wp-content/uploads/2017/07/azafran-plantado-creciendo.webp",
    "/wp-content/uploads/2017/07/crocus-blossom-2119173_1280.webp",
    "/wp-content/uploads/2017/07/crocus-1225501_1280.webp",
    "/wp-content/uploads/2017/07/crocus-2225200_1280.webp",
    "/wp-content/uploads/2017/07/crocus-2144736_1280.webp",
    "/wp-content/uploads/2017/07/saffron-1821786_1280.webp",
    "/wp-content/uploads/2017/07/spices-2353062_1280.webp",
    "/wp-content/uploads/2017/07/paella-1349255_1280.webp"
];

function getBaseName(imagePath) {
    // Quitar dimensiones como -325x244, -300x200, _1280, etc.
    let baseName = path.basename(imagePath, '.webp');
    baseName = baseName.replace(/-\d+x\d+$/, ''); // Quitar -WIDTHxHEIGHT
    baseName = baseName.replace(/_\d+$/, ''); // Quitar _1280
    return baseName;
}

function getAllImagesInDirectory(dir) {
    const images = [];
    
    function scanDirectory(currentDir) {
        try {
            const items = fs.readdirSync(currentDir);
            for (const item of items) {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    scanDirectory(fullPath);
                } else if (item.match(/\.(webp|jpg|jpeg|png|gif)$/i)) {
                    images.push(fullPath);
                }
            }
        } catch (error) {
            // Ignorar errores de acceso a directorios
        }
    }
    
    scanDirectory(dir);
    return images;
}

async function main() {
    console.log('🔍 Buscando imágenes similares que solo cambian de tamaño...\n');
    
    // Obtener todas las imágenes existentes en wp-content/uploads
    const uploadsDir = path.join(__dirname, 'public/wp-content/uploads');
    const existingImages = getAllImagesInDirectory(uploadsDir);
    
    console.log(`📂 Encontradas ${existingImages.length} imágenes existentes\n`);
    
    const matches = [];
    
    // Para cada imagen faltante, buscar similares
    for (const missingImage of missingImages.slice(0, 20)) { // Solo primeras 20 para prueba
        const missingBaseName = getBaseName(missingImage);
        const missingDir = path.dirname(missingImage);
        
        console.log(`🔎 Buscando similares para: ${missingImage}`);
        console.log(`   Base name: ${missingBaseName}`);
        
        // Buscar imágenes similares
        const similarImages = existingImages.filter(existingPath => {
            const existingBaseName = getBaseName(path.basename(existingPath));
            const existingRelativePath = existingPath.replace(__dirname + '\\public', '').replace(/\\/g, '/');
            const existingDir = path.dirname(existingRelativePath);
            
            return existingBaseName === missingBaseName && existingDir === missingDir;
        });
        
        if (similarImages.length > 0) {
            console.log(`   ✅ Encontradas ${similarImages.length} imágenes similares:`);
            similarImages.forEach(img => {
                const relativePath = img.replace(__dirname + '\\public', '').replace(/\\/g, '/');
                console.log(`      - ${relativePath}`);
            });
            
            matches.push({
                missing: missingImage,
                baseName: missingBaseName,
                similar: similarImages.map(img => img.replace(__dirname + '\\public', '').replace(/\\/g, '/'))
            });
        } else {
            console.log(`   ❌ No se encontraron imágenes similares`);
        }
        console.log('');
    }
    
    console.log(`\n📊 RESUMEN DE COINCIDENCIAS:\n`);
    
    if (matches.length > 0) {
        console.log(`✅ Encontradas ${matches.length} imágenes faltantes con similares:\n`);
        
        matches.forEach((match, index) => {
            console.log(`${index + 1}. FALTANTE: ${match.missing}`);
            console.log(`   SIMILARES ENCONTRADAS:`);
            match.similar.forEach(similar => {
                console.log(`   - ${similar}`);
                console.log(`     COMANDO: copy "public${similar.replace(/\//g, '\\')}" "public${match.missing.replace(/\//g, '\\')}"`);
            });
            console.log('');
        });
    } else {
        console.log(`❌ No se encontraron imágenes similares para las primeras 20 imágenes faltantes.`);
    }
}

main().catch(console.error);