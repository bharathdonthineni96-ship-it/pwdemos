import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';

test('Test Case 8: Verify All Products and product detail page', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);

    // 1-3. Navigate to url and verify home page
    await homePage.navigate();
    await expect(page).toHaveURL('https://automationexercise.com/');
    
    // 4. Click on 'Products' button
    await productsPage.clickProducts();
    
    // 5. Verify user is navigated to ALL PRODUCTS page successfully
    await expect(page).toHaveURL('https://automationexercise.com/products');
    await expect(productsPage.allProductsHeader).toBeVisible();
    
    // 6. The products list is visible
    await expect(productsPage.productsList).toBeVisible();
    
    // 7. Click on 'View Product' of first product
    await productsPage.viewFirstProduct();
    
    // 8. User is landed to product detail page
    await expect(page).toHaveURL(/.*\/product_details\/.*/);
    
    // 9. Verify that detail detail is visible: product name, category, price, availability, condition, brand
    await expect(productsPage.productName).toBeVisible();
    await expect(productsPage.productCategory).toBeVisible();
    await expect(productsPage.productPrice).toBeVisible();
    await expect(productsPage.productAvailability).toBeVisible();
    await expect(productsPage.productCondition).toBeVisible();
    await expect(productsPage.productBrand).toBeVisible();
});
