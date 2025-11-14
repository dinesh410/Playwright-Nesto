import { Page, Locator, expect } from "@playwright/test";
import { LocaleConfig } from "../types/locale.types";

export class LandingPage {
  readonly page: Page;
  readonly locale: LocaleConfig;
  readonly menuButton: Locator;
  readonly myPortfolioButton: Locator;

  constructor(page: Page, locale: LocaleConfig) {
    this.page = page;
    this.locale = locale;

    this.menuButton = this.page.getByTestId("menu-button");
    this.myPortfolioButton = this.page.getByTestId("my-portfolio-button");
  }

  async goto(): Promise<void> {
    await this.page.goto(this.locale.urls.baseUrl);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await expect(this.menuButton).toBeVisible();
    await expect(this.myPortfolioButton).toBeVisible();
    await expect(this.page.url()).toContain('getaquote');
  }

  async clickMenuButton(): Promise<void> {
    await this.menuButton.click();
  }
}