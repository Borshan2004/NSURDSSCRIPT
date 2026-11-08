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
    this.pageHeading = this.page.getByRole('heading', { name: /Application for Leave/i }).or(this.page.getByText('Application for Leave'));
    this.applyDateInput = this.page.locator('#apply_date');
    this.leaveFromInput = this.page.locator('#leave_from');
    this.leaveToInput = this.page.locator('#leave_to');
    this.totalDaysInput = this.page.locator('#tdaysr');
    this.purposeTextarea = this.page.getByLabel(/Purpose of Leave/i);
    this.phoneInput = this.page.locator('#phone');
    this.emailInput = this.page.locator('#mail');
    this.documentInput = this.page.getByLabel(/Document/i);
    this.submitButton = this.page.getByRole('button', { name: 'Submit' });
    this.confirmationMessage = this.page.getByText(
      /Your Leave Request Submitted Successfully|A request is already in pending Status/i
    );
    this.pendingAlert = this.page.getByText(/A request is already in pending Status/i);
    this.verificationAlert = this.page
      .getByRole('heading', { name: /document verification .* is not completed yet/i })
      .or(this.page.getByText(/document verification .* is not completed yet/i));
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
