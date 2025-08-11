import fs from 'fs';
import path from 'path';

console.log('🧹 Limpiando contenido obsoleto de pages.json...');

// Leer el archivo pages.json
const pagesPath = path.join(process.cwd(), 'data', 'pages.json');
const rawData = fs.readFileSync(pagesPath, 'utf8');
let pages = JSON.parse(rawData);

let cleanedCount = 0;

// Función para limpiar solo las secciones "Tipos y variedades"
function cleanSeoHtml(html) {
  if (!html) return html;
  
  let cleaned = html;
  const originalLength = html.length;
  
  // 1. Eliminar títulos "Tipos y variedades" + todo su contenido
  cleaned = cleaned.replace(
    /<h3>\s*Tipos\s+y\s+variedades\s*<\/h3>[\s\S]*?(?=<h[2-6]|$)/gi,
    ''
  );
  
  // 2. También eliminar variaciones del título "Tipos"
  cleaned = cleaned.replace(
    /<h3>\s*Tipos\s*<\/h3>[\s\S]*?(?=<h[2-6]|$)/gi,
    ''
  );
  
  // 3. Eliminar listas completas con "Leer Más" (son las listas de plantas obsoletas)
  cleaned = cleaned.replace(
    /<ul>\s*(?:<li>\s*<h3>\s*<a[^>]*>[^<]*<\/a>\s*<\/h3>\s*<p>[\s\S]*?<\/p>\s*<a[^>]*>\s*Leer\s+Más\s*<\/a>\s*<\/li>\s*)+<\/ul>/gi,
    ''
  );
  
  // 4. Eliminar elementos sueltos con "Leer Más" que no estén en listas
  cleaned = cleaned.replace(
    /<h3>\s*<a[^>]*>[^<]*<\/a>\s*<\/h3>\s*<p>[\s\S]*?<\/p>\s*(?:<br\s*\/?>)?\s*(?:\.{6})?\s*<a[^>]*>\s*Leer\s+Más\s*<\/a>/gi,
    ''
  );
  
  // 4. Eliminar nombres de plantas separados solo por espacios (ej: "Azufre Ulam Raja Chocolate Sonata")
  cleaned = cleaned.replace(
    /\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*)*\s*){3,}(?=\s*<)/gm,
    ''
  );
  
  // 5. Eliminar elementos HTML vacíos que queden
  cleaned = cleaned.replace(/<li>\s*<\/li>/gi, '');
  cleaned = cleaned.replace(/<ul>\s*<\/ul>/gi, '');
  cleaned = cleaned.replace(/<ol>\s*<\/ol>/gi, '');
  
  // 6. Limpiar espacios en blanco excesivos resultantes
  cleaned = cleaned.replace(/\s*\n\s*\n\s*\n/g, '\n\n');
  cleaned = cleaned.trim();
  
  if (cleaned !== html) {
    console.log(`   Antes: ${originalLength} caracteres → Después: ${cleaned.length} caracteres`);
  }
  
  return cleaned;
}

// Procesar todas las páginas
pages = pages.map(page => {
  if (page.seo_html) {
    const originalHtml = page.seo_html;
    const cleanedHtml = cleanSeoHtml(originalHtml);
    
    if (cleanedHtml !== originalHtml) {
      console.log(`✅ Limpiada página: ${page.slug}`);
      cleanedCount++;
      page.seo_html = cleanedHtml;
    }
  }
  return page;
});

// Guardar el archivo limpio
fs.writeFileSync(pagesPath, JSON.stringify(pages, null, 2), 'utf8');

console.log(`\n🎉 Limpieza completada!`);
console.log(`📄 ${cleanedCount} páginas fueron limpiadas`);
console.log(`💾 Archivo guardado en: ${pagesPath}`);