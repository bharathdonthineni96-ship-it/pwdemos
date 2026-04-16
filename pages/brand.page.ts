import { Page, Locator } from '@playwright/test';

export class BrandPage {
    readonly page: Page;
    readonly brandsSidebar: Locator;
    readonly brandLinks: Locator;
    readonly brandPageTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.brandsSidebar = page.locator('.brands_products h2:has-text("Brands")');
        this.brandLinks = page.locator('.brands-name ul li a');
        this.brandPageTitle = page.locator('h2.title.text-center');
    }

    async clickBrand(brandName: string) {
        // Use filter to find the brand link by text
        const brandLink = this.brandLinks.filter({ hasText: brandName }).first();
        await brandLink.scrollIntoViewIfNeeded();
        await brandLink.click({ force: true });
    }
}
