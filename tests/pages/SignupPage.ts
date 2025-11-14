import { Page, Locator, expect } from "@playwright/test";
import type { SignupFormData } from "../types/signup.types";
import type { LocaleConfig } from "../types/locale.types";

/**
 * Test IDs that are consistent across all locales
 */
const TEST_IDS = {
  firstName: "first-name-input",
  lastName: "last-name-input",
  phoneNumber: "phoneInput",
  province: "region-select",
  email: "email-input",
  password: "password-input",
  confirmPassword: "passwordConfirmation-input",
  submitButton: "submit-button",
  firstNameErrorMessage: "first-name-error-message-typography",
  lastNameErrorMessage: "last-name-error-message-typography",
  phoneNumberErrorMessage: "phone-error-message-typography",
  provinceErrorMessage: "province-error-message-typography",
  emailErrorMessage: "email-error-message-typography",
  passwordErrorMessage: "password-error-message-typography",
  confirmPasswordErrorMessage: "passwordConfirmation-error-message-typography",
  loginButton: "header-login-button",
  languageSwitch: "header-language-switch",
  termsOfServiceLink: "terms-link",
} as const;

export class SignupPage {
  readonly page: Page;
  readonly locale: LocaleConfig;

  // Form fields
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly provinceSelect: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly partnerContactCheckbox: Locator;
  readonly submitButton: Locator;
  readonly firstNameErrorMessage: Locator;
  readonly lastNameErrorMessage: Locator;
  readonly phoneNumberErrorMessage: Locator;
  readonly provinceErrorMessage: Locator;
  readonly emailErrorMessage: Locator;
  readonly passwordErrorMessage: Locator;
  readonly confirmPasswordErrorMessage: Locator;
  

  // Labels and text elements
  readonly heading: Locator;
  readonly passwordRequirementText: Locator;
  readonly loginLink: Locator;
  readonly loginButton: Locator;
  readonly termsOfServiceLink: Locator;
  readonly privacyPolicyLink: Locator;
  readonly languageSwitch: Locator;

  constructor(page: Page, locale: LocaleConfig) {
    this.page = page;
    this.locale = locale;

    // Initialize form fields using test IDs (same for all locales)
    this.firstNameInput = page.getByTestId(TEST_IDS.firstName);
    this.lastNameInput = page.getByTestId(TEST_IDS.lastName);
    this.phoneNumberInput = page.getByTestId(TEST_IDS.phoneNumber);
    this.provinceSelect = page.getByTestId(TEST_IDS.province);
    this.emailInput = page.getByTestId(TEST_IDS.email);
    this.passwordInput = page.getByTestId(TEST_IDS.password);
    this.confirmPasswordInput = page.getByTestId(TEST_IDS.confirmPassword);
    this.submitButton = page.getByTestId(TEST_IDS.submitButton);
    this.partnerContactCheckbox = page
      .locator('input[type="checkbox"]')
      .first();

    // Initialize labels and text elements (locale-specific)
    this.heading = page.getByRole("heading", { name: locale.signup.heading });
    this.passwordRequirementText = page.getByText(
      locale.signup.passwordRequirement
      );
    this.loginButton = page.getByTestId(TEST_IDS.loginButton);
    this.loginLink = page.getByRole("link", {
      name: new RegExp(locale.signup.loginLink, "i"),
    });
    this.languageSwitch = page.getByTestId(TEST_IDS.languageSwitch);
    this.termsOfServiceLink = page.getByTestId(TEST_IDS.termsOfServiceLink);
    this.privacyPolicyLink = page.getByText(new RegExp(locale.signup.privacyPolicy, "i"));

    this.firstNameErrorMessage = page.getByTestId(
      TEST_IDS.firstNameErrorMessage
    );
    this.lastNameErrorMessage = page.getByTestId(TEST_IDS.lastNameErrorMessage);
    this.phoneNumberErrorMessage = page.getByTestId(
      TEST_IDS.phoneNumberErrorMessage
    );
    this.provinceErrorMessage = page.getByTestId(TEST_IDS.provinceErrorMessage);
    this.emailErrorMessage = page.getByTestId(TEST_IDS.emailErrorMessage);
    this.passwordErrorMessage = page.getByTestId(TEST_IDS.passwordErrorMessage);
    this.confirmPasswordErrorMessage = page.getByTestId(
      TEST_IDS.confirmPasswordErrorMessage
    );
  }

