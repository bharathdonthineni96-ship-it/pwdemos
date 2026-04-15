import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';

test('Test Case 13: Verify Product quantity in Cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    // 1-3. Navigate to url and verify home page
    await homePage.navigate();
    await expect(page).toHaveURL('https://automationexercise.com/');
    await expect(homePage.testCasesLink).toBeVisible();

    // 4. Click 'View Product' for any product on home page
    // Using the first 'View Product' link on the home page
    await page.locator('.choose ul li a').first().click();
    
    // 5. Verify product detail is opened
    await expect(page).toHaveURL(/.*product_details.*/);
    await expect(productsPage.productName).toBeVisible();

    // 6. Increase quantity to 4
    await productsPage.setQuantity('4');
    
    // 7. Click 'Add to cart' button
    await productsPage.clickAddToCartDetail();
    
    // 8. Click 'View Cart' button
    await productsPage.clickViewCartModal();
    await expect(page).toHaveURL('https://automationexercise.com/view_cart');
    
    // 9. Verify that product is displayed in cart page with exact quantity
    const details = await cartPage.getProductDetails(0);
    expect(details.quantity).toBe('4');
});
