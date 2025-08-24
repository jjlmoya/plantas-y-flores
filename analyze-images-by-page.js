import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to extract all image URLs from any content
function extractImageUrls(data, fileName = '') {
    const urls = new Map(); // Map to store url -> source info
    
    function addUrl(url, source) {
        if (url && url.includes('/wp-content/uploads/') && url.match(/\.(webp|jpg|jpeg|png|gif)/i)) {
            if (!urls.has(url)) {
                urls.set(url, []);
            }
            urls.get(url).push({ source, file: fileName });
        }
    }
    
    if (typeof data === 'string') {
        // Extract from HTML content - multiple patterns
        const patterns = [
            /src=["']([^"']*\/wp-content\/uploads\/[^"']*\.(webp|jpg|jpeg|png|gif))[^"']*/gi,
            /href=["']([^"']*\/wp-content\/uploads\/[^"']*\.(webp|jpg|jpeg|png|gif))[^"']*/gi,
            /url\(["']?([^"']*\/wp-content\/uploads\/[^"']*\.(webp|jpg|jpeg|png|gif))[^"']*/gi,
            /\/wp-content\/uploads\/[^"\s)]+\.(webp|jpg|jpeg|png|gif)/gi
        ];
        
        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(data)) !== null) {
                const url = match[1] || match[0];
                addUrl(url, 'html_content');
            }
        });
    } else if (typeof data === 'object' && data !== null) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (key === 'main_image' && typeof data[key] === 'string') {
                    addUrl(data[key], 'main_image');
                } else {
                    const nestedUrls = extractImageUrls(data[key], fileName);
                    nestedUrls.forEach((sources, url) => {
                        if (!urls.has(url)) {
                            urls.set(url, []);
                        }
                        urls.get(url).push(...sources);
                    });
                }
            }
        }
    } else if (Array.isArray(data)) {
        data.forEach(item => {
            const nestedUrls = extractImageUrls(item, fileName);
            nestedUrls.forEach((sources, url) => {
                if (!urls.has(url)) {
                    urls.set(url, []);
                }
                urls.get(url).push(...sources);
            });
        });
    }
    
    return urls;
}

function checkImageExists(imagePath) {
    const fullPath = path.join(__dirname, 'public', imagePath);
    return fs.existsSync(fullPath);
}

function scanDirectory(dir, extensions = ['.json', '.html', '.astro', '.md']) {
    const files = [];
    
    function scan(currentDir) {
        try {
            const items = fs.readdirSync(currentDir);
            for (const item of items) {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                    scan(fullPath);
                } else if (stat.isFile()) {
                    const ext = path.extname(item).toLowerCase();
                    if (extensions.includes(ext)) {
                        files.push(fullPath);
                    }
                }
            }
        } catch (error) {
            // Ignore permission errors
        }
    }
    
    scan(dir);
    return files;
}

