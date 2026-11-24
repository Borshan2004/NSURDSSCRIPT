import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RdsCourseInclusionPage extends BasePage {
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
    this.pageHeading = this.page.locator('.page-content h2, h2, .page-header h1, h1').first();
    this.coursesSearchInput = this.page.locator('.select2-search__field, #courses ~ .select2 input, input[type="search"]').first();
    this.briefDescriptionInput = this.page.locator('#purpose, textarea[name="purpose"], #description');
    this.signatureInput = this.page.locator('#signature, input[name="signature"], input[type="file"]#signature');
    this.documentInput = this.page.locator('#file-upload, #document, input[name="document"], input[type="file"]');
    this.submitButton = this.page.locator('#submit_btn, form input[type="submit"], form button[type="submit"]');
    this.confirmationMessage = this.page.locator('.page-content .alert, .alert-success, .alert-info, .alert-danger').filter({
      hasText: /Please wait until all procedures are completed|A request is already in pending Status/i
    });
    this.ineligibleAlert = this.page.locator('.page-content .alert, .alert-warning, .alert-danger').filter({
      hasText: /It is not possible for you to request a course Inclusion/i
    });
  }

  async goto(): Promise<void> {
    await this.page.goto('bpm/CourseInclusion');
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
