import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';

test('Test Case 2: Login User with correct email and password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    // Pre-condition: Test Case 2 chivaralo "Delete Account" step undi. 
    // Anduke prathi sari test pass avvadaniki munde oka dummy account create cheddam.
    const testUsername = 'BharathLogin';
    const testEmail = `login${Date.now()}@gmail.com`;
    const testPass = 'Vickyrao1@';

    // 🔴 Setup User for Login Test
    await registerPage.navigate();
    await registerPage.clickSignupLogin();
    await registerPage.fillSignupDetails(testUsername, testEmail);
    await registerPage.fillAccountInformation({
        password: testPass, day: '10', month: '5', year: '1996',
        firstName: 'Bharath', lastName: 'D',
        address: '123 Main', country: 'India', state: 'TS',
        city: 'Hyd', zipcode: '500001', mobile: '9876543210'
    });
    await registerPage.clickCreateAccount();
    await registerPage.clickContinue();
    await page.locator('a[href="/logout"]').click(); // Logout aipoyi actual test start cheddam

    // 🟢 Actual Test Case 2 Steps Begin
    // 1-3. Navigate to url and verify home page
    await registerPage.navigate();
    await expect(page).toHaveURL('https://automationexercise.com/');
    
    // 4. Click on 'Signup / Login' button
    await registerPage.clickSignupLogin();
    
    // 5. Verify 'Login to your account' is visible
    await expect(loginPage.loginHeader).toBeVisible();
    
    // 6-7. Enter correct email address, password and Click login
    await loginPage.login(testEmail, testPass);
    
    // 8. Verify that 'Logged in as username' is visible
    await expect(registerPage.loggedInAsMsg).toBeVisible();
    await expect(page.locator(`text=${testUsername}`)).toBeVisible();
    
    // 9. Click 'Delete Account' button
    await registerPage.clickDeleteAccount();
    
    // 10. Verify that 'ACCOUNT DELETED!' is visible
    await expect(registerPage.accountDeletedMsg).toBeVisible();
});
