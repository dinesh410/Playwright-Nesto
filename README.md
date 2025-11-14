# Playwright Nesto Test Automation

End-to-end test automation framework for Nesto signup functionality using Playwright and TypeScript.

## 📋 Overview

This project provides comprehensive test coverage for the Nesto signup page, including:
- Form field validations
- API response validations
- Multi-language support (English and French)
- Multi-environment support (Dev, QA, Staging)
- Page Object Model (POM) architecture
- Data-driven testing

## 🏗️ Project Structure

```
Playwright-Nesto/
├── environments/              # Environment-specific configuration files
│   ├── .env.dev              # Development environment variables
│   ├── .env.qa               # QA environment variables
│   └── .env.staging          # Staging environment variables
├── tests/
│   ├── fixtures/              # Playwright fixtures
│   │   └── base.fixtures.ts  # Base fixture with locale configuration
│   ├── i18n/                 # Internationalization files
│   │   ├── en/               # English translations
│   │   │   ├── signup.json  # Signup page labels
│   │   │   ├── provinces.json # Province names
│   │   │   └── urls.json     # URL paths
│   │   └── fr/               # French translations
│   │       ├── signup.json
│   │       ├── provinces.json
│   │       └── urls.json
│   ├── pages/                # Page Object Model classes
│   │   ├── SignupPage.ts     # Signup page interactions
│   │   ├── LoginPage.ts      # Login page interactions
│   │   └── LandingPage.ts   # Landing page interactions
│   ├── specs/                # Test specifications
│   │   └── signup.spec.ts    # Signup test suite
│   ├── types/                # TypeScript type definitions
│   │   ├── locale.types.ts   # Locale configuration types
│   │   ├── provinces.types.ts # Province types and utilities
│   │   └── signup.types.ts  # Signup form data types
│   └── utils/                # Utility functions
│       ├── api-interceptor.ts # API response interception
│       ├── locale-loader.ts  # Locale configuration loader
│       └── test-helpers.ts   # Test helper functions
├── playwright.config.ts      # Playwright configuration
├── package.json              # Project dependencies and scripts
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Environment Setup

Create environment files in the `environments/` directory:

**`environments/.env.dev`**
```env
ENV=dev
BASE_URL=https://app.dev.nesto.ca
API_BASE_URL=https://api.dev.nesto.ca
```

**`environments/.env.qa`**
```env
ENV=qa
BASE_URL=https://app.qa.nesto.ca
API_BASE_URL=https://api.qa.nesto.ca
```

## 🧪 Running Tests

### Run all tests
```bash
npm test
```

### Run tests with UI mode
```bash
npm run test:ui
```

### Run tests for specific environment and locale

```bash
# Development - English
npm run test:dev:en

# Development - French
npm run test:dev:fr

# QA - English
npm run test:qa:en

# QA - French
npm run test:qa:fr
```

### Run specific test file
```bash
npx playwright test tests/specs/signup.spec.ts
```

### Run tests with custom environment
```bash
ENV=staging LOCALE=fr npx playwright test
```

## 🎯 Key Features

### 1. **Page Object Model (POM)**
- Encapsulates page interactions in reusable classes
- Reduces code duplication and improves maintainability

### 2. **Multi-Language Support**
- Tests run in both English and French
- Locale-specific translations stored in JSON files
- Automatic locale selection based on `LOCALE` environment variable

### 3. **Multi-Environment Support**
- Supports multiple environments (Dev, QA, Staging)
- Environment-specific configuration via `.env` files
- Easy switching between environments

### 4. **API Interception**
- Intercepts and validates API responses
- Verifies response status codes and body content
- Detailed error messages for debugging

### 5. **Data-Driven Testing**
- Uses Faker.js for realistic test data generation
- Reusable test data creation functions
- Supports parameterized test cases

### 6. **Comprehensive Error Reporting**
- Detailed error messages with expected vs actual values
- Full API response bodies in error messages
- Console logging for debugging

## 📝 Test Coverage

The signup test suite includes:

- ✅ Form field visibility and labels
- ✅ Required field validations
- ✅ Password requirements validation
- ✅ Email format validation
- ✅ Phone number format validation
- ✅ Province selection validation
- ✅ Password confirmation matching
- ✅ API response validation (status codes and body)
- ✅ OAuth token validation
- ✅ Multi-language support
- ✅ Form data persistence on language switch
- ✅ Navigation to login page
- ✅ Terms of Service and Privacy Policy links

## 🛠️ Configuration

### Playwright Configuration

The `playwright.config.ts` file handles:
- Environment variable loading
- Base URL configuration
- Test execution settings
- Screenshot and video capture on failure
- Trace collection on retry

### Locale Configuration

Locale files are organized in `tests/i18n/{locale}/`:
- `signup.json` - Signup page labels and error messages
- `provinces.json` - Province names in the selected language
- `urls.json` - URL paths for the locale

## 📦 Dependencies

- **@playwright/test** - Playwright testing framework
- **@faker-js/faker** - Test data generation
- **dotenv** - Environment variable management
- **TypeScript** - Type safety and better development experience

## 🐛 Bug Reports

Known bugs are documented in `BUG_REPORT.txt` with:
- Bug description
- Severity and priority
- Steps to reproduce
- Expected vs actual behavior
- Recommendations

## 📚 Best Practices

1. **Page Object Model**: All page interactions are encapsulated in page classes
2. **Reusable Fixtures**: Common setup/teardown logic in fixtures
3. **Type Safety**: TypeScript types for all data structures
4. **Helper Functions**: Reusable utilities for common operations
5. **Detailed Logging**: Comprehensive error messages and console logs
6. **Environment Isolation**: Separate configurations for each environment

## 🔧 Utilities

### API Interceptor
```typescript
const apiResponse = await setupApiInterception(page, "/api/accounts", "POST");
// Returns { status: number, body: any }
```

### Response Body Validator
```typescript
const verification = verifyResponseBodyValue(
  responseBody,
  'fieldName',
  expectedValue,
  'contains' // or 'equals' or 'defined'
);
```

### Test Data Generation
```typescript
const userData = createTestUser(localeConfig, {
  email: 'custom@example.com',
  province: localeConfig.provinces.ONTARIO
});
```

## 📄 License

ISC

## 👥 Contributing

1. Follow the existing code structure and patterns
2. Add appropriate TypeScript types
3. Include detailed error messages in assertions
4. Update this README for significant changes
5. Document any new utilities or patterns

