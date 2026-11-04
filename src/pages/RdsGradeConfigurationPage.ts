import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RdsGradeConfigurationPage extends BasePage {
  readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = this.page.getByText('Grade Configuration', { exact: true }).first();
  }

  async goto(): Promise<void> {
    await this.page.goto('faculty/gradePrep/gradeConfig/263/CSE215/5');
    await this.waitForReady();
  }
}

