import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test('Test Case 7: Verify Test Cases Page', async ({ page }) => {
    const homePage = new HomePage(page);

    // 1-3. Navigate to url and verify home page
    await homePage.navigate();
    await expect(page).toHaveURL('https://automationexercise.com/');
    
    // 4. Click on 'Test Cases' button
    await homePage.clickTestCases();
    
    // 5. Verify user is navigated to test cases page successfully
    await expect(page).toHaveURL('https://automationexercise.com/test_cases');
    await expect(page.locator('h2:has-text("Test Cases")').first()).toBeVisible();
});
