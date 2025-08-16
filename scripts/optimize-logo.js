import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

async function optimizeLogo() {
  const logoPath = join(publicDir, 'brand', 'logo.png');
  const brandDir = join(publicDir, 'brand');
  
  // Create optimized WebP versions
  const logoBuffer = fs.readFileSync(logoPath);
  
  // High quality WebP (for hero sections)
  await sharp(logoBuffer)
    .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90, effort: 6 })
    .toFile(join(brandDir, 'logo.webp'));
    
  // Medium quality WebP (for general use)
  await sharp(logoBuffer)
    .resize(200, 200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(join(brandDir, 'logo-200.webp'));
    
  // Small WebP (for navigation)
  await sharp(logoBuffer)
    .resize(64, 64, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 75, effort: 6 })
    .toFile(join(brandDir, 'logo-64.webp'));

  // Generate favicon sizes in WebP
  const faviconSizes = [16, 32, 48, 96, 144, 192, 512];
  
  for (const size of faviconSizes) {
    await sharp(logoBuffer)
      .resize(size, size, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85, effort: 6 })
      .toFile(join(publicDir, `favicon-${size}.webp`));
  }

  // Also create PNG fallbacks for older browsers (much smaller than original)
  await sharp(logoBuffer)
    .resize(192, 192, { fit: 'inside', withoutEnlargement: true })
    .png({ quality: 80, compressionLevel: 9 })
    .toFile(join(publicDir, 'favicon.png'));

  console.log('✅ Logo optimized successfully!');
  
  // Show file size comparison
  const originalSize = fs.statSync(logoPath).size;
  const webpSize = fs.statSync(join(brandDir, 'logo.webp')).size;
  const reduction = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
  
  console.log(`📊 Original PNG: ${(originalSize / 1024).toFixed(1)}KB`);
  console.log(`📊 Optimized WebP: ${(webpSize / 1024).toFixed(1)}KB`);
  console.log(`🚀 Size reduction: ${reduction}%`);
}

optimizeLogo().catch(console.error);