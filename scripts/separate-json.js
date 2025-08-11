import fs from 'fs';
import path from 'path';

console.log('🔄 Separando JSON por tipos y organizando por categorías...');

// Leer el archivo JSON original
const pagesPath = path.join(process.cwd(), 'data', 'pages.json');
const rawData = fs.readFileSync(pagesPath, 'utf8');
const data = JSON.parse(rawData);

// Separar por tipos
const posts = data.filter(item => item.type === 'post');
const pages = data.filter(item => item.type === 'page');

console.log(`📊 Encontrados: ${posts.length} posts y ${pages.length} pages`);

// Crear directorio data si no existe
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Guardar pages.json
const pagesFile = path.join(dataDir, 'pages.json');
fs.writeFileSync(pagesFile, JSON.stringify(pages, null, 2), 'utf8');
console.log(`✅ Guardado: ${pagesFile} con ${pages.length} páginas`);

// Crear directorio posts si no existe
const postsDir = path.join(dataDir, 'posts');
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

// Agrupar posts por categoría
const postsByCategory = {};

posts.forEach(post => {
  if (post.categories && post.categories.length > 0) {
    const categorySlug = post.categories[0].slug;
    
    if (!postsByCategory[categorySlug]) {
      postsByCategory[categorySlug] = [];
    }
    
    postsByCategory[categorySlug].push(post);
  } else {
    // Posts sin categoría van a una carpeta especial
    if (!postsByCategory['sin-categoria']) {
      postsByCategory['sin-categoria'] = [];
    }
    postsByCategory['sin-categoria'].push(post);
  }
});

// Crear archivos por categoría
Object.entries(postsByCategory).forEach(([categorySlug, categoryPosts]) => {
  const categoryFile = path.join(postsDir, `${categorySlug}.json`);
  fs.writeFileSync(categoryFile, JSON.stringify(categoryPosts, null, 2), 'utf8');
  console.log(`✅ Guardado: ${categoryFile} con ${categoryPosts.length} posts`);
});

// Guardar también un posts.json completo para referencia
const allPostsFile = path.join(dataDir, 'posts.json');
fs.writeFileSync(allPostsFile, JSON.stringify(posts, null, 2), 'utf8');
console.log(`✅ Guardado: ${allPostsFile} con ${posts.length} posts totales`);

console.log('\n🎉 Separación completada!');
console.log(`📁 Estructura creada:`);
console.log(`   data/pages.json - ${pages.length} páginas`);
console.log(`   data/posts.json - ${posts.length} posts`);
console.log(`   data/posts/ - ${Object.keys(postsByCategory).length} archivos por categoría`);

// Mostrar estadísticas por categoría
console.log('\n📈 Posts por categoría:');
Object.entries(postsByCategory)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([category, posts]) => {
    console.log(`   ${category}: ${posts.length} posts`);
  });