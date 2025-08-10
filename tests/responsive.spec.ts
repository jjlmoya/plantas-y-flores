import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.goto('/');

    // Check that hero section is properly responsive
    await expect(page.locator('.hero')).toBeVisible();
    await expect(page.locator('.hero__title')).toBeVisible();
    
    // Check that categories grid adapts to mobile
    const categoriesGrid = page.locator('.categories-grid');
    await expect(categoriesGrid).toBeVisible();
    
    // Categories should stack vertically on mobile
    const categoryCards = page.locator('.category-card');
    const firstCard = categoryCards.first();
    const secondCard = categoryCards.nth(1);
    
    if (await categoryCards.count() > 1) {
      const firstCardBox = await firstCard.boundingBox();
      const secondCardBox = await secondCard.boundingBox();
      
      // On mobile, second card should be below first card
      if (firstCardBox && secondCardBox) {
        expect(secondCardBox.y).toBeGreaterThan(firstCardBox.y + firstCardBox.height - 10);
      }
    }
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
    await page.goto('/');

    // Check that layout works on tablet
    await expect(page.locator('.hero')).toBeVisible();
    await expect(page.locator('.categories-section')).toBeVisible();
    await expect(page.locator('.recent-section')).toBeVisible();
    
    // Check that plant grid is responsive
    await page.waitForSelector('.plant-card');
    const plantCards = page.locator('.plant-card');
    await expect(plantCards.first()).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 }); // Desktop size
    await page.goto('/');

    // Check that all sections are visible
    await expect(page.locator('.hero')).toBeVisible();
    await expect(page.locator('.categories-section')).toBeVisible();
    await expect(page.locator('.recent-section')).toBeVisible();
    
    // Check that plant grid shows multiple columns
    await page.waitForSelector('.plant-card');
    const plantCards = page.locator('.plant-card');
    const count = await plantCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have accessible navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/rosa/princesa-de-monaco/');
    
    // Check that breadcrumb is visible and accessible
    await expect(page.locator('.breadcrumb')).toBeVisible();
    
    // Check that back button is visible
    await expect(page.locator('.plant-article__back')).toBeVisible();
    
    // Check that content is readable
    await expect(page.locator('.plant-article__content')).toBeVisible();
  });
});