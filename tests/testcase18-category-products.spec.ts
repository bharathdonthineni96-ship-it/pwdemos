import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { CategoryPage } from '../pages/category.page';

test('Test Case 18: View Category Products', async ({ page }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);

    // 1. Launch browser & 2. Navigate to url 'http://automationexercise.com'
    await homePage.navigate();

    // 3. Verify that categories are visible on left side bar
    await expect(categoryPage.categorySidebar).toBeVisible();

    // 4. Click on 'Women' category
    await categoryPage.clickWomenCategory();

    // 5. Click on any category link under 'Women' category, for example: Dress
    await categoryPage.clickSubCategory(0, 'Dress');

    // 6. Verify that category page is displayed and confirm text 'WOMEN - DRESS PRODUCTS'
    await expect(categoryPage.categoryPageTitle).toBeVisible();
    await expect(categoryPage.categoryPageTitle).toContainText(/WOMEN - DRESS PRODUCTS/i);

    // 7. On left side bar, click on 'Men' category
    await categoryPage.clickMenCategory();

    // 8. Click on any category link under 'Men' category, for example: Tshirts
    await categoryPage.clickSubCategory(1, 'Tshirts');

    // 9. Verify that user is navigated to that category page
    await expect(categoryPage.categoryPageTitle).toBeVisible();
    await expect(categoryPage.categoryPageTitle).toContainText(/MEN - TSHIRTS PRODUCTS/i);
});
