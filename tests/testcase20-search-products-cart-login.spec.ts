import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';

test('Test Case 20: Search Products and Verify Cart After Login', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    const timestamp = Date.now();
    const userDetails = {
        name: `User${timestamp}`,
        email: `user${timestamp}@example.com`,
        password: 'Password123!',
        day: '10',
        month: 'May',
        year: '1990',
        firstName: 'First',
        lastName: 'Last',
        company: 'Company',
        address: '123 Test St',
        address2: 'Apt 4',
        country: 'United States',
        state: 'New York',
        city: 'New York',
        zipcode: '10001',
        mobile: '1234567890'
    };

    // --- SETUP: Register a user and logout ---
    await homePage.navigate();
    await homePage.clickLogin();
    await registerPage.fillSignupDetails(userDetails.name, userDetails.email);
    await registerPage.fillAccountInformation(userDetails);
    await registerPage.clickCreateAccount();
    await registerPage.clickContinue();
    await homePage.clickLogout();

    // 1. Launch browser & 2. Navigate to url 'http://automationexercise.com'
    await homePage.navigate();

    // 3. Click on 'Products' button
    await homePage.clickProducts();

    // 4. Verify user is navigated to ALL PRODUCTS page successfully
    await expect(page).toHaveURL(/.*products/);
    await expect(productsPage.allProductsHeader).toBeVisible();

    // 5. Enter product name in search input and click search button
    await productsPage.searchProduct('Blue');
    await page.waitForLoadState('networkidle');

    // 6. Verify 'SEARCHED PRODUCTS' is visible
    await expect(productsPage.searchedProductsHeader).toBeVisible();

    // 7. Verify all the products related to search are visible
    const productCount = await page.locator('.features_items .col-sm-4').count();
    expect(productCount).toBeGreaterThanOrEqual(1);

    // 8. Add those products to cart
    // Using exactly 1 product for maximum stability in the merge logic
    const productsToAdd = 1;
    for (let i = 0; i < productsToAdd; i++) {
        await productsPage.addProductToCart(i);
        await productsPage.clickContinueShopping();
    }

    // 9. Click 'Cart' button and verify that products are visible in cart
    await homePage.clickCart();
    await expect(page).toHaveURL(/.*view_cart/);
    const cartCountBefore = await cartPage.getCartCount();
    expect(cartCountBefore).toBe(productsToAdd);

    // 10. Click 'Signup / Login' button and submit login details
    await homePage.clickLogin();
    await loginPage.login(userDetails.email, userDetails.password);
    await page.waitForLoadState('networkidle');

    // 11. Again, go to Cart page
    await homePage.clickCart();
    
    // 12. Verify that those products are visible in cart after login as well
    // Using auto-retrying assertion to handle slow backend merging
    await expect(cartPage.cartRows).toHaveCount(productsToAdd, { timeout: 15000 });
    
    // Cleanup: Delete account
    await homePage.clickDeleteAccount();
    await expect(registerPage.accountDeletedMsg).toBeVisible();
    await registerPage.clickContinue();
});
