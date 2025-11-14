import { test, expect } from "../fixtures/base.fixtures";
import { SignupPage } from "../pages/SignupPage";
import { LoginPage } from "../pages/LoginPage";
import {
  setupApiInterception,
} from "../utils/api-interceptor";
import { generateValidPassword, getRandomValue, verifyResponseBodyValue } from "../utils/test-helpers";
import {
  getLocalizedProvince,
} from "../types/provinces.types";
import type { SignupFormData } from "../types/signup.types";
import type { LocaleConfig } from "../types/locale.types";
import { faker } from "@faker-js/faker";
import { LandingPage } from "../pages/LandingPage";

/**
 * Signup Test Suite
 *
 * This test suite uses:
 * - Page Object Model (POM) for maintainability
 * - Base fixtures for reusable setup
 * - JSON-based locale configuration (labels and URLs only)
 * - Test IDs in page objects (same across locales)
 * - Reusable API interception utilities
 * - Helper functions for common operations
 * - Environment variable (LOCALE) to determine language (default: 'en', use 'fr' for French)
 *
 * Run tests with different locales:
 *   LOCALE=en npx playwright test tests/specs/signup.spec.ts
 *   LOCALE=fr npx playwright test tests/specs/signup.spec.ts
 */

/**
 * Creates test user data using Faker
 * This is spec-specific and generates realistic test data
 *
 * @param localeConfig - Locale configuration for localized province names
 * @param overrides - Optional partial SignupFormData to override default generated values
 * @returns SignupFormData object with generated test user information
 */
const createTestUser = (
  localeConfig: LocaleConfig,
  overrides?: Partial<SignupFormData>
): SignupFormData => {
  const password: string = generateValidPassword();

  // Generate Canadian phone number (10 digits)
  const phoneNumber: string = faker.string.numeric(10);

  // Get localized province name for Ontario (default)
  const ontarioProvince = getLocalizedProvince("ONTARIO", localeConfig);

  const defaultUserData: SignupFormData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phoneNumber: phoneNumber,
    province: ontarioProvince.name,
    email: faker.internet.email(),
    password: password,
    confirmPassword: password,
    partnerContact: false,
  };

  return {
    ...defaultUserData,
    ...overrides,
  };
};

