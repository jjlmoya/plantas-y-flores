// descargar_todo.js
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const fetch = require('node-fetch');

const DOMAIN = 'https://plantasyflores.online';
const INPUT = 'content.formatted.json';
const MODE = (process.argv[2] || 'path').toLowerCase(); // 'path' | 'by-page'
const CONCURRENCY = 6;
const RETRIES = 2;

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8')); // [{slug, seo_html, ...}]
const reImg = /<img\b[^>]*\bsrc\s*=\s*"(.*?)"[^>]*>/gi;

const safe = s => (s || 'sin-slug').toLowerCase().replace(/[^a-z0-9_-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
const stripQuery = u => u.split('#')[0].split('?')[0];

function absUrl(u) {
    if (!u) return null;
    if (u.startsWith('data:')) return null;
    if (u.startsWith('//')) return 'https:' + u;
    if (u.startsWith('/')) return DOMAIN + u;
    return u;
}

async function ensureDir(p) { await fsp.mkdir(p, { recursive: true }); }
async function exists(p) { try { await fsp.access(p); return true; } catch { return false; } }

function destPath(url, pageSlug) {
    const u = new URL(url);
    const cleanPath = stripQuery(u.pathname);
    const filename0 = path.basename(cleanPath) || `${safe(pageSlug)}-img`;
    if (MODE === 'by-page') return path.join('assets', safe(pageSlug), filename0);
    return path.join('static', cleanPath);
}

async function download(url, dest) {
    await ensureDir(path.dirname(dest));
    let final = dest, i = 1;
    const ext = path.extname(dest);
    const base = path.join(path.dirname(dest), path.basename(dest, ext));
    while (await exists(final)) { final = `${base}-${i}${ext}`; i++; }

    let lastErr;
    for (let r = 0; r <= RETRIES; r++) {
        try {
            const res = await fetch(url, { timeout: 30000 });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const buf = await res.buffer();
            await fsp.writeFile(final, buf);
            return final;
        } catch (e) { lastErr = e; }
    }
    throw lastErr;
}

function extractAll() {
    const tasks = [];
    for (const item of data) {
        const html = item.seo_html || '';
        let m; reImg.lastIndex = 0;
        const seen = new Set();
        while ((m = reImg.exec(html)) !== null) {
            const u = absUrl(m[1].trim());
            if (!u) continue;
            if (seen.has(u)) continue;
            seen.add(u);
            tasks.push({ url: u, dest: destPath(u, item.slug), page: item.slug });
        }
    }
    return tasks;
}

async function run() {
    const tasks = extractAll();
    console.log(`Imágenes a descargar: ${tasks.length}  |  Modo: ${MODE}`);

    let done = 0, ok = 0, fail = 0;
    const q = tasks.slice();
    const workers = Array.from({ length: CONCURRENCY }, async () => {
        while (q.length) {
            const t = q.shift();
            try {
                const saved = await download(t.url, t.dest);
                ok++;
                if (ok % 10 === 0) console.log(`✓ ${ok} OK`);
            } catch (e) {
                fail++;
                console.error(`✗ ${t.url} -> ${t.dest} (${e.message})`);
            } finally {
                done++;
            }
        }
    });
    await Promise.all(workers);
    console.log(`Fin. OK: ${ok} | Fallos: ${fail}`);
}

run().catch(e => { console.error(e); process.exit(1); });
