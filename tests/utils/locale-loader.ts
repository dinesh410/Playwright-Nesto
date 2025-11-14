import { readFileSync } from 'fs';
import { join } from 'path';
import type { LocaleConfig } from '../types/locale.types';

/**
 * Loads a JSON file from the i18n directory
 */
function loadJsonFile(locale: 'en' | 'fr', filename: string): any {
  const filePath = join(__dirname, '..', 'i18n', locale, filename);
  const fileData = readFileSync(filePath, 'utf-8');
  return JSON.parse(fileData);
}

/**
 * Loads locale configuration from i18n folder structure
 * Structure: tests/i18n/{locale}/{section}.json
 * Sections: signup.json, provinces.json, urls.json
 * 
 * @param locale - The locale to load ('en' or 'fr')
 * @param baseUrl - Optional base URL to resolve relative URLs
 * @returns LocaleConfig object with all locale data
 */
export async function loadLocaleConfig(
  locale: 'en' | 'fr',
  baseUrl?: string
): Promise<LocaleConfig> {
  // Load separate JSON files for each section
  const signup = loadJsonFile(locale, 'signup.json');
  const provinces = loadJsonFile(locale, 'provinces.json');
  const urls = loadJsonFile(locale, 'urls.json');
  
  // Combine into LocaleConfig structure
  const config: LocaleConfig = {
    signup,
    provinces,
    urls: {
      ...urls,
      baseUrl: baseUrl || '',
    },
  };
  
  // Resolve URLs with base URL if provided
  if (baseUrl) {
    const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    config.urls = {
      signup: `${base}${urls.signup}`,
      baseUrl: base,
      login: `${base}${urls.login}`,
      termsOfService: urls.termsOfService.startsWith('http')
        ? urls.termsOfService
        : `https://www.nesto.ca${urls.termsOfService}`,
    };
  }
  
  return config;
}
