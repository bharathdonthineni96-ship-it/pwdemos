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
        await this.page.evaluate(() => document.querySelectorAll('iframe, ins.adsbygoogle, .adsbygoogle').forEach(e => e.remove()));
        // Try main selector, otherwise fallback to any checkout link
        const sel = 'a.btn.btn-default.check_out';
        const alt = 'a[href="/checkout"], a:has-text("Proceed To Checkout")';
        const locator = this.page.locator(sel).first();
        if (await locator.count() > 0) {
            await locator.scrollIntoViewIfNeeded().catch(() => null);
            await locator.click({ force: true });
            return;
        }
        const altLocator = this.page.locator(alt).first();
        if (await altLocator.count() > 0) {
            await altLocator.scrollIntoViewIfNeeded().catch(() => null);
            await altLocator.click({ force: true });
            return;
        }
        // As a last resort, perform a JS click on any matching element
        await this.page.evaluate(() => {
            const el = document.querySelector('a.btn.btn-default.check_out') || document.querySelector('a[href="/checkout"]');
            if (el) (el as HTMLElement).click();
        });
    }

    async clickRegisterLoginModal() {
        await this.registerLoginModalLink.click();
    }

    async removeProduct(index: number) {
        const row = this.cartRows.nth(index);
        const deleteButton = row.locator('a.cart_quantity_delete');
        await this.page.evaluate(() => document.querySelectorAll('iframe, ins.adsbygoogle, .adsbygoogle').forEach(e => e.remove()));
        const beforeCount = await this.cartRows.count();
        await deleteButton.scrollIntoViewIfNeeded();
        await deleteButton.click({ force: true });

        // Wait for either the row to be removed or the cart count to decrease
        await this.page.waitForFunction((sel, prev) => document.querySelectorAll(sel).length < prev, {}, 'tr[id^="product-"]', beforeCount).catch(async () => {
            // As a fallback, wait for the specific row to be hidden or detached
            await row.waitFor({ state: 'detached', timeout: 8000 }).catch(() => null);
        });
    }
}
