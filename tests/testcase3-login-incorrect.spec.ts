import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';

test('Test Case 3: Login User with incorrect email and password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    // 1-3. Navigate to url and verify home page
    await registerPage.navigate();
    await expect(page).toHaveURL('https://automationexercise.com/');
    
    // 4. Click on 'Signup / Login' button
    await registerPage.clickSignupLogin();
    
    // 5. Verify 'Login to your account' is visible
    await expect(loginPage.loginHeader).toBeVisible();
    
    // 6-7. Enter incorrect email address, password and Click login
    await loginPage.login('wrong_user_12345@gmail.com', 'wrongpassword!');
    
    // 8. Verify error 'Your email or password is incorrect!' is visible
    await expect(loginPage.errorMessage).toBeVisible();
});
