import fs from 'fs';
import path from 'path';

async function updateImageReferencesInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;
        
        // Contar las sustituciones realizadas
        let replacements = 0;
        
        // Buscar y reemplazar todas las referencias de imágenes
        // Patrón para capturar extensiones .jpg, .jpeg, .png
        const imagePattern = /(\S*?)\.(jpg|jpeg|png)(\b)/gi;
        
        content = content.replace(imagePattern, (match, baseName, extension, boundary) => {
            replacements++;
            updated = true;
            return `${baseName}.webp${boundary}`;
        });
        
        if (updated) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ ${path.relative(process.cwd(), filePath)}: ${replacements} referencias actualizadas`);
            return replacements;
        } else {
            console.log(`ℹ️  ${path.relative(process.cwd(), filePath)}: No se encontraron referencias de imágenes`);
            return 0;
        }
    } catch (error) {
        console.error(`❌ Error procesando ${filePath}:`, error.message);
        return 0;
    }
}

async function findFilesWithImageReferences() {
    const files = [];
    
    // Buscar en src/
    function scanSrcDirectory(dir) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                scanSrcDirectory(fullPath);
            } else if (fullPath.match(/\.(astro|vue|js|ts|json)$/)) {
                files.push(fullPath);
            }
        }
    }
    
    // Buscar en public/data/
    function scanDataDirectory(dir) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                scanDataDirectory(fullPath);
            } else if (fullPath.endsWith('.json')) {
                files.push(fullPath);
            }
        }
    }
    
    // Escanear directorios
    if (fs.existsSync('src')) {
        scanSrcDirectory('src');
    }
    if (fs.existsSync('public/data')) {
        scanDataDirectory('public/data');
    }
    
    return files;
}

async function main() {
    console.log('🔍 Buscando archivos con referencias de imágenes...');
    
    const allFiles = await findFilesWithImageReferences();
    console.log(`📊 Encontrados ${allFiles.length} archivos para procesar`);
    
    if (allFiles.length === 0) {
        console.log('No se encontraron archivos para procesar.');
        return;
    }
    
    console.log('\n🔄 Actualizando referencias de imágenes...\n');
    
    let totalFiles = 0;
    let totalReplacements = 0;
    let processedFiles = 0;
    
    for (let i = 0; i < allFiles.length; i++) {
        const filePath = allFiles[i];
        console.log(`[${i + 1}/${allFiles.length}] Procesando: ${path.relative(process.cwd(), filePath)}`);
        
        const replacements = await updateImageReferencesInFile(filePath);
        if (replacements > 0) {
            totalFiles++;
            totalReplacements += replacements;
        }
        processedFiles++;
        
        // Mostrar progreso cada 25 archivos
        if ((i + 1) % 25 === 0) {
            console.log(`\n📈 Progreso: ${i + 1}/${allFiles.length} (${Math.round((i + 1) / allFiles.length * 100)}%)`);
            console.log(`✅ Archivos modificados: ${totalFiles} | 🔄 Total de referencias actualizadas: ${totalReplacements}\n`);
        }
    }
    
    console.log('\n🎉 ¡Actualización completada!');
    console.log(`📊 Resumen:`);
    console.log(`  - Total de archivos procesados: ${processedFiles}`);
    console.log(`  - Archivos modificados: ${totalFiles}`);
    console.log(`  - Total de referencias actualizadas: ${totalReplacements}`);
}

// Ejecutar el script
main().catch(console.error);