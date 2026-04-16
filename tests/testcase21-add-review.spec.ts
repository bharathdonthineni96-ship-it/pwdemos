import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';

test('Test Case 21: Add Review on Product', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);

    // 1. Launch browser & 2. Navigate to url 'http://automationexercise.com'
    await homePage.navigate();

    // 3. Click on 'Products' button
    await homePage.clickProducts();

    // 4. Verify user is navigated to ALL PRODUCTS page successfully
    await expect(page).toHaveURL(/.*\/products/);
    await expect(productsPage.allProductsHeader).toBeVisible();

    // 5. Click on 'View Product' button
    await productsPage.viewFirstProduct();

    // 6. Verify 'Write Your Review' is visible
    await expect(productsPage.writeReviewHeader).toBeVisible();
    await expect(productsPage.writeReviewHeader).toContainText('Write Your Review');

    // 7. Enter name, email and review
    // 8. Click 'Submit' button
    await productsPage.submitReview('Test User', 'testuser@example.com', 'This is a great product! Highly recommended.');

    // 9. Verify success message 'Thank you for your review.'
    await expect(productsPage.reviewSuccessMsg).toBeVisible();
    await expect(productsPage.reviewSuccessMsg).toContainText('Thank you for your review.');
});
