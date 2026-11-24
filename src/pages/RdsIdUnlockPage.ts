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
  readonly enrolledAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = this.page.locator('.page-content h2, h2, .page-header h1, h1').first();
    this.unlockTypeSelect = this.page.locator('#unlock_type');
    this.briefDescriptionInput = this.page.locator('#purpose, textarea[name="purpose"], #description');
    this.signatureInput = this.page.locator('#signature, input[name="signature"], input[type="file"]#signature');
    this.documentInput = this.page.locator('#file-upload, #document, input[name="document"], input[type="file"]');
    this.submitButton = this.page.locator('#submit_btn, form input[type="submit"], form button[type="submit"]');
    this.confirmationMessage = this.page.locator('.page-content .alert, .alert-success, .alert-info, .alert-danger').filter({
      hasText: /Please wait until all procedures are completed|A request is already in pending Status/i
    });
    this.pendingAlert = this.page.locator('.page-content .alert-warning, .page-content .alert-danger, .alert').filter({
      hasText: /A request is already in pending Status/i
    });
    this.enrolledAlert = this.page.locator('.page-content .alert, .alert-info, .alert-warning').filter({
      hasText: /Since you are already Enrolled, there is no need for you to apply for an ID unblock/i
    });
  }

  async goto(): Promise<void> {
    await this.page.goto('bpm/unlockId');
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
