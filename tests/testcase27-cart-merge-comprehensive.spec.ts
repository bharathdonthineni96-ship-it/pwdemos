import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';

test('Test Case 27: Comprehensive Cart Merge Verification', async ({ page }) => {
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
        firstName: 'Merger',
        lastName: 'Tester',
        company: 'QA Corp',
        address: '789 Merge St',
        address2: 'Suite 5',
        country: 'United States',
        state: 'Florida',
        city: 'Miami',
        zipcode: '33101',
        mobile: '3051234567'
    };

    // --- SETUP: Register a user and login ---
    await homePage.navigate();
    await homePage.clickLogin();
    await registerPage.fillSignupDetails(userDetails.name, userDetails.email);
    await registerPage.fillAccountInformation(userDetails);
    await registerPage.clickCreateAccount();
    await registerPage.clickContinue();

    // 1. Add Product A to cart while logged in
    await homePage.clickProducts();
    await productsPage.addProductToCart(0); // Product A (index 0)
    await productsPage.clickContinueShopping();

    // 2. Click 'Cart' button and verify Product A is present
    await homePage.clickCart();
    await expect(cartPage.cartRows).toHaveCount(1);

    // 3. Logout of the application
    await homePage.clickLogout();

    // 4. Browsing as a guest, navigate to Products and add Product B
    await homePage.clickProducts();
    await productsPage.addProductToCart(1); // Product B (index 1)
    await productsPage.clickContinueShopping();

    // 5. Click 'Cart' button and verify only Product B is in the guest cart
    // (Note: Site usually clears the guest session or keeps it separate depending on configuration)
    await homePage.clickCart();
    const guestCartCount = await cartPage.getCartCount();
    expect(guestCartCount).toBe(1);

    // 6. Click 'Signup / Login' button and submit login details
    await homePage.clickLogin();
    await loginPage.login(userDetails.email, userDetails.password);
    await homePage.loggedInAsText.waitFor({ state: 'visible', timeout: 15000 });

    // 7. Go to Cart page
    await homePage.clickCart();

    // 8. Verify that BOTH Product A (prevously saved) and Product B (guest addition) are visible in cart
    // We use auto-retrying assertion to allow backend merge to complete
    await expect(cartPage.cartRows).toHaveCount(2, { timeout: 15000 });

    // Cleanup: Delete account
    await homePage.clickDeleteAccount();
    await expect(registerPage.accountDeletedMsg).toBeVisible();
    await registerPage.clickContinue();
});
