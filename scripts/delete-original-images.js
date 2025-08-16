import fs from 'fs';
import path from 'path';

async function findOriginalImages(dir, extensions = ['.jpg', '.jpeg', '.png']) {
    const images = [];
    
    function scanDirectory(currentDir) {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                scanDirectory(fullPath);
            } else if (extensions.includes(path.extname(item).toLowerCase())) {
                images.push(fullPath);
            }
        }
    }
    
    scanDirectory(dir);
    return images;
}

async function verifyWebPExists(originalPath) {
    const webpPath = originalPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return fs.existsSync(webpPath);
}

async function deleteImageSafely(imagePath) {
    try {
        // Verificar que existe la versión WebP antes de eliminar el original
        const webpExists = await verifyWebPExists(imagePath);
        
        if (!webpExists) {
            console.log(`⚠️  No se puede eliminar ${path.relative(process.cwd(), imagePath)} - No existe la versión WebP`);
            return false;
        }
        
        fs.unlinkSync(imagePath);
        console.log(`🗑️  Eliminado: ${path.relative(process.cwd(), imagePath)}`);
        return true;
    } catch (error) {
        console.error(`❌ Error eliminando ${imagePath}:`, error.message);
        return false;
    }
}

async function main() {
    console.log('🔍 Buscando imágenes originales para eliminar...');
    
    // Buscar todas las imágenes originales
    const originalImages = await findOriginalImages('public');
    console.log(`📊 Encontradas ${originalImages.length} imágenes originales`);
    
    if (originalImages.length === 0) {
        console.log('No se encontraron imágenes originales para eliminar.');
        return;
    }
    
    console.log('\n🔄 Verificando y eliminando imágenes originales...\n');
    
    let deleted = 0;
    let skipped = 0;
    let errors = 0;
    
    // Procesar todas las imágenes
    for (let i = 0; i < originalImages.length; i++) {
        const imagePath = originalImages[i];
        console.log(`[${i + 1}/${originalImages.length}] Procesando: ${path.relative(process.cwd(), imagePath)}`);
        
        const result = await deleteImageSafely(imagePath);
        if (result === true) {
            deleted++;
        } else if (result === false) {
            skipped++;
        } else {
            errors++;
        }
        
        // Mostrar progreso cada 50 imágenes
        if ((i + 1) % 50 === 0) {
            console.log(`\n📈 Progreso: ${i + 1}/${originalImages.length} (${Math.round((i + 1) / originalImages.length * 100)}%)`);
            console.log(`🗑️  Eliminadas: ${deleted} | ⚠️  Omitidas: ${skipped} | ❌ Errores: ${errors}\n`);
        }
    }
    
    console.log('\n🎉 ¡Limpieza completada!');
    console.log(`📊 Resumen:`);
    console.log(`  - Total procesadas: ${originalImages.length}`);
    console.log(`  - Eliminadas exitosamente: ${deleted}`);
    console.log(`  - Omitidas (sin WebP): ${skipped}`);
    console.log(`  - Errores: ${errors}`);
    
    // Mostrar estadísticas finales
    const remainingOriginals = await findOriginalImages('public');
    const totalWebP = (await findOriginalImages('public', ['.webp'])).length;
    
    console.log(`\n📊 Estado final:`);
    console.log(`  - Imágenes originales restantes: ${remainingOriginals.length}`);
    console.log(`  - Total de imágenes WebP: ${totalWebP}`);
}

// Ejecutar el script
main().catch(console.error);