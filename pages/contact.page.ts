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
        await this.page.goto('/');
    }

    async clickContactUs() {
        await this.contactUsLink.click();
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
        // Handle the javascript alert
        this.page.once('dialog', dialog => dialog.accept());
        await this.submitButton.click();
    }

    async clickHome() {
        await this.homeButton.click();
    }
}
