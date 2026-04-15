import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { RegisterPage } from '../pages/register.page';
import { CheckoutPage } from '../pages/checkout.page';
import { PaymentPage } from '../pages/payment.page';
import * as fs from 'fs';
import * as path from 'path';

test('Test Case 24: Download Invoice after purchase order', async ({ page }) => {
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
        firstName: 'Invoicer',
        lastName: 'Test',
        company: 'Billing Corp',
        address: '456 Invoice Ave',
        address2: 'Floor 2',
        country: 'United States',
        state: 'Texas',
        city: 'Austin',
        zipcode: '78701',
        mobile: '1231231234'
    };

    // 1. Launch browser & 2. Navigate to url 'http://automationexercise.com'
    await homePage.navigate();

    // 3. Add products to cart
    await homePage.clickProducts();
    await productsPage.addProductToCart(0);
    await productsPage.clickContinueShopping();

    // 4. Click 'Cart' button
    await homePage.clickCart();

    // 5. Verify that cart page is displayed
    await expect(page).toHaveURL(/.*view_cart/);

    // 6. Click Proceed To Checkout
    await cartPage.clickProceedToCheckout();

    // 7. Click 'Register / Login' button
    await cartPage.clickRegisterLoginModal();

    // 8. Fill all details in Signup and create account
    await registerPage.fillSignupDetails(userDetails.name, userDetails.email);
    await registerPage.fillAccountInformation(userDetails);
    await registerPage.clickCreateAccount();

    // 9. Verify 'ACCOUNT CREATED!' and click 'Continue' button
    await expect(registerPage.accountCreatedMsg).toBeVisible({ timeout: 10000 });
    await registerPage.clickContinue();
    await page.waitForLoadState('networkidle');

    // 10. Verify ' Logged in as username' at top
    await expect(homePage.loggedInAsText).toContainText(userDetails.name);

    // 11. Click 'Cart' button
    await homePage.clickCart();

    // 12. Click 'Proceed To Checkout' button
    await cartPage.clickProceedToCheckout();

    // 13. Verify Address Details and Review Your Order
    // (Already verified in TC23, here we just check visibility)
    await expect(checkoutPage.deliveryAddress).toBeVisible();

    // 14. Enter description in comment text area and click 'Place Order'
    await checkoutPage.enterComment('Please expedite the order.');
    await checkoutPage.clickPlaceOrder();

    // 15. Enter payment details: Name on Card, Card Number, CVC, Expiration date
    await paymentPage.fillPaymentDetails({
        name: userDetails.firstName,
        card: '4111111111111111',
        cvc: '123',
        month: '12',
        year: '2028'
    });

    // 16. Click 'Pay and Confirm Order' button
    await paymentPage.clickPay();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // UI settle time for download logic

    // 17. Verify success message 'Your order has been placed successfully!'
    // In this site, it shows 'ORDER PLACED!'
    await expect(paymentPage.orderPlacedMsg).toBeVisible({ timeout: 10000 });

    // 18. Click 'Download Invoice' button and verify invoice is downloaded successfully.
    const downloadPromise = page.waitForEvent('download');
    await paymentPage.clickDownloadInvoice();
    const download = await downloadPromise;
    
    // Verify download suggested filename or just successful reception
    expect(download.suggestedFilename()).toContain('.txt');
    
    // Save the file to ensure it's valid
    const downloadPath = path.join(__dirname, `../test-results/invoice_${timestamp}.txt`);
    await download.saveAs(downloadPath);
    expect(fs.existsSync(downloadPath)).toBeTruthy();

    // 19. Click 'Continue' button
    await paymentPage.clickContinue();

    // 20. Click 'Delete Account' button
    await homePage.clickDeleteAccount();

    // 21. Verify 'ACCOUNT DELETED!' and click 'Continue' button
    await expect(registerPage.accountDeletedMsg).toBeVisible();
    await registerPage.clickContinue();
});
