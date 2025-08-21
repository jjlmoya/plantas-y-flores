# Calendar System Documentation

This directory contains the hierarchical calendar system for plant cultivation data with inheritance support.

## Directory Structure

```
calendar/
├── README.md                   # This documentation
├── global-config.json          # Complete catalog of all available options
├── tomate/                     # Category directory
│   ├── index.json             # Base configuration for all tomatoes
│   ├── kumato.json            # Specific overrides for Kumato variety
│   └── cherry.json            # Specific overrides for Cherry variety
├── rosa/                       # Category directory
│   └── index.json             # Base configuration for all roses
└── albahaca/                   # Category directory
    ├── index.json             # Base configuration for all basils
    └── genovesa.json          # Specific overrides for Genovese variety
```

## File Types & Purpose

### `global-config.json`
**Purpose**: Master catalog of all available options across the entire system.

**Contains**:
- All possible values for enums (task_definitions, soil_types, etc.)
- Valid options for every field used in plant configurations
- Hemisphere settings for automatic season adjustment
- Standardized units (celsius, centimeters, days)

**Usage**: Reference file for validation and available options. Not directly inherited by plants.

### `{category}/index.json`
**Purpose**: Base configuration common to all plants in a category.

**What defines a category**: The directory name (e.g., `tomate`, `rosa`, `albahaca`) represents the plant category. The `index.json` file inside defines the shared characteristics for ALL plants in that category.

**Contains**:
- Common growing conditions for the entire category
- Standard sowing/planting/harvesting schedules  
- Typical care calendar
- Default spacing and requirements
- Scientific family and basic plant info

**Inheritance**: Automatically inherited by all plants in the category.

**Examples**:

#### Example 1: `tomate/index.json` (Annual Vegetable Category)
```json
{
  "plant_info": {
    "category": "tomate",           // Category = directory name
    "scientific_name": "Solanum lycopersicum",
    "family": "Solanaceae",
    "type": "annual",
    "difficulty": "beginner"
  },
  "calendar_data": {
    "sowing": {
      "indoor": {
        "best_months": [1, 2, 3],   // All tomatoes: sow indoors Jan-Mar
        "temperature_range": [18, 24]
      }
    },
    "harvesting": {
      "best_months": [7, 8, 9, 10] // All tomatoes: harvest Jul-Oct
    }
  }
}
```

#### Example 2: `rosa/index.json` (Perennial Flower Category)  
```json
{
  "plant_info": {
    "category": "rosa",             // Category = directory name
    "scientific_name": "Rosa",
    "family": "Rosaceae",
    "type": "perennial",
    "difficulty": "intermediate"
  },
  "calendar_data": {
    "planting": {
      "best_months": [3, 4, 10, 11] // All roses: plant in spring/fall
    },
    "flowering": {
      "best_months": [5, 6, 7, 8, 9, 10] // All roses: bloom May-Oct
    }
  }
}
```

**Key Point**: Every file in `tomate/` (like `kumato.json`, `cherry.json`) automatically inherits everything from `tomate/index.json`, then applies their specific overrides.

### `{category}/{plant}.json`
**Purpose**: Plant-specific overrides and additions.

**Contains**:
- Only differences from the category base
- Specific timing adjustments
- Unique characteristics
- Special care requirements
- Article references (if plant has an existing article)

**Inheritance**: Merges with category base, overriding matching fields.

**Examples**:

#### Example 1: `tomate/kumato.json` (Extends Base Tomato)
```json
{
  "plant_info": {
    // Inherits: category="tomate", family="Solanaceae", type="annual" from tomate/index.json
    "scientific_name": "Solanum lycopersicum var. kumato", // OVERRIDE: More specific
    "origin": "es-ES"  // ADDITION: Spanish locale (Spain)
  },
  "calendar_data": {
    // Inherits: sowing from tomate/index.json (indoor Jan-Mar)
    "harvesting": {
      "best_months": [7, 8, 9, 10, 11], // OVERRIDE: Extends to November (base was Jul-Oct)
      "harvest_indicators": ["color_change", "firmness", "dark_color"] // ADDITION
    }
  },
  "harvest_data": {
    "storage_life": 14  // ADDITION: Kumato-specific storage info
  }
}
```

