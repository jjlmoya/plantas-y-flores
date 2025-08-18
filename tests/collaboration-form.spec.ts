import { test, expect } from '@playwright/test';

test('enviar formulario de colaboración', async ({ page }) => {
  // Ir a la página de colaboraciones
  await page.goto('http://localhost:4321/colaboraciones/');
  
  // Esperar que la página cargue completamente
  await page.waitForLoadState('networkidle');
  
  // Scroll hasta el formulario
  await page.locator('#contact-form').scrollIntoViewIfNeeded();
  
  // Rellenar el formulario simplificado con datos realistas
  await page.fill('#name', 'María José Fernández');
  await page.fill('#company', 'EcoVerde Innovations S.L.');
  await page.fill('#email', 'mariajose@ecoverde.es');
  
  // Seleccionar tipo de colaboración
  await page.selectOption('#collaboration', 'articulo');
  
  // Llenar mensaje (ahora es un solo campo)
  await page.fill('#message', 'Hola jardineraamable! Somos EcoVerde Innovations, pioneros en fertilizantes orgánicos de nueva generación fabricados a partir de residuos agrícolas compostados. Llevamos más de 15 años comprometidos con la agricultura regenerativa y todos nuestros productos están certificados por ECOCERT. Nos encanta tu enfoque auténtico hacia la jardinería sostenible y creemos que hay una sinergia perfecta entre nuestros valores y tu audiencia. Nos gustaría proponerte una colaboración para análisis en profundidad de nuestros bioestimulantes naturales en condiciones reales de jardín. ¡Esperamos poder charlar contigo pronto!');
  
  // Hacer scroll hacia el botón para asegurar que esté visible
  await page.locator('#submit-btn').scrollIntoViewIfNeeded();
  
  // Esperar un momento para que todo esté cargado
  await page.waitForTimeout(1000);
  
  // Enviar el formulario
  await page.click('#submit-btn');
  
  // Esperar a que aparezca el mensaje de éxito (máximo 10 segundos)
  await expect(page.locator('.form-status.success')).toBeVisible({ timeout: 10000 });
  
  // Verificar que el mensaje de éxito contiene el texto correcto
  await expect(page.locator('.form-status.success')).toContainText('Recibido. Respondo en un máximo de 48 h.');
  
  // Verificar que el formulario se ha reseteado
  await expect(page.locator('#company')).toHaveValue('');
  
  // Esperar un poco más para asegurar que el Google Apps Script procese todo
  await page.waitForTimeout(3000);
  
  console.log('🎉 ¡Nueva página de colaboración funciona perfectamente!');
  console.log('📧 Revisa jardineraamable@gmail.com para el email de notificación');
  console.log('📊 Revisa Google Sheets para ver la nueva fila con los datos');
});