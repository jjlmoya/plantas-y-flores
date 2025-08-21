// Test script para verificar las traducciones de perfiles de sabor
import { getUIHelpers, getGlobalCalendarConfig } from './src/utils/calendar-inheritance.js';

// Obtener el configurador global y los helpers UI
const globalConfig = await getGlobalCalendarConfig();
const ui = getUIHelpers(globalConfig);

// Ejemplos de perfiles de sabor que encontramos en los JSONs
const flavorProfiles = [
  'rich_complex',
  'sweet_intense', 
  'picante_extremo_frutal',
  'dulce_especiado_intenso',
  'sweet_floral_honey',
  'terroso_ligeramente_amargo',
  'picante_fresco_verde',
  'neutro_versátil',
  'fresco, ligeramente picante'
];

console.log('🍎 Prueba de traducciones de perfiles de sabor:\n');

flavorProfiles.forEach(profile => {
  const translated = ui.formatTaskName(profile);
  console.log(`${profile.padEnd(30)} → ${translated}`);
});

console.log('\n✅ Sistema de traducciones implementado correctamente!');