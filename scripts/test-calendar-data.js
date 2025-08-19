import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const calendarDir = path.join(__dirname, '../public/data/calendar');

console.log('🧪 Testing Calendar Data Structure...\n');

// Test 1: Verify all categories have index.json
console.log('📁 Testing Category Structure:');
const categories = fs.readdirSync(calendarDir).filter(item => {
    const itemPath = path.join(calendarDir, item);
    return fs.statSync(itemPath).isDirectory();
});

let passedTests = 0;
let totalTests = 0;

for (const category of categories) {
    totalTests++;
    const indexPath = path.join(calendarDir, category, 'index.json');
    if (fs.existsSync(indexPath)) {
        console.log(`  ✅ ${category}/index.json`);
        passedTests++;
    } else {
        console.log(`  ❌ ${category}/index.json - MISSING`);
    }
}

// Test 2: Verify plant files have proper structure
console.log('\n🌱 Testing Plant File Structure:');
let plantTests = 0;
let plantPassed = 0;

// Test specific examples
const testPlants = [
    { category: 'tomate', plant: 'cherry' },
    { category: 'tomate', plant: 'kumato' },
    { category: 'rosa', plant: 'princesa-de-monaco' },
    { category: 'albahaca', plant: 'genovesa' },
    { category: 'lirios', plant: 'stargazer' }
];

for (const test of testPlants) {
    plantTests++;
    const plantPath = path.join(calendarDir, test.category, `${test.plant}.json`);
    
    if (fs.existsSync(plantPath)) {
        try {
            const plantData = JSON.parse(fs.readFileSync(plantPath, 'utf8'));
            
            // Check required fields
            if (plantData.key && plantData.key === test.plant) {
                console.log(`  ✅ ${test.category}/${test.plant}.json - Valid structure`);
                plantPassed++;
            } else {
                console.log(`  ❌ ${test.category}/${test.plant}.json - Invalid key field`);
            }
        } catch (error) {
            console.log(`  ❌ ${test.category}/${test.plant}.json - JSON Parse Error`);
        }
    } else {
        console.log(`  ❌ ${test.category}/${test.plant}.json - File not found`);
    }
}

// Test 3: Count plants per category
console.log('\n📊 Plant Count by Category:');
let totalPlants = 0;

for (const category of categories) {
    const categoryPath = path.join(calendarDir, category);
    const files = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.json') && file !== 'index.json');
    
    totalPlants += files.length;
    console.log(`  📁 ${category}: ${files.length} plants`);
}

// Test 4: Verify JSON structure of sample files
console.log('\n🔍 Testing JSON Structure:');
const sampleCategories = ['tomate', 'rosa', 'hibiscus'];
let jsonTests = 0;
let jsonPassed = 0;

for (const category of sampleCategories) {
    jsonTests++;
    const indexPath = path.join(calendarDir, category, 'index.json');
    
    if (fs.existsSync(indexPath)) {
        try {
            const data = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
            
            if (data.plant_info && data.plant_info.category === category) {
                console.log(`  ✅ ${category}/index.json - Proper category reference`);
                jsonPassed++;
            } else {
                console.log(`  ⚠️  ${category}/index.json - Missing category reference`);
            }
        } catch (error) {
            console.log(`  ❌ ${category}/index.json - JSON Parse Error`);
        }
    }
}

// Test 5: Check for inheritance data completeness
console.log('\n🧬 Testing Data Completeness:');
const testCategoryData = (category) => {
    const indexPath = path.join(calendarDir, category, 'index.json');
    if (!fs.existsSync(indexPath)) return false;
    
    try {
        const data = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
        
        return !!(data.plant_info && 
                 data.calendar_data && 
                 data.growing_conditions);
    } catch {
        return false;
    }
};

const completenessTests = ['tomate', 'rosa', 'albahaca', 'hibiscus'];
let completenessCount = 0;

for (const category of completenessTests) {
    if (testCategoryData(category)) {
        console.log(`  ✅ ${category} - Complete base data`);
        completenessCount++;
    } else {
        console.log(`  ❌ ${category} - Incomplete base data`);
    }
}

// Summary
console.log('\n📋 Test Summary:');
console.log(`🏗️  Categories: ${passedTests}/${totalTests} passed`);
console.log(`🌱 Plants: ${plantPassed}/${plantTests} sample plants validated`);
console.log(`📄 JSON: ${jsonPassed}/${jsonTests} structures valid`);
console.log(`🧬 Completeness: ${completenessCount}/${completenessTests.length} categories complete`);
console.log(`📊 Total plants migrated: ${totalPlants}`);

const overallSuccess = (passedTests === totalTests) && 
                       (plantPassed === plantTests) && 
                       (jsonPassed >= jsonTests * 0.8) && 
                       (completenessCount >= completenessTests.length * 0.8);

if (overallSuccess) {
    console.log('\n🎉 Migration Successful! All tests passed.');
    console.log('✅ Calendar system is ready to use.');
} else {
    console.log('\n⚠️  Migration completed with some issues.');
    console.log('🔧 Review the failed tests above for improvements.');
}

// Additional statistics
console.log('\n📈 Migration Statistics:');
console.log(`📁 Total categories: ${categories.length}`);
console.log(`🌱 Total plants: ${totalPlants}`);
console.log(`📄 Total files: ${categories.length + totalPlants} (+ category indices)`);

// Show top categories by plant count
const categoryStats = categories.map(category => {
    const categoryPath = path.join(calendarDir, category);
    const plantCount = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.json') && file !== 'index.json').length;
    return { category, count: plantCount };
}).sort((a, b) => b.count - a.count);

console.log('\n🏆 Top Categories by Plant Count:');
categoryStats.slice(0, 5).forEach(stat => {
    console.log(`  ${stat.category}: ${stat.count} plants`);
});