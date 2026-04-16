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
        this.continueButton = page.locator('a[data-qa="continue"], a:has-text("Continue")').first();
        this.successMsg = this.orderPlacedMsg;
    }

    // Backwards-compatible alias expected by some tests
    readonly successMsg: Locator;

    // Provide expected public API names used across tests
    async enterPaymentDetails(details: { name: string, cardNum: string, cvc: string, month: string, year: string }) {
        await this.fillPaymentDetails({ name: details.name, card: details.cardNum, cvc: details.cvc, month: details.month, year: details.year });
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

    async clickPayAndConfirm() {
        await this.clickPay();
    }

    async clickDownloadInvoice() {
        // Try the normal click first and also attempt to open the href if download event doesn't fire
        const href = await this.downloadInvoiceButton.getAttribute('href');

        // Click the button (may trigger download)
        await this.downloadInvoiceButton.scrollIntoViewIfNeeded();
        await this.downloadInvoiceButton.click({ force: true });

        // If href exists and the click did not trigger a download in the test caller, navigating to the link can produce a download
        if (href) {
            // Open the invoice url in a new page to trigger a download event if necessary
            try {
                const newPage = await this.page.context().newPage();
                await newPage.goto(href, { waitUntil: 'load', timeout: 5000 }).catch(() => null);
                // close the helper page after a short delay to allow download event
                await newPage.waitForTimeout(500).catch(() => null);
                await newPage.close().catch(() => null);
            } catch (e) {
                // ignore errors; best-effort
            }
        }
    }

    async clickContinue() {
        await this.continueButton.click({ force: true });
    }
}
