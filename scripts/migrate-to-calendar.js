import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read all data files
const pagesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/pages.json'), 'utf8'));
const postsDir = path.join(__dirname, '../public/data/posts');
const calendarDir = path.join(__dirname, '../public/data/calendar');

// Ensure calendar directory exists
if (!fs.existsSync(calendarDir)) {
    fs.mkdirSync(calendarDir, { recursive: true });
}

// Category mapping for plant types and basic info
const categoryDefaults = {
    // Vegetables and Edible Plants
    tomate: {
        plant_info: {
            category: "tomate",
            scientific_name: "Solanum lycopersicum",
            family: "Solanaceae",
            type: "annual",
            difficulty: "beginner"
        },
        calendar_data: {
            sowing: {
                indoor: {
                    best_months: [1, 2, 3],
                    temperature_range: [18, 24]
                },
                outdoor: {
                    best_months: [4, 5],
                    temperature_range: [15, 20]
                }
            },
            transplanting: {
                best_months: [4, 5, 6]
            },
            harvesting: {
                best_months: [7, 8, 9, 10]
            },
            care_calendar: {
                monthly_tasks: {
                    "1": ["prepare_seedbeds", "soil_preparation"],
                    "2": ["sowing_indoor", "fertilize"],
                    "3": ["sowing_indoor", "prepare_outdoor"],
                    "4": ["transplant", "install_supports"],
                    "5": ["transplant", "moderate_watering", "mulching"],
                    "6": ["moderate_watering", "fertilize"],
                    "7": ["harvest_early", "moderate_watering"],
                    "8": ["harvest_main", "moderate_watering"],
                    "9": ["harvest_main", "moderate_watering"],
                    "10": ["harvest_late", "plant_cleanup"]
                }
            }
        },
        growing_conditions: {
            sun_requirements: "full_sun",
            water_needs: "moderate",
            soil_ph: [6.0, 7.0],
            soil_type: "well_drained_fertile",
            spacing: {
                plant_distance: 50,
                row_distance: 80
            }
        }
    },
    
    albahaca: {
        plant_info: {
            category: "albahaca",
            scientific_name: "Ocimum basilicum",
            family: "Lamiaceae",
            type: "annual",
            difficulty: "beginner"
        },
        calendar_data: {
            sowing: {
                indoor: {
                    best_months: [2, 3, 4],
                    temperature_range: [20, 25]
                },
                outdoor: {
                    best_months: [4, 5, 6],
                    temperature_range: [18, 22]
                }
            },
            harvesting: {
                best_months: [6, 7, 8, 9, 10]
            },
            care_calendar: {
                monthly_tasks: {
                    "2": ["prepare_seedbeds"],
                    "3": ["sowing_indoor"],
                    "4": ["sowing_outdoor", "transplant"],
                    "5": ["transplant", "moderate_watering"],
                    "6": ["harvest_early", "moderate_watering"],
                    "7": ["harvest_main", "moderate_watering"],
                    "8": ["harvest_main", "moderate_watering"],
                    "9": ["harvest_main", "moderate_watering"],
                    "10": ["harvest_late", "plant_cleanup"]
                }
            }
        },
        growing_conditions: {
            sun_requirements: "full_sun",
            water_needs: "moderate",
            soil_ph: [6.0, 7.5],
            soil_type: "well_drained",
            spacing: {
                plant_distance: 20,
                row_distance: 30
            }
        }
    },

    // Flowers and Ornamentals
    rosa: {
        plant_info: {
            category: "rosa",
            scientific_name: "Rosa",
            family: "Rosaceae",
            type: "perennial",
            difficulty: "intermediate"
        },
        calendar_data: {
            planting: {
                best_months: [3, 4, 10, 11],
                alternative_months: [2, 5, 9, 12]
            },
            flowering: {
                best_months: [5, 6, 7, 8, 9, 10],
                peak_months: [6, 7]
            },
            pruning: {
                main_pruning: [2, 3],
                deadheading: [5, 6, 7, 8, 9],
                light_pruning: [11]
            },
            care_calendar: {
                monthly_tasks: {
                    "2": ["prune_main"],
                    "3": ["fertilize", "mulching"],
                    "4": ["moderate_watering"],
                    "5": ["pest_monitoring", "fertilize"],
                    "6": ["moderate_watering", "deadheading"],
                    "7": ["moderate_watering", "deadheading"],
                    "8": ["moderate_watering", "deadheading"],
                    "9": ["moderate_watering", "deadheading"],
                    "10": ["moderate_watering"],
                    "11": ["prune_shoots", "mulching"]
                }
            }
        },
        growing_conditions: {
            sun_requirements: "full_sun",
            water_needs: "moderate",
            soil_ph: [6.0, 7.0],
            soil_type: "well_drained_fertile",
            spacing: {
                plant_distance: 60,
                row_distance: 80
            }
        }
    },

    hibiscus: {
        plant_info: {
            category: "hibiscus",
            scientific_name: "Hibiscus",
            family: "Malvaceae",
            type: "perennial",
            difficulty: "beginner"
        },
        calendar_data: {
            planting: {
                best_months: [4, 5, 6],
                alternative_months: [3, 7]
            },
            flowering: {
                best_months: [6, 7, 8, 9, 10],
                peak_months: [7, 8]
            },
            pruning: {
                main_pruning: [3, 4],
                light_pruning: [11]
            },
            care_calendar: {
                monthly_tasks: {
                    "3": ["prune_main", "fertilize"],
                    "4": ["planting", "moderate_watering"],
                    "5": ["planting", "moderate_watering"],
                    "6": ["moderate_watering", "fertilize"],
                    "7": ["moderate_watering"],
                    "8": ["moderate_watering"],
                    "9": ["moderate_watering"],
                    "10": ["moderate_watering"],
                    "11": ["prune_shoots"]
                }
            }
        },
        growing_conditions: {
            sun_requirements: "full_sun",
            water_needs: "high",
            soil_ph: [6.0, 7.5],
            soil_type: "well_drained_fertile",
            spacing: {
                plant_distance: 100,
                row_distance: 120
            }
        }
    },

    lirios: {
        plant_info: {
            category: "lirios",
            scientific_name: "Lilium",
            family: "Liliaceae",
            type: "perennial",
            difficulty: "intermediate"
        },
        calendar_data: {
            planting: {
                best_months: [9, 10, 11],
                alternative_months: [3, 4]
            },
            flowering: {
                best_months: [5, 6, 7, 8],
                peak_months: [6, 7]
            },
            care_calendar: {
                monthly_tasks: {
                    "3": ["fertilize"],
                    "4": ["moderate_watering"],
                    "5": ["moderate_watering", "mulching"],
                    "6": ["moderate_watering"],
                    "7": ["moderate_watering"],
                    "8": ["moderate_watering"],
                    "9": ["planting", "fertilize"],
                    "10": ["planting"],
                    "11": ["planting", "mulching"]
                }
            }
        },
        growing_conditions: {
            sun_requirements: "partial_sun",
            water_needs: "moderate",
            soil_ph: [6.0, 7.0],
            soil_type: "well_drained",
            spacing: {
                plant_distance: 30,
                row_distance: 40
            }
        }
    },

    // Other common categories with basic defaults
    amapola: {
        plant_info: { category: "amapola", type: "annual", difficulty: "beginner" },
        calendar_data: { sowing: { outdoor: { best_months: [3, 4, 9] } }, flowering: { best_months: [5, 6, 7] } },
        growing_conditions: { sun_requirements: "full_sun", water_needs: "low" }
    },
    
    margarita: {
        plant_info: { category: "margarita", type: "perennial", difficulty: "beginner" },
        calendar_data: { planting: { best_months: [3, 4, 9] }, flowering: { best_months: [4, 5, 6, 7, 8, 9] } },
        growing_conditions: { sun_requirements: "full_sun", water_needs: "moderate" }
    },

    cosmos: {
        plant_info: { category: "cosmos", type: "annual", difficulty: "beginner" },
        calendar_data: { sowing: { outdoor: { best_months: [4, 5] } }, flowering: { best_months: [7, 8, 9, 10] } },
        growing_conditions: { sun_requirements: "full_sun", water_needs: "low" }
    },

    hortensias: {
        plant_info: { category: "hortensias", type: "perennial", difficulty: "intermediate" },
        calendar_data: { planting: { best_months: [3, 4, 10] }, flowering: { best_months: [6, 7, 8, 9] } },
        growing_conditions: { sun_requirements: "partial_shade", water_needs: "high" }
    },

    azalea: {
        plant_info: { category: "azalea", type: "perennial", difficulty: "intermediate" },
        calendar_data: { planting: { best_months: [3, 4, 10] }, flowering: { best_months: [4, 5, 6] } },
        growing_conditions: { sun_requirements: "partial_shade", water_needs: "high", soil_ph: [4.5, 6.0] }
    },

    tulipan: {
        plant_info: { category: "tulipan", type: "perennial", difficulty: "beginner" },
        calendar_data: { planting: { best_months: [10, 11, 12] }, flowering: { best_months: [3, 4, 5] } },
        growing_conditions: { sun_requirements: "full_sun", water_needs: "moderate" }
    },

    lavanda: {
        plant_info: { category: "lavanda", type: "perennial", difficulty: "beginner" },
        calendar_data: { planting: { best_months: [3, 4, 9] }, flowering: { best_months: [6, 7, 8] } },
        growing_conditions: { sun_requirements: "full_sun", water_needs: "low", soil_type: "well_drained" }
    },

    orquidea: {
        plant_info: { category: "orquidea", type: "perennial", difficulty: "advanced" },
        calendar_data: { flowering: { best_months: [3, 4, 5, 6, 7, 8, 9, 10] } },
        growing_conditions: { sun_requirements: "bright_indirect", water_needs: "low" }
    },

    // Vegetables and edible plants
    patata: {
        plant_info: { category: "patata", type: "annual", difficulty: "beginner" },
        calendar_data: { sowing: { outdoor: { best_months: [3, 4, 5] } }, harvesting: { best_months: [7, 8, 9] } },
        growing_conditions: { sun_requirements: "full_sun", water_needs: "moderate" }
    },

    fresa: {
        plant_info: { category: "fresa", type: "perennial", difficulty: "beginner" },
        calendar_data: { planting: { best_months: [3, 4, 8, 9] }, harvesting: { best_months: [5, 6, 7] } },
        growing_conditions: { sun_requirements: "full_sun", water_needs: "moderate" }
    },

    chili: {
        plant_info: { category: "chili", type: "annual", difficulty: "beginner" },
        calendar_data: { sowing: { indoor: { best_months: [2, 3] } }, harvesting: { best_months: [8, 9, 10] } },
        growing_conditions: { sun_requirements: "full_sun", water_needs: "moderate" }
    },

    col: {
        plant_info: { category: "col", type: "annual", difficulty: "beginner" },
        calendar_data: { sowing: { outdoor: { best_months: [3, 4, 8, 9] } }, harvesting: { best_months: [6, 7, 10, 11] } },
        growing_conditions: { sun_requirements: "full_sun", water_needs: "moderate" }
    },

    // Fruits
    mango: {
        plant_info: { category: "mango", type: "perennial", difficulty: "advanced" },
        calendar_data: { planting: { best_months: [4, 5] }, harvesting: { best_months: [6, 7, 8] } },
        growing_conditions: { sun_requirements: "full_sun", water_needs: "moderate" }
    },

    platano: {
        plant_info: { category: "platano", type: "perennial", difficulty: "intermediate" },
        calendar_data: { planting: { best_months: [4, 5, 6] }, harvesting: { best_months: [10, 11, 12] } },
        growing_conditions: { sun_requirements: "full_sun", water_needs: "high" }
    },

    pina: {
        plant_info: { category: "pina", type: "perennial", difficulty: "advanced" },
        calendar_data: { planting: { best_months: [5, 6] }, harvesting: { best_months: [10, 11, 12] } },
        growing_conditions: { sun_requirements: "full_sun", water_needs: "moderate" }
    },

    // Herbs
    tomillo: {
        plant_info: { category: "tomillo", type: "perennial", difficulty: "beginner" },
        calendar_data: { planting: { best_months: [3, 4, 9] }, harvesting: { best_months: [6, 7, 8, 9] } },
        growing_conditions: { sun_requirements: "full_sun", water_needs: "low" }
    },

    manzanilla: {
        plant_info: { category: "manzanilla", type: "annual", difficulty: "beginner" },
        calendar_data: { sowing: { outdoor: { best_months: [3, 4, 9] } }, harvesting: { best_months: [6, 7, 8] } },
        growing_conditions: { sun_requirements: "full_sun", water_needs: "moderate" }
    },

    // Default for unknown categories
    default: {
        plant_info: { type: "annual", difficulty: "beginner" },
        calendar_data: { sowing: { outdoor: { best_months: [4, 5] } } },
        growing_conditions: { sun_requirements: "full_sun", water_needs: "moderate" }
    }
};

