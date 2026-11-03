import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RdsIdUnlockPage extends BasePage {
  readonly pageHeading: Locator;
  readonly unlockTypeSelect: Locator;
  readonly briefDescriptionInput: Locator;
  readonly signatureInput: Locator;
  readonly documentInput: Locator;
  readonly submitButton: Locator;
  readonly confirmationMessage: Locator;
  readonly pendingAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = this.page.getByText('Application for ID Unlock');
    this.unlockTypeSelect = this.page.locator('#unlock_type');
    this.briefDescriptionInput = this.page.getByLabel(/Brief Description/i);
    this.signatureInput = this.page.getByLabel(/Signature/i);
    this.documentInput = this.page.getByLabel(/Document/i);
    this.submitButton = this.page.getByRole('button', { name: 'Submit' });
    this.confirmationMessage = this.page.getByText(
      /Please wait until all procedures are completed|A request is already in pending Status/i
    );
    this.pendingAlert = this.page.getByText(/A request is already in pending Status/i);
  }

  async goto(): Promise<void> {
    await this.page.goto('http://10.102.11.254/rds/bpm/unlockId');
    await this.waitForReady();
  }

  async selectUnlockType(type: string): Promise<void> {
    await this.unlockTypeSelect.selectOption(type);
    await this.waitForReady();
  }

  async fillDescription(description: string): Promise<void> {
    await this.briefDescriptionInput.fill(description);
  }

  async uploadSignature(filePath: string): Promise<void> {
    await this.signatureInput.setInputFiles(filePath);
    await this.waitForReady();
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

