# Test Cases - Nesto Signup Page

## Overview
This document consolidates all automated test cases for the Nesto signup page functionality. The test suite covers form validation, API integration, multi-language support, and user experience flows.

**Test Suite:** `tests/specs/signup.spec.ts`  
**Total Test Cases:** 19  
**Supported Locales:** English (en), French (fr)  
**Supported Environments:** Dev, QA, Staging

---

## Test Case Categories

### 1. UI/Display Tests
### 2. Field Validation Tests
### 3. Form Submission Tests
### 4. Navigation Tests
### 5. Language/Localization Tests
### 6. API Integration Tests

---

## Test Cases

### TC-001: Display All Form Fields and Labels Correctly
**Category:** UI/Display  
**Priority:** High  
**Description:** Verifies that all form fields and labels are displayed correctly on the signup page.

**Test Steps:**
1. Navigate to signup page
2. Verify all form fields are visible
3. Verify all labels are displayed correctly
4. Verify heading matches current locale

**Expected Results:**
- All form fields (firstName, lastName, phoneNumber, province, email, password, confirmPassword) are visible
- All labels match the locale configuration
- Page heading displays correct text for current locale

**Validation:**
- `validateLabels()` - Checks all labels
- `validateFormFieldsVisible()` - Checks all fields
- Heading text matches locale config

---

### TC-002: Display Password Requirements
**Category:** UI/Display  
**Priority:** Medium  
**Description:** Verifies that password requirements text is displayed on the signup page.

**Test Steps:**
1. Navigate to signup page
2. Verify password requirement text is visible
3. Verify text matches locale configuration

**Expected Results:**
- Password requirement text is visible
- Text content matches locale-specific password requirements

**Validation:**
- Password requirement element is visible
- Text contains locale-specific password requirement message

---

### TC-003: Validate Required Fields - Empty Form Submission
**Category:** Field Validation  
**Priority:** High  
**Description:** Verifies that the form prevents submission when all required fields are empty and displays appropriate error messages.

**Test Steps:**
1. Navigate to signup page
2. Click submit button without filling any fields
3. Wait for validation errors
4. Verify URL remains on signup page
5. Verify error messages for all required fields

**Expected Results:**
- Form does not submit
- URL remains on `/signup`
- Error messages appear for:
  - First name (required)
  - Last name (required)
  - Phone number (required)
  - Email (required)
  - Password (length too short)

**Validation:**
- URL contains "/signup"
- All required field error messages are displayed
- Error messages match locale configuration

---

### TC-004: Validate First Name and Last Name Fields
**Category:** Field Validation  
**Priority:** Medium  
**Description:** Verifies that first name and last name fields accept and store valid input correctly.

**Test Steps:**
1. Navigate to signup page
2. Enter valid first name
3. Verify first name value is stored
4. Enter valid last name
5. Verify last name value is stored

**Expected Results:**
- First name input accepts and stores the entered value
- Last name input accepts and stores the entered value
- Values match what was entered

**Test Data:**
- Uses Faker.js to generate realistic first and last names

---

### TC-005: Reject Special Characters in First Name and Last Name Fields
**Category:** Field Validation  
**Priority:** Medium  
**Status:** ⚠️ SKIPPED (Documents Bug)  
**Description:** Verifies that special characters are rejected in name fields. Currently skipped as the form accepts special characters (bug).

**Test Steps:**
1. Navigate to signup page
2. Enter name with special characters (e.g., "John@123", "Doe#Smith")
3. Verify validation error appears or form prevents submission

**Expected Results:**
- Special characters should be rejected
- Validation error should appear
- Form should prevent submission

