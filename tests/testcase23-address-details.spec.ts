import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { RegisterPage } from '../pages/register.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';

test('Test Case 23: Verify address details in checkout page', async ({ page }) => {
    const homePage = new HomePage(page);
    const registerPage = new RegisterPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    const timestamp = Date.now();
    const userDetails = {
        name: `User${timestamp}`,
        email: `user${timestamp}@example.com`,
        password: 'Password123!',
        day: '10',
        month: 'May',
        year: '1990',
        firstName: 'Firstname',
        lastName: 'Lastname',
        company: 'Automated Corp',
        address: '123 Tech Lane',
        address2: 'Building 4',
        country: 'United States',
        state: 'California',
        city: 'San Francisco',
        zipcode: '94105',
        mobile: '9876543210'
    };

    // 1. Launch browser & 2. Navigate to url 'http://automationexercise.com'
    await homePage.navigate();

    // 3. Click 'Signup / Login' button
    await homePage.clickLogin();

    // 4. Fill all details in Signup and create account
    await registerPage.fillSignupDetails(userDetails.name, userDetails.email);
    await registerPage.fillAccountInformation(userDetails);
    await registerPage.clickCreateAccount();

    // 5. Verify 'ACCOUNT CREATED!' and click 'Continue' button
    await expect(registerPage.accountCreatedMsg).toBeVisible();
    await registerPage.clickContinue();

    // 6. Verify ' Logged in as username' at top
    await expect(homePage.loggedInAsText).toContainText(userDetails.name);

    // 7. Add products to cart
    await homePage.clickProducts();
    await productsPage.addProductToCart(0);
    await productsPage.clickContinueShopping();

    // 8. Click 'Cart' button
    await homePage.clickCart();

    // 9. Verify that cart page is displayed
    await expect(page).toHaveURL(/.*view_cart/);

    // 10. Click Proceed To Checkout
    await cartPage.clickProceedToCheckout();

    // 11. Verify that the delivery address is same address filled at the time registration of account
    const delivery = checkoutPage.deliveryAddress;
    await expect(delivery).toContainText(userDetails.firstName);
    await expect(delivery).toContainText(userDetails.lastName);
    await expect(delivery).toContainText(userDetails.company);
    await expect(delivery).toContainText(userDetails.address);
    await expect(delivery).toContainText(userDetails.address2);
    await expect(delivery).toContainText(userDetails.city);
    await expect(delivery).toContainText(userDetails.state);
    await expect(delivery).toContainText(userDetails.zipcode);
    await expect(delivery).toContainText(userDetails.country);
    await expect(delivery).toContainText(userDetails.mobile);

    // 12. Verify that the billing address is same address filled at the time registration of account
    const billing = checkoutPage.billingAddress;
    await expect(billing).toContainText(userDetails.firstName);
    await expect(billing).toContainText(userDetails.lastName);
    await expect(billing).toContainText(userDetails.company);
    await expect(billing).toContainText(userDetails.address);
    await expect(billing).toContainText(userDetails.address2);
    await expect(billing).toContainText(userDetails.city);
    await expect(billing).toContainText(userDetails.state);
    await expect(billing).toContainText(userDetails.zipcode);
    await expect(billing).toContainText(userDetails.country);
    await expect(billing).toContainText(userDetails.mobile);

    // 13. Click 'Delete Account' button
    await homePage.clickDeleteAccount();

    // 14. Verify 'ACCOUNT DELETED!' and click 'Continue' button
    await expect(registerPage.accountDeletedMsg).toBeVisible();
    await registerPage.clickContinue();
});
