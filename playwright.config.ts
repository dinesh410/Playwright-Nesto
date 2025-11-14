import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Load environment-specific .env file
 * Priority: ENV_FILE > ENV > default to dev
 */
const env = process.env.ENV || process.env.ENV_FILE?.replace('.env.', '') || 'qa';
const envFile = process.env.ENV_FILE || `environments/.env.${env}`;
const envPath = path.resolve(__dirname, envFile);

// Load environment variables
dotenv.config({ path: envPath });

console.log(`📦 Loading environment: ${env}`);
console.log(`📄 Using env file: ${envFile}`);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: process.env.BASE_URL || `https://app.qa.nesto.ca`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});