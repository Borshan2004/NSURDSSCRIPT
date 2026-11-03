import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MajorDeclarationPage extends BasePage {
  readonly requirementAlert: Locator;
  readonly footerBrand: Locator;

  constructor(page: Page) {
    super(page);
    this.requirementAlert = page.locator('.alert-danger, .alert').filter({ hasText: /To declare your major/i });
    this.footerBrand = page.getByText('Developed & Maintained By Office of IT, NSU.');
  }

  async goto(): Promise<void> {
    await this.page.goto('students/major');
    await this.waitForReady();
  }
}

