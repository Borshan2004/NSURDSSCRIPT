import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class PreAdvisingPage extends BasePage {
  // Modal: Academic Probation Guidelines Quiz
  readonly probationModal: Locator;
  readonly modalHeading: Locator;
  readonly modalNotice: Locator;
  readonly questionProgress: Locator;
  readonly nextButton: Locator;
  readonly optionA: Locator;
  readonly optionB: Locator;
  readonly optionC: Locator;
  readonly optionD: Locator;

  // Pre-Advising Main Window (Post-Quiz / View state)
  readonly pageHeading: Locator;
  readonly maxAllowedCoursesBadge: Locator;
  readonly maxAllowedCreditsBadge: Locator;
  readonly courseSelect: Locator;
  readonly priorityInput: Locator;
  readonly addButton: Locator;
  readonly chosenCoursesHeading: Locator;
  readonly chosenCoursesTable: Locator;
  readonly chosenCourseRows: Locator;

  // Fallback Alert (If evaluation is required before pre-advising)
  readonly incompleteEvaluationAlert: Locator;

  constructor(page: Page) {
    super(page);

    // Academic Probation Guidelines Quiz Modal (Anchored to modal container and structural controls)
    this.probationModal = this.page.locator('#modalProbation, .modal-dialog, .modal').first();
    this.modalHeading = this.page.locator('.modal-header h3, .modal-header h4, .modal-title').first();
    this.modalNotice = this.page.locator('.modal-body .alert, .modal-body p').first();
    this.questionProgress = this.page.locator('.modal-body .badge, .modal-body .progress-text, [data-progress]').first();
    this.nextButton = this.page.locator('.modal-footer button, button[name="next"], button[type="submit"]').first();

    // Quiz options targeting DOM IDs and inputs
    this.optionA = this.page.locator('#optA, input[value="A"], label:has(#optA)').or(this.page.locator('div, li, label').filter({ hasText: /^A\.\s*/i })).first();
    this.optionB = this.page.locator('#optB, input[value="B"], label:has(#optB)').or(this.page.locator('div, li, label').filter({ hasText: /^B\.\s*/i })).first();
    this.optionC = this.page.locator('#optC, input[value="C"], label:has(#optC)').or(this.page.locator('div, li, label').filter({ hasText: /^C\.\s*/i })).first();
    this.optionD = this.page.locator('#optD, input[value="D"], label:has(#optD)').or(this.page.locator('div, li, label').filter({ hasText: /^D\.\s*/i })).first();

    // Pre Advising Dashboard Controls (Structural and form attributes)
    this.pageHeading = this.page.locator('.page-header h1, h1').first();
    this.maxAllowedCoursesBadge = this.page.locator('#maxCourse, .badge-info, [data-max-course]').first();
    this.maxAllowedCreditsBadge = this.page.locator('#maxCredit, .badge-success, [data-max-credit]').first();

    this.courseSelect = this.page.locator('select#course, select[name="course"], select[name="courseCode"]').first();
    this.priorityInput = this.page.locator('#priority, input[name="priority"], select[name="priority"]').first();
    this.addButton = this.page.locator('#btnAdd, input[type="submit"][value="Add"], button[type="submit"]').first();

    // Chosen Courses Table
    this.chosenCoursesHeading = this.page.locator('.page-content h4, .page-content h3').first();
    this.chosenCoursesTable = this.page.locator('.page-content table').first();
    this.chosenCourseRows = this.page.locator('.page-content table tbody tr');

    // Auxiliary Alert
    this.incompleteEvaluationAlert = this.page.locator('.page-content .alert-danger, .page-content .alert').first();
  }

  async goto(): Promise<void> {
    await this.page.goto('students/preadvising');
    await this.waitForReady();
  }

  async isQuizModalVisible(): Promise<boolean> {
    try {
      return await this.modalHeading.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  async answerQuestionAndNext(optionLetter: 'A' | 'B' | 'C' | 'D' = 'A'): Promise<void> {
    const targetOption =
      optionLetter === 'A' ? this.optionA :
      optionLetter === 'B' ? this.optionB :
      optionLetter === 'C' ? this.optionC : this.optionD;

    await targetOption.click();
    await this.nextButton.click();
    await this.waitForReady();
  }

  getChosenCourseRow(courseCode: string): Locator {
    return this.chosenCoursesTable.locator('tr').filter({ hasText: courseCode }).first();
  }
}
