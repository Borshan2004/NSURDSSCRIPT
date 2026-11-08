import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RdsFacultyEvaluationPage extends BasePage {
  readonly pageHeading: Locator;
  readonly evaluationNoticeAlert: Locator;
  readonly footerBrand: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = this.page
      .getByRole('heading', { name: /Faculty Evaluation/i })
      .or(this.page.locator('.alert').filter({ hasText: /Faculty evaluation/i }))
      .first();
    this.evaluationNoticeAlert = this.page
      .locator('.alert-success, .alert-info, .alert')
      .filter({ hasText: /Faculty evaluation/i })
      .first();
    this.footerBrand = this.page.getByText('Developed & Maintained By Office of IT, NSU.');
  }

  async goto(): Promise<void> {
    await this.page.goto('students/FacultyEvaluation');
    await this.waitForReady();
  }

  async getNoticeText(): Promise<string> {
    return (await this.evaluationNoticeAlert.innerText()).trim();
  }
}
