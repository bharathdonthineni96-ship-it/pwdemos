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
        
        // Hover to make the overlay visible
        await product.hover();
        
        // Use the button in the overlay as per standard flow, but wait for it to be visible
        const addToCartButton = product.locator('.product-overlay a.add-to-cart');
        await addToCartButton.waitFor({ state: 'visible' });
        await addToCartButton.click();
    }

    async clickContinueShopping() {
        await this.continueShoppingButton.click();
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
