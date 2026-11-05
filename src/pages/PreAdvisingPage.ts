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

    // Academic Probation Guidelines Quiz Modal
    this.probationModal = this.page.locator('.modal, [role="dialog"], div').filter({
      hasText: /Academic Probation Guidelines/i,
    }).first();
    this.modalHeading = this.page.getByText('Academic Probation Guidelines').first();
    this.modalNotice = this.page.getByText(/All questions must be answered correctly/i).first();
    this.questionProgress = this.page.getByText(/Question \d+ of \d+/i).first();
    this.nextButton = this.page.getByRole('button', { name: /Next/i });

    // Quiz options
    this.optionA = this.page.locator('div, li, button, label').filter({ hasText: /^A\.\s*/i }).first();
    this.optionB = this.page.locator('div, li, button, label').filter({ hasText: /^B\.\s*/i }).first();
    this.optionC = this.page.locator('div, li, button, label').filter({ hasText: /^C\.\s*/i }).first();
    this.optionD = this.page.locator('div, li, button, label').filter({ hasText: /^D\.\s*/i }).first();

    // Pre Advising Dashboard Controls
    this.pageHeading = this.page.getByText(/Pre Advising/i).first();
    this.maxAllowedCoursesBadge = this.page.getByText(/Max Allowed Course:\s*\d+/i).first();
    this.maxAllowedCreditsBadge = this.page.getByText(/Max Allowed Credit:\s*\d+/i).first();

    this.courseSelect = this.page.locator('select, div').filter({ hasText: /Select a Course/i }).first();
    this.priorityInput = this.page.locator('select, input').filter({ hasText: /1/i }).or(this.page.locator('#priority, [name="priority"]')).first();
    this.addButton = this.page.getByRole('button', { name: 'Add' });

    // Chosen Courses Table
    this.chosenCoursesHeading = this.page.getByText(/Your chosen courses:/i).first();
    this.chosenCoursesTable = this.page.locator('table').filter({ hasText: /Course Title/i }).first();
    this.chosenCourseRows = this.page.locator('table tbody tr');

    // Auxiliary Alert
    this.incompleteEvaluationAlert = this.page.getByText(/Faculty Evaluation is Incomplete/i).first();
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
