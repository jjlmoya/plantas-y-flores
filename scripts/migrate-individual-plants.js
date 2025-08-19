import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read all data files
const postsDir = path.join(__dirname, '../public/data/posts');
const calendarDir = path.join(__dirname, '../public/data/calendar');

console.log('Processing individual plants from category posts...');

// Read all category files and process their individual plants
const categoryFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.json'));
let totalPlants = 0;

for (const categoryFile of categoryFiles) {
    const categorySlug = path.basename(categoryFile, '.json');
    const categoryData = JSON.parse(fs.readFileSync(path.join(postsDir, categoryFile), 'utf8'));
    
    console.log(`\n📁 Processing category: ${categorySlug} (${categoryData.length} plants)`);
    
    let plantsProcessed = 0;
    
    for (const plant of categoryData) {
        const plantSlug = plant.slug;
        const plantPath = path.join(calendarDir, categorySlug, `${plantSlug}.json`);
        
        // Skip if plant already exists
        if (fs.existsSync(plantPath)) {
            continue;
        }
        
        // Extract plant details from content
        const plantDetails = extractPlantDetails(plant.seo_html || '', plant.title);
        
        // Create plant-specific data
        const plantData = {
            key: plantSlug
        };
        
        // Add plant info
        if (plant.title) {
            plantData.plant_info = {
                common_names: [plant.title]
            };
            
            if (plantDetails.scientific_name) {
                plantData.plant_info.scientific_name = plantDetails.scientific_name;
            }
            
            if (plantDetails.origin) {
                plantData.plant_info.origin = plantDetails.origin;
            }
            
            if (plantDetails.difficulty) {
                plantData.plant_info.difficulty = plantDetails.difficulty;
            }
        }
        
        // Add specific calendar overrides based on category and plant
        addSpecificPlantData(categorySlug, plantSlug, plantData, plantDetails, plant);
        
        // Add main image if available
        if (plant.main_image) {
            plantData._meta = {
                main_image: plant.main_image,
                article_date: plant.date
            };
        }
        
        // Add article reference
        if (plant.excerpt) {
            if (!plantData._meta) plantData._meta = {};
            plantData._meta.excerpt = plant.excerpt.replace(/<[^>]*>/g, '').substring(0, 200);
        }
        
        // Write plant file
        fs.writeFileSync(plantPath, JSON.stringify(plantData, null, 2));
        console.log(`  ✓ ${plantSlug}`);
        plantsProcessed++;
    }
    
    console.log(`  📊 Processed ${plantsProcessed} plants for ${categorySlug}`);
    totalPlants += plantsProcessed;
}

// Helper function to extract key information from HTML content
function extractPlantDetails(html, title) {
    const details = {};
    
    // Try to extract scientific name with various patterns
    const scientificNamePatterns = [
        /nombre científico[^<]*<[^>]*>([^<]+)/i,
        /<em>([A-Z][a-z]+ [a-z]+[^<]*)<\/em>/,
        /<strong><em>([A-Z][a-z]+ [a-z]+[^<]*)<\/em><\/strong>/,
        /científico[^>]*>\s*([A-Z][a-z]+ [a-z]+)/i,
        /\b([A-Z][a-z]+ [a-z]+ [a-z]+)\b/,
        /\b([A-Z][a-z]+ [a-z]+)\b/
    ];
    
    for (const pattern of scientificNamePatterns) {
        const match = html.match(pattern);
        if (match) {
            details.scientific_name = match[1].trim();
            break;
        }
    }
    
    // Try to extract origin information
    const originPatterns = [
        /origen[^<]*([A-Z][a-z]+)/i,
        /originario de ([A-Z][a-z]+)/i,
        /desarrollado en ([A-Z][a-z]+)/i
    ];
    
    for (const pattern of originPatterns) {
        const match = html.match(pattern);
        if (match) {
            details.origin = match[1].toLowerCase();
            break;
        }
    }
    
    // Try to extract difficulty information
    if (html.includes('fácil') || html.includes('sencill') || html.includes('poco mantenimiento')) {
        details.difficulty = 'beginner';
    } else if (html.includes('difícil') || html.includes('complicad') || html.includes('exigente')) {
        details.difficulty = 'advanced';
    } else if (html.includes('intermedi')) {
        details.difficulty = 'intermediate';
    }
    
    return details;
}

// Helper function to add specific plant data based on category and known varieties
function addSpecificPlantData(categorySlug, plantSlug, plantData, plantDetails, plant) {
    switch (categorySlug) {
        case 'tomate':
            addTomatoSpecifics(plantSlug, plantData, plantDetails, plant);
            break;
        case 'rosa':
            addRosaSpecifics(plantSlug, plantData, plantDetails, plant);
            break;
        case 'albahaca':
            addAlbahacaSpecifics(plantSlug, plantData, plantDetails, plant);
            break;
        case 'hibiscus':
            addHibiscusSpecifics(plantSlug, plantData, plantDetails, plant);
            break;
        case 'lirios':
            addLiriosSpecifics(plantSlug, plantData, plantDetails, plant);
            break;
        default:
            // Add basic data for other categories
            break;
    }
}

