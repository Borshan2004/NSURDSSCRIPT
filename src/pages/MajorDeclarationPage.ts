import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MajorDeclarationPage extends BasePage {
  readonly requirementAlert: Locator;
  readonly footerBrand: Locator;

  constructor(page: Page) {
    super(page);
    this.requirementAlert = page.locator('.page-content .alert-danger, .page-content .alert, .alert-danger').first();
    this.footerBrand = page.locator('.footer-content span').first();
  }

  async goto(): Promise<void> {
    await this.page.goto('students/major');
    await this.waitForReady();
  }
}

