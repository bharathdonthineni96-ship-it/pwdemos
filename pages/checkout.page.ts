import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    readonly deliveryAddress: Locator;
    readonly billingAddress: Locator;
    readonly commentTextArea: Locator;
    readonly placeOrderButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.deliveryAddress = page.locator('#address_delivery');
        this.billingAddress = page.locator('#address_invoice');
        this.commentTextArea = page.locator('textarea[name="message"]');
        this.placeOrderButton = page.locator('a.btn.btn-default.check_out[href="/payment"]');
    }

    async enterComment(comment: string) {
        await this.commentTextArea.fill(comment);
    }

    async clickPlaceOrder() {
        await this.placeOrderButton.click();
    }
}
