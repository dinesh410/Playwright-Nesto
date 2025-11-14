import { test as base } from '@playwright/test';
import { loadLocaleConfig } from '../utils/locale-loader';
import type { LocaleConfig } from '../types/locale.types';

/**
 * Base test context with common utilities
 */
export interface BaseTestContext {
  localeConfig: LocaleConfig;
  environment: string;
}

/**
 * Base fixture that provides common utilities
 */
export const test = base.extend<BaseTestContext>({
  environment: async ({}, use) => {
    const env = process.env.ENV || 'dev';
    await use(env);
  },

  localeConfig: async ({ environment }, use) => {
    // Get locale from environment variable, default to 'en'
    const locale = (process.env.LOCALE || 'en').toLowerCase() as 'en' | 'fr';
    const baseUrl = process.env.BASE_URL || `https://app.${environment}.nesto.ca`;
    const localeConfig = await loadLocaleConfig(locale, baseUrl);
    await use(localeConfig);
  },
});

export { expect } from '@playwright/test';