async function main() {
    console.log('🔍 Analizando TODAS las fuentes de imágenes (JSON, HTML, Astro, MD)...\n');
    
    const allImagesBySource = new Map(); // url -> [{file, source, context}]
    const processedFiles = new Set();
    
    // 1. Scan JSON files in public/data
    const jsonFiles = [
        ...scanDirectory(path.join(__dirname, 'public/data'), ['.json'])
    ];
    
    console.log(`📄 Analizando ${jsonFiles.length} archivos JSON...`);
    for (const filePath of jsonFiles) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);
            const relativePath = path.relative(__dirname, filePath);
            
            const imageUrls = extractImageUrls(data, relativePath);
            imageUrls.forEach((sources, url) => {
                if (!allImagesBySource.has(url)) {
                    allImagesBySource.set(url, []);
                }
                sources.forEach(source => {
                    allImagesBySource.get(url).push({
                        file: relativePath,
                        source: source.source,
                        context: 'JSON_DATA'
                    });
                });
            });
            
            processedFiles.add(relativePath);
        } catch (error) {
            console.log(`❌ Error procesando ${filePath}: ${error.message}`);
        }
    }
    
    // 2. Scan HTML/Astro/MD files in src
    const contentFiles = [
        ...scanDirectory(path.join(__dirname, 'src'), ['.html', '.astro', '.md']),
        ...scanDirectory(path.join(__dirname, 'public'), ['.html', '.md'])
    ];
    
    console.log(`📝 Analizando ${contentFiles.length} archivos HTML/Astro/MD...`);
    for (const filePath of contentFiles) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const relativePath = path.relative(__dirname, filePath);
            
            const imageUrls = extractImageUrls(content, relativePath);
            imageUrls.forEach((sources, url) => {
                if (!allImagesBySource.has(url)) {
                    allImagesBySource.set(url, []);
                }
                sources.forEach(source => {
                    allImagesBySource.get(url).push({
                        file: relativePath,
                        source: source.source,
                        context: 'HTML_CONTENT'
                    });
                });
            });
            
            processedFiles.add(relativePath);
        } catch (error) {
            console.log(`❌ Error procesando ${filePath}: ${error.message}`);
        }
    }
    
    console.log(`\n📊 Total archivos procesados: ${processedFiles.size}`);
    console.log(`📊 Total imágenes únicas encontradas: ${allImagesBySource.size}\n`);
    
    // 3. Check which images are missing
    const missingImagesByPage = new Map(); // page -> missing images
    const foundImages = [];
    const missingImages = [];
    
    allImagesBySource.forEach((sources, imageUrl) => {
        const exists = checkImageExists(imageUrl);
        
        if (exists) {
            foundImages.push(imageUrl);
        } else {
            missingImages.push(imageUrl);
            
            // Group by pages/files where the image is used
            sources.forEach(source => {
                const pageKey = source.file;
                if (!missingImagesByPage.has(pageKey)) {
                    missingImagesByPage.set(pageKey, []);
                }
                missingImagesByPage.get(pageKey).push({
                    url: imageUrl,
                    source: source.source,
                    context: source.context
                });
            });
        }
    });
    
    console.log(`✅ Imágenes existentes: ${foundImages.length}`);
    console.log(`❌ Imágenes faltantes: ${missingImages.length}`);
    console.log(`📄 Páginas afectadas: ${missingImagesByPage.size}\n`);
    
    if (missingImagesByPage.size > 0) {
        console.log('🚨 IMÁGENES FALTANTES AGRUPADAS POR PÁGINA:\n');
        
        // Sort pages by number of missing images (descending)
        const sortedPages = Array.from(missingImagesByPage.entries())
            .sort(([,a], [,b]) => b.length - a.length);
        
        sortedPages.forEach(([page, images], index) => {
            console.log(`${index + 1}. 📄 PÁGINA: ${page}`);
            console.log(`   ❌ Imágenes faltantes: ${images.length}`);
            console.log(`   📋 Lista de imágenes:`);
            
            images.forEach((img, imgIndex) => {
                console.log(`      ${imgIndex + 1}. ${img.url}`);
                console.log(`         - Fuente: ${img.source} (${img.context})`);
            });
            console.log('');
        });
        
        // Summary by category
        console.log('📊 RESUMEN POR CATEGORÍAS:\n');
        const categoryCount = new Map();
        
        missingImages.forEach(url => {
            const match = url.match(/\/wp-content\/uploads\/(\d{4})\/(\d{2})/);
            if (match) {
                const yearMonth = `${match[1]}-${match[2]}`;
                categoryCount.set(yearMonth, (categoryCount.get(yearMonth) || 0) + 1);
            }
        });
        
        Array.from(categoryCount.entries())
            .sort(([,a], [,b]) => b - a)
            .forEach(([period, count]) => {
                console.log(`   📅 ${period}: ${count} imágenes faltantes`);
            });
    }
}

main().catch(console.error);