// Helper function to determine planting season based on plant type
function getPlantingSeasonData(category, scientificName) {
    const categoryData = categoryDefaults[category] || categoryDefaults.default;
    
    // Add scientific name from individual plant if available
    if (scientificName && categoryData.plant_info) {
        categoryData.plant_info.scientific_name = scientificName;
    }
    
    return categoryData;
}

// Helper function to extract key information from HTML content
function extractPlantDetails(html, title) {
    const details = {};
    
    // Try to extract scientific name
    const scientificNameMatch = html.match(/nombre científico[^<]*<[^>]*>([^<]+)/i) ||
                               html.match(/<em>([A-Z][a-z]+ [a-z]+)<\/em>/) ||
                               html.match(/\b([A-Z][a-z]+ [a-z]+)\b/);
    
    if (scientificNameMatch) {
        details.scientific_name = scientificNameMatch[1];
    }
    
    // Try to extract origin information
    const originMatch = html.match(/origen[^<]*([A-Z][a-z]+)/i);
    if (originMatch) {
        details.origin = originMatch[1].toLowerCase();
    }
    
    // Try to extract difficulty information
    if (html.includes('fácil') || html.includes('sencill') || html.includes('beginner')) {
        details.difficulty = 'beginner';
    } else if (html.includes('difícil') || html.includes('complicad') || html.includes('advanced')) {
        details.difficulty = 'advanced';
    } else if (html.includes('intermedi')) {
        details.difficulty = 'intermediate';
    }
    
    return details;
}

