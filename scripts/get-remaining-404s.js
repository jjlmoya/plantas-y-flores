import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista COMPLETA de imágenes que estaban faltando originalmente
const originalMissingImages = [
    "/wp-content/uploads/2017/07/IMG_3560.webp-325x244.webp",
    "/wp-content/uploads/2017/07/book-419589_1280.webp",
    "/wp-content/uploads/2017/07/fresa-1.webp",
    "/wp-content/uploads/2017/07/calender-2389150_1280.webp",
    "/wp-content/uploads/2017/07/watering-can-1506750_1280.webp",
    "/wp-content/uploads/2017/07/fresas-plantadas-creciendo.webp",
    "/wp-content/uploads/2017/07/fresa-6.webp",
    "/wp-content/uploads/2017/07/fresa-9.webp",
    "/wp-content/uploads/2017/07/fresas-en-mercado.webp",
    "/wp-content/uploads/2017/07/herbal-tea-1410565_1280.webp",
    "/wp-content/uploads/2017/07/fresa-10.webp",
    "/wp-content/uploads/2017/07/fresa-7.webp",
    "/wp-content/uploads/2017/07/fresa-3.webp",
    "/wp-content/uploads/2017/07/CFjdh6aWgAAzjvx.webp",
    "/wp-content/uploads/2017/07/fresa-4.webp",
    "/wp-content/uploads/2017/07/rosa-21.webp",
    "/wp-content/uploads/2017/07/rosa-17.webp",
    "/wp-content/uploads/2017/07/rosa-8.webp",
    "/wp-content/uploads/2017/07/rosa-9.webp",
    "/wp-content/uploads/2017/07/rosa-7.webp",
    "/wp-content/uploads/2017/07/rosa-6.webp",
    "/wp-content/uploads/2017/07/rosa-19.webp",
    "/wp-content/uploads/2017/07/rosa-2.webp",
    "/wp-content/uploads/2017/07/rosa-3.webp",
    "/wp-content/uploads/2017/07/rosa-primer-plano-creciendo.webp",
    "/wp-content/uploads/2017/07/rosa-10.webp",
    "/wp-content/uploads/2017/07/rosa-1.webp",
    "/wp-content/uploads/2017/07/azafran-en-hebras.webp",
    "/wp-content/uploads/2017/07/azafran-plantado-creciendo.webp",
    "/wp-content/uploads/2017/07/crocus-blossom-2119173_1280.webp",
    "/wp-content/uploads/2017/07/crocus-1225501_1280.webp",
    "/wp-content/uploads/2017/07/crocus-2225200_1280.webp",
    "/wp-content/uploads/2017/07/crocus-2144736_1280.webp",
    "/wp-content/uploads/2017/07/saffron-1821786_1280.webp",
    "/wp-content/uploads/2017/07/spices-2353062_1280.webp",
    "/wp-content/uploads/2017/07/paella-1349255_1280.webp",
    "/wp-content/uploads/2017/07/hass-avocado-2032538_1280.webp",
    "/wp-content/uploads/2017/07/aguacate-recien-abierto.webp",
    "/wp-content/uploads/2017/07/hass-avocado-1054736_1280.webp",
    "/wp-content/uploads/2017/07/aguacate-plantado-creciendo.webp",
    "/wp-content/uploads/2017/07/avocado-1488561_1280.webp",
    "/wp-content/uploads/2017/07/golf-1649258_1280.webp",
    "/wp-content/uploads/2017/07/hass-avocado-945418_1280.webp",
    "/wp-content/uploads/2017/07/refrigerator-1132254_1280.webp",
    "/wp-content/uploads/2017/07/avocados-354061_1280.webp",
    "/wp-content/uploads/2017/07/avocado-2210652_1280.webp",
    "/wp-content/uploads/2017/07/avocado-829092_1280.webp",
    "/wp-content/uploads/2017/07/avocado-1171725_1280.webp",
    "/wp-content/uploads/2017/07/measure-1897778_1280.webp",
    "/wp-content/uploads/2017/07/fruit-1851051_1280.webp",
    "/wp-content/uploads/2017/07/pineapple-1487977_1280.webp",
    "/wp-content/uploads/2017/07/pineapple-2282921_1280.webp",
    "/wp-content/uploads/2017/07/fruit-2138391_1280.webp",
    "/wp-content/uploads/2017/07/mini-pineapple-1462136_1280.webp",
    "/wp-content/uploads/2017/07/pina-en-planta-jardin.webp",
    "/wp-content/uploads/2017/07/pineapple-1127897_1280.webp",
    "/wp-content/uploads/2017/07/pineapple-636562_1280.webp",
    "/wp-content/uploads/2017/07/pineapple-1822156_1280.webp",
    "/wp-content/uploads/2017/07/young-pineapple-247334_1280.webp",
    "/wp-content/uploads/2017/07/pineapple-decoration-1037911_1280.webp",
    "/wp-content/uploads/2017/07/female-731895_1280.webp",
    "/wp-content/uploads/2025/08/peonia.webp",
    "/wp-content/uploads/2017/12/2048px-Köynnöshortensia_Hydrangea_anomala_subsp._petiolaris-1-325x244.webp",
    "/wp-content/uploads/2017/07/cherry-tomatoes-2152341_1280.webp",
    "/wp-content/uploads/2017/07/ripening-tomatoes-1530464_1280.webp",
    "/wp-content/uploads/2017/07/vegetables-1772527_1280.webp",
    "/wp-content/uploads/2017/07/vinegar-1667839_1280.webp",
    "/wp-content/uploads/2017/07/spaghetti-1118343_1280.webp",
    "/wp-content/uploads/2017/11/Thymus_×citriodorus_Lemon_Thyme_レモンタイム5_026711-325x244.webp"
];

// Function to check if image exists locally
function checkImageExists(imagePath) {
    const fullPath = path.join(__dirname, 'public', imagePath);
    return fs.existsSync(fullPath);
}

async function main() {
    console.log('📋 VERIFICANDO IMÁGENES DESPUÉS DE LAS CORRECCIONES...\n');
    
    const stillMissing = [];
    const nowFixed = [];
    
    // Verificar cada imagen original
    for (const imagePath of originalMissingImages) {
        const exists = checkImageExists(imagePath);
        
        if (exists) {
            nowFixed.push(imagePath);
        } else {
            stillMissing.push(imagePath);
        }
    }
    
    console.log(`✅ IMÁGENES CORREGIDAS: ${nowFixed.length}/69`);
    console.log(`❌ IMÁGENES RESTANTES: ${stillMissing.length}/69\n`);
    
    if (nowFixed.length > 0) {
        console.log('🎉 IMÁGENES QUE YA FUNCIONAN:\n');
        nowFixed.forEach((img, index) => {
            console.log(`${index + 1}. ${img}`);
        });
        console.log('');
    }
    
    if (stillMissing.length > 0) {
        console.log('🚨 IMÁGENES QUE AÚN FALTAN:\n');
        stillMissing.forEach((img, index) => {
            console.log(`${index + 1}. ${img}`);
        });
    } else {
        console.log('🎉 ¡TODAS LAS IMÁGENES HAN SIDO CORREGIDAS!');
    }
    
    console.log(`\n📊 PROGRESO: ${((nowFixed.length / originalMissingImages.length) * 100).toFixed(1)}% completado`);
}

main().catch(console.error);