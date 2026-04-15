import { Page, Locator } from '@playwright/test';

export class PaymentPage {
    readonly page: Page;
    readonly nameOnCardInput: Locator;
    readonly cardNumberInput: Locator;
    readonly cvcInput: Locator;
    readonly expiryMonthInput: Locator;
    readonly expiryYearInput: Locator;
    readonly submitButton: Locator;
    readonly successMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameOnCardInput = page.locator('input[name="name_on_card"]');
        this.cardNumberInput = page.locator('input[name="card_number"]');
        this.cvcInput = page.locator('input[name="cvc"]');
        this.expiryMonthInput = page.locator('input[name="expiry_month"]');
        this.expiryYearInput = page.locator('input[name="expiry_year"]');
        this.submitButton = page.locator('button#submit');
        this.successMsg = page.locator('[data-qa="order-placed"] b');
    }

    async enterPaymentDetails(details: { name: string, cardNum: string, cvc: string, month: string, year: string }) {
        await this.nameOnCardInput.fill(details.name);
        await this.cardNumberInput.fill(details.cardNum);
        await this.cvcInput.fill(details.cvc);
        await this.expiryMonthInput.fill(details.month);
        await this.expiryYearInput.fill(details.year);
    }

    async clickPayAndConfirm() {
        await this.submitButton.click();
    }
}