// Process categories first
console.log('Processing categories...');
let categoryCount = 0;

// Get all category files from posts directory
const categoryFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.json'));

for (const categoryFile of categoryFiles) {
    const categorySlug = path.basename(categoryFile, '.json');
    const categoryPath = path.join(calendarDir, categorySlug);
    
    // Create category directory
    if (!fs.existsSync(categoryPath)) {
        fs.mkdirSync(categoryPath, { recursive: true });
    }
    
    // Get base category data
    const baseData = categoryDefaults[categorySlug] || categoryDefaults.default;
    
    // Ensure category is set correctly
    if (baseData.plant_info) {
        baseData.plant_info.category = categorySlug;
    }
    
    // Write category index.json
    const categoryIndexPath = path.join(categoryPath, 'index.json');
    fs.writeFileSync(categoryIndexPath, JSON.stringify(baseData, null, 2));
    
    console.log(`✓ Created category: ${categorySlug}`);
    categoryCount++;
}

// Process individual plants
console.log('\nProcessing individual plants...');
let plantCount = 0;

// Filter plants that have categories matching our calendar categories
const plantsWithCategories = pagesData.filter(item => {
    return item.type === 'page' && 
           item.categories && 
           item.categories.length > 0 &&
           categoryDefaults[item.categories[0].slug];
});

