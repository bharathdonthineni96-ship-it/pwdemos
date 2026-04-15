import { Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly testCasesLink: Locator;
    readonly subscriptionHeader: Locator;
    readonly subscriptionEmailInput: Locator;
    readonly subscribeButton: Locator;
    readonly subscribeSuccessMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        this.testCasesLink = page.locator('a[href="/test_cases"]'); // Using the href to uniquely identify it
        this.subscriptionHeader = page.locator('h2:has-text("Subscription")');
        this.subscriptionEmailInput = page.locator('#susbscribe_email');
        this.subscribeButton = page.locator('#subscribe');
        this.subscribeSuccessMsg = page.locator('#success-subscribe');
    }

    async navigate() {
        await this.page.goto('/');
    }

    async clickTestCases() {
        await this.testCasesLink.first().click();
    }

    async subscribe(email: string) {
        await this.subscriptionEmailInput.fill(email);
        await this.subscribeButton.click();
    }
}
