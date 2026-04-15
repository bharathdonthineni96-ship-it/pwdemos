import { Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly testCasesLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.testCasesLink = page.locator('a[href="/test_cases"]'); // Using the href to uniquely identify it
    }

    async navigate() {
        await this.page.goto('/');
    }

    async clickTestCases() {
        await this.testCasesLink.first().click();
    }
}
