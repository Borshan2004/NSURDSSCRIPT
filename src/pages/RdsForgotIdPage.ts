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
    this.pageHeading = this.page.getByRole('heading', { name: /Application for Forgot (ID|RFID)/i });
    this.reasonCombobox = this.page.locator('#select2-id_type-container, .select2-selection').first();
    this.descriptionInput = this.page.getByLabel(/Description/i).or(this.page.locator('#purpose'));
    this.submitButton = this.page.getByRole('button', { name: 'Submit' });
    this.confirmationMessage = this.page.getByText(
      /Please visit the Information Desk in order to collect your temporary ID|A request is already in pending Status/i
    );
    this.pendingAlert = this.page.getByText(/A request is already in pending Status/i);
  }

  async goto(): Promise<void> {
    await this.page.goto('bpm/forgotId');
    await this.waitForReady();
  }

  async selectReason(reason: string): Promise<void> {
    try {
      await this.reasonCombobox.click();
      const option = this.page.getByRole('treeitem', { name: new RegExp(reason, 'i') }).first();
      await option.waitFor({ state: 'visible', timeout: 3000 });
      await option.click();
    } catch {
      await this.page.locator('#id_type').selectOption({ label: reason }, { force: true });
      await this.page.locator('#id_type').dispatchEvent('change');
    }
  }

  async getSelectedReason(): Promise<string> {
    const text = await this.page.locator('#select2-id_type-container').innerText().catch(() => '');
    return text.trim() || (await this.page.locator('#id_type').inputValue());
  }

  async fillDescription(description: string): Promise<void> {
    await this.descriptionInput.fill(description);
  }

  async submitForm(): Promise<void> {
    await this.submitButton.click();
    await this.waitForReady();
  }
}
