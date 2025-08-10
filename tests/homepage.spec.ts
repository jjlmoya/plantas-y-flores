import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage correctly', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Plantas y Flores/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Plantas y Flores');
    
    // Check hero description
    await expect(page.locator('.hero__description')).toContainText('jardinería');
    
    // Check that categories section exists
    await expect(page.locator('.categories-section')).toBeVisible();
    
    // Check that recent articles section exists
    await expect(page.locator('.recent-section')).toBeVisible();
  });

  test('should have working category links', async ({ page }) => {
    await page.goto('/');
    
    // Wait for categories to load
    await page.waitForSelector('.category-card');
    
    // Get the first category link
    const firstCategoryLink = page.locator('.category-card').first();
    await expect(firstCategoryLink).toBeVisible();
    
    // Check that it has proper structure
    await expect(firstCategoryLink.locator('.category-card__title')).toBeVisible();
    await expect(firstCategoryLink.locator('.category-card__count')).toBeVisible();
  });

  test('should have SEO meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check Open Graph tags
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Plantas y Flores/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
    
    // Check Twitter Card
    await expect(page.locator('meta[property="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    
    // Check canonical URL
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0); // Homepage shouldn't have canonical
  });
});