import fs from 'fs';
import path from 'path';
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

async function main() {
    console.log('🔍 Escaneando imágenes faltantes...\n');
    
    const allImageUrls = new Set();
    const missing404Images = [];
    
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
    
    // Check each image locally only
    console.log('🔄 Verificando archivos locales...\n');
    
    for (const imageUrl of allImageUrls) {
        // Check if file exists locally
        const localExists = checkImageExists(imageUrl);
        
        if (!localExists) {
            missing404Images.push(imageUrl);
        }
    }
    
    console.log(`\n📋 RESULTADOS:\n`);
    console.log(`✅ Total imágenes escaneadas: ${allImageUrls.size}`);
    console.log(`❌ Imágenes faltantes: ${missing404Images.length}`);
    
    if (missing404Images.length > 0) {
        console.log(`\n🚨 IMÁGENES QUE DAN 404 (ARCHIVOS FALTANTES):\n`);
        missing404Images.forEach((url, index) => {
            console.log(`${index + 1}. ${url}`);
        });
    } else {
        console.log(`\n✅ ¡Todas las imágenes están disponibles localmente!`);
    }
}

main().catch(console.error);