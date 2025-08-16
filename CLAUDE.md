# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Spanish-language plant and flower encyclopedia website migrated from WordPress to **Astro with Vue.js**. The project is designed for static site generation and deployment on Vercel, focusing on SEO-friendly educational content about plants, flowers, herbs, and gardening techniques.

## Architecture

### Astro + Vue.js Stack
- **Astro 4+** - Static site generator with island architecture
- **Vue 3** - Component framework for interactive elements
- **Content Collections** - Type-safe content management with markdown + frontmatter
- **Static Generation** - All pages pre-rendered for optimal performance
- **Vercel Ready** - Configured for seamless deployment

### URL Structure
- **Homepage**: `/` - Hero section + popular categories + recent articles
- **Category Pages**: `/{category}/` - All plants in a specific category (e.g., `/rosa/`, `/tomate/`)
- **Plant Articles**: `/{category}/{plant-slug}/` - Individual plant pages (e.g., `/rosa/princesa-de-monaco/`)
- **All Plants**: `/plantas/` - Complete plant archive

### Content Architecture

#### Data Source
- **`public/data/pages.json`** - Main content database with 113+ plant articles and category information

#### Data Processing Pipeline
1. **Data Utilities** (`src/utils/data.js`) - Functions to read and process pages.json directly
2. **Image Extraction** (`scripts/extract-main-images.js`) - Extracts main images from article HTML  
3. **Content Cleaning** (`scripts/clean-related-articles.js`) - Removes hardcoded related articles from HTML

### Component System

**Modular Vue Components** (`src/components/`):
- `PlantCard.vue` - Reusable plant preview cards with hover effects and image optimization
- `PlantGrid.vue` - Responsive grid layout for plant collections  
- `RelatedPlants.vue` - Dynamic related plants component with intelligent matching

**Astro Layouts** (`src/layouts/`):
- `BaseLayout.astro` - SEO-optimized base template with meta tags, Open Graph, Schema.org

**Page Templates** (`src/pages/`):
- `index.astro` - Homepage with hero + categories + recent plants
- `[category]/index.astro` - Dynamic category listing pages
- `[category]/[plant].astro` - Dynamic plant article pages
- `plantas/index.astro` - Complete plant archive
- `sitemap.xml.js` - Dynamic XML sitemap generation

## Development Commands

### Basic Workflow
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Content Management
```bash
# Extract and add main images to articles
node scripts/extract-main-images.js

# Clean hardcoded related articles from HTML
node scripts/clean-related-articles.js
```

### Testing
```bash
# Run Playwright tests
npx playwright test

# Start simple development server for testing
node simple-server.js
```

### Deployment
```bash
npm run build        # Generate static files
# Deploy /dist to Vercel (automatic via GitHub integration)
```

## SEO Implementation

### Technical SEO
- **Meta Tags**: Title, description, canonical URLs
- **Open Graph**: Social media previews with images
- **Twitter Cards**: Optimized social sharing
- **Schema.org**: Structured data for articles and website
- **Sitemap**: Dynamic XML sitemap at `/sitemap.xml`
- **Robots.txt**: Search engine directives

### Performance Optimization
- **Static Generation**: All pages pre-rendered
- **Image Optimization**: WebP conversion and responsive loading
- **Client-Side Hydration**: Vue components load only when needed (`client:load`)
- **CSS**: Scoped styles with minimal global CSS

### Content Structure
- **Semantic HTML**: Proper heading hierarchy and article structure
- **Internal Linking**: Category breadcrumbs and cross-references
- **URL Structure**: Clean, descriptive URLs with category hierarchy

## Image Management

### Organization
- **Location**: `/public/wp-content/uploads/2017/`, `/public/wp-content/uploads/2018/`, etc.
- **Format**: Original WordPress directory structure preserved
- **Processing**: Vue components automatically convert WordPress URLs to local paths

### Usage in Components
```javascript
// PlantCard.vue automatically converts:
// '/wp-content/uploads/2017/07/image.webp'
// to: '/wp-content/uploads/2017/07/image.webp'
```

## Content Categories (24 total)

**Most Popular** (by article count):
- Rosa (14), Hibiscus (13), Lirios (9), Amapola (8), Tomate (8)
- Albahaca (6), Hortensias (6), Fresa (6), Chili (6), Margarita (5)

**Complete List**: pensamiento, albahaca, rosa, lirios, hibiscus, cosmos, margarita, amapola, patata, manzanilla, piña, hortensias, fresa, plantas-comestibles, azalea, tomate, tomillo, lavanda, tulipán, chili, orquídea, plátano, col, mango

## File Structure
```
src/
├── components/       # Vue.js components
├── content/         # Content collections
│   ├── plants/      # 113 markdown files
│   ├── categories/  # 24 JSON files
│   └── config.ts    # Collection schemas
├── layouts/         # Astro layouts
└── pages/          # Route definitions
    ├── [category]/  # Dynamic category routes
    └── plantas/     # Static archive page

public/
├── data/
│   ├── pages.json      # Original WordPress export
│   └── posts/          # Category JSON files
├── images/         # Migrated WordPress images
├── robots.txt      # SEO directives
└── favicon.svg     # Site icon

scripts/
└── process-content.js  # Content migration script
```

## Deployment Notes

### Vercel Configuration
- **Framework**: Astro
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js Version**: 18+

### Environment Variables
- No environment variables required for static generation
- All content embedded at build time

### Performance Targets
- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for LCP, FID, CLS
- **Bundle Size**: Minimal JavaScript footprint with island architecture