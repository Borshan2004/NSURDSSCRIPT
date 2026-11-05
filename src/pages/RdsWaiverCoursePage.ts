import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RdsWaiverCoursePage extends BasePage {
  readonly requestPurposeSelect: Locator;
  readonly briefDescriptionInput: Locator;
  readonly signatureInput: Locator;
  readonly supportingDocumentInput: Locator;
  readonly submitButton: Locator;
  readonly submissionResponseAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.requestPurposeSelect = this.page.locator('#type');
    this.briefDescriptionInput = this.page.locator('#purpose');
    this.signatureInput = this.page.locator('#signature');
    this.supportingDocumentInput = this.page.locator('#file-upload');
    this.submitButton = this.page.getByRole('button', { name: 'Submit' });
    this.submissionResponseAlert = this.page.locator('.alert, .alert-success, .alert-info, .alert-danger');
  }

  async goto(): Promise<void> {
    await this.page.goto('bpm/studentGeneralRequest');
    await this.waitForReady();
  }

  async selectRequestPurpose(purpose: string): Promise<void> {
    await this.requestPurposeSelect.selectOption(purpose);
  }

  async fillBriefDescription(description: string): Promise<void> {
    await this.briefDescriptionInput.fill(description);
  }

  async uploadSignature(signaturePath: string): Promise<void> {
    await this.signatureInput.setInputFiles(signaturePath);
  }

  async uploadSupportingDocument(filePath: string): Promise<void> {
    await this.supportingDocumentInput.setInputFiles(filePath);
  }

  async submitForm(): Promise<void> {
    await this.submitButton.click();
    await this.waitForReady();
  }
}