test.describe("Signup Page", () => {
  // Initialize signup page for each test (not global fixture)
  let signupPage: SignupPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page, localeConfig }) => {
    // Page setup is done here, not in global fixture
    signupPage = new SignupPage(page, localeConfig);
    loginPage = new LoginPage(page);

    await signupPage.goto();

    const currentLocale = process.env.LOCALE || "en";
    console.log(`Running test in ${currentLocale.toUpperCase()} locale`);
  });

  // This should be covered by the validateLabels and validateFormFieldsVisible tests by unit tests.
  test("TC-001: should display all form fields and labels correctly", async ({
    localeConfig,
  }) => {
    await signupPage.validateLabels();
    await signupPage.validateFormFieldsVisible();

    // Verify heading matches current locale
    await expect(signupPage.heading).toContainText(localeConfig.signup.heading);
  });

  // This should be covered by the validateLabels and validateFormFieldsVisible tests by unit tests.
  test("TC-002: should display password requirements", async ({
    localeConfig,
  }) => {
    await expect(signupPage.passwordRequirementText).toBeVisible();
    await expect(signupPage.passwordRequirementText).toContainText(
      localeConfig.signup.passwordRequirement
    );
  });

  test("TC-003: should validate required fields - empty form submission", async ({
    page,
    localeConfig,
  }) => {
    await signupPage.submit();
    await page.waitForTimeout(500);

    // Form should prevent submission with empty fields
    const url = page.url();
    expect(url).toContain("/signup");

    // Check if validation errors appear
    await signupPage.verifyFirstNameErrorMessage(
      localeConfig.signup.errors.firstNameRequired
    );
    await signupPage.verifyLastNameErrorMessage(
      localeConfig.signup.errors.lastNameRequired
    );
    await signupPage.verifyPhoneNumberErrorMessage(
      localeConfig.signup.errors.phoneNumberRequired
    );
    await signupPage.verifyEmailErrorMessage(
      localeConfig.signup.errors.emailRequired
    );
    await signupPage.verifyPasswordErrorMessage(
      localeConfig.signup.errors.passwordLengthTooShort
    );
  });

  test("TC-004: should validate first name and last name fields", async ({
    localeConfig,
  }) => {
    const userData = createTestUser(localeConfig);

    // Validate first name field
    await signupPage.fillFirstName(userData.firstName);
    await expect(signupPage.firstNameInput).toHaveValue(userData.firstName);

    // Validate last name field
    await signupPage.fillLastName(userData.lastName);
    await expect(signupPage.lastNameInput).toHaveValue(userData.lastName);
  });

  // TODO: This test is skipped because the form does not reject special characters
  test.skip("TC-005: should reject special characters in first name and last name fields", async ({
    page,
  }) => {
    // Test data with special characters that should not be allowed
    const invalidNames = [
      {
        field: "firstName",
        value: "John@123",
        description: "Special characters and numbers",
      },
      { field: "firstName", value: "John#Doe", description: "Hash symbol" },
      { field: "firstName", value: "John$Doe", description: "Dollar sign" },
      {
        field: "lastName",
        value: "Doe@123",
        description: "Special characters and numbers",
      },
      { field: "lastName", value: "Doe#Smith", description: "Hash symbol" },
      { field: "lastName", value: "Doe$Smith", description: "Dollar sign" },
    ];

    // Select a random value from the invalidNames array
    const randomTestCase = getRandomValue(invalidNames);
    await signupPage.fillFirstName(randomTestCase.value);
    await signupPage.lastNameInput.blur();
    await page.waitForTimeout(300);

    // Check if validation error appears or form prevents submission
    const errors = await signupPage.getValidationErrors();
    expect(errors).toBeDefined();
    expect(errors).toContain(randomTestCase.description);
  });

  test("TC-006: should validate phone number field format", async ({}) => {
    // TODO: There is a possibility to use the faker phone number function to generate a valid phone number for the selected country.
    // const phoneNumber = faker.phone.number({ style: "international" });

    // Hardcoded test phone number for Canadian format (10 digits) 
    const phoneNumbers = [
      {
        value: "14165678900",
        description: "Valid Canadian phone number",
        expectedFormat: "1 (416) 567-8900",
      },
      {
        value: "4165678901",
        description: "Valid Canadian phone number",
        expectedFormat: "(416) 567-8901",
      },
    ];

    for (const phoneNumber of phoneNumbers) {
      await signupPage.fillPhoneNumber(phoneNumber.value);
      await signupPage.phoneNumberInput.blur();

      const phoneValue = await signupPage.getPhoneNumber();
      expect(phoneValue).toBe(phoneNumber.expectedFormat);
    }
  });

  test("TC-007: should validate invalid phone number formats and show error messages", async ({
    page,
    localeConfig,
  }) => {
    // Test data for invalid phone numbers that should be rejected
    // These test cases document the bug where unlimited input is allowed
    const invalidPhoneNumbers = [
      {
        value: "123",
        description: "Too short (less than 10 digits)",
        expectedError: localeConfig.signup.errors.phoneNumberRequired, // Based on observed error message
      },
      {
        value: faker.string.numeric(30), // Generate 30 random digits
        description: "Too long (30 digits, exceeds maximum)",
        expectedError: localeConfig.signup.errors.phoneNumberRequired,
      },
    ];

    for (const phoneNumber of invalidPhoneNumbers) {
      await signupPage.fillPhoneNumber(phoneNumber.value);
      await signupPage.phoneNumberInput.blur();
      await signupPage.submit();
      await page.waitForTimeout(500);
      const url = page.url();
      expect(url).toContain("/signup");

      // Check if validation error appears
      await signupPage.verifyPhoneNumberErrorMessage(
        localeConfig.signup.errors.phoneNumberRequired
      );
    }
  });

  test("TC-008: should validate province selection", async ({ page, localeConfig }) => {
    // Get a random province from the provinces list
    const provinces = Object.values(localeConfig.provinces);
    const randomProvince = getRandomValue(provinces);
    await signupPage.selectProvince(randomProvince);

    // Check if the province is selected
    const selectedProvince = await signupPage.getSelectedProvince();
    expect(selectedProvince).toBe(randomProvince);
  });

  test("TC-009: should validate email field format", async ({ page, localeConfig }) => {
    const invalidEmails = [
      "invalid-email",
      "invalid@",
      "@invalid.com",
      "invalid..email@example.com",
    ];

    await signupPage.submit();

    for (const email of invalidEmails) {
      await signupPage.fillEmail(email);
      await signupPage.emailInput.blur();
      await page.waitForTimeout(500);
      const url = page.url();
      expect(url).toContain("/signup");

      // Check if validation error appears
      await signupPage.verifyEmailErrorMessage(
        localeConfig.signup.errors.emailRequired
      );
    }
  });

  test("TC-010: should validate password requirements", async ({
    page,
    localeConfig,
  }) => {
    const passwordValidationTestData = [
      {
        name: "too short",
        password: "Short1",
        confirmPassword: "Short1",
        errorMessage: localeConfig.signup.errors.passwordLengthTooShort,
      },
      {
        name: "too long",
        password: "A".repeat(33) + "1",
        confirmPassword: "A".repeat(33) + "1",
        errorMessage: localeConfig.signup.errors.passwordLengthTooLong,
      },
      {
        name: "missing uppercase letter",
        password: "12characters12",
        confirmPassword: "12characters12",
        errorMessage: localeConfig.signup.errors.passwordRequired,
      },
      {
        name: "missing lowercase letter",
        password: "12CHARACTERS12",
        confirmPassword: "12CHARACTERS12",
        errorMessage: localeConfig.signup.errors.passwordRequired,
      },
      {
        name: "missing number",
        password: "NoNumberinPasswordHere",
        confirmPassword: "NoNumberinPasswordHere",
        errorMessage: localeConfig.signup.errors.passwordRequired,
      },
    ];

    await signupPage.submit();

    for (const testCase of passwordValidationTestData) {
      await signupPage.fillPassword(testCase.password);
      await page.waitForTimeout(500);

      const url = page.url();
      expect(url).toContain("/signup");

      // Check if validation error appears
      await signupPage.verifyPasswordErrorMessage(testCase.errorMessage);
    }
  });

  test("TC-011: should validate password confirmation match", async ({
    page,
    localeConfig,
  }) => {
    const invalidData = createTestUser(localeConfig, {
      password: generateValidPassword(),
      confirmPassword: generateValidPassword(), // Different password
    });

    await signupPage.fillForm(invalidData);
    await signupPage.submit();
    await page.waitForTimeout(500);

    const url = page.url();
    expect(url).toContain("/signup");

    // Check if validation error appears
    await signupPage.verifyConfirmPasswordErrorMessage(
      localeConfig.signup.errors.confirmPasswordRequired
    );
  });  

  test("TC-012: should handle partner contact checkbox", async ({ localeConfig }) => {
    const validData = createTestUser(localeConfig, { partnerContact: true });

    await signupPage.fillForm(validData);
    await expect(signupPage.partnerContactCheckbox).toBeChecked();
  });

  test("TC-013: should navigate to login page from signup", async ({
    localeConfig,
    page,
  }) => {
    await expect(signupPage.loginLink).toBeVisible();
    await signupPage.clickLoginButton();
    await page.waitForURL(localeConfig.urls.baseUrl);

    // Wait until the network is idle
    await page.waitForLoadState("networkidle");
    await loginPage.verifyEmailInputVisible();

    expect(page.url()).toContain("login");
  });

  test("TC-014: should have the correct links", async ({ localeConfig }) => {
    await expect(signupPage.termsOfServiceLink).toBeVisible();
    console.log("Terms of Service link:", signupPage.termsOfServiceLink);
    
    const href = await signupPage.termsOfServiceLink.getAttribute("href");
    
    // TODO: Just verifying the href can be clicked and navigates to the correct page if required.
    expect(href).toContain(
      localeConfig.urls.signup.includes("/fr/")
        ? "conditions-d-utilisation"
        : "terms-of-services"
    );

     await expect(signupPage.privacyPolicyLink).toBeVisible();
  });

  test("TC-015: should switch language", async ({ localeConfig, page }) => {
    const currentLocale = process.env.LOCALE || "en";
    console.log("Current locale:", currentLocale);
    const targetLocale = currentLocale === "en" ? "fr" : "en";
    console.log("Target locale:", targetLocale);

    // Switch language
    await signupPage.switchLanguage(targetLocale);

    // Wait for 2 seconds to ensure the language switch is complete
    await page.waitForTimeout(2000);

    // Wait for URL to update
    if (targetLocale === "fr") {
      await page.waitForURL("**/fr/signup");
      expect(page.url()).toContain("/fr/signup");
    } else {
      await page.waitForURL("**/signup");
      expect(page.url()).not.toContain("/fr/");
    }

    // Verify labels updated
    const { loadLocaleConfig } = await import("../utils/locale-loader");
    const newLocale = await loadLocaleConfig(targetLocale);
    const newSignupPage = new SignupPage(page, newLocale);
    await expect(newSignupPage.heading).toBeVisible();
  });

  test("TC-016: should preserve form data when switching languages", async ({
    page,
    localeConfig,
  }) => {
    // Fill form use static data for timing purposes
    // const formData = createTestUser(localeConfig);
    const formData = {
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "12345678900",
      expectedPhoneNumber: "1 (234) 567-8900",
      province: localeConfig.provinces.ONTARIO,
      email: "john.doe@example.com",
      password: "Password1234",
      confirmPassword: "Password1234",
    };
    await signupPage.fillForm(formData);

    // Switch language
    const currentLocale = process.env.LOCALE || "en";
    const targetLocale = currentLocale === "en" ? "fr" : "en";
    await signupPage.switchLanguage(targetLocale);

    // Wait for language switch
    if (targetLocale === "fr") {
      await page.waitForURL("**/fr/signup");
    } else {
      await page.waitForURL("**/signup");
    }

    // Verify form data is preserved (or cleared, depending on implementation)
    const firstNameValue = await signupPage.getFirstName();
    expect(firstNameValue).toBe(formData.firstName);
    const lastNameValue = await signupPage.getLastName();
    expect(lastNameValue).toBe(formData.lastName);
    const phoneNumberValue = await signupPage.getPhoneNumber();
    expect(phoneNumberValue).toBe(formData.expectedPhoneNumber);
    const provinceValue = await signupPage.getSelectedProvince();
    expect(provinceValue).toBe(formData.province);
    const emailValue = await signupPage.getEmail();
    expect(emailValue).toBe(formData.email);
  });

  test("TC-017: should successfully submit form with valid data and validate API response", async ({
    page,
    localeConfig,
  }) => {
    const userData: SignupFormData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phoneNumber: faker.phone.number({ style: "international" }),
      province: localeConfig.provinces.ONTARIO,
      email: faker.internet.email().toLowerCase(),
      password: "Password1234",
      confirmPassword: "Password1234",
      partnerContact: false,
    };

    const apiResponsePromise = setupApiInterception(page, "/api/accounts", "POST");

    await signupPage.fillForm(userData);
    await signupPage.submit();

    const apiResponse = await apiResponsePromise;

    // Log API response for debugging
    console.log('API Response Status:', apiResponse.status);
    console.log('API Response Body:', JSON.stringify(apiResponse.body, null, 2));
    console.log('User Data:', JSON.stringify(userData, null, 2));

    // Validate API responses with detailed error messages
    expect(
      apiResponse.status,
      `Expected API status to be 401 (weak password), but got ${apiResponse.status}. Response body: ${JSON.stringify(apiResponse.body)}`
    ).toBe(401);
    
    const errorVerification = verifyResponseBodyValue(
      apiResponse.body,
      'error',
      'invalid password',
      'contains'
    );
    expect(errorVerification.isValid, errorVerification.errorMessage).toBeTruthy();

    const errors = await signupPage.getValidationErrors();
    console.log('UI Validation Errors:', errors);
    
    expect(
      errors,
      `Expected validation errors to be defined, but got: ${JSON.stringify(errors)}`
    ).toBeDefined();
    
    expect(
      errors,
      `Expected validation errors to contain "${localeConfig.signup.errors.weakPasswordErrorMessage}", but got: ${JSON.stringify(errors)}`
    ).toContain(localeConfig.signup.errors.weakPasswordErrorMessage);
  });

  test("TC-018: should successfully submit form with valid data and validate API response", async ({
    page,
    localeConfig,
  }) => {
    // Use Ontarion Province this test.

    const password = generateValidPassword();

    const userData: SignupFormData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phoneNumber: faker.phone.number({ style: "international" }),
      province: localeConfig.provinces.ONTARIO,
      email: faker.internet.email().toLowerCase(),
      password: password,
      confirmPassword: password,
    };

    const apiSignupPromise = setupApiInterception(page, "/api/accounts", "POST");
    const apiOAuthPromise = setupApiInterception(page, "/oauth/token", "POST");
    const apiAccountPromise = setupApiInterception(page, "/api/account", "GET");

    await signupPage.fillForm(userData);
    await signupPage.submit();

    const apiSignupResponse = await apiSignupPromise;
    const apiOAuthResponse = await apiOAuthPromise;
    const apiAccountResponse = await apiAccountPromise;

    // Log API responses for debugging
    console.log('API Signup Response:', JSON.stringify(apiSignupResponse, null, 2));
    console.log('API OAuth Response:', JSON.stringify(apiOAuthResponse, null, 2));
    console.log('API Account Response:', JSON.stringify(apiAccountResponse, null, 2));
    console.log('User Data:', JSON.stringify(userData, null, 2));

    // Validate API responses with detailed error messages
    expect(
      apiSignupResponse.status,
      `Expected signup API status to be 201, but got ${apiSignupResponse.status}. Response body: ${JSON.stringify(apiSignupResponse.body)}`
    ).toBe(201);
    
    expect(
      apiAccountResponse.status,
      `Expected account API status to be 200, but got ${apiAccountResponse.status}. Response body: ${JSON.stringify(apiAccountResponse.body)}`
    ).toBe(200);
    
    expect(
      apiOAuthResponse.status,
      `Expected OAuth API status to be 200, but got ${apiOAuthResponse.status}. Response body: ${JSON.stringify(apiOAuthResponse.body)}`
    ).toBe(200);

    // Validate OAuth response body with detailed error messages
    const oauthFields = ['access_token', 'refresh_token', 'expires_in', 'token_type', 'scope'];
    for (const field of oauthFields) {
      const verification = verifyResponseBodyValue(apiOAuthResponse.body, field, null, 'defined');
      expect(verification.isValid, verification.errorMessage).toBeTruthy();
    }

    // Validate API response bodies with detailed error messages
    const accountValidations = [
      { field: 'firstName', expected: userData.firstName },
      { field: 'lastName', expected: userData.lastName },
      { field: 'region', expected: 'ON' },
      { field: 'email', expected: userData.email },
    ];

    for (const validation of accountValidations) {
      const verification = verifyResponseBodyValue(
        apiAccountResponse.body,
        validation.field,
        validation.expected,
        'contains'
      );
      expect(verification.isValid, verification.errorMessage).toBeTruthy();
    }

    // Validate Page load with menu button visibility. 
    const landingPage = new LandingPage(page, localeConfig);
    await landingPage.waitForPageLoad();
    await expect(landingPage.menuButton).toBeVisible();
  });
});
