import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { CartPage } from '../pages/cart.page';

test('Test Case 22: Add to Cart from Recommended Items', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);

    // 1. Launch browser & 2. Navigate to url 'http://automationexercise.com'
    await homePage.navigate();

    // 3. Scroll to bottom of page
    // (Handled automatically by scrollIntoViewIfNeeded in the POM method, 
    // but we'll do an explicit scroll to see it in action)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // 4. Verify 'RECOMMENDED ITEMS' are visible
    await expect(homePage.recommendedItemsHeader).toBeVisible();

    // 5. Click on 'Add To Cart' on Recommended product
    // We'll add the first recommended product
    await homePage.addRecommendedProductToCart(0);

    // 6. Click on 'View Cart' button
    await homePage.clickViewCartModal();

    // 7. Verify that product is displayed in cart page
    await expect(page).toHaveURL(/.*view_cart/);
    const rowCount = await cartPage.getCartCount();
    expect(rowCount).toBeGreaterThan(0);
});
