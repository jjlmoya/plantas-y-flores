import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to category page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for categories to load
    await page.waitForSelector('.category-card');
    
    // Click on the first category
    const firstCategory = page.locator('.category-card').first();
    const categoryName = await firstCategory.locator('.category-card__title').textContent();
    
    await firstCategory.click();
    
    // Should be on category page
    await expect(page.url()).toMatch(/\/[^\/]+\/$/);
    
    // Check that category header exists with correct name
    await expect(page.locator('.category-header__title')).toContainText(categoryName || '');
    
    // Check breadcrumb
    await expect(page.locator('.breadcrumb')).toBeVisible();
    await expect(page.locator('.breadcrumb a')).toContainText('Inicio');
  });

  test('should navigate to plant article', async ({ page }) => {
    await page.goto('/rosa/'); // Navigate to a known category
    
    // Wait for plant cards to load
    await page.waitForSelector('.plant-card', { timeout: 10000 });
    
    // Click on first plant article
    const firstPlant = page.locator('.plant-card').first();
    const plantTitle = await firstPlant.locator('.plant-card__title a').textContent();
    
    await firstPlant.locator('.plant-card__title a').click();
    
    // Should be on plant article page
    await expect(page.url()).toMatch(/\/[^\/]+\/[^\/]+\/$/);
    
    // Check that article title exists
    await expect(page.locator('.plant-article__title')).toContainText(plantTitle || '');
    
    // Check that article content exists
    await expect(page.locator('.plant-article__content')).toBeVisible();
    
    // Check breadcrumb navigation
    await expect(page.locator('.breadcrumb')).toBeVisible();
    await expect(page.locator('.breadcrumb a[href="/"]')).toContainText('Inicio');
  });

  test('should have working back navigation', async ({ page }) => {
    await page.goto('/rosa/princesa-de-monaco/'); // Navigate to a known article
    
    // Check that back button exists and works
    const backButton = page.locator('.plant-article__back');
    await expect(backButton).toBeVisible();
    await expect(backButton).toContainText('Volver a');
    
    await backButton.click();
    
    // Should be back on category page
    await expect(page.url()).toMatch(/\/rosa\/$/);
    await expect(page.locator('.category-header__title')).toContainText('Rosa');
  });

  test('should navigate to all plants page', async ({ page }) => {
    await page.goto('/');
    
    // Click "Ver todos los artículos" link
    const viewAllLink = page.locator('.view-all__link');
    await expect(viewAllLink).toBeVisible();
    await viewAllLink.click();
    
    // Should be on plantas page
    await expect(page.url()).toBe('http://127.0.0.1:4321/plantas/');
    
    // Check that page title is correct
    await expect(page.locator('.plants-header__title')).toContainText('Todas las Plantas');
    
    // Check that plant grid exists
    await expect(page.locator('.plants-content')).toBeVisible();
  });
});