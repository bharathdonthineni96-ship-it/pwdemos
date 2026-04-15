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

    constructor(page: Page) {
        this.page = page;
        this.productsLink = page.locator('a[href="/products"]');
        this.allProductsHeader = page.locator('h2.title.text-center:has-text("All Products")');
        this.productsList = page.locator('.features_items');
        this.firstProductViewLink = page.locator('.choose ul li a').first();
        this.searchInput = page.locator('#search_product');
        this.searchButton = page.locator('#submit_search');
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
        this.reviewSuccessMsg = page.locator('#review-section .alert-success span, .alert-success').filter({ hasText: 'Thank you for your review.' });
    }

    readonly writeReviewHeader: Locator;
    readonly reviewNameInput: Locator;
    readonly reviewEmailInput: Locator;
    readonly reviewTextArea: Locator;
    readonly submitReviewButton: Locator;
    readonly reviewSuccessMsg: Locator;

    async clickProducts() {
        await this.productsLink.click();
    }

    async viewFirstProduct() {
        await this.firstProductViewLink.click();
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
        const responsePromise = this.page.waitForResponse(response => 
            response.url().includes('/add_to_cart') && response.status() === 200
        );
        
        await addToCart.click({ force: true }); 
        
        // Wait for the server to confirm the addition
        await responsePromise;
    }

    async clickContinueShopping() {
        await this.continueShoppingButton.waitFor({ state: 'visible' });
        await this.continueShoppingButton.click();
        // Ensure the modal and BACKDROP are gone before proceeding
        await this.page.locator('.modal-content').waitFor({ state: 'hidden' });
        await this.page.locator('.modal-backdrop').waitFor({ state: 'hidden' });
        await this.page.waitForTimeout(1000); // Increased safety buffer for session state syncing
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
        
        // Setup listener for the AJAX response BEFORE clicking
        const responsePromise = this.page.waitForResponse(response => 
            response.url().includes('/product_review/') && response.status() === 200
        );
        
        await this.submitReviewButton.click();
        
        // Wait for the server to confirm the submission
        await responsePromise;
    }
}
