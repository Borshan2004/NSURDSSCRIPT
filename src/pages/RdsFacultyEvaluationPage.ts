import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RdsFacultyEvaluationPage extends BasePage {
  readonly pageHeading: Locator;
  readonly evaluationNoticeAlert: Locator;
  readonly footerBrand: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = this.page.locator('.page-header h1, h1, .page-content .alert').first();
    this.evaluationNoticeAlert = this.page.locator('.page-content .alert-success, .page-content .alert-info, .page-content .alert').first();
    this.footerBrand = this.page.locator('.footer-content span, .footer-content').first();
  }

  async goto(): Promise<void> {
    await this.page.goto('students/FacultyEvaluation');
    await this.waitForReady();
  }

  async getNoticeText(): Promise<string> {
    return (await this.evaluationNoticeAlert.innerText()).trim();
  }
}