function addTomatoSpecifics(plantSlug, plantData, plantDetails, plant) {
    switch (plantSlug) {
        case 'cherry':
            plantData.harvest_data = {
                weight_range: [10, 25],
                storage_life: 5
            };
            plantData.calendar_data = {
                harvesting: {
                    days_to_harvest: [60, 70],
                    continuous_harvest: true
                }
            };
            plantData.growing_conditions = {
                growth_habit: "indeterminate",
                spacing: {
                    plant_distance: 40,
                    row_distance: 60
                }
            };
            break;
            
        case 'kumato':
            plantData.calendar_data = {
                harvesting: {
                    best_months: [7, 8, 9, 10, 11],
                    harvest_indicators: ["color_change", "firmness", "dark_color"]
                }
            };
            plantData.harvest_data = {
                weight_range: [60, 150],
                storage_life: 14
            };
            break;
            
        case 'roma':
            plantData.calendar_data = {
                harvesting: {
                    best_use: "processing",
                    characteristics: ["thick_flesh", "low_water_content"]
                }
            };
            plantData.growing_conditions = {
                growth_habit: "determinate"
            };
            break;
            
        case 'corazon-de-buey':
            plantData.harvest_data = {
                weight_range: [300, 500],
                storage_life: 7
            };
            plantData.calendar_data = {
                harvesting: {
                    best_months: [7, 8, 9],
                    harvest_indicators: ["size", "color_change"]
                }
            };
            plantData.growing_conditions = {
                growth_habit: "indeterminate",
                support_required: true,
                spacing: {
                    plant_distance: 60,
                    row_distance: 100
                }
            };
            break;
            
        case 'pera':
            plantData.calendar_data = {
                harvesting: {
                    best_use: "processing",
                    days_to_harvest: [90, 100]
                }
            };
            break;
            
        case 'rosa':
            plantData.harvest_data = {
                weight_range: [400, 1000],
                storage_life: 10
            };
            break;
            
        case 'indigo':
            plantData.plant_info = plantData.plant_info || {};
            plantData.plant_info.special_characteristics = ["high_antioxidants", "blue_pigmentation"];
            plantData.calendar_data = {
                harvesting: {
                    harvest_indicators: ["firmness", "aroma", "partial_color_change"]
                }
            };
            break;
            
        case 'rama':
            plantData.harvest_data = {
                storage_life: 270 // 9 months as mentioned in content
            };
            plantData.calendar_data = {
                harvesting: {
                    harvest_method: "cluster",
                    storage_method: "hanging"
                }
            };
            break;
    }
}

function addRosaSpecifics(plantSlug, plantData, plantDetails, plant) {
    // Common rose characteristics can be added here
    if (!plantData.flower_data) {
        plantData.flower_data = {};
    }
    
    switch (plantSlug) {
        case 'princesa-de-monaco':
            plantData.calendar_data = {
                flowering: {
                    best_months: [5, 6, 7, 8, 9, 10, 11],
                    repeat_flowering: true
                }
            };
            plantData.flower_data.fragrance = "moderate";
            break;
        default:
            plantData.flower_data.fragrance = "moderate";
            break;
    }
}

function addAlbahacaSpecifics(plantSlug, plantData, plantDetails, plant) {
    switch (plantSlug) {
        case 'genovesa':
            plantData.calendar_data = {
                harvesting: {
                    best_months: [6, 7, 8, 9],
                    harvest_method: "continuous_pinching"
                }
            };
            plantData.plant_info = plantData.plant_info || {};
            plantData.plant_info.culinary_use = "pesto";
            break;
    }
}

function addHibiscusSpecifics(plantSlug, plantData, plantDetails, plant) {
    // Add hibiscus-specific data based on variety
    plantData.flower_data = plantData.flower_data || {};
    plantData.flower_data.size = "large";
}

function addLiriosSpecifics(plantSlug, plantData, plantDetails, plant) {
    // Add lily-specific data based on variety
    plantData.flower_data = plantData.flower_data || {};
    
    switch (plantSlug) {
        case 'martagon':
            plantData.calendar_data = {
                flowering: {
                    best_months: [6, 7],
                    flower_form: "turks_cap"
                }
            };
            break;
        case 'stargazer':
            plantData.flower_data.fragrance = "strong";
            plantData.calendar_data = {
                flowering: {
                    best_months: [7, 8],
                    flower_form: "upward_facing"
                }
            };
            break;
        case 'azucena':
            plantData.flower_data.fragrance = "strong";
            plantData.flower_data.color = "white";
            break;
        case 'paz':
            plantData.growing_conditions = {
                sun_requirements: "partial_shade",
                water_needs: "high"
            };
            plantData.plant_info = plantData.plant_info || {};
            plantData.plant_info.indoor_suitable = true;
            break;
    }
}

console.log(`\n🎉 Individual plant migration completed!`);
console.log(`🌱 Total plants processed: ${totalPlants}`);