import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';

test('Test Case 27: Search and Product Detail Consistency', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);

    // 1. Launch browser & 2. Navigate to url 'http://automationexercise.com'
    await homePage.navigate();

    // 3. Click on 'Products' button
    await homePage.clickProducts();

    // 4. Enter product name in search input and click search button
    const searchTerm = 'Polo';
    await productsPage.searchProduct(searchTerm);

    // 5. Verify 'SEARCHED PRODUCTS' is visible
    await expect(productsPage.searchedProductsHeader).toBeVisible();

    // 6. Capture Name and Price of the first search result
    const firstProductContainer = page.locator('.features_items .col-sm-4').first();
    const resultName = await firstProductContainer.locator('.productinfo p').innerText();
    const resultPrice = await firstProductContainer.locator('.productinfo h2').innerText();
    
    console.log(`Searching for: ${searchTerm}`);
    console.log(`Found result: ${resultName} at ${resultPrice}`);

    // 7. Click on 'View Product' of first product
    await firstProductContainer.locator('.choose ul li a').click();

    // 8. Verify that Product Name and Price on the detail page match search results
    await expect(productsPage.productName).toHaveText(resultName);
    
    // For price, we handle potential whitespace or currency symbol differences
    const detailPrice = await productsPage.productPrice.innerText();
    expect(detailPrice.trim()).toBe(resultPrice.trim());

    console.log(`Detail page verified: ${resultName} at ${detailPrice}`);
});