  /**
   * Navigates to the signup page and waits for it to load
   */
  async goto(): Promise<void> {
    await this.page.goto(this.locale.urls.signup);
    await this.waitForPageLoad();
  }

  /**
   * Waits for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await expect(this.heading).toBeVisible();
  }

  /**
   * Fills the entire signup form
   */
  async fillForm(data: SignupFormData): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.phoneNumberInput.fill(data.phoneNumber);
    await this.provinceSelect.selectOption(data.province);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.confirmPassword);

    if (data.partnerContact) {
      await this.partnerContactCheckbox.check();
    }
  }

  /**
   * Fills only the first name field
   */
  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  /**
   * Fills only the last name field
   */
  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  /**
   * Fills only the phone number field
   */
  async fillPhoneNumber(phoneNumber: string): Promise<void> {
    await this.phoneNumberInput.fill(phoneNumber);
  }

  /**
   * Selects a province
   */
  async selectProvince(province: string): Promise<void> {
    await this.provinceSelect.selectOption(province);
  }

  /**
   * Fills only the email field
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Fills only the password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Fills only the confirm password field
   */
  async fillConfirmPassword(password: string): Promise<void> {
    await this.confirmPasswordInput.fill(password);
  }

  /**
   * Checks the partner contact checkbox
   */
  async checkPartnerContact(): Promise<void> {
    await this.partnerContactCheckbox.check();
  }

  /**
   * Unchecks the partner contact checkbox
   */
  async uncheckPartnerContact(): Promise<void> {
    await this.partnerContactCheckbox.uncheck();
  }

  /**
   * Submits the form
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Gets the current value of first name field
   */
  async getFirstName(): Promise<string> {
    return await this.firstNameInput.inputValue();
  }

  /**
   * Gets the current value of last name field
   */
  async getLastName(): Promise<string> {
    return await this.lastNameInput.inputValue();
  }

  /**
   * Gets the current value of email field
   */
  async getEmail(): Promise<string> {
    return await this.emailInput.inputValue();
  }

  /**
   * Gets the current value of phone number field
   */
  async getPhoneNumber(): Promise<string> {
    return await this.phoneNumberInput.inputValue();
  }

  /**
   * Gets the selected province value
   */
  async getSelectedProvince(): Promise<string> {
    // Use evaluate to get the selected option text directly
    const selectedText = await this.provinceSelect.evaluate(
      (select: HTMLSelectElement) => {
        const selectedOption = select.options[select.selectedIndex];
        return selectedOption ? selectedOption.textContent?.trim() || "" : "";
      }
    );

    return selectedText;
  }

  /**
   * Checks if partner contact checkbox is checked
   */
  async isPartnerContactChecked(): Promise<boolean> {
    return await this.partnerContactCheckbox.isChecked();
  }

  /**
   * Validates all form fields are visible
   */
  async validateFormFieldsVisible(): Promise<void> {
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.phoneNumberInput).toBeVisible();
    await expect(this.provinceSelect).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  /**
   * Validates all labels are displayed correctly
   */
  async validateLabels(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.passwordRequirementText).toBeVisible();
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.phoneNumberInput).toBeVisible();
    await expect(this.provinceSelect).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
  }

  /**
   * Validates form is empty (all fields have empty values)
   */
  async validateFormIsEmpty(): Promise<void> {
    await expect(this.firstNameInput).toHaveValue("");
    await expect(this.lastNameInput).toHaveValue("");
    await expect(this.emailInput).toHaveValue("");
  }

  /**
   * Clears all form fields
   */
  async clearForm(): Promise<void> {
    await this.firstNameInput.clear();
    await this.lastNameInput.clear();
    await this.phoneNumberInput.clear();
    await this.emailInput.clear();
    await this.passwordInput.clear();
    await this.confirmPasswordInput.clear();
    await this.uncheckPartnerContact();
  }

  /**
   * Clicks the login link
   */
  async clickLoginLink(): Promise<void> {
    await this.loginLink.click();
  }

  /**
   * Clicks the login button
   */
  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Clicks the Terms of Service link
   */
  async clickTermsOfServiceLink(): Promise<void> {
    await this.termsOfServiceLink.click();
  }

  /**
   * Clicks the Privacy Policy link
   */
  async clickPrivacyPolicyLink(): Promise<void> {
    await this.privacyPolicyLink.click();
  }

  /**
   * Switches language (clicks FR or EN link)
   */
  async switchLanguage(language: "en" | "fr"): Promise<void> {
    await this.languageSwitch.click();
  }

  /**
   * Gets validation error messages (if any)
   */
  async getValidationErrors(): Promise<string[]> {
    const errors: string[] = [];

    // Look for common error indicators
    const errorSelectors = [
      '[role="alert"]',
      ".error",
      '[class*="error"]',
      '[class*="invalid"]',
    ];

    for (const selector of errorSelectors) {
      const elements = await this.page.locator(selector).all();
      for (const element of elements) {
        const text = await element.textContent();
        if (text && text.trim()) {
          errors.push(text.trim());
        }
      }
    }

    return errors;
  }

  /**
   * Verify the validation error message for the first name field
   */
  async verifyFirstNameErrorMessage(errorMessage: string): Promise<void> {
    await expect(this.firstNameErrorMessage).toContainText(errorMessage);
  }

  /**
   * Verify the validation error message for the last name field
   */
  async verifyLastNameErrorMessage(errorMessage: string): Promise<void> {
    await expect(this.lastNameErrorMessage).toContainText(errorMessage);
  }

  /**
   * Verify the validation error message for the phone number field
   */
  async verifyPhoneNumberErrorMessage(errorMessage: string): Promise<void> {
    await expect(this.phoneNumberErrorMessage).toContainText(errorMessage);
  }

  /**
   * Verify the validation error message for the province field
   */
  async verifyProvinceErrorMessage(errorMessage: string): Promise<void> {
    await expect(this.provinceErrorMessage).toContainText(errorMessage);
  }

  /**
   * Verify the validation error message for the email field
   */
  async verifyEmailErrorMessage(errorMessage: string): Promise<void> {
    await expect(this.emailErrorMessage).toContainText(errorMessage);
  }

  /**
   * Verify the validation error message for the password field
   */
  async verifyPasswordErrorMessage(errorMessage: string): Promise<void> {
    await expect(this.passwordErrorMessage).toContainText(errorMessage);
  }

  /**
   * Verify the validation error message for the confirm password field
   */
  async verifyConfirmPasswordErrorMessage(errorMessage: string): Promise<void> {
    await expect(this.confirmPasswordErrorMessage).toContainText(errorMessage);
  }

  /**
   * Checks if form submission was successful (by URL change or success message)
   */
  async isSubmissionSuccessful(): Promise<boolean> {
    const currentUrl = this.page.url();

    // Check if URL changed (not on signup page anymore)
    if (!currentUrl.includes("/signup")) {
      return true;
    }

    // Check for success indicators
    const successIndicators = [
      this.page.getByText(/success/i),
      this.page.getByText(/account created/i),
      this.page.getByText(/welcome/i),
    ];

    for (const indicator of successIndicators) {
      try {
        const isVisible = await indicator.isVisible({ timeout: 1000 });
        if (isVisible) {
          return true;
        }
      } catch {
        // Continue checking
      }
    }

    return false;
  }
}
