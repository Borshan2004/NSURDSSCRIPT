import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { RdsGradeConfigurationPage } from './RdsGradeConfigurationPage';

export class RdsGradePreparationPage extends BasePage {
  readonly examCategoryTrigger: Locator;
  readonly select2SearchInput: Locator;
  readonly examDateInput: Locator;
  readonly examTopicInput: Locator;
  readonly totalMarksInput: Locator;
  readonly addExamButton: Locator;
  readonly studentMarksInputs: Locator;
  readonly saveOrUpdateButton: Locator;
  readonly swalConfirmButton: Locator;
  readonly swalOkButton: Locator;
  readonly nextStepButton: Locator;

  constructor(page: Page) {
    super(page);
    this.examCategoryTrigger = this.page.locator('#select2-exam_type-container');
    this.select2SearchInput = this.page.getByRole('searchbox');
    this.examDateInput = this.page.locator('#exam_date');
    this.examTopicInput = this.page.locator('#exam_topic');
    this.totalMarksInput = this.page.locator('#total_marks, input[name="total_marks"], input[type="number"]').first();
    this.addExamButton = this.page.locator('#add_exam, #btn_add, input[value="Add"], button[type="submit"]').first();
    this.studentMarksInputs = this.page.locator('table tbody input[name*="marks"], table input[type="number"], table input[type="text"]');
    this.saveOrUpdateButton = this.page.locator('#save_marks, input[value*="Save"], button.btn-save, input[type="submit"]').first();
    this.swalConfirmButton = this.page.locator('.swal2-confirm, button.swal2-confirm, button:has-text("Yes")').first();
    this.swalOkButton = this.page.locator('.swal2-confirm, button.swal2-confirm, button:has-text("OK")').first();
    this.nextStepButton = this.page.locator('a[href*="gradeConfig"], .page-content a.btn-next').first();
  }

  async goto(): Promise<void> {
    await this.page.goto('faculty/gradePrep/gradePreparation/263/CSE215/5');
    await this.waitForReady();
  }

  async addExamCategoryIfMissing(exam: {
    category: string;
    date: string;
    topic: string;
    totalMarks: string;
  }): Promise<void> {
    const existingInputsCount = await this.studentMarksInputs.count();
    if (existingInputsCount === 0) {
      await this.examCategoryTrigger.click();
      if (await this.select2SearchInput.isVisible()) {
        await this.select2SearchInput.fill(exam.category);
      }
      await this.page.getByRole('treeitem', { name: exam.category, exact: true }).click();
      await this.examDateInput.fill(exam.date);
      await this.examTopicInput.fill(exam.topic);
      await this.totalMarksInput.fill(exam.totalMarks);
      await this.addExamButton.click();
      await this.waitForReady();
    }
  }

  async fillAllStudentMarks(mark: string): Promise<number> {
    const count = await this.studentMarksInputs.count();
    for (let i = 0; i < count; i++) {
      await this.studentMarksInputs.nth(i).fill(mark);
    }
    return count;
  }

  async saveMarks(): Promise<void> {
    await this.saveOrUpdateButton.click();
    await this.swalConfirmButton.waitFor({ state: 'visible' });
    await this.swalConfirmButton.click();

    // Acknowledge the SweetAlert confirmation / success dialog if displayed
    await this.swalOkButton.waitFor({ state: 'visible' }).catch(() => {});
    if (await this.swalOkButton.isVisible()) {
      await this.swalOkButton.click();
    }
    await this.waitForReady();
  }

  async proceedToNext(): Promise<RdsGradeConfigurationPage> {
    await this.nextStepButton.click();
    await this.waitForReady();
    return new RdsGradeConfigurationPage(this.page);
  }
}

