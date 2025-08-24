import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to extract images from rosa category
function findRosaImages() {
    console.log('🌹 Analizando específicamente la categoría ROSA...\n');
    
    // Check rosa.json in posts
    const rosaPostPath = path.join(__dirname, 'public/data/posts/rosa.json');
    const rosaImages = new Set();
    const missingRosaImages = [];
    
    if (fs.existsSync(rosaPostPath)) {
        try {
            const rosaData = JSON.parse(fs.readFileSync(rosaPostPath, 'utf8'));
            console.log('📄 Analizando public/data/posts/rosa.json...');
            
            // Extract images from the JSON content
            const content = JSON.stringify(rosaData);
            const imageMatches = content.match(/\/wp-content\/uploads\/[^"]*\.(webp|jpg|jpeg|png|gif)/gi);
            
            if (imageMatches) {
                imageMatches.forEach(url => rosaImages.add(url));
            }
            
            console.log(`   Encontradas ${rosaImages.size} imágenes en rosa.json\n`);
            
            // Check which ones are missing
            rosaImages.forEach(imageUrl => {
                const fullPath = path.join(__dirname, 'public', imageUrl);
                if (!fs.existsSync(fullPath)) {
                    missingRosaImages.push(imageUrl);
                }
            });
            
        } catch (error) {
            console.log(`❌ Error leyendo rosa.json: ${error.message}`);
        }
    }
    
    // Check calendar rosa entries
    const rosaCalendarPath = path.join(__dirname, 'public/data/calendar/rosa');
    const calendarImages = new Set();
    const missingCalendarImages = [];
    
    if (fs.existsSync(rosaCalendarPath)) {
        console.log('📅 Analizando archivos del calendario de rosas...');
        
        const files = fs.readdirSync(rosaCalendarPath).filter(f => f.endsWith('.json'));
        
        files.forEach(file => {
            try {
                const filePath = path.join(rosaCalendarPath, file);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                
                if (data.main_image) {
                    calendarImages.add(data.main_image);
                    const fullPath = path.join(__dirname, 'public', data.main_image);
                    if (!fs.existsSync(fullPath)) {
                        missingCalendarImages.push({
                            file: file,
                            image: data.main_image
                        });
                    }
                }
                
                console.log(`   ${file}: main_image = ${data.main_image || 'N/A'}`);
            } catch (error) {
                console.log(`   ❌ Error en ${file}: ${error.message}`);
            }
        });
    }
    
    console.log(`\n📊 RESUMEN CATEGORÍA ROSA:`);
    console.log(`   📄 Imágenes en posts: ${rosaImages.size}`);
    console.log(`   📅 Imágenes en calendario: ${calendarImages.size}`);
    console.log(`   ❌ Faltantes en posts: ${missingRosaImages.length}`);
    console.log(`   ❌ Faltantes en calendario: ${missingCalendarImages.length}\n`);
    
    if (missingRosaImages.length > 0) {
        console.log('🚨 IMÁGENES FALTANTES EN POSTS DE ROSA:\n');
        missingRosaImages.forEach((img, index) => {
            console.log(`   ${index + 1}. ${img}`);
        });
        console.log('');
    }
    
    if (missingCalendarImages.length > 0) {
        console.log('🚨 IMÁGENES FALTANTES EN CALENDARIO DE ROSA:\n');
        missingCalendarImages.forEach((item, index) => {
            console.log(`   ${index + 1}. ${item.file} -> ${item.image}`);
        });
        console.log('');
    }
    
    if (missingRosaImages.length === 0 && missingCalendarImages.length === 0) {
        console.log('✅ ¡Todas las imágenes de la categoría ROSA están disponibles!');
    }
    
    return {
        postImages: Array.from(rosaImages),
        calendarImages: Array.from(calendarImages),
        missingInPosts: missingRosaImages,
        missingInCalendar: missingCalendarImages
    };
}

// Check pages.json for rosa-related images
function checkPagesJsonForRosa() {
    console.log('\n📄 Verificando pages.json para imágenes relacionadas con rosas...');
    
    const pagesPath = path.join(__dirname, 'public/data/pages.json');
    const rosaRelatedImages = [];
    const missingRosaFromPages = [];
    
    if (fs.existsSync(pagesPath)) {
        try {
            const pagesData = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
            
            // Look for rosa-related content
            const content = JSON.stringify(pagesData);
            const rosaMatches = content.match(/[^"]*rosa[^"]*\.(webp|jpg|jpeg|png|gif)/gi);
            
            if (rosaMatches) {
                rosaMatches.forEach(url => {
                    if (url.startsWith('/wp-content/uploads/')) {
                        rosaRelatedImages.push(url);
                        
                        const fullPath = path.join(__dirname, 'public', url);
                        if (!fs.existsSync(fullPath)) {
                            missingRosaFromPages.push(url);
                        }
                    }
                });
            }
            
            console.log(`   Encontradas ${rosaRelatedImages.length} imágenes relacionadas con 'rosa'`);
            console.log(`   Faltantes: ${missingRosaFromPages.length}`);
            
            if (missingRosaFromPages.length > 0) {
                console.log('\n   🚨 Imágenes de rosa faltantes en pages.json:');
                missingRosaFromPages.forEach((img, index) => {
                    console.log(`      ${index + 1}. ${img}`);
                });
            }
            
        } catch (error) {
            console.log(`   ❌ Error leyendo pages.json: ${error.message}`);
        }
    }
    
    return {
        rosaImages: rosaRelatedImages,
        missing: missingRosaFromPages
    };
}

async function main() {
    const rosaResults = findRosaImages();
    const pagesResults = checkPagesJsonForRosa();
    
    console.log('\n🎯 CONCLUSIÓN FINAL:');
    console.log('=====================================');
    console.log(`Total imágenes de rosa encontradas: ${rosaResults.postImages.length + rosaResults.calendarImages.length + pagesResults.rosaImages.length}`);
    console.log(`Total imágenes faltantes: ${rosaResults.missingInPosts.length + rosaResults.missingInCalendar.length + pagesResults.missing.length}`);
    
    if (rosaResults.missingInPosts.length + rosaResults.missingInCalendar.length + pagesResults.missing.length === 0) {
        console.log('\n✅ ¡TODAS las imágenes de la página /rosa/ deberían cargar correctamente!');
        console.log('   La página https://plantasyflores.online/rosa/ no debería tener imágenes rotas.');
    } else {
        console.log('\n❌ Hay imágenes faltantes que podrían causar problemas en /rosa/');
    }
}

main().catch(console.error);