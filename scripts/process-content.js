// Script para procesar el contenido y generar las páginas de Astro
import fs from 'fs';
import path from 'path';

const DATA_FILE = 'data/pages.json';
const OUTPUT_DIR = 'src/content';

// Leer y procesar el archivo de datos
const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

// Separar posts y páginas
const posts = data.filter(item => item.type === 'post');
const pages = data.filter(item => item.type === 'page');

// Obtener todas las categorías únicas
const categories = new Map();
posts.forEach(post => {
  post.categories.forEach(category => {
    if (!categories.has(category.slug)) {
      categories.set(category.slug, {
        slug: category.slug,
        name: category.name,
        posts: []
      });
    }
    categories.get(category.slug).posts.push(post);
  });
});

// Crear directorio de contenido si no existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Generar archivo de configuración de colecciones
const configContent = `
import { defineCollection, z } from 'astro:content';

const plants = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.number(),
    title: z.string(),
    date: z.string(),
    excerpt: z.string(),
    featured_image: z.string().nullable(),
    categories: z.array(z.object({
      slug: z.string(),
      name: z.string()
    })),
    tags: z.array(z.object({
      slug: z.string(),
      name: z.string()
    })).default([]),
    seo_html: z.string()
  }),
});

const categories = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    description: z.string().optional(),
    posts_count: z.number()
  }),
});

export const collections = { plants, categories };
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'config.ts'), configContent.trim());

// Crear directorio para plantas
const plantsDir = path.join(OUTPUT_DIR, 'plants');
if (!fs.existsSync(plantsDir)) {
  fs.mkdirSync(plantsDir, { recursive: true });
}

// Generar archivos markdown para cada post
posts.forEach(post => {
  const filename = `${post.slug}.md`;
  const frontmatter = {
    id: post.id,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    featured_image: post.featured_image,
    categories: post.categories,
    tags: post.tags || [],
    seo_html: post.seo_html
  };

  const content = `---
${Object.entries(frontmatter).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')}
---

${post.seo_html || ''}
`;

  fs.writeFileSync(path.join(plantsDir, filename), content);
});

// Crear directorio para categorías
const categoriesDir = path.join(OUTPUT_DIR, 'categories');
if (!fs.existsSync(categoriesDir)) {
  fs.mkdirSync(categoriesDir, { recursive: true });
}

// Generar archivos de datos para cada categoría
categories.forEach((category, slug) => {
  const filename = `${slug}.json`;
  const categoryData = {
    slug: category.slug,
    name: category.name,
    description: `Información completa sobre ${category.name.toLowerCase()}`,
    posts_count: category.posts.length
  };

  fs.writeFileSync(
    path.join(categoriesDir, filename), 
    JSON.stringify(categoryData, null, 2)
  );
});

console.log(`✅ Procesado completado:`);
console.log(`   ${posts.length} posts generados`);
console.log(`   ${categories.size} categorías generadas`);
console.log(`   Archivos generados en ${OUTPUT_DIR}`);

// Generar resumen de la estructura
const summary = {
  total_posts: posts.length,
  total_categories: categories.size,
  categories_with_counts: Array.from(categories.entries()).map(([slug, data]) => ({
    slug,
    name: data.name,
    posts_count: data.posts.length
  })).sort((a, b) => b.posts_count - a.posts_count)
};

fs.writeFileSync('data/content-summary.json', JSON.stringify(summary, null, 2));
console.log(`📊 Resumen guardado en data/content-summary.json`);