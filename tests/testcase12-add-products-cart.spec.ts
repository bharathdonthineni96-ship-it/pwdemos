import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';

test('Test Case 12: Add Products in Cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    // 1. Launch browser & 2. Navigate to url 'http://automationexercise.com'
    await homePage.navigate();

    // 3. Verify that home page is visible successfully
    await expect(page).toHaveURL(/https:\/\/automationexercise.com\/?/);
    await expect(homePage.testCasesLink).toBeVisible();

    // 4. Click 'Products' button
    await productsPage.clickProducts();
    await expect(page).toHaveURL(/.*\/products/);

    // 5. Hover over first product and click 'Add to cart'
    // 6. Click 'Continue Shopping' button
    await productsPage.addProductToCart(0);
    await productsPage.clickContinueShopping();

    // 7. Hover over second product and click 'Add to cart'
    // 8. Click 'View Cart' button
    await productsPage.addProductToCart(1);
    await productsPage.clickViewCartModal();
    await expect(page).toHaveURL(/.*\/view_cart/);

    // 9. Verify both products are added to Cart
    const count = await cartPage.getCartCount();
    expect(count).toBe(2);

    // 10. Verify their prices, quantity and total price
    const product1 = await cartPage.getProductDetails(0);
    const product2 = await cartPage.getProductDetails(1);

    // Verifying basic structure first
    expect(product1.name).not.toBe('');
    expect(product1.price).toContain('Rs.');
    expect(product1.quantity).toBe('1');
    expect(product1.total).toBe(product1.price);

    expect(product2.name).not.toBe('');
    expect(product2.price).toContain('Rs.');
    expect(product2.quantity).toBe('1');
    expect(product2.total).toBe(product2.price);
});
