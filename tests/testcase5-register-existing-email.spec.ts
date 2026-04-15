import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/register.page';

test('Test Case 5: Register User with existing email', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // Pre-condition: Create an account first
    const userName = 'BharathExisting';
    const existingEmail = `existing${Date.now()}@gmail.com`;

    await registerPage.navigate();
    await registerPage.clickSignupLogin();
    await registerPage.fillSignupDetails(userName, existingEmail);
    await registerPage.fillAccountInformation({
        password: 'Password123', day: '10', month: '5', year: '1996',
        firstName: 'Bharath', lastName: 'D',
        address: '123 Main', country: 'India', state: 'TS',
        city: 'Hyd', zipcode: '500001', mobile: '9876543210'
    });
    await registerPage.clickCreateAccount();
    await registerPage.clickContinue();
    await registerPage.clickLogout(); 

    // Actual Test Case 5 Steps
    // 1-3. Navigate to url and verify home page
    await registerPage.navigate();
    await expect(page).toHaveURL('https://automationexercise.com/');
    
    // 4. Click on 'Signup / Login' button
    await registerPage.clickSignupLogin();
    
    // 5. Verify 'New User Signup!' is visible
    await expect(page.locator('h2:has-text("New User Signup!")')).toBeVisible();
    
    // 6-7. Enter name and already registered email address and click Signup
    await registerPage.fillSignupDetails(userName, existingEmail);
    
    // 8. Verify error 'Email Address already exist!' is visible
    await expect(registerPage.emailExistsMsg).toBeVisible();
});
