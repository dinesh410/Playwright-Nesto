/**
 * Locale configuration structure
 * Note: testIds are now in page objects since they're the same across locales
 */
export interface LocaleConfig {
  signup: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    province: string;
    email: string;
    password: string;
    confirmPassword: string;
    submitButton: string;
    heading: string;
    passwordRequirement: string;
    loginLink: string;
    termsOfService: string;
    privacyPolicy: string;
    alreadyHaveAccount: string;
    partnerContactCheckbox: string;
    errors: {
      firstNameRequired: string;
      lastNameRequired: string;
      phoneNumberRequired: string;
      provinceRequired: string;
      emailRequired: string;
      passwordRequired: string;
      passwordLengthTooShort: string;
      passwordLengthTooLong: string;
      confirmPasswordRequired: string;
      weakPasswordErrorMessage: string;
    };
  };
  provinces: {
    ONTARIO: string;
    QUEBEC: string;
    ALBERTA: string;
    BRITISH_COLUMBIA: string;
    MANITOBA: string;
    NEW_BRUNSWICK: string;
    NOVA_SCOTIA: string;
    NEWFOUNDLAND: string;
    PRINCE_EDWARD_ISLAND: string;
    SASKATCHEWAN: string;
    NORTHWEST_TERRITORIES: string;
    YUKON: string;
    NUNAVUT: string;
  };
  urls: {
    signup: string;
    baseUrl: string;
    login: string;
    termsOfService: string;
  };
}
