import { Page, Locator } from '@playwright/test';

export class RegisterPage {
    readonly page: Page;
    // Initial Signup Locators
    readonly signupLoginLink: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly signupButton: Locator;

    // Account Details Locators
    readonly passwordInput: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly addressInput: Locator;
    readonly countrySelect: Locator;
    readonly stateInput: Locator;
    readonly cityInput: Locator;
    readonly zipcodeInput: Locator;
    readonly mobileInput: Locator;
    readonly createAccountBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        // Initial Signup
        this.signupLoginLink = page.locator('a[href="/login"]');
        this.nameInput = page.locator('input[data-qa="signup-name"]');
        this.emailInput = page.locator('input[data-qa="signup-email"]');
        this.signupButton = page.locator('button[data-qa="signup-button"]');

        // Detailed Information
        this.passwordInput = page.locator('#password');
        this.firstNameInput = page.locator('#first_name');
        this.lastNameInput = page.locator('#last_name');
        this.addressInput = page.locator('#address1');
        this.countrySelect = page.locator('#country');
        this.stateInput = page.locator('#state');
        this.cityInput = page.locator('#city');
        this.zipcodeInput = page.locator('#zipcode');
        this.mobileInput = page.locator('#mobile_number');
        this.createAccountBtn = page.locator('button[data-qa="create-account"]');
    }

    async navigate() {
        await this.page.goto('https://automationexercise.com/');
    }

    async clickSignupLogin() {
        await this.signupLoginLink.click();
    }

    async fillSignupDetails(name: string, email: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.signupButton.click();
    }

    async fillAccountInformation(details: any) {
        await this.passwordInput.fill(details.password);
        await this.firstNameInput.fill(details.firstName);
        await this.lastNameInput.fill(details.lastName);
        await this.addressInput.fill(details.address);
        await this.countrySelect.selectOption(details.country);
        await this.stateInput.fill(details.state);
        await this.cityInput.fill(details.city);
        await this.zipcodeInput.fill(details.zipcode);
        await this.mobileInput.fill(details.mobile);
    }

    async clickCreateAccount() {
        await this.createAccountBtn.click();
    }
}