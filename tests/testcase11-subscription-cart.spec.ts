import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test('Test Case 11: Verify Subscription in Cart page', async ({ page }) => {
    const homePage = new HomePage(page);

    // 1-3. Navigate to url and verify home page
    await homePage.navigate();
    await expect(page).toHaveURL(/https:\/\/automationexercise.com\/?/);
    
    // 4. Click 'Cart' button
    await homePage.clickCart();
    await expect(page).toHaveURL(/.*\/view_cart/);
    
    // 5. Scroll down to footer
    await homePage.subscriptionHeader.scrollIntoViewIfNeeded();
    
    // 6. Verify text 'SUBSCRIPTION'
    await expect(homePage.subscriptionHeader).toBeVisible();
    await expect(homePage.subscriptionHeader).toHaveText('Subscription');
    
    // 7. Enter email address in input and click arrow button
    const subscribeEmail = `cartsub${Date.now()}@test.com`;
    await homePage.subscribe(subscribeEmail);
    
    // 8. Verify success message 'You have been successfully subscribed!' is visible
    await expect(homePage.subscribeSuccessMsg).toBeVisible();
    await expect(homePage.subscribeSuccessMsg).toHaveText('You have been successfully subscribed!');
});