**Current Behavior:**
- Form accepts special characters without validation (Bug #2)

**Test Data:**
- Invalid names: "John@123", "John#Doe", "John$Doe", "Doe@123", "Doe#Smith", "Doe$Smith"

---

### TC-006: Validate Phone Number Field Format
**Category:** Field Validation  
**Priority:** High  
**Description:** Verifies that phone number field correctly formats Canadian phone numbers.

**Test Steps:**
1. Navigate to signup page
2. Enter phone number with 11 digits (with country code)
3. Verify phone number is formatted correctly
4. Enter phone number with 10 digits (without country code)
5. Verify phone number is formatted correctly

**Expected Results:**
- "14165678900" formats to "1 (416) 567-8900"
- "4165678901" formats to "(416) 567-8901"

**Test Data:**
- Valid Canadian phone numbers with and without country code

---

### TC-007: Validate Invalid Phone Number Formats and Show Error Messages
**Category:** Field Validation  
**Priority:** High  
**Description:** Verifies that invalid phone number formats are rejected with appropriate error messages.

**Test Steps:**
1. Navigate to signup page
2. Enter phone number that is too short (e.g., "123")
3. Submit form
4. Verify error message appears
5. Enter phone number that is too long (e.g., 30 digits)
6. Submit form
7. Verify error message appears

**Expected Results:**
- Phone numbers that are too short (< 10 digits) show error message
- Phone numbers that are too long (> 11 digits) show error message
- Form does not submit
- URL remains on "/signup"

**Test Data:**
- Invalid phone numbers: "123" (too short), 30 random digits (too long)

**Current Behavior:**
- Documents bug where unlimited input is allowed (Bug #3)

---

### TC-008: Validate Province Selection
**Category:** Field Validation  
**Priority:** Medium  
**Description:** Verifies that province dropdown allows selection and stores the selected value.

**Test Steps:**
1. Navigate to signup page
2. Select a random province from dropdown
3. Verify selected province is stored correctly

**Expected Results:**
- Province dropdown is functional
- Selected province value matches what was selected
- Value is stored in form

**Test Data:**
- Random province selected from available provinces list

---

### TC-009: Validate Email Field Format
**Category:** Field Validation  
**Priority:** High  
**Description:** Verifies that invalid email formats are rejected with appropriate error messages.

**Test Steps:**
1. Navigate to signup page
2. Click submit to trigger validation
3. Enter invalid email formats
4. Verify error messages appear for each invalid format

**Expected Results:**
- Invalid email formats show error messages
- Form does not submit
- URL remains on "/signup"

**Test Data:**
- Invalid emails: "invalid-email", "invalid@", "@invalid.com", "invalid..email@example.com"

---

### TC-010: Validate Password Requirements
**Category:** Field Validation  
**Priority:** High  
**Description:** Verifies that password field enforces all password requirements and shows appropriate error messages.

**Test Steps:**
1. Navigate to signup page
2. Click submit to trigger validation
3. Test each password requirement violation:
   - Password too short (< 12 characters)
   - Password too long (> 32 characters)
   - Missing uppercase letter
   - Missing lowercase letter
   - Missing number

**Expected Results:**
- Each violation shows appropriate error message
- Form does not submit
- URL remains on "/signup"

**Test Data:**
- "Short1" - too short
- "A".repeat(33) + "1" - too long
- "12characters12" - missing uppercase
- "12CHARACTERS12" - missing lowercase
- "NoNumberinPasswordHere" - missing number

**Password Requirements:**
- Minimum 12 characters
- Maximum 32 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

---

### TC-011: Validate Password Confirmation Match
**Category:** Field Validation  
**Priority:** High  
**Description:** Verifies that password and confirm password fields must match.

**Test Steps:**
1. Navigate to signup page
2. Fill form with valid data
3. Enter different values in password and confirm password fields
4. Submit form
5. Verify error message appears

**Expected Results:**
- Error message appears when passwords don't match
- Form does not submit
- URL remains on "/signup"
- Error message matches locale configuration

**Test Data:**
- Valid password in password field
- Different valid password in confirm password field

---

### TC-012: Handle Partner Contact Checkbox
**Category:** Field Validation  
**Priority:** Low  
**Description:** Verifies that partner contact checkbox can be checked and stores the value correctly.

**Test Steps:**
1. Navigate to signup page
2. Fill form with valid data
3. Check partner contact checkbox
4. Verify checkbox is checked

**Expected Results:**
- Checkbox can be checked
- Checkbox state is stored correctly
- Form accepts checked state

**Test Data:**
- Valid form data with `partnerContact: true`

---

### TC-013: Navigate to Login Page from Signup
**Category:** Navigation  
**Priority:** Medium  
**Description:** Verifies that users can navigate from signup page to login page via the login link.

**Test Steps:**
1. Navigate to signup page
2. Verify login link is visible
3. Click login link/button
4. Wait for navigation
5. Verify login page is loaded

**Expected Results:**
- Login link is visible on signup page
- Clicking link navigates to login page
- URL contains "login"
- Login page email input is visible

**Validation:**
- URL contains "login"
- Login page email input is visible
- Page load state is complete

---

### TC-014: Verify Correct Links
**Category:** UI/Display  
**Priority:** Low  
**Description:** Verifies that Terms of Service and Privacy Policy links are present and have correct href attributes.

**Test Steps:**
1. Navigate to signup page
2. Verify Terms of Service link is visible
3. Verify href attribute contains correct path
4. Verify Privacy Policy link is visible

**Expected Results:**
- Terms of Service link is visible
- Privacy Policy link is visible
- Links have correct href attributes based on locale
  - English: "terms-of-services"
  - French: "conditions-d-utilisation"

**Validation:**
- Links are visible
- href attributes match locale-specific paths

---

### TC-015: Switch Language
**Category:** Language/Localization  
**Priority:** Medium  
**Description:** Verifies that language can be switched between English and French, and UI updates accordingly.

**Test Steps:**
1. Navigate to signup page in current locale
2. Switch to target locale (en ↔ fr)
3. Wait for language switch to complete
4. Verify URL updates correctly
5. Verify labels update to new locale

**Expected Results:**
- Language switch is functional
- URL updates to reflect new locale:
  - French: contains "/fr/signup"
  - English: does not contain "/fr/"
- Page heading and labels update to new locale
- All UI elements reflect new language

**Validation:**
- URL matches target locale pattern
- Page heading is visible and in correct language
- Locale configuration loads correctly

---

### TC-016: Preserve Form Data When Switching Languages
**Category:** Language/Localization  
**Priority:** Medium  
**Description:** Verifies that form data is preserved when switching between languages.

**Test Steps:**
1. Navigate to signup page
2. Fill form with test data
3. Switch language (en ↔ fr)
4. Wait for language switch
5. Verify all form fields retain their values

**Expected Results:**
- Form data is preserved after language switch
- All field values remain unchanged:
  - First name
  - Last name
  - Phone number (formatted)
  - Province selection
  - Email

**Test Data:**
- Static test data for consistent validation:
  - firstName: "John"
  - lastName: "Doe"
  - phoneNumber: "12345678900" (expected format: "1 (234) 567-8900")
  - province: Ontario
  - email: "john.doe@example.com"

**Validation:**
- All form field values match original input
- Phone number format is preserved

---

### TC-017: Verify Weak Password Error Message and Validate API Response
**Category:** API Integration  
**Priority:** High  
**Status:** ⚠️ Documents Bug  
**Description:** Verifies that weak passwords are rejected by API and appropriate error message is displayed. Documents bug where error message is too generic.

**Test Steps:**
1. Navigate to signup page
2. Set up API interception for `/api/accounts` POST request
3. Fill form with valid data but weak password ("Password1234")
4. Submit form
5. Wait for API response
6. Verify API response status is 401
7. Verify API response body contains error message
8. Verify UI displays weak password error message

**Expected Results:**
- API returns 401 status code
- API response body contains error: "invalid password"
- UI displays weak password error message
- Form does not submit successfully

**Current Behavior:**
- API returns generic error message "invalid password" (Bug #4)
- Error message is not user-friendly and doesn't explain why password was rejected
- New users may not understand what makes a password weak

**Test Data:**
- Valid form data with weak password: "Password1234"
- All other fields are valid

**API Validation:**
- Status code: 401
- Response body contains error field with "invalid password"
- UI error message matches locale configuration

---

### TC-018: Verify Successful Signup with Partner Contact Checked and Validate API Responses
**Category:** API Integration  
**Priority:** High  
**Description:** Verifies successful signup flow with partner contact checkbox checked, including API response validation.

**Test Steps:**
1. Navigate to signup page
2. Set up API interception for:
   - `/api/accounts` POST (signup)
   - `/oauth/token` POST (authentication)
   - `/api/account` GET (account details)
3. Fill form with valid data and check partner contact checkbox
4. Submit form
5. Wait for all API responses
6. Verify all API responses have correct status codes
7. Verify API response bodies contain expected data
8. Verify navigation to landing page

**Expected Results:**
- Signup API returns 201 status code
- OAuth API returns 200 status code with token data
- Account API returns 200 status code with user data
- OAuth response contains: access_token, refresh_token, expires_in, token_type, scope
- Account response contains: firstName, lastName, region (ON), email
- User is redirected to landing page
- Landing page menu button is visible

**Test Data:**
- Valid form data with strong password
- Province: Ontario
- partnerContact: true

**API Validation:**
- `/api/accounts` POST: 201 status
- `/oauth/token` POST: 200 status, all OAuth fields present
- `/api/account` GET: 200 status, all account fields match form data

---

### TC-019: Verify Successful Signup with Partner Contact Unchecked and Validate API Responses
**Category:** API Integration  
**Priority:** High  
**Description:** Verifies successful signup flow with partner contact checkbox unchecked, including API response validation.

**Test Steps:**
1. Navigate to signup page
2. Set up API interception for:
   - `/api/accounts` POST (signup)
   - `/oauth/token` POST (authentication)
   - `/api/account` GET (account details)
3. Fill form with valid data and leave partner contact checkbox unchecked
4. Submit form
5. Wait for all API responses
6. Verify all API responses have correct status codes
7. Verify API response bodies contain expected data
8. Verify navigation to landing page

**Expected Results:**
- Signup API returns 201 status code
- OAuth API returns 200 status code with token data
- Account API returns 200 status code with user data
- OAuth response contains: access_token, refresh_token, expires_in, token_type, scope
- Account response contains: firstName, lastName, region (ON), email
- User is redirected to landing page
- Landing page menu button is visible

**Test Data:**
- Valid form data with strong password
- Province: Ontario
- partnerContact: false

**API Validation:**
- `/api/accounts` POST: 201 status
- `/oauth/token` POST: 200 status, all OAuth fields present
- `/api/account` GET: 200 status, all account fields match form data

---

### TC-020: Verify Signup with Existing User Email and Validate API Response
**Category:** API Integration  
**Priority:** High  
**Status:** ⚠️ Documents Bug  
**Description:** Verifies that attempting to signup with an existing email address is rejected with appropriate error message. Documents bug where error message is too generic.

**Test Steps:**
1. Navigate to signup page
2. Set up API interception for `/api/accounts` POST request
3. Fill form with valid data but use an existing email address
4. Submit form
5. Wait for API response
6. Verify API response status is 409 (Conflict)
7. Verify API response body contains error message
8. Verify form remains on signup page (no redirect)

**Expected Results:**
- API returns 409 status code (Conflict)
- API response body contains error message indicating duplicate email
- Error message should be user-friendly and explain the issue clearly
- Form does not submit successfully
- User remains on signup page

**Current Behavior:**
- API returns generic error message "duplicate entity" (Bug #5)
- Error message is not user-friendly and doesn't clearly explain that the email is already registered
- New users may not understand what "duplicate entity" means

**Test Data:**
- Valid form data with strong password
- Email: "test@example.com" (pre-existing email in database)
- Province: Ontario
- partnerContact: false

**API Validation:**
- Status code: 409
- Response body contains error field with "duplicate entity"

**Note:**
- This test requires a pre-existing user with email "test@example.com" in the database
- Static email is used for testing purposes

---

## Test Execution Summary

### Test Coverage by Category

| Category | Test Cases | Status |
|----------|-----------|--------|
| UI/Display | 3 | ✅ All Passing |
| Field Validation | 8 | ✅ 7 Passing, 1 Skipped (Bug) |
| Navigation | 1 | ✅ Passing |
| Language/Localization | 2 | ✅ Passing |
| API Integration | 4 | ✅ 2 Passing, 2 Documents Bug |
| **Total** | **20** | **18 Passing, 1 Skipped, 1 Documents Bug** |

### Test Execution Commands

```bash
# Run all tests
npm test

# Run tests in UI mode
npm run test:ui

# Run tests for specific environment and locale
npm run test:qa:en
npm run test:qa:fr

# Run specific test case
npx playwright test tests/specs/signup.spec.ts -g "TC-001"
```

### Known Issues

1. **TC-005 (Skipped)**: Special characters are accepted in name fields (Bug #2)
2. **TC-007**: Phone number field allows unlimited input (Bug #3)
3. **TC-017**: Generic weak password error message (Bug #4)
4. **TC-020**: Generic duplicate email error message (Bug #5)

---

## Test Data Strategy

### Data Generation
- Uses **Faker.js** for realistic test data generation
- Generates unique data for each test execution
- Supports locale-specific data generation

### Test Data Types
- **Names**: Realistic first and last names
- **Emails**: Valid email addresses
- **Phone Numbers**: Canadian format (10-11 digits)
- **Passwords**: Strong passwords meeting all requirements
- **Provinces**: Random selection from available provinces

### Static Test Data
- Used in TC-016 for consistent validation across language switches
- Ensures reliable comparison of form data preservation

---

## API Endpoints Tested

| Endpoint | Method | Test Cases | Expected Status |
|----------|--------|------------|-----------------|
| `/api/accounts` | POST | TC-017, TC-018, TC-019, TC-020 | 201 (success), 401 (weak password), 409 (duplicate email) |
| `/oauth/token` | POST | TC-018, TC-019 | 200 |
| `/api/account` | GET | TC-018, TC-019 | 200 |

---

## Locale Support

### Supported Locales
- **English (en)**: Default locale
- **French (fr)**: Full translation support

### Locale-Specific Validations
- All error messages are locale-aware
- Form labels update based on locale
- URL paths reflect locale (e.g., `/fr/signup`)
- Province names are localized

---

## Environment Support

### Supported Environments
- **Development (dev)**: `https://app.dev.nesto.ca`
- **QA (qa)**: `https://app.qa.nesto.ca`
- **Staging (staging)**: `https://app.staging.nesto.ca`

### Environment Configuration
- Environment-specific base URLs
- Environment-specific API endpoints
- Configurable via `.env` files

---

## Notes

- All tests use Page Object Model (POM) pattern for maintainability
- Tests are data-driven and use helper functions for reusability
- API responses are intercepted and validated for integration testing
- Comprehensive error messages for debugging
- Tests support parallel execution

---
