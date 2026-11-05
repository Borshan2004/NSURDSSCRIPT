import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RdsCreditStatusUpdatePage extends BasePage {
  readonly pageHeading: Locator;
  readonly creditToNonCreditRadio: Locator;
  readonly nonCreditToCreditRadio: Locator;
  readonly coursesSelect: Locator;
  readonly signatureInput: Locator;
  readonly documentInput: Locator;
  readonly submitButton: Locator;
  readonly submissionResponseAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = this.page.getByText('Course Credit/Non-Credit Status Update Request Process');
    this.creditToNonCreditRadio = this.page.locator('input[name="purpose"][value="Credit to Non Credit"]');
    this.nonCreditToCreditRadio = this.page.locator('input[name="purpose"][value="Non Credit to Credit"]');
    this.coursesSelect = this.page.locator('#courses');
    this.signatureInput = this.page.locator('#signature');
    this.documentInput = this.page.locator('#file-upload');
    this.submitButton = this.page.locator('#submit_btn');
    this.submissionResponseAlert = this.page.getByText(
      /Please wait until all procedures are completed|A request is already in pending Status/i
    );
  }

  async goto(): Promise<void> {
    await this.page.goto('bpm/CreditNonCreditStatusUpdate');
    await this.waitForReady();
  }

  async selectPurpose(purpose: 'Credit to Non Credit' | 'Non Credit to Credit'): Promise<void> {
    const radio = purpose === 'Credit to Non Credit' ? this.creditToNonCreditRadio : this.nonCreditToCreditRadio;
    await Promise.all([
      this.page.waitForResponse(resp => resp.url().includes('getCourses') && resp.status() === 200),
      radio.check(),
    ]);
    await this.coursesSelect.waitFor({ state: 'attached' });
  }

  async selectFirstAvailableCourse(): Promise<string> {
    const firstOptionValue = await this.coursesSelect.locator('option').first().getAttribute('value');
    if (firstOptionValue) {
      await this.coursesSelect.selectOption(firstOptionValue);
      await this.coursesSelect.dispatchEvent('change');
      return firstOptionValue;
    }
    return '';
  }

  async uploadSignature(filePath: string): Promise<void> {
    await this.signatureInput.setInputFiles(filePath);
  }

  async uploadDocument(filePath: string): Promise<void> {
    await this.documentInput.setInputFiles(filePath);
  }

  async submitForm(): Promise<void> {
    await Promise.all([
      this.page.waitForNavigation().catch(() => {}),
      this.submitButton.click(),
    ]);
    await this.waitForReady();
  }
}