#### Example 2: `rosa/princesa-monaco.json` (Extends Base Rose)
```json
{
  "plant_info": {
    // Inherits: category="rosa", family="Rosaceae", type="perennial" from rosa/index.json  
    "scientific_name": "Rosa 'Princesse de Monaco'", // OVERRIDE: Specific variety
    "origin": "fr-FR"  // ADDITION: French locale
  },
  "calendar_data": {
    // Inherits: planting (Mar,Apr,Oct,Nov) from rosa/index.json
    "flowering": {
      "best_months": [5, 6, 7, 8, 9, 10, 11], // OVERRIDE: Extends flowering to November
      "repeat_flowering": true  // ADDITION: This variety reblooms
    }
  }
}
```

**Result After Inheritance**:
- `kumato` gets ALL tomato base config + its specific overrides
- `princesa-monaco` gets ALL rose base config + its specific overrides
- Missing fields automatically inherit from category base

## Data Standards

### Numerical Values
- **storage_life**: Number in days (default unit)
- **temperature_range**: Array `[min, max]` in Celsius
- **days_to_harvest**: Array `[min, max]` in days  
- **months**: Numbers 1-12 (January = 1, December = 12)
- **spacing**: Numbers in centimeters
- **soil_ph**: Array `[min, max]` pH values
- **weight_range**: Array `[min, max]` in grams

### Enum Values
All categorical values must exist in `global-config.json`:
- `task_definitions`: Available tasks for care calendar
- `soil_types`: Valid soil type options
- `sun_requirements`: Light requirement options
- `water_needs`: Watering need levels
- `origins`: Valid origin locations (countries/regions only)
- `preservation_methods`: Food preservation options

### Calendar Activities

#### Annual Plants (vegetables, herbs)
- **sowing**: Indoor/outdoor sowing schedules
- **transplanting**: Moving seedlings to final location
- **harvesting**: When to harvest crops
- **care_calendar**: Monthly maintenance tasks

#### Perennial Plants (roses, trees, shrubs)  
- **planting**: When to plant new specimens
- **flowering**: Blooming periods
- **pruning**: Pruning schedules (main, light, deadhead)
- **care_calendar**: Monthly maintenance tasks

## Inheritance System

### Inheritance Chain
1. **Category Base** (`{category}/index.json`)
2. **Plant Specific** (`{category}/{plant}.json`) - overrides base

### How It Works
```javascript
// Category base defines common traits
tomate/index.json: {
  "harvesting": {
    "best_months": [7, 8, 9, 10]
  }
}

// Plant specific extends harvest season
tomate/kumato.json: {
  "harvesting": {
    "best_months": [7, 8, 9, 10, 11]  // Extends to November
  }
}

// Result: Kumato inherits everything from tomato base, 
// but has extended harvest season
```

### Deep Merge Rules
- Arrays are completely replaced (not merged)
- Objects are merged recursively  
- Later values override earlier ones
- Missing fields inherit from parent

## Hemisphere Support

### Automatic Season Adjustment
- **Northern Hemisphere**: month_offset = 0 (no change)
- **Southern Hemisphere**: month_offset = +6 months

### Examples
```javascript
// Northern: Sow tomatoes in March (month 3)
// Southern: Automatically adjusted to September (month 9)

findPlantsByMonth(3, 'sowing', 'northern')  // March
findPlantsByMonth(3, 'sowing', 'southern')  // Adjusted to September
```

## Monthly Tasks System

