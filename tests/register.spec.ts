import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/register.page';

test('Test Case 1: Register User', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    
    // 1-3. Navigate to url and verify home page
    await registerPage.navigate();
    await expect(page).toHaveURL('https://automationexercise.com/');
    await expect(registerPage.signupLoginLink).toBeVisible(); 
    
    // 4. Click on 'Signup / Login' button
    await registerPage.clickSignupLogin();
    
    // 5. Verify 'New User Signup!' is visible
    await expect(page.locator('h2:has-text("New User Signup!")')).toBeVisible();
    
    // 6-7. Enter name and email address and click Signup
    const userName = 'Bharath';
    // Using Date.now() for unique email each time to avoid "Email Address already exist!" error
    const testEmail = `bharath${Date.now()}@gmail.com`; 
    await registerPage.fillSignupDetails(userName, testEmail);
    
    // 8. Verify that 'ENTER ACCOUNT INFORMATION' is visible
    await expect(page.locator('text=Enter Account Information')).toBeVisible();
    
    // 9-13. Fill all details correctly
    await registerPage.fillAccountInformation({
        password: 'Password@123',
        day: '10',
        month: '5',
        year: '1996',
        newsletter: true,
        offers: true,
        firstName: 'Bharath',
        lastName: 'Donthineni',
        company: 'Automaters Tech',
        address: '123 Main Street',
        address2: 'Apt 4B',
        country: 'India',
        state: 'Telangana',
        city: 'Hyderabad',
        zipcode: '500001',
        mobile: '9876543210'
    });
    
    // 14. Click 'Create Account button'
    await registerPage.clickCreateAccount();
    
    // 15. Verify that 'ACCOUNT CREATED!' is visible
    await expect(registerPage.accountCreatedMsg).toBeVisible();
    
    // 16. Click 'Continue' button
    await registerPage.clickContinue();
    
    // 17. Verify that 'Logged in as username' is visible
    await expect(registerPage.loggedInAsMsg).toBeVisible();
    await expect(page.locator(`text=${userName}`)).toBeVisible();
    
    // 18. Click 'Delete Account' button
    await registerPage.clickDeleteAccount();
    
    // 19. Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
    await expect(registerPage.accountDeletedMsg).toBeVisible();
    await registerPage.clickContinue();
});