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
}
