import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function findAllImages(dir, extensions = ['.jpg', '.jpeg', '.png']) {
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

async function convertImageToWebP(inputPath, quality = 85) {
    const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    try {
        await sharp(inputPath)
            .webp({ quality })
            .toFile(outputPath);
        
        console.log(`✅ Converted: ${path.relative(process.cwd(), inputPath)} -> ${path.relative(process.cwd(), outputPath)}`);
        return outputPath;
    } catch (error) {
        console.error(`❌ Error converting ${inputPath}:`, error.message);
        return null;
    }
}

async function main() {
    console.log('🔍 Buscando todas las imágenes...');
    
    // Buscar todas las imágenes
    const allImages = await findAllImages('public');
    console.log(`📊 Encontradas ${allImages.length} imágenes para convertir`);
    
    if (allImages.length === 0) {
        console.log('No se encontraron imágenes para convertir.');
        return;
    }
    
    console.log('\n🔄 Iniciando conversión a WebP...\n');
    
    let converted = 0;
    let errors = 0;
    
    // Convertir todas las imágenes
    for (let i = 0; i < allImages.length; i++) {
        const imagePath = allImages[i];
        console.log(`[${i + 1}/${allImages.length}] Procesando: ${path.relative(process.cwd(), imagePath)}`);
        
        const result = await convertImageToWebP(imagePath);
        if (result) {
            converted++;
        } else {
            errors++;
        }
        
        // Mostrar progreso cada 50 imágenes
        if ((i + 1) % 50 === 0) {
            console.log(`\n📈 Progreso: ${i + 1}/${allImages.length} (${Math.round((i + 1) / allImages.length * 100)}%)`);
            console.log(`✅ Convertidas: ${converted} | ❌ Errores: ${errors}\n`);
        }
    }
    
    console.log('\n🎉 ¡Conversión completada!');
    console.log(`📊 Resumen:`);
    console.log(`  - Total procesadas: ${allImages.length}`);
    console.log(`  - Convertidas exitosamente: ${converted}`);
    console.log(`  - Errores: ${errors}`);
    console.log(`  - Tasa de éxito: ${Math.round(converted / allImages.length * 100)}%`);
}

// Ejecutar el script
main().catch(console.error);