import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';

test('Test Case 17: Remove Products From Cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    // 1. Launch browser & 2. Navigate to url 'http://automationexercise.com'
    await homePage.navigate();

    // 3. Verify that home page is visible successfully
    await expect(page).toHaveURL('https://automationexercise.com/');
    await expect(homePage.testCasesLink).toBeVisible();

    // 4. Add products to cart
    await productsPage.clickProducts();
    await page.waitForLoadState('networkidle');
    await productsPage.addProductToCart(0);
    await productsPage.clickContinueShopping();
    await productsPage.addProductToCart(1);
    await productsPage.clickContinueShopping();

    // 5. Click 'Cart' button
    await homePage.clickCart();

    // 6. Verify that cart page is displayed
    await expect(page).toHaveURL('https://automationexercise.com/view_cart');

    // 7. Click 'X' button corresponding to particular product
    const initialCount = await cartPage.getCartCount();
    expect(initialCount).toBe(2);
    
    await cartPage.removeProduct(0);

    // 8. Verify that product is removed from the cart
    const finalCount = await cartPage.getCartCount();
    expect(finalCount).toBe(1);
    
    // Optional: check that the row count decreased
    await expect(cartPage.cartRows).toHaveCount(1);
});
