import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function analyzeRosaImages() {
    console.log('🔍 ANÁLISIS PROFUNDO DE IMÁGENES DE ROSA...\n');
    
    // Lista de imágenes que mi script dice que faltan
    const supposedlyMissing = [
        '/wp-content/uploads/2017/07/rosa-1.webp',
        '/wp-content/uploads/2017/07/rosa-2.webp',
        '/wp-content/uploads/2017/07/rosa-3.webp',
        '/wp-content/uploads/2017/07/rosa-6.webp',
        '/wp-content/uploads/2017/07/rosa-10.webp',
        '/wp-content/uploads/2017/07/rosa-19.webp',
        '/wp-content/uploads/2017/07/rosa-primer-plano-creciendo.webp'
    ];
    
    console.log('📋 Verificando cada imagen "faltante":\n');
    
    supposedlyMissing.forEach((imageUrl, index) => {
        const fullPath = path.join(__dirname, 'public', imageUrl);
        const exists = fs.existsSync(fullPath);
        
        console.log(`${index + 1}. ${imageUrl}`);
        console.log(`   📁 Existe localmente: ${exists ? '✅ SÍ' : '❌ NO'}`);
        
        if (exists) {
            try {
                const stats = fs.statSync(fullPath);
                console.log(`   📏 Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
                console.log(`   📅 Modificado: ${stats.mtime.toISOString()}`);
            } catch (error) {
                console.log(`   ❌ Error leyendo stats: ${error.message}`);
            }
        } else {
            // Buscar imágenes similares
            const dir = path.dirname(fullPath);
            const filename = path.basename(imageUrl, '.webp');
            
            if (fs.existsSync(dir)) {
                const files = fs.readdirSync(dir);
                const similarFiles = files.filter(file => 
                    file.includes(filename) && file.endsWith('.webp')
                );
                
                if (similarFiles.length > 0) {
                    console.log(`   🔍 Archivos similares encontrados:`);
                    similarFiles.forEach(file => {
                        const similarPath = path.join(dir, file);
                        const stats = fs.statSync(similarPath);
                        console.log(`      - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
                    });
                }
            }
        }
        console.log('');
    });
    
    // Ahora verificar qué imágenes SÍ existen en esa carpeta
    console.log('📂 Todas las imágenes de rosa que SÍ existen en 2017/07:\n');
    const july2017Dir = path.join(__dirname, 'public/wp-content/uploads/2017/07');
    
    if (fs.existsSync(july2017Dir)) {
        const files = fs.readdirSync(july2017Dir);
        const rosaFiles = files.filter(file => 
            file.includes('rosa') && file.endsWith('.webp')
        ).sort();
        
        console.log(`   Encontrados ${rosaFiles.length} archivos de rosa:`);
        rosaFiles.forEach((file, index) => {
            const filePath = path.join(july2017Dir, file);
            const stats = fs.statSync(filePath);
            console.log(`   ${index + 1}. ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
        });
    } else {
        console.log('   ❌ El directorio 2017/07 no existe');
    }
}

analyzeRosaImages();