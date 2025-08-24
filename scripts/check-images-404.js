import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to extract all image URLs from JSON data
function extractImageUrls(data) {
    const urls = new Set();
    
    if (typeof data === 'string') {
        // Extract from HTML content
        const imgMatches = data.match(/\/wp-content\/uploads\/[^"\s)]+\.(webp|jpg|jpeg|png|gif)/gi);
        if (imgMatches) {
            imgMatches.forEach(url => urls.add(url));
        }
    } else if (typeof data === 'object' && data !== null) {
        // Recursively search in objects
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (key === 'main_image' && typeof data[key] === 'string') {
                    urls.add(data[key]);
                } else {
                    const nestedUrls = extractImageUrls(data[key]);
                    nestedUrls.forEach(url => urls.add(url));
                }
            }
        }
    } else if (Array.isArray(data)) {
        // Search in arrays
        data.forEach(item => {
            const nestedUrls = extractImageUrls(item);
            nestedUrls.forEach(url => urls.add(url));
        });
    }
    
    return urls;
}

// Function to check if image exists locally
function checkImageExists(imagePath) {
    const fullPath = path.join(__dirname, 'public', imagePath);
    return fs.existsSync(fullPath);
}

// Function to check if image is accessible via HTTP
function checkImageHttp(imagePath) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 4321,
            path: imagePath,
            method: 'HEAD',
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            resolve(res.statusCode === 200);
        });

        req.on('error', () => {
            resolve(false);
        });

        req.on('timeout', () => {
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

async function main() {
    console.log('🔍 Escaneando todas las imágenes...\n');
    
    const allImageUrls = new Set();
    const missing404Images = [];
    const missingLocalImages = [];
    
    // Check main pages.json
    try {
        const pagesPath = path.join(__dirname, 'public/data/pages.json');
        if (fs.existsSync(pagesPath)) {
            const pagesData = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
            const pagesUrls = extractImageUrls(pagesData);
            pagesUrls.forEach(url => allImageUrls.add(url));
            console.log(`📄 Páginas principales: ${pagesUrls.size} imágenes encontradas`);
        }
    } catch (error) {
        console.log('❌ Error leyendo pages.json:', error.message);
    }
    
    // Check category JSON files
    const postsDir = path.join(__dirname, 'public/data/posts');
    if (fs.existsSync(postsDir)) {
        const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.json'));
        
        for (const file of files) {
            try {
                const filePath = path.join(postsDir, file);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                const urls = extractImageUrls(data);
                urls.forEach(url => allImageUrls.add(url));
                console.log(`📂 ${file}: ${urls.size} imágenes encontradas`);
            } catch (error) {
                console.log(`❌ Error leyendo ${file}:`, error.message);
            }
        }
    }
    
    console.log(`\n📊 Total de imágenes únicas encontradas: ${allImageUrls.size}\n`);
    
    // Check each image
    let checkedCount = 0;
    const totalImages = allImageUrls.size;
    
    for (const imageUrl of allImageUrls) {
        checkedCount++;
        process.stdout.write(`\r🔄 Verificando imagen ${checkedCount}/${totalImages}: ${imageUrl.slice(-50)}...`);
        
        // Check if file exists locally
        const localExists = checkImageExists(imageUrl);
        
        // Check if accessible via HTTP
        const httpExists = await checkImageHttp(imageUrl);
        
        if (!localExists) {
            missingLocalImages.push(imageUrl);
        }
        
        if (!httpExists) {
            missing404Images.push({
                url: imageUrl,
                localExists: localExists,
                httpAccessible: false
            });
        }
    }
    
    console.log(`\n\n📋 RESULTADOS DE VERIFICACIÓN:\n`);
    console.log(`✅ Total imágenes escaneadas: ${totalImages}`);
    console.log(`❌ Imágenes con 404 HTTP: ${missing404Images.length}`);
    console.log(`📁 Imágenes faltantes localmente: ${missingLocalImages.length}`);
    
    if (missing404Images.length > 0) {
        console.log(`\n🚨 IMÁGENES QUE DAN 404:\n`);
        missing404Images.forEach((img, index) => {
            console.log(`${index + 1}. ${img.url}`);
            console.log(`   📁 Existe localmente: ${img.localExists ? '✅ Sí' : '❌ No'}`);
            console.log(`   🌐 Accesible vía HTTP: ${img.httpAccessible ? '✅ Sí' : '❌ No'}`);
            console.log('');
        });
    }
    
    if (missingLocalImages.length > 0) {
        console.log(`\n📁 ARCHIVOS FALTANTES LOCALMENTE:\n`);
        missingLocalImages.forEach((url, index) => {
            console.log(`${index + 1}. ${url}`);
        });
    }
    
    // Generate summary
    const summary = {
        totalImages: totalImages,
        missing404: missing404Images.length,
        missingLocal: missingLocalImages.length,
        missing404List: missing404Images,
        missingLocalList: missingLocalImages,
        timestamp: new Date().toISOString()
    };
    
    // Save results to file
    fs.writeFileSync('404-images-report.json', JSON.stringify(summary, null, 2));
    console.log(`\n💾 Reporte completo guardado en: 404-images-report.json`);
}

main().catch(console.error);