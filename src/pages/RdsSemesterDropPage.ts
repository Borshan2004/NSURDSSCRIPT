import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RdsSemesterDropPage extends BasePage {
  readonly pageHeading: Locator;
  readonly semesterSelect: Locator;
  readonly semesterContainer: Locator;
  readonly dropTypeSelect: Locator;
  readonly dropTypeContainer: Locator;
  readonly reasonTextarea: Locator;
  readonly signatureInput: Locator;
  readonly documentInput: Locator;
  readonly submitButton: Locator;
  readonly submissionResponseAlert: Locator;
  readonly pendingAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = this.page.getByText('Application for Semester Drop');
    this.semesterSelect = this.page.locator('#semester');
    this.semesterContainer = this.page.locator('#select2-semester-container');
    this.dropTypeSelect = this.page.locator('#drop_type');
    this.dropTypeContainer = this.page.locator('#select2-drop_type-container');
    this.reasonTextarea = this.page.getByLabel(/Reason to Drop/i);
    this.signatureInput = this.page.getByLabel(/Signature/i);
    this.documentInput = this.page.getByLabel(/Supporting Document/i);
    this.submitButton = this.page.getByRole('button', { name: 'Submit' });
    this.submissionResponseAlert = this.page.getByText(
      /You can not apply for General Drop|Please wait until all procedures are completed|A request is already in pending Status/i
    );
    this.pendingAlert = this.page.getByText(/A request is already in pending Status/i);
  }

  async goto(): Promise<void> {
    await this.page.goto('http://10.102.11.254/rds/bpm/semesterDrop');
    await this.waitForReady();
  }

  async selectSemester(semesterName: string): Promise<void> {
    await this.semesterContainer.click();
    const option = this.page.getByRole('treeitem', { name: new RegExp(semesterName, 'i') }).first();
    await option.waitFor({ state: 'visible' });
    await option.click();
    await this.waitForReady();
  }

  async selectDropType(dropType: string): Promise<void> {
    await this.dropTypeContainer.click();
    const option = this.page.getByRole('treeitem', { name: dropType }).first();
    await option.waitFor({ state: 'visible' });
    await option.click();
    await this.waitForReady();
  }

  async fillReason(reason: string): Promise<void> {
    await this.reasonTextarea.fill(reason);
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

