import { Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly testCasesLink: Locator;
    readonly cartLink: Locator;
    readonly subscriptionHeader: Locator;
    readonly subscriptionEmailInput: Locator;
    readonly subscribeButton: Locator;
    readonly subscribeSuccessMsg: Locator;
    readonly loggedInAsText: Locator;
    readonly deleteAccountLink: Locator;
    readonly logoutLink: Locator;
    readonly loginLink: Locator;

    readonly productsLink: Locator;
    readonly recommendedItemsHeader: Locator;
    readonly recommendedAddToCartButtons: Locator;
    readonly viewCartModalLink: Locator;
    readonly scrollUpButton: Locator;
    readonly sliderHeadline: Locator;

    constructor(page: Page) {
        this.page = page;
        this.testCasesLink = page.locator('ul.nav li a[href="/test_cases"]').first(); // Ensure specific to navigation menu and handles strict mode
        this.cartLink = page.locator('ul.nav li a[href="/view_cart"]').first();
        this.subscriptionHeader = page.locator('h2:has-text("Subscription")');
        this.subscriptionEmailInput = page.locator('#susbscribe_email');
        this.subscribeButton = page.locator('#subscribe');
        this.subscribeSuccessMsg = page.locator('#success-subscribe');
        this.loggedInAsText = page.locator('li:has-text("Logged in as")');
        this.deleteAccountLink = page.locator('a[href="/delete_account"]');
        this.logoutLink = page.locator('a[href="/logout"]');
        this.loginLink = page.locator('a[href="/login"]').first();
        this.productsLink = page.locator('a[href="/products"]');

        // Recommended Items
        this.recommendedItemsHeader = page.locator('.recommended_items h2:has-text("recommended items")');
        this.recommendedAddToCartButtons = page.locator('.recommended_items a.add-to-cart');
        this.viewCartModalLink = page.locator('.modal-body a[href="/view_cart"]');

        // Scroll Up
        this.scrollUpButton = page.locator('#scrollUp');
        this.sliderHeadline = page.locator('.active h2:has-text("Full-Fledged practice website for Automation Engineers")');
    }


    async navigate() {
        await this.page.goto('/');

        // More aggressive Ad clearing and hash segment removal to prevent strictly-matched URL failures
        await this.page.evaluate(() => {
            const clearAds = () => {
                document.querySelectorAll('iframe, ins.adsbygoogle, .adsbygoogle, [id^="aswift_"], [id^="google_vignette"], .vignette, .overlay').forEach(e => e.remove());
                try { if (location.hash) history.replaceState(null, '', location.href.split('#')[0]); } catch (e) {}
            };
            clearAds();
            // Periodically clean to catch late-loading ads
            setTimeout(clearAds, 2000);
        });

        // Wait for a stable page element to appear; fall back if first one isn't present
        try {
            await this.sliderHeadline.waitFor({ state: 'visible', timeout: 8000 });
        } catch {
            await this.productsLink.waitFor({ state: 'visible', timeout: 8000 });
        }
    }

    async clickTestCases() {
        await this.testCasesLink.first().click();
    }

    async clickCart() {
        await this.page.evaluate(() => {
            document.querySelectorAll('iframe, ins.adsbygoogle, .adsbygoogle, [id^="aswift_"]').forEach(e => e.remove());
        });
        await this.cartLink.scrollIntoViewIfNeeded();
        await this.cartLink.click({ force: true });
    }

    async subscribe(email: string) {
        await this.subscriptionEmailInput.fill(email);
        await this.subscribeButton.click();
    }

    async clickLogin() {
        await this.page.evaluate(() => {
            document.querySelectorAll('iframe, ins.adsbygoogle, .adsbygoogle, [id^="aswift_"]').forEach(e => e.remove());
        });
        await this.loginLink.scrollIntoViewIfNeeded();
        await this.loginLink.click({ force: true });
    }

    async clickDeleteAccount() {
        await this.page.evaluate(() => {
            document.querySelectorAll('iframe, ins.adsbygoogle, .adsbygoogle, [id^="aswift_"]').forEach(e => e.remove());
        });
        await this.deleteAccountLink.scrollIntoViewIfNeeded();
        await this.deleteAccountLink.click({ force: true });
    }

    async clickLogout() {
        await this.page.evaluate(() => {
            document.querySelectorAll('iframe, ins.adsbygoogle, .adsbygoogle, [id^="aswift_"]').forEach(e => e.remove());
        });
        await this.logoutLink.scrollIntoViewIfNeeded();
        await this.logoutLink.click({ force: true });
    }

    async clickProducts() {
        await this.page.evaluate(() => {
            document.querySelectorAll('iframe, ins.adsbygoogle, .adsbygoogle, [id^="aswift_"]').forEach(e => e.remove());
        });
        await this.productsLink.scrollIntoViewIfNeeded();
        
        // Try clicking, then force navigation if it fails to reach target within 2s
        await this.productsLink.click({ force: true });
        try {
            await this.page.waitForURL(/.*\/products/, { timeout: 2000 });
        } catch {
            await this.page.goto('/products', { waitUntil: 'domcontentloaded' });
        }
    }

    async addRecommendedProductToCart(index: number) {
        // Ensure the header is visible first so we are at the bottom
        await this.recommendedItemsHeader.scrollIntoViewIfNeeded();
        
        const button = this.recommendedAddToCartButtons.nth(index);
        await button.waitFor({ state: 'visible' });
        await button.click();
    }

    async clickViewCartModal() {
        await this.viewCartModalLink.waitFor({ state: 'visible' });
        await this.viewCartModalLink.click();
    }

    async clickScrollUp() {
        await this.scrollUpButton.click();
    }
}
