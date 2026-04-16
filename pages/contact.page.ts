import { Page, Locator } from '@playwright/test';

export class ContactPage {
    readonly page: Page;
    readonly contactUsLink: Locator;
    readonly getInTouchHeader: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly subjectInput: Locator;
    readonly messageTextArea: Locator;
    readonly uploadFileInput: Locator;
    readonly submitButton: Locator;
    readonly successMessage: Locator;
    readonly homeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.contactUsLink = page.locator('a[href="/contact_us"]');
        this.getInTouchHeader = page.locator('h2:has-text("Get In Touch")');
        this.nameInput = page.locator('input[data-qa="name"]');
        this.emailInput = page.locator('input[data-qa="email"]');
        this.subjectInput = page.locator('input[data-qa="subject"]');
        this.messageTextArea = page.locator('textarea[data-qa="message"]');
        this.uploadFileInput = page.locator('input[name="upload_file"]');
        this.submitButton = page.locator('input[data-qa="submit-button"]');
        this.successMessage = page.locator('.status.alert.alert-success');
        this.homeButton = page.locator('#form-section a.btn-success, a.btn-success:has-text("Home")');
    }

    async navigate() {
        await this.page.goto('https://automationexercise.com/');
        // Ad clearing logic
        await this.page.evaluate(() => {
            const clear = () => document.querySelectorAll('iframe, ins.adsbygoogle, .adsbygoogle, [id^="google_vignette"]').forEach(e => e.remove());
            clear();
            setTimeout(clear, 2000);
        });
    }

    async clickContactUs() {
        await this.contactUsLink.scrollIntoViewIfNeeded();
        await this.contactUsLink.click({ force: true });
        
        // Handle failed navigation due to vignettes
        await this.page.waitForTimeout(1000);
        if (!this.page.url().includes('/contact_us')) {
            await this.page.goto('/contact_us', { waitUntil: 'domcontentloaded' });
        }
    }

    async fillContactForm(name: string, email: string, subject: string, message: string, filePath?: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.subjectInput.fill(subject);
        await this.messageTextArea.fill(message);
        
        if (filePath) {
            await this.uploadFileInput.setInputFiles(filePath);
        }
    }

    async submitForm() {
        // Remove ads that might block the alert or the click
        await this.page.evaluate(() => document.querySelectorAll('iframe, ins.adsbygoogle, .adsbygoogle, [id^="google_vignette"]').forEach(e => e.remove()));
        
        // Handle the javascript alert
        this.page.once('dialog', async dialog => {
            await dialog.accept();
        });
        
        await this.submitButton.scrollIntoViewIfNeeded();
        await this.submitButton.click({ force: true });
        
        // If the submit didn't seem to work (no success message or dialogue didn't trigger), retry once
        await this.page.waitForTimeout(1000);
        if (!(await this.successMessage.isVisible())) {
            await this.submitButton.click({ force: true }).catch(() => null);
        }
    }

    async clickHome() {
        await this.homeButton.click();
    }
}
