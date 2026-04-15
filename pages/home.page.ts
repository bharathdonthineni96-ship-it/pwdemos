import { Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly testCasesLink: Locator;
    readonly cartLink: Locator;
    readonly subscriptionHeader: Locator;
    readonly subscriptionEmailInput: Locator;
    readonly subscribeButton: Locator;
    readonly subscribeSuccessMsg: Locator;
    readonly loggedInAsText: Locator;
    readonly deleteAccountLink: Locator;
    readonly logoutLink: Locator;
    readonly loginLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.testCasesLink = page.locator('ul.nav li a[href="/test_cases"]').first(); // Ensure specific to navigation menu and handles strict mode
        this.cartLink = page.locator('ul.nav li a[href="/view_cart"]').first();
        this.subscriptionHeader = page.locator('h2:has-text("Subscription")');
        this.subscriptionEmailInput = page.locator('#susbscribe_email');
        this.subscribeButton = page.locator('#subscribe');
        this.subscribeSuccessMsg = page.locator('#success-subscribe');
        this.loggedInAsText = page.locator('li:has-text("Logged in as")');
        this.deleteAccountLink = page.locator('a[href="/delete_account"]');
        this.logoutLink = page.locator('a[href="/logout"]');
        this.loginLink = page.locator('a[href="/login"]');
    }

    async navigate() {
        await this.page.goto('/');
    }

    async clickTestCases() {
        await this.testCasesLink.first().click();
    }

    async clickCart() {
        await this.cartLink.click();
    }

    async subscribe(email: string) {
        await this.subscriptionEmailInput.fill(email);
        await this.subscribeButton.click();
    }

    async clickLogin() {
        await this.loginLink.click();
    }

    async clickDeleteAccount() {
        await this.deleteAccountLink.click();
    }

    async clickLogout() {
        await this.logoutLink.click();
    }
}
