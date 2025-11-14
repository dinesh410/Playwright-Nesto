import { Page } from '@playwright/test';

export interface ApiResponse {
  status: number;
  body: any;
}

/**
 * Sets up API interception for a specific URL pattern
 * @param page - Playwright page object
 * @param urlPattern - URL pattern to intercept (string or regex)
 * @param requestMethod - HTTP method to match (optional, defaults to 'POST')
 * @returns Promise that resolves with response status and body when the API is called
 */
export function setupApiInterception(
  page: Page,
  urlPattern: string | RegExp,
  requestMethod: string = 'POST'
): Promise<ApiResponse> {
  return page.waitForResponse((resp) => {
    const url = resp.url();
    const method = resp.request().method();
    const urlMatches = typeof urlPattern === 'string' 
      ? url.includes(urlPattern)
      : urlPattern.test(url);
    return urlMatches && method === requestMethod;
  }).then(async (response) => {
    const status = response.status();
    const body = await response.json().catch(() => ({}));
    return { status, body };
  });
}
