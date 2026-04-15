import { Page, Locator } from '@playwright/test';

export class RegisterPage {
    readonly page: Page;
    
    // Initial Signup Locators
    readonly signupLoginLink: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly signupButton: Locator;

    // Account Details Locators
    readonly titleMr: Locator;
    readonly passwordInput: Locator;
    readonly daysSelect: Locator;
    readonly monthsSelect: Locator;
    readonly yearsSelect: Locator;
    readonly newsletterCheckbox: Locator;
    readonly offersCheckbox: Locator;
    
    // Address Details Locators
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly companyInput: Locator;
    readonly addressInput: Locator;
    readonly address2Input: Locator;
    readonly countrySelect: Locator;
    readonly stateInput: Locator;
    readonly cityInput: Locator;
    readonly zipcodeInput: Locator;
    readonly mobileInput: Locator;
    readonly createAccountBtn: Locator;

    // Post-Registration Locators
    readonly accountCreatedMsg: Locator;
    readonly continueBtn: Locator;
    readonly loggedInAsMsg: Locator;
    readonly deleteAccountBtn: Locator;
    readonly accountDeletedMsg: Locator;
    readonly logoutLink: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Initial Signup
        this.signupLoginLink = page.locator('a[href="/login"]');
        this.nameInput = page.locator('input[data-qa="signup-name"]');
        this.emailInput = page.locator('input[data-qa="signup-email"]');
        this.signupButton = page.locator('button[data-qa="signup-button"]');

        // Detailed Information
        this.titleMr = page.locator('#id_gender1');
        this.passwordInput = page.locator('#password');
        this.daysSelect = page.locator('#days');
        this.monthsSelect = page.locator('#months');
        this.yearsSelect = page.locator('#years');
        this.newsletterCheckbox = page.locator('#newsletter');
        this.offersCheckbox = page.locator('#optin');
        
        this.firstNameInput = page.locator('#first_name');
        this.lastNameInput = page.locator('#last_name');
        this.companyInput = page.locator('#company');
        this.addressInput = page.locator('#address1');
        this.address2Input = page.locator('#address2');
        this.countrySelect = page.locator('#country');
        this.stateInput = page.locator('#state');
        this.cityInput = page.locator('#city');
        this.zipcodeInput = page.locator('#zipcode');
        this.mobileInput = page.locator('#mobile_number');
        this.createAccountBtn = page.locator('button[data-qa="create-account"]');
        
        // Success & Delete Elements
        this.accountCreatedMsg = page.locator('h2[data-qa="account-created"]');
        this.continueBtn = page.locator('[data-qa="continue-button"]');
        this.loggedInAsMsg = page.locator('text=Logged in as'); 
        this.deleteAccountBtn = page.locator('a[href="/delete_account"]');
        this.accountDeletedMsg = page.locator('h2[data-qa="account-deleted"]');
        this.logoutLink = page.locator('a[href="/logout"]');
    }

    async navigate() {
        await this.page.goto('/');
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
        // Title & Basic Info
        await this.titleMr.click();
        await this.passwordInput.fill(details.password);
        
        // Date of Birth
        await this.daysSelect.selectOption(details.day);
        await this.monthsSelect.selectOption(details.month);
        await this.yearsSelect.selectOption(details.year);
        
        // Checkboxes
        if (details.newsletter) await this.newsletterCheckbox.check();
        if (details.offers) await this.offersCheckbox.check();
        
        // Address details
        await this.firstNameInput.fill(details.firstName);
        await this.lastNameInput.fill(details.lastName);
        if (details.company) await this.companyInput.fill(details.company);
        await this.addressInput.fill(details.address);
        if (details.address2) await this.address2Input.fill(details.address2);
        
        await this.countrySelect.selectOption(details.country);
        await this.stateInput.fill(details.state);
        await this.cityInput.fill(details.city);
        await this.zipcodeInput.fill(details.zipcode);
        await this.mobileInput.fill(details.mobile);
    }

    async clickCreateAccount() {
        await this.createAccountBtn.click();
    }
    
    async clickContinue() {
        await this.continueBtn.click();
    }
    
    async clickDeleteAccount() {
        await this.deleteAccountBtn.click();
    }

    async clickLogout() {
        await this.logoutLink.click();
    }
}