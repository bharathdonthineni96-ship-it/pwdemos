import { Page, Locator } from '@playwright/test';

export class ProductsPage {
    readonly page: Page;
    readonly productsLink: Locator;
    readonly allProductsHeader: Locator;
    readonly productsList: Locator;
    readonly firstProductViewLink: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly searchedProductsHeader: Locator;
    readonly continueShoppingButton: Locator;
    readonly viewCartModalLink: Locator;
    readonly quantityInput: Locator;
    readonly addToCartDetailButton: Locator;
    
    // Product Details Locators
    readonly productName: Locator;
    readonly productCategory: Locator;
    readonly productPrice: Locator;
    readonly productAvailability: Locator;
    readonly productCondition: Locator;
    readonly productBrand: Locator;

    readonly writeReviewHeader: Locator;
    readonly reviewNameInput: Locator;
    readonly reviewEmailInput: Locator;
    readonly reviewTextArea: Locator;
    readonly submitReviewButton: Locator;
    readonly reviewSuccessMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productsLink = page.locator('a[href="/products"]');
        this.allProductsHeader = page.locator('h2.title.text-center:has-text("All Products")');
        this.productsList = page.locator('.features_items');
        this.firstProductViewLink = page.locator('.choose ul li a').first();
        this.searchInput = page.locator('#search_product');
        this.searchButton = page.locator('#submit_search');
        this.continueButton = page.locator('a[data-qa="continue"], a:has-text("Continue")').first();
        this.searchedProductsHeader = page.locator('h2.title.text-center:has-text("Searched Products")');
        this.continueShoppingButton = page.locator('button.btn-success:has-text("Continue Shopping")');
        this.viewCartModalLink = page.locator('.modal-body a[href="/view_cart"]');
        this.quantityInput = page.locator('#quantity');
        this.addToCartDetailButton = page.locator('button.cart');
        
        // Detailed Info
        this.productName = page.locator('.product-information h2');
        this.productCategory = page.locator('.product-information p:has-text("Category:")');
        this.productPrice = page.locator('.product-information span span');
        this.productAvailability = page.locator('.product-information p:has-text("Availability:")');
        this.productCondition = page.locator('.product-information p:has-text("Condition:")');
        this.productBrand = page.locator('.product-information p:has-text("Brand:")');

        // Review Locators
        this.writeReviewHeader = page.locator('a[href="#reviews"]');
        this.reviewNameInput = page.locator('#name');
        this.reviewEmailInput = page.locator('#email');
        this.reviewTextArea = page.locator('#review');
        this.submitReviewButton = page.locator('#button-review');
        this.reviewSuccessMsg = page.locator('.alert-success').filter({ hasText: 'Thank you for your review.' }).first();
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

    async viewFirstProduct() {
        await this.firstProductViewLink.scrollIntoViewIfNeeded();
        const href = await this.firstProductViewLink.getAttribute('href');
        await this.firstProductViewLink.click({ force: true });
        // Handle potential Google Vignette or failed navigation
        await this.page.waitForTimeout(1000);
        if (href && !this.page.url().includes(href)) {
            await this.page.goto(href, { waitUntil: 'domcontentloaded' });
        }
    }

    async searchProduct(productName: string) {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
    }

    async addProductToCart(index: number) {
        // Target specifically the static 'productinfo' area WITHIN the unique grid container
        const productContainer = this.page.locator('.features_items .col-sm-4').nth(index);
        await productContainer.scrollIntoViewIfNeeded();
        
        const addToCart = productContainer.locator('.productinfo a.add-to-cart');
        await addToCart.waitFor({ state: 'visible', timeout: 5000 });
        
        // Setup listener for the AJAX response BEFORE clicking
        const responsePromise = this.page.waitForResponse(response => {
            const url = response.url();
            return (url.includes('/add_to_cart') || url.includes('/add_cart')) && response.status() === 200;
        }, { timeout: 8000 }).catch(() => null);

        // Also wait for the UI modal as a fallback
        const modalPromise = this.page.waitForSelector('.modal-content', { state: 'visible', timeout: 8000 }).catch(() => null);

        await addToCart.click({ force: true });

        // If a vignette intercepted the click, retry or clear it (site specific behavior)
        if (this.page.url().includes('#google_vignette')) {
            await this.page.evaluate(() => {
                if (location.hash) history.replaceState(null, '', location.href.split('#')[0]);
                document.querySelectorAll('iframe, [id^="google_vignette"]').forEach(e => e.remove());
            });
            await addToCart.click({ force: true });
        }

        // Wait for either the network response or the modal to appear
        await Promise.race([responsePromise, modalPromise]);
    }

    async clickContinueShopping() {
        // The 'Continue Shopping' button can be hidden/overlapped by ads; try a few strategies
        await this.page.evaluate(() => document.querySelectorAll('iframe, ins.adsbygoogle, .adsbygoogle').forEach(e => e.remove()));
        // If the button is visible on the modal, click it; otherwise close modal via backdrop or ESC
        const visible = await this.continueShoppingButton.isVisible();
        if (visible) {
            await this.continueShoppingButton.click({ force: true });
        } else {
            // Try clicking the modal close button
            const modalClose = this.page.locator('.modal .close');
            if (await modalClose.isVisible()) await modalClose.click({ force: true });
            else await this.page.keyboard.press('Escape');
        }
        // Ensure the modal and BACKDROP are gone before proceeding
        await this.page.locator('.modal-content').waitFor({ state: 'hidden', timeout: 8000 }).catch(() => null);
        await this.page.locator('.modal-backdrop').waitFor({ state: 'hidden', timeout: 8000 }).catch(() => null);
        await this.page.waitForTimeout(500); // Small buffer for session state syncing
    }

    async clickViewCartModal() {
        await this.viewCartModalLink.click();
    }

    async setQuantity(qty: string) {
        await this.quantityInput.fill(qty);
    }

    async clickAddToCartDetail() {
        await this.addToCartDetailButton.click();
    }

    async submitReview(name: string, email: string, review: string) {
        await this.reviewNameInput.fill(name);
        await this.reviewEmailInput.fill(email);
        await this.reviewTextArea.fill(review);
        
        // Remove ads that might overlap the submit button
        await this.page.evaluate(() => document.querySelectorAll('iframe, ins.adsbygoogle, .adsbygoogle').forEach(e => e.remove()));

        // Setup listener for the AJAX response BEFORE clicking
        const responsePromise = this.page.waitForResponse(response => 
            response.url().includes('/product_review/') && response.status() === 200,
            { timeout: 10000 }
        ).catch(() => null);

        await this.submitReviewButton.scrollIntoViewIfNeeded();
        await this.submitReviewButton.click({ force: true });
        
        // Wait for responding or the success message
        await Promise.race([
            responsePromise,
            this.reviewSuccessMsg.waitFor({ state: 'visible', timeout: 10000 }).catch(() => null)
        ]);
    }
}
