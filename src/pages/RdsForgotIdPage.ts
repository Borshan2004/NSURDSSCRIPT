import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RdsForgotIdPage extends BasePage {
  readonly pageHeading: Locator;
  readonly reasonCombobox: Locator;
  readonly descriptionInput: Locator;
  readonly submitButton: Locator;
  readonly confirmationMessage: Locator;
  readonly pendingAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = this.page.getByText('Application for Forgot RFID');
    this.reasonCombobox = this.page.getByRole('combobox').first();
    this.descriptionInput = this.page.getByLabel(/Description/i);
    this.submitButton = this.page.getByRole('button', { name: 'Submit' });
    this.confirmationMessage = this.page.getByText(
      /Please visit the Information Desk in order to collect your temporary ID|A request is already in pending Status/i
    );
    this.pendingAlert = this.page.getByText(/A request is already in pending Status/i);
  }

  async goto(): Promise<void> {
    await this.page.goto('http://10.102.11.254/rds/bpm/forgotId');
    await this.waitForReady();
  }

  async selectReason(reason: string): Promise<void> {
    await this.reasonCombobox.click();
    const option = this.page.getByRole('treeitem', { name: reason }).first();
    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  async getSelectedReason(): Promise<string> {
    return (await this.reasonCombobox.innerText()).trim();
  }

  async fillDescription(description: string): Promise<void> {
    await this.descriptionInput.fill(description);
  }

  async submitForm(): Promise<void> {
    await Promise.all([
      this.page.waitForNavigation().catch(() => {}),
      this.submitButton.click(),
    ]);
    await this.waitForReady();
  }
}

