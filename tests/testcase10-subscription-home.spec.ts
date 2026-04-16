import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test('Test Case 10: Verify Subscription in home page', async ({ page }) => {
    const homePage = new HomePage(page);

    // 1-3. Navigate to url and verify home page
    await homePage.navigate();
    await expect(page).toHaveURL(/https:\/\/automationexercise.com\/?/);
    
    // 4. Scroll down to footer
    // Playwright automatically scrolls to the element when needed, but to explicitly scroll down:
    await homePage.subscriptionHeader.scrollIntoViewIfNeeded();
    
    // 5. Verify text 'SUBSCRIPTION'
    await expect(homePage.subscriptionHeader).toBeVisible();
    
    // 6. Enter email address in input and click arrow button
    const subscribeEmail = `subscription${Date.now()}@test.com`;
    await homePage.subscribe(subscribeEmail);
    
    // 7. Verify success message 'You have been successfully subscribed!' is visible
    await expect(homePage.subscribeSuccessMsg).toBeVisible();
    await expect(homePage.subscribeSuccessMsg).toHaveText('You have been successfully subscribed!');
});
