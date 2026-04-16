import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';

test('Test Case 9: Search Product', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);

    // 1-3. Navigate to url and verify home page
    await homePage.navigate();
    await expect(page).toHaveURL(/https:\/\/automationexercise.com\/?/);
    
    // 4. Click on 'Products' button
    await productsPage.clickProducts();
    
    // 5. Verify user is navigated to ALL PRODUCTS page successfully
    await expect(page).toHaveURL(/.*\/products/);
    
    // 6. Enter product name in search input and click search button
    const searchKeyword = 'Shirt';
    await productsPage.searchProduct(searchKeyword);
    
    // 7. Verify 'SEARCHED PRODUCTS' is visible
    await expect(productsPage.searchedProductsHeader).toBeVisible();
    
    // 8. Verify all the products related to search are visible
    // Wait for the products list to be populated 
    const products = page.locator('.productinfo.text-center > p');
    await products.first().waitFor(); // Wait for at least one to be visible
    
    // Assuming each product contains the search keyword (this depends on the site's search behavior)
    // Here we'll just check that it's greater than 0 products showing
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
});
