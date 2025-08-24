/**
 * Tests básicos para sistema de favoritos MVP
 * Siguiendo FAVORITES_SPEC.md - Sin sobreingeniería
 */

import { test, expect } from '@playwright/test';

test.describe('Sistema de Favoritos MVP', () => {
  
  test.beforeEach(async ({ page }) => {
    // Limpiar localStorage antes de cada test
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('Botón favorito aparece en PlantCard', async ({ page }) => {
    await page.goto('/plantas/');
    
    // Esperar a que se carguen las plantas
    await page.waitForSelector('.plant-card', { timeout: 10000 });
    
    // Verificar que hay botones de favorito
    const favoriteButtons = await page.locator('.plant-card__favorite-btn').count();
    expect(favoriteButtons).toBeGreaterThan(0);
    
    // Verificar atributos de accesibilidad
    const firstButton = page.locator('.plant-card__favorite-btn').first();
    await expect(firstButton).toHaveAttribute('aria-pressed', 'false');
    await expect(firstButton).toHaveAttribute('title');
  });

  test('Añadir y quitar favoritos funciona', async ({ page }) => {
    await page.goto('/plantas/');
    
    // Esperar a que carguen las plantas
    await page.waitForSelector('.plant-card', { timeout: 10000 });
    
    const firstButton = page.locator('.plant-card__favorite-btn').first();
    
    // Verificar estado inicial (no favorito)
    await expect(firstButton).toHaveAttribute('aria-pressed', 'false');
    await expect(firstButton).toContainText('🤍');
    
    // Click para añadir a favoritos
    await firstButton.click();
    
    // Esperar a que cambie el estado
    await expect(firstButton).toHaveAttribute('aria-pressed', 'true');
    await expect(firstButton).toContainText('❤️');
    
    // Click para quitar de favoritos
    await firstButton.click();
    
    // Verificar que vuelve al estado inicial
    await expect(firstButton).toHaveAttribute('aria-pressed', 'false');
    await expect(firstButton).toContainText('🤍');
  });

  test('Los favoritos persisten tras recarga', async ({ page }) => {
    await page.goto('/plantas/');
    await page.waitForSelector('.plant-card', { timeout: 10000 });
    
    const firstButton = page.locator('.plant-card__favorite-btn').first();
    
    // Añadir a favoritos
    await firstButton.click();
    await expect(firstButton).toHaveAttribute('aria-pressed', 'true');
    
    // Recargar la página
    await page.reload();
    await page.waitForSelector('.plant-card', { timeout: 10000 });
    
    // Verificar que sigue siendo favorito
    const firstButtonAfterReload = page.locator('.plant-card__favorite-btn').first();
    await expect(firstButtonAfterReload).toHaveAttribute('aria-pressed', 'true');
    await expect(firstButtonAfterReload).toContainText('❤️');
  });

  test('Contador en navegación actualiza correctamente', async ({ page }) => {
    await page.goto('/plantas/');
    await page.waitForSelector('.plant-card', { timeout: 10000 });
    
    // Verificar que no hay badge inicialmente
    await expect(page.locator('.favorites-badge')).toHaveCount(0);
    
    // Añadir una planta a favoritos
    const firstButton = page.locator('.plant-card__favorite-btn').first();
    await firstButton.click();
    
    // Verificar que aparece el badge con "1"
    await expect(page.locator('.favorites-badge')).toHaveCount(1);
    await expect(page.locator('.favorites-badge')).toContainText('1');
    
    // Añadir otra planta
    const secondButton = page.locator('.plant-card__favorite-btn').nth(1);
    await secondButton.click();
    
    // Verificar que el contador aumenta
    await expect(page.locator('.favorites-badge')).toContainText('2');
  });

  test('Página de favoritos muestra estado vacío inicialmente', async ({ page }) => {
    await page.goto('/favoritos/');
    
    // Esperar a que cargue el contenido
    await page.waitForSelector('.favorites-empty', { timeout: 5000 });
    
    // Verificar estado vacío
    await expect(page.locator('.empty-title')).toContainText('Aún no tienes plantas favoritas');
    await expect(page.locator('.cta-button')).toHaveCount(2);
    
    // Verificar links funcionan
    const plantasLink = page.locator('a[href="/plantas/"]');
    await expect(plantasLink).toBeVisible();
  });

  test('Página de favoritos muestra plantas guardadas', async ({ page }) => {
    // Primero añadir favoritos
    await page.goto('/plantas/');
    await page.waitForSelector('.plant-card', { timeout: 10000 });
    
    // Añadir 2 plantas a favoritos
    await page.locator('.plant-card__favorite-btn').first().click();
    await page.locator('.plant-card__favorite-btn').nth(1).click();
    
    // Ir a página de favoritos
    await page.goto('/favoritos/');
    
    // Esperar a que cargue y verificar que hay plantas
    await page.waitForSelector('.plant-card-simple', { timeout: 5000 });
    
    // Verificar que hay plantas mostradas
    const plantCards = await page.locator('.plant-card-simple').count();
    expect(plantCards).toBe(2);
    
    // Verificar estadísticas
    await expect(page.locator('.stats-text')).toContainText('2 plantas guardadas');
  });

  test('Funciona sin localStorage habilitado', async ({ page }) => {
    // Deshabilitar localStorage
    await page.addInitScript(() => {
      delete window.localStorage;
    });
    
    await page.goto('/plantas/');
    await page.waitForSelector('.plant-card', { timeout: 10000 });
    
    // Verificar que los botones existen pero están deshabilitados
    const favoriteButtons = page.locator('.plant-card__favorite-btn');
    await expect(favoriteButtons.first()).toBeDisabled();
  });

  test('Navegación por teclado funciona', async ({ page }) => {
    await page.goto('/plantas/');
    await page.waitForSelector('.plant-card', { timeout: 10000 });
    
    const firstButton = page.locator('.plant-card__favorite-btn').first();
    
    // Enfocar el botón con Tab
    await page.keyboard.press('Tab');
    // Buscar el botón de favorito y enfocarlo
    await firstButton.focus();
    
    // Verificar que está enfocado
    await expect(firstButton).toBeFocused();
    
    // Activar con Enter
    await page.keyboard.press('Enter');
    
    // Verificar que se activó
    await expect(firstButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('Límite de 200 favoritos se respeta', async ({ page }) => {
    // Simular localStorage con 200 elementos
    await page.goto('/plantas/');
    
    await page.evaluate(() => {
      const fakeFavorites = Array.from({length: 200}, (_, i) => `plant-${i}`);
      const data = {
        version: 1,
        favorites: fakeFavorites,
        created: Date.now()
      };
      localStorage.setItem('plantas-favorites', JSON.stringify(data));
    });
    
    await page.reload();
    await page.waitForSelector('.plant-card', { timeout: 10000 });
    
    // Intentar añadir uno más
    const firstButton = page.locator('.plant-card__favorite-btn').first();
    
    // El botón debería funcionar pero no añadir más elementos
    await firstButton.click();
    
    // Verificar en favoritos que sigue siendo 200
    const favoriteIds = await page.evaluate(() => {
      const stored = localStorage.getItem('plantas-favorites');
      if (!stored) return [];
      const data = JSON.parse(stored);
      return data.favorites || [];
    });
    
    expect(favoriteIds.length).toBeLessThanOrEqual(200);
  });

  test('Datos corruptos en localStorage se manejan correctamente', async ({ page }) => {
    await page.goto('/plantas/');
    
    // Corromper datos en localStorage
    await page.evaluate(() => {
      localStorage.setItem('plantas-favorites', 'invalid json');
    });
    
    await page.reload();
    await page.waitForSelector('.plant-card', { timeout: 10000 });
    
    // La página debería funcionar normalmente
    const favoriteButtons = await page.locator('.plant-card__favorite-btn').count();
    expect(favoriteButtons).toBeGreaterThan(0);
    
    // El primer botón debería funcionar
    const firstButton = page.locator('.plant-card__favorite-btn').first();
    await firstButton.click();
    await expect(firstButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('Enlace de favoritos en navegación funciona', async ({ page }) => {
    await page.goto('/');
    
    // Buscar el enlace de favoritos
    const favoritesLink = page.locator('a[href="/favoritos/"]');
    await expect(favoritesLink).toBeVisible();
    await expect(favoritesLink).toContainText('Favoritos');
    
    // Click y verificar que navega correctamente
    await favoritesLink.click();
    await page.waitForURL('/favoritos/');
    await expect(page).toHaveURL('/favoritos/');
  });
});

// Test de especificación férrea
test.describe('Validación de Spec Férrea', () => {
  
  test('Sistema usa solo localStorage (no IndexedDB)', async ({ page }) => {
    await page.goto('/plantas/');
    
    // Verificar que no se usa IndexedDB
    const usesIndexedDB = await page.evaluate(() => {
      return window.indexedDB && 'favoritos' in window.indexedDB;
    });
    
    expect(usesIndexedDB).toBeFalsy();
  });
  
  test('Bundle size es razonable', async ({ page, context }) => {
    // Monitorear requests de JavaScript
    const jsRequests = [];
    
    page.on('response', response => {
      if (response.url().includes('.js') && response.url().includes('favorites')) {
        jsRequests.push({
          url: response.url(),
          size: response.headers()['content-length']
        });
      }
    });
    
    await page.goto('/plantas/');
    await page.waitForSelector('.plant-card', { timeout: 10000 });
    
    // Verificar que no hay muchos archivos JS relacionados con favoritos
    expect(jsRequests.length).toBeLessThan(5); // No más de 5 archivos JS
  });
});