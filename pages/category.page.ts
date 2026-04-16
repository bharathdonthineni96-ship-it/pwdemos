import { Page, Locator } from '@playwright/test';

export class CategoryPage {
    readonly page: Page;
    readonly categorySidebar: Locator;
    readonly womenCategory: Locator;
    readonly menCategory: Locator;
    readonly categoryPageTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.categorySidebar = page.locator('.left-sidebar h2:has-text("Category")');
        this.womenCategory = page.locator('a[href="#Women"]');
        this.menCategory = page.locator('a[href="#Men"]');
        this.categoryPageTitle = page.locator('h2.title.text-center');
    }

    async clickWomenCategory() {
        await this.womenCategory.click();
    }

    async clickMenCategory() {
        await this.menCategory.click();
    }

    async clickSubCategory(parentIndex: number, subCategoryName: string) {
        // parentIndex: 0 for Women, 1 for Men, etc. (based on accordion order)
        const panel = this.page.locator('.panel-group .panel').nth(parentIndex);
        const subCategory = panel.locator('.panel-body ul li a').filter({ hasText: subCategoryName }).first();
        await subCategory.click();
    }
}
