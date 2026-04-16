import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { RegisterPage } from '../pages/register.page';
import { CheckoutPage } from '../pages/checkout.page';
import { PaymentPage } from '../pages/payment.page';

test('Test Case 14: Place Order: Register while Checkout', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const registerPage = new RegisterPage(page);
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);

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

    // 1. Launch browser & 2. Navigate to url 'http://automationexercise.com'
    await homePage.navigate();

    // 3. Verify that home page is visible successfully
    await expect(page).toHaveURL(/https:\/\/automationexercise.com\/?/);
    await expect(homePage.testCasesLink).toBeVisible();

    // 4. Add products to cart
    await productsPage.clickProducts();
    await page.locator('h2.title.text-center').waitFor({ state: 'visible', timeout: 15000 });
    
    await productsPage.addProductToCart(0);
    await productsPage.clickContinueShopping();
    
    await productsPage.addProductToCart(1);
    await productsPage.clickContinueShopping();

    // 5. Click 'Cart' button
    await homePage.clickCart();

    // 6. Verify that cart page is displayed
    await expect(page).toHaveURL(/.*\/view_cart/);

    // 7. Click Proceed To Checkout
    await cartPage.clickProceedToCheckout();

    // 8. Click 'Register / Login' button
    await cartPage.clickRegisterLoginModal();

    // 9. Fill all details in Signup and create account
    await registerPage.fillSignupDetails(userDetails.name, userDetails.email);
    await registerPage.fillAccountInformation(userDetails);
    await registerPage.clickCreateAccount();

    // 10. Verify 'ACCOUNT CREATED!' and click 'Continue' button
    await expect(registerPage.accountCreatedMsg).toBeVisible();
    await expect(registerPage.accountCreatedMsg).toHaveText('Account Created!');
    await registerPage.clickContinue();

    // 11. Verify ' Logged in as username' at top
    await expect(homePage.loggedInAsText).toBeVisible();
    await expect(homePage.loggedInAsText).toContainText(userDetails.name);

    // 12.Click 'Cart' button
    await homePage.clickCart();

    // 13. Click 'Proceed To Checkout' button
    await cartPage.clickProceedToCheckout();
    await page.waitForTimeout(1000); // Small buffer for address loading

    // 14. Verify Address Details and Review Your Order
    await expect(checkoutPage.deliveryAddress).toBeVisible();
    await expect(checkoutPage.deliveryAddress).toContainText(userDetails.firstName);
    await expect(checkoutPage.deliveryAddress).toContainText(userDetails.address);

    // 15. Enter description in comment text area and click 'Place Order'
    await checkoutPage.enterComment('Test order comments');
    await checkoutPage.clickPlaceOrder();

    // 16. Enter payment details: Name on Card, Card Number, CVC, Expiration date
    await paymentPage.enterPaymentDetails({
        name: userDetails.name,
        cardNum: '4111111111111111',
        cvc: '123',
        month: '12',
        year: '2025'
    });

    // 17. Click 'Pay and Confirm Order' button
    await paymentPage.clickPayAndConfirm();

    // 18. Verify success message 'Your order has been placed successfully!'
    await expect(paymentPage.successMsg).toBeVisible();
    // The message is actually "Congratulations! Your order has been confirmed!" in the sub-header usually, 
    // but the task says "Your order has been placed successfully!" 
    // or just checking the success section.
    await expect(paymentPage.successMsg).toContainText('Order Placed!');

    // 19. Click 'Delete Account' button
    await homePage.clickDeleteAccount();

    // 20. Verify 'ACCOUNT DELETED!' and click 'Continue' button
    await expect(registerPage.accountDeletedMsg).toBeVisible();
    await registerPage.clickContinue();
});
