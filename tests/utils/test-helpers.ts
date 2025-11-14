/**
 * Gets a random value from an array
 * @param array - Array to select from
 * @returns Random element from the array
 * @throws Error if array is empty
 */
export function getRandomValue<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error('Cannot get random value from empty array');
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Verifies a value in API response body with detailed error message
 * @param responseBody - The API response body object
 * @param fieldPath - The field path (e.g., 'firstName' or 'body.access_token')
 * @param expectedValue - The expected value to match
 * @param comparison - Comparison type: 'equals', 'contains', 'defined' (default: 'contains')
 * @returns Object with isValid flag and error message
 */
export function verifyResponseBodyValue(
  responseBody: any,
  fieldPath: string,
  expectedValue: any,
  comparison: 'equals' | 'contains' | 'defined' = 'contains'
): { isValid: boolean; errorMessage: string } {
  const fieldValue = getNestedValue(responseBody, fieldPath);
  const fullResponse = JSON.stringify(responseBody, null, 2);

  if (comparison === 'defined') {
    const isValid = fieldValue !== undefined && fieldValue !== null;
    return {
      isValid,
      errorMessage: isValid
        ? ''
        : `${fieldPath} is missing or undefined. Full response: ${fullResponse}`,
    };
  }

  if (fieldValue === undefined || fieldValue === null) {
    return {
      isValid: false,
      errorMessage: `${fieldPath} is missing. Expected: ${JSON.stringify(expectedValue)}, but field is undefined. Full response: ${fullResponse}`,
    };
  }

  if (comparison === 'equals') {
    const isValid = fieldValue === expectedValue;
    return {
      isValid,
      errorMessage: isValid
        ? ''
        : `Expected ${fieldPath} to equal "${expectedValue}", but got "${fieldValue}". Full response: ${fullResponse}`,
    };
  }

  // 'contains' comparison
  const fieldStr = String(fieldValue);
  const expectedStr = String(expectedValue);
  const isValid = fieldStr.includes(expectedStr);
  return {
    isValid,
    errorMessage: isValid
      ? ''
      : `Expected ${fieldPath} to contain "${expectedValue}", but got "${fieldValue}". Full response: ${fullResponse}`,
  };
}

/**
 * Gets a nested value from an object using dot notation
 * @param obj - The object to traverse
 * @param path - The dot-notation path (e.g., 'body.access_token')
 * @returns The value at the path or undefined
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Generates a unique email address for testing
 */
export function generateUniqueEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `testuser${timestamp}${random}@example.com`;
}

/**
 * Generates a random phone number (Canadian format)
 */
export function generatePhoneNumber(): string {
  const areaCodes = ['416', '647', '437', '514', '438', '450', '613', '819', '905', '289', '365'];
  const areaCode = getRandomValue(areaCodes);
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `${areaCode}${number}`;
}

/**
 * Generates a valid password meeting all requirements
 */
export function generateValidPassword(): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  
  const randomUpper = uppercase[Math.floor(Math.random() * uppercase.length)];
  const randomLower = lowercase[Math.floor(Math.random() * lowercase.length)];
  const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
  
  // Generate remaining characters to meet minimum length
  const allChars = uppercase + lowercase + numbers;
  const remainingLength = 12 - 3; // Minimum 12, we have 3 already
  let remaining = '';
  for (let i = 0; i < remainingLength; i++) {
    remaining += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  const password = (randomUpper + randomLower + randomNumber + remaining)
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
  
  return password;
}

/**
 * Validates password meets requirements
 */
export function isValidPassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters');
  }

  if (password.length > 32) {
    errors.push('Password must be at most 32 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
