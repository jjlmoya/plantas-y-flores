// extraer_imagenes.js
const fs = require('fs');

const DOMAIN = 'https://plantasyflores.online';
const input = 'content.formatted.json';
const output = 'imagenes.json';

const data = JSON.parse(fs.readFileSync(input, 'utf8'));
const reImg = /<img\b[^>]*\bsrc\s*=\s*"(.*?)"[^>]*>/gi;

const result = data.map(item => {
    const html = item.seo_html || item.content_html || '';
    const urls = new Set();
    let m;
    while ((m = reImg.exec(html)) !== null) {
        let u = m[1].trim();
        if (!u) continue;
        // Normaliza a absoluta
        if (u.startsWith('//')) u = 'https:' + u;
        else if (u.startsWith('/')) u = DOMAIN + u;
        // Ignora data URIs
        if (!/^data:/i.test(u)) urls.add(u);
    }
    return {
        page: item.slug,
        images: [...urls]
    };
});

fs.writeFileSync(output, JSON.stringify(result, null, 2), 'utf8');
console.log(`OK → ${output} (${result.length} páginas)`);
