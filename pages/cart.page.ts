import { Page, Locator } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartRows: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartRows = page.locator('tr[id^="product-"]');
    }

    async getProductDetails(index: number) {
        const row = this.cartRows.nth(index);
        const description = row.locator('.cart_description h4 a');
        const price = row.locator('.cart_price p');
        const quantity = row.locator('.cart_quantity button');
        const total = row.locator('.cart_total p');

        return {
            name: await description.innerText(),
            price: await price.innerText(),
            quantity: await quantity.innerText(),
            total: await total.innerText()
        };
    }

    async getCartCount() {
        return await this.cartRows.count();
    }
}
