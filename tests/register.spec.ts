import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/register.page';

test('Test Case 1: Register User', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    await registerPage.clickSignupLogin();
    await registerPage.fillSignupDetails('Bharath', `test${Date.now()}@gmail.com`);
    await expect(page.locator('text=Enter Account Information')).toBeVisible();
});