for (const plant of plantsWithCategories) {
    const categorySlug = plant.categories[0].slug;
    const plantSlug = plant.slug;
    
    // Skip if it's a general category page or has no meaningful slug
    if (plantSlug === categorySlug || plantSlug.length < 2) {
        continue;
    }
    
    const plantPath = path.join(calendarDir, categorySlug, `${plantSlug}.json`);
    
    // Extract plant details from content
    const plantDetails = extractPlantDetails(plant.seo_html || '', plant.title);
    
    // Create plant-specific data
    const plantData = {
        key: plantSlug
    };
    
    // Add plant info if we extracted any meaningful data
    if (Object.keys(plantDetails).length > 0) {
        plantData.plant_info = {};
        
        if (plantDetails.scientific_name) {
            plantData.plant_info.scientific_name = plantDetails.scientific_name;
        }
        
        if (plant.title) {
            plantData.plant_info.common_names = [plant.title];
        }
        
        if (plantDetails.origin) {
            plantData.plant_info.origin = plantDetails.origin;
        }
        
        if (plantDetails.difficulty) {
            plantData.plant_info.difficulty = plantDetails.difficulty;
        }
    }
    
    // Add specific overrides for well-known varieties
    if (categorySlug === 'tomate') {
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
                    storage_life: 14
                };
                break;
                
            case 'roma':
                plantData.calendar_data = {
                    harvesting: {
                        best_use: "processing"
                    }
                };
                break;
        }
    }
    
    // Add main image if available
    if (plant.main_image) {
        plantData._meta = {
            main_image: plant.main_image
        };
    }
    
    // Write plant file only if we have meaningful data
    if (Object.keys(plantData).length > 1) { // More than just 'key'
        fs.writeFileSync(plantPath, JSON.stringify(plantData, null, 2));
        console.log(`✓ Created plant: ${categorySlug}/${plantSlug}`);
        plantCount++;
    }
}

console.log(`\n🎉 Migration completed!`);
console.log(`📁 Categories created: ${categoryCount}`);
console.log(`🌱 Plants migrated: ${plantCount}`);
console.log(`📍 Calendar data location: ${calendarDir}`);

// Create a summary report
const summaryPath = path.join(calendarDir, 'migration-summary.json');
const summary = {
    migration_date: new Date().toISOString(),
    categories_processed: categoryCount,
    plants_processed: plantCount,
    source_files: {
        pages_json: pagesData.length + ' entries',
        category_files: categoryFiles.length + ' files'
    },
    categories_with_defaults: Object.keys(categoryDefaults).filter(key => key !== 'default'),
    next_steps: [
        "Review generated calendar files",
        "Adjust plant-specific data as needed",
        "Test calendar inheritance system",
        "Validate data with calendar utilities"
    ]
};

fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
console.log(`📋 Migration summary saved to: migration-summary.json`);