import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { BrandPage } from '../pages/brand.page';

test('Test Case 19: View & Cart Brand Products', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const brandPage = new BrandPage(page);

    // 1. Launch browser & 2. Navigate to url 'http://automationexercise.com'
    await homePage.navigate();

    // 3. Click on 'Products' button
    await homePage.clickProducts();

    // 4. Verify that Brands are visible on left side bar
    await expect(brandPage.brandsSidebar).toBeVisible();

    // 5. Click on any brand name, for example: Polo
    await brandPage.clickBrand('Polo');

    // 6. Verify that user is navigated to brand page and brand products are displayed
    await expect(page).toHaveURL(/.*brand_products\/Polo/);
    await expect(brandPage.brandPageTitle).toBeVisible();
    await expect(brandPage.brandPageTitle).toContainText(/BRAND - POLO PRODUCTS/i);

    // 7. On left side bar, click on any other brand link, for example: H&M
    await brandPage.clickBrand('H&M');

    // 8. Verify that user is navigated to that brand page and can see products
    await expect(page).toHaveURL(/.*brand_products\/H&M/);
    await expect(brandPage.brandPageTitle).toBeVisible();
    await expect(brandPage.brandPageTitle).toContainText(/BRAND - H&M PRODUCTS/i);
});