### Task Structure
```json
"care_calendar": {
  "monthly_tasks": {
    "3": ["prepare_seedbeds", "soil_preparation"],
    "4": ["transplant", "install_supports"],
    "5": ["moderate_watering", "mulching"]
  }
}
```

### Task Definitions
All tasks must be defined in `global-config.json` under `task_definitions`:
- `prepare_seedbeds`: Prepare seed starting containers
- `transplant`: Move plants to final location
- `moderate_watering`: Regular watering schedule
- `harvest_main`: Main harvest period
- `plant_cleanup`: End-of-season cleanup

## Automatic Article Linking

### How Link Resolution Works
The system automatically resolves links to existing articles at build time using a two-step fallback:

1. **Plant-specific article** (if `key` field exists)
2. **Category page** (if no plant article found)
3. **No link** (if neither exists)

### Plant Key Field
```json
{
  "key": "kumato",  // Looks for article with slug "kumato"
  "plant_info": {
    "scientific_name": "Solanum lycopersicum var. kumato"
  }
}
```

### Link Resolution Examples

#### Example 1: Plant with Specific Article
```json
// tomate/kumato.json
{
  "key": "kumato"  // Found in posts/tomate.json
}

// Result in _article_links:
{
  "plant_article": "/tomate/kumato/",
  "category_article": null,
  "resolved_link": "/tomate/kumato/"
}
```

#### Example 2: Fallback to Category  
```json
// albahaca/genovesa.json
{
  // No "key" field - no specific article
}

// Result in _article_links:
{
  "plant_article": null,
  "category_article": "/albahaca/",      // Found in pages.json
  "resolved_link": "/albahaca/"
}
```

#### Example 3: No Links Available
```json
// new-category/new-plant.json
{
  "key": "non-existent"  // Not found anywhere
}

// Result in _article_links:
{
  "plant_article": null,
  "category_article": null,
  "resolved_link": null
}
```

### Build-Time Resolution
Links are resolved automatically when calling `getPlantCalendarWithInheritance()`:

```javascript
const plant = await getPlantCalendarWithInheritance('tomate', 'kumato');

// Access resolved links
console.log(plant._article_links.resolved_link); // "/tomate/kumato/"

// Check what type of link was found
if (plant._article_links.plant_article) {
  // Specific plant article available
} else if (plant._article_links.category_article) {
  // Only category page available
} else {
  // No link available
}
```

### Purpose
- **Zero maintenance**: Links resolve automatically without manual updates
- **Flexible fallback**: Always tries to provide best available link
- **Build-time efficiency**: Links resolved once during site generation
- **Cross-referencing**: Connects calendar and encyclopedia systems seamlessly

## Usage Examples

### Adding a New Plant
1. Check if category directory exists, create if needed
2. Create/update `{category}/index.json` with common traits
3. Create `{category}/{plant}.json` with specific overrides
4. Ensure all enum values exist in `global-config.json`

### Adding a New Category
1. Create directory: `{category}/`
2. Create base configuration: `{category}/index.json`
3. Add plant-specific files: `{category}/{plant}.json`
4. Update `global-config.json` if new enum values needed

### Validation
Use utility functions to validate against global config:
```javascript
import { validatePlantConfig } from '../../../src/utils/calendar-inheritance.js';

const errors = validatePlantConfig(plantData, globalConfig);
if (errors.length > 0) {
  console.error('Validation errors:', errors);
}
```

## Best Practices

### File Organization
- Keep category bases comprehensive but not overly specific
- Plant files should only contain meaningful differences
- Use consistent naming: lowercase, hyphens for spaces

### Data Entry
- Always validate enum values against `global-config.json`
- Use arrays for ranges: `[min, max]` format
- Keep origins specific: "Spain" not "Mediterranean region"
- Avoid descriptive text, use structured data only

### Maintenance
- Update `global-config.json` when adding new enum options
- Keep inheritance chains logical and maintainable  
- Regularly validate all files against global config
- Document significant changes in git commits