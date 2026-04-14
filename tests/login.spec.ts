import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';

test('Test Case 2: Login User with correct email and password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    await registerPage.navigate();
    await registerPage.clickSignupLogin();
    
    // TC1 lo register chesina details ikkada ivvu
    await loginPage.login('bharathdonthineni96@gmail.com', 'Vickyrao1@');

    // Success check
    await expect(page.locator('text=Logged in as Bharath')).toBeVisible();
});
