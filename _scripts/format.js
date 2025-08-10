// format.js
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');

const input = 'content.json';
const output = 'content.formatted.json';

// Etiquetas SEO permitidas
const allowedTags = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'strong', 'b', 'em', 'i',
    'ul', 'ol', 'li',
    'blockquote', 'code', 'pre',
    'a', 'img'
];

// Atributos permitidos
const allowedAttributes = {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt']
};

function clean(html = '') {
    let out = sanitizeHtml(html, {
        allowedTags,
        allowedAttributes,
        disallowedTagsMode: 'discard',
        enforceHtmlBoundary: true,
        transformTags: {
            'a': (tagName, attribs) => {
                // Cambiar URLs absolutas del dominio por rutas relativas
                if (attribs.href) {
                    attribs.href = attribs.href.replace(/https?:\/\/plantasyflores\.online\//gi, '/');
                }
                // Si es enlace interno, quitar target y rel
                if (attribs.href && attribs.href.startsWith('/')) {
                    delete attribs.target;
                    delete attribs.rel;
                } else {
                    // Si es externo, asegurar seguridad
                    attribs.target = '_blank';
                    attribs.rel = 'noopener noreferrer';
                }
                return { tagName, attribs };
            }
        }
    });

    // Quitar etiquetas vacías
    for (let i = 0; i < 2; i++) {
        out = out.replace(/<((?:p|h[1-6]|blockquote|li|ul|ol|code|pre|strong|em|b|i))>(\s|&nbsp;)*<\/\1>/gi, '');
    }

    // Quitar saltos de línea y espacios múltiples
    out = out.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim();

    return out;
}

const data = JSON.parse(fs.readFileSync(input, 'utf8'));
const formatted = data.map(item => {
    const { content_html, ...rest } = item;
    return {
        ...rest,
        seo_html: clean(content_html || '')
    };
});

fs.writeFileSync(output, JSON.stringify(formatted, null, 2), 'utf8');
console.log(`OK → ${output}`);
