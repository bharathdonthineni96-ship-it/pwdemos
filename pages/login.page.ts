import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginEmailInput = page.locator('input[data-qa="login-email"]');
        this.loginPasswordInput = page.locator('input[data-qa="login-password"]');
        this.loginButton = page.locator('button[data-qa="login-button"]');
    }

    async login(email: string, pass: string) {
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(pass);
        await this.loginButton.click();
    }
}