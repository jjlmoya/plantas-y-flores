// verificar.js
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('content.json', 'utf8'));

// sólo posts
const posts = data.filter(i => (i.type || '').toLowerCase() === 'post');

const normTerms = (arr = []) => arr
    .map(t => {
        if (!t) return null;
        if (typeof t === 'string') return { name: t, slug: t.toLowerCase().replace(/\s+/g, '-') };
        return { name: t.name || t.slug || String(t), slug: t.slug || (t.name || '').toLowerCase().replace(/\s+/g, '-') };
    })
    .filter(Boolean);

const countBy = (items, getter) => {
    const map = new Map();
    for (const it of items) {
        for (const key of getter(it)) {
            map.set(key, (map.get(key) || 0) + 1);
        }
    }
    // orden descendente
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
};

// contar por categorías y tags (normalizados)
const catCounts = countBy(posts, p => normTerms(p.categories || []).map(c => c.name.trim()).filter(Boolean));
const tagCounts = countBy(posts, p => normTerms(p.tags || []).map(t => t.name.trim()).filter(Boolean));

// salida en consola
console.log(`Total posts: ${posts.length}\n`);

console.log('Posts por categoría:');
for (const [name, n] of catCounts) console.log(`- ${name}: ${n}`);

console.log('\nPosts por tag:');
for (const [name, n] of tagCounts) console.log(`- ${name}: ${n}`);

// opcional: exportar a JSON
fs.writeFileSync('counts.categories.json', JSON.stringify(Object.fromEntries(catCounts), null, 2));
fs.writeFileSync('counts.tags.json', JSON.stringify(Object.fromEntries(tagCounts), null, 2));
