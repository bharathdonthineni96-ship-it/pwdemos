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
    }

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
        const product = this.productsList.locator('.single-products').nth(index);
        await product.scrollIntoViewIfNeeded();
        
        // Hover can be flaky, so we ensure the target is visible and then click.
        // Using dispatchEvent as a fallback to ensure the click reaches the element even if slightly obscured.
        await product.hover();
        const addToCart = product.locator('a.add-to-cart').filter({ hasText: 'Add to cart' }).first();
        await addToCart.waitFor({ state: 'visible', timeout: 5000 });
        await addToCart.dispatchEvent('click'); 
    }

    async clickContinueShopping() {
        await this.continueShoppingButton.waitFor({ state: 'visible' });
        await this.continueShoppingButton.click();
        // Ensure the modal is gone before proceeding
        await this.page.locator('.modal-content').waitFor({ state: 'hidden' });
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
}
