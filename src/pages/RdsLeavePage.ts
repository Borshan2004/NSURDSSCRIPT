import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RdsLeavePage extends BasePage {
  readonly pageHeading: Locator;
  readonly applyDateInput: Locator;
  readonly leaveFromInput: Locator;
  readonly leaveToInput: Locator;
  readonly totalDaysInput: Locator;
  readonly purposeTextarea: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly documentInput: Locator;
  readonly submitButton: Locator;
  readonly confirmationMessage: Locator;
  readonly pendingAlert: Locator;
  readonly verificationAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = this.page.locator('.page-content h2, h2, .page-header h1, h1').first();
    this.applyDateInput = this.page.locator('#apply_date');
    this.leaveFromInput = this.page.locator('#leave_from');
    this.leaveToInput = this.page.locator('#leave_to');
    this.totalDaysInput = this.page.locator('#tdaysr');
    this.purposeTextarea = this.page.locator('#purpose, textarea[name="purpose"]');
    this.phoneInput = this.page.locator('#phone');
    this.emailInput = this.page.locator('#mail');
    this.documentInput = this.page.locator('#file-upload, #document, input[name="document"], input[type="file"]');
    this.submitButton = this.page.locator('#submit_btn, form input[type="submit"], form button[type="submit"]');
    this.confirmationMessage = this.page.locator('.page-content .alert, .alert-success, .alert-info, .alert-danger').filter({
      hasText: /Your Leave Request Submitted Successfully|A request is already in pending Status/i
    });
    this.pendingAlert = this.page.locator('.page-content .alert-warning, .page-content .alert-danger, .alert').filter({
      hasText: /A request is already in pending Status/i
    });
    this.verificationAlert = this.page
      .locator('.page-content .alert, .alert-danger, .alert-warning')
      .filter({ hasText: /document verification .* is not completed yet/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('bpm/student_leave');
    await this.waitForReady();
  }

  async fillLeaveDates(leaveFrom: string, leaveTo: string): Promise<void> {
    await this.leaveFromInput.fill(leaveFrom);
    await this.leaveFromInput.dispatchEvent('change');
    await this.leaveToInput.fill(leaveTo);
    await this.leaveToInput.dispatchEvent('change');
    await this.waitForReady();
  }

  async getTotalDays(): Promise<string> {
    return await this.totalDaysInput.inputValue();
  }

  async fillPurpose(purpose: string): Promise<void> {
    await this.purposeTextarea.fill(purpose);
  }

  async uploadDocument(filePath: string): Promise<void> {
    await this.documentInput.setInputFiles(filePath);
    await this.waitForReady();
  }

  async submitForm(): Promise<void> {
    await this.submitButton.click();
    await this.waitForReady();
  }
}
