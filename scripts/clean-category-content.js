import fs from 'fs';
import path from 'path';

console.log('🧹 Limpiando contenido obsoleto del JSON...');

// Leer el archivo JSON
const pagesPath = path.join(process.cwd(), 'data', 'pages.json');
const rawData = fs.readFileSync(pagesPath, 'utf8');
let data = JSON.parse(rawData);

let cleanedCount = 0;

// Función para limpiar solo las secciones "Tipos y variedades"
function cleanSeoHtml(html) {
  if (!html) return html;
  
  let cleaned = html;
  
  // SOLO eliminar secciones "Tipos y variedades" completas (título + listas)
  cleaned = cleaned.replace(
    /<h3>\s*Tipos\s+y\s+variedades\s*<\/h3>[\s\S]*?(?=<h[2-6]|$)/gi,
    ''
  );
  
  // También eliminar variaciones del título "Tipos" + todo su contenido
  cleaned = cleaned.replace(
    /<h3>\s*Tipos\s*<\/h3>[\s\S]*?(?=<h[2-6]|$)/gi,
    ''
  );
  
  // Eliminar listas con nombres de plantas justo después de títulos (típicamente después de "Tipos")
  // Estructura: <ul><li><h3><a href="/ruta/">Nombre</a></h3><p>descripción...</p><a href="/ruta/">Leer Más</a></li>...</ul>
  cleaned = cleaned.replace(
    /<ul>\s*(?:<li>\s*<h3>\s*<a href="[^"]*">[^<]*<\/a>\s*<\/h3>\s*<p>[^<]*<\/p>\s*<a href="[^"]*">\s*Leer Más\s*<\/a>\s*<\/li>\s*){2,}<\/ul>/gi,
    ''
  );
  
  // También eliminar nombres de plantas separados solo por espacios (como "Azufre Ulam Raja Chocolate Sonata")
  cleaned = cleaned.replace(
    /\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*)*\s*){3,}(?=\s*<)/gm,
    ''
  );
  
  return cleaned.trim();
}

// Procesar solo páginas de tipo "page" (categorías)
data = data.map(item => {
  if (item.type === 'page' && item.seo_html) {
    const originalLength = item.seo_html.length;
    const cleanedHtml = cleanSeoHtml(item.seo_html);
    
    if (cleanedHtml !== item.seo_html) {
      console.log(`✅ Limpiada página: ${item.slug}`);
      console.log(`   Antes: ${originalLength} caracteres`);
      console.log(`   Después: ${cleanedHtml.length} caracteres`);
      cleanedCount++;
      
      item.seo_html = cleanedHtml;
    }
  }
  return item;
});

// Guardar el archivo limpio
fs.writeFileSync(pagesPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`\n🎉 Limpieza completada!`);
console.log(`📄 ${cleanedCount} páginas fueron limpiadas`);
console.log(`💾 Archivo guardado en: ${pagesPath}`);