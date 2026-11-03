import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RdsCourseExclusionPage extends BasePage {
  readonly pageHeading: Locator;
  readonly coursesSearchInput: Locator;
  readonly briefDescriptionInput: Locator;
  readonly signatureInput: Locator;
  readonly documentInput: Locator;
  readonly submitButton: Locator;
  readonly confirmationMessage: Locator;
  readonly ineligibleAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = this.page.getByText('Course Exclusion Request Process');
    this.coursesSearchInput = this.page.getByPlaceholder(/select multiple courses/i);
    this.briefDescriptionInput = this.page.getByLabel(/Brief Description/i);
    this.signatureInput = this.page.getByLabel(/Signature/i);
    this.documentInput = this.page.getByLabel(/Document/i);
    this.submitButton = this.page.getByRole('button', { name: 'Submit' });
    this.confirmationMessage = this.page.getByText(
      /Please wait until all procedures are completed|A request is already in pending Status/i
    );
    this.ineligibleAlert = this.page.getByText(
      /It is not possible for you to request a course exclusion/i
    );
  }

  async goto(): Promise<void> {
    await this.page.goto('http://10.102.11.254/rds/bpm/CourseExclusion');
    await this.waitForReady();
  }

  async selectCourse(courseNameOrCode?: string): Promise<string> {
    await this.coursesSearchInput.click();
    const option = courseNameOrCode
      ? this.page.getByRole('treeitem', { name: new RegExp(courseNameOrCode, 'i') }).first()
      : this.page.getByRole('treeitem').first();
    await option.waitFor({ state: 'visible' });
    const selectedText = (await option.innerText()).trim();
    await option.click();
    return selectedText;
  }

  getSelectedCourseBadge(courseText: string): Locator {
    return this.page.getByRole('listitem').filter({ hasText: courseText });
  }

  async fillDescription(description: string): Promise<void> {
    await this.briefDescriptionInput.fill(description);
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
