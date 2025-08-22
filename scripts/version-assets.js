#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const distDir = path.join(projectRoot, 'dist');
const srcDir = path.join(projectRoot, 'src');

// Generate timestamp-based version
const version = Date.now();

function updateCSSReferences(dir, replacements) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      updateCSSReferences(fullPath, replacements);
    } else if (file.name.endsWith('.html') || file.name.endsWith('.astro')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      for (const [oldPath, newPath] of Object.entries(replacements)) {
        if (content.includes(oldPath)) {
          content = content.replaceAll(oldPath, newPath);
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`✅ Updated references in: ${path.relative(projectRoot, fullPath)}`);
      }
    }
  }
}

function versionAssets() {
  console.log('🚀 Starting asset versioning...');
  
  const stylesDir = path.join(publicDir, 'styles');
  const distStylesDir = path.join(distDir, 'styles');
  
  if (!fs.existsSync(stylesDir)) {
    console.log('⚠️  No styles directory found in public/');
    return;
  }
  
  // Create dist/styles directory if it doesn't exist
  if (!fs.existsSync(distStylesDir)) {
    fs.mkdirSync(distStylesDir, { recursive: true });
  }
  
  const cssFiles = fs.readdirSync(stylesDir).filter(file => file.endsWith('.css'));
  const replacements = {};
  
  // Copy and version CSS files
  for (const cssFile of cssFiles) {
    const originalPath = path.join(stylesDir, cssFile);
    const name = path.parse(cssFile).name;
    const ext = path.parse(cssFile).ext;
    const versionedName = `${name}.${version}${ext}`;
    const versionedPath = path.join(distStylesDir, versionedName);
    
    // Copy file with versioned name
    fs.copyFileSync(originalPath, versionedPath);
    
    // Store replacement mapping
    const oldRef = `/styles/${cssFile}`;
    const newRef = `/styles/${versionedName}`;
    replacements[oldRef] = newRef;
    
    console.log(`📁 Versioned: ${cssFile} → ${versionedName}`);
  }
  
  // Update references in built HTML files
  if (fs.existsSync(distDir)) {
    updateCSSReferences(distDir, replacements);
  }
  
  // Also update source files for development
  updateCSSReferences(srcDir, replacements);
  
  console.log(`✨ Asset versioning complete! Version: ${version}`);
  console.log(`📊 Processed ${Object.keys(replacements).length} CSS files`);
}

// Run the versioning
versionAssets();