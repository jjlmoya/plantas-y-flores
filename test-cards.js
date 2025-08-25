import { generateAllCards } from './scripts/generate-plant-cards.js'

console.log('🚀 Iniciando test de generación de tarjetas...')

try {
  await generateAllCards()
  console.log('✅ Test completado')
} catch (error) {
  console.error('❌ Error en test:', error)
}