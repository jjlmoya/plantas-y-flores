import fs from 'fs';
import path from 'path';

console.log('🔄 Eliminando Navigation duplicado de las páginas...');

const pagesDir = path.join(process.cwd(), 'src', 'pages');
const files = [
  'plantas-medicinales.astro',
  'contacto.astro', 
  'politica-de-cookies.astro',
  'tienda-de-semillas.astro',
  'plantas-interior.astro',
  'plantas-aromaticas.astro',
  'plantas-comestibles.astro',
  'plantas-exterior.astro'
];

let fixedCount = 0;

files.forEach(fileName => {
  const filePath = path.join(pagesDir, fileName);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Eliminar import de Navigation
    content = content.replace(/import Navigation from ['"](.*?)Navigation\.vue['"];\s*\n?/g, '');
    
    // Eliminar el componente Navigation del HTML
    content = content.replace(/<Navigation client:load \/>\s*\n?/g, '');
    content = content.replace(/<Navigation client:load>\s*<\/Navigation>\s*\n?/g, '');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Limpiado: ${fileName}`);
      fixedCount++;
    } else {
      console.log(`⚪ Sin cambios: ${fileName}`);
    }
  } else {
    console.log(`❌ No encontrado: ${fileName}`);
  }
});

console.log(`\n🎉 Proceso completado!`);
console.log(`📄 ${fixedCount} archivos fueron limpiados`);
console.log(`🧭 Navigation ahora aparece automáticamente en todas las páginas via BaseLayout`);