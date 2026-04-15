import { Page, Locator } from '@playwright/test';

export class PaymentPage {
    readonly page: Page;
    readonly nameOnCardInput: Locator;
    readonly cardNumberInput: Locator;
    readonly cvcInput: Locator;
    readonly expiryMonthInput: Locator;
    readonly expiryYearInput: Locator;
    readonly payButton: Locator;
    readonly orderPlacedMsg: Locator;
    readonly downloadInvoiceButton: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameOnCardInput = page.locator('input[data-qa="name-on-card"]');
        this.cardNumberInput = page.locator('input[data-qa="card-number"]');
        this.cvcInput = page.locator('input[data-qa="cvc"]');
        this.expiryMonthInput = page.locator('input[data-qa="expiry-month"]');
        this.expiryYearInput = page.locator('input[data-qa="expiry-year"]');
        this.payButton = page.locator('button[data-qa="pay-button"]');
        this.orderPlacedMsg = page.locator('h2[data-qa="order-placed"] b');
        this.downloadInvoiceButton = page.locator('a.btn.btn-default.check_out:has-text("Download Invoice")');
        this.continueButton = page.locator('a[data-qa="continue"]');
    }

    async fillPaymentDetails(details: { name: string, card: string, cvc: string, month: string, year: string }) {
        await this.nameOnCardInput.fill(details.name);
        await this.cardNumberInput.fill(details.card);
        await this.cvcInput.fill(details.cvc);
        await this.expiryMonthInput.fill(details.month);
        await this.expiryYearInput.fill(details.year);
    }

    async clickPay() {
        // Setup listener for the payment response BEFORE clicking
        const responsePromise = this.page.waitForResponse(response => 
            response.url().includes('/payment') && response.status() === 200,
            { timeout: 10000 }
        );

        await this.payButton.click({ force: true });

        // Wait for the server to confirm the payment
        await responsePromise;
    }

    async clickDownloadInvoice() {
        // This method should be used with a download promise in the test
        await this.downloadInvoiceButton.click({ force: true });
    }

    async clickContinue() {
        await this.continueButton.click({ force: true });
    }
}
