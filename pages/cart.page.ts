import { Page, Locator } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartRows: Locator;
    readonly proceedToCheckoutButton: Locator;
    readonly registerLoginModalLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartRows = page.locator('tr[id^="product-"]');
        this.proceedToCheckoutButton = page.locator('a.btn.btn-default.check_out');
        this.registerLoginModalLink = page.locator('.modal-body a[href="/login"]');
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

    async clickProceedToCheckout() {
        await this.proceedToCheckoutButton.click();
    }

    async clickRegisterLoginModal() {
        await this.registerLoginModalLink.click();
    }
}
