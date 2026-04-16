import { test, expect } from '@playwright/test';
import { ContactPage } from '../pages/contact.page';
import * as path from 'path';

test('Test Case 6: Contact Us Form', async ({ page }) => {
    const contactPage = new ContactPage(page);

    // 1-3. Navigate to url and verify home page
    await contactPage.navigate();
    await expect(page).toHaveURL('https://automationexercise.com/');
    
    // 4. Click on 'Contact Us' button
    await contactPage.clickContactUs();
    
    // 5. Verify 'GET IN TOUCH' is visible
    await expect(contactPage.getInTouchHeader).toBeVisible();
    
    // 6. Enter name, email, subject and message
    // 7. Upload file
    const uploadFilePath = path.join(__dirname, '../package.json'); // Using an existing file
    await contactPage.fillContactForm(
        'Bharath QA', 
        'bharathqa@test.com', 
        'Test Subject', 
        'This is a test message for Contact Us form.',
        uploadFilePath
    );
    
    // 8-9. Click 'Submit' button & Click OK button on Javascript alert
    await contactPage.submitForm();
    
    // 10. Verify success message 'Success! Your details have been submitted successfully.' is visible
    await expect(contactPage.successMessage).toHaveText('Success! Your details have been submitted successfully.');
    
    // 11. Click 'Home' button and verify that landed to home page successfully
    await contactPage.clickHome();
    await expect(page).toHaveURL(/https:\/\/automationexercise.com\/?/);
});
