import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RdsGradeHistoryPage extends BasePage {
  readonly pageHeading: Locator;
  readonly waiverHeading: Locator;
  readonly transferHeading: Locator;

  readonly summaryTable: Locator;
  readonly studentNameCell: Locator;
  readonly creditCompletedCell: Locator;
  readonly cgpaCell: Locator;

  readonly waiverTable: Locator;
  readonly transferTable: Locator;
  readonly gradeHistoryTable: Locator;

  readonly printGradesButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = this.page.getByRole('heading', { name: /Grade History of/i });
    this.waiverHeading = this.page.getByRole('heading', { name: /Waiver Courses/i });
    this.transferHeading = this.page.getByRole('heading', { name: /Transfer Courses/i });

    this.summaryTable = this.page.locator('table').filter({ hasText: /Student Name/i }).first();
    this.studentNameCell = this.summaryTable.locator('tbody tr td').nth(0);
    this.creditCompletedCell = this.summaryTable.locator('tbody tr td').nth(1);
    this.cgpaCell = this.summaryTable.locator('tbody tr td').nth(2);

    this.waiverTable = this.page.locator('table').filter({ hasText: /Course Code/i }).nth(0);
    this.transferTable = this.page.locator('table').filter({ hasText: /Course Code/i }).nth(1);
    this.gradeHistoryTable = this.page.locator('table').filter({ hasText: /Semester Name/i }).first();

    this.printGradesButton = this.page.locator('#printGrades');
  }

  async goto(): Promise<void> {
    await this.page.goto('students/grade_history');
    await this.waitForReady();
  }

  getCourseRow(courseCode: string): Locator {
    return this.gradeHistoryTable.locator('tbody tr, tr').filter({ hasText: new RegExp(`\\b${courseCode}\\b`, 'i') }).first();
  }

  getSemesterTotalRow(semesterName: string): Locator {
    return this.gradeHistoryTable.locator('tr').filter({ hasText: new RegExp(semesterName, 'i') }).filter({ hasText: /TGPA|CGPA/i }).first();
  }

  async clickPrintGrades(): Promise<void> {
    await this.printGradesButton.click();
  }
}

