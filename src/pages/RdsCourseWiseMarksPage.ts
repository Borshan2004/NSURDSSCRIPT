import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RdsCourseWiseMarksPage extends BasePage {
  readonly pageHeading: Locator;
  readonly semesterSelect: Locator;
  readonly seeMarksButton: Locator;
  readonly courseTables: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = this.page.getByRole('heading', { name: /Course Wise Marks/i });
    this.semesterSelect = this.page.locator('#semesterCode');
    this.seeMarksButton = this.page.getByRole('button', { name: /See Marks/i });
    this.courseTables = this.page.locator('table').filter({ hasText: /Course\/Section/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('students/grade_history/exam_marks');
    await this.waitForReady();
  }

  async selectSemester(semesterLabel: string): Promise<void> {
    await this.semesterSelect.selectOption({ label: semesterLabel });
    await this.seeMarksButton.click();
    await this.waitForReady();
  }

  getCourseTable(courseCode: string): Locator {
    return this.courseTables.filter({ hasText: new RegExp(`Course\\/Section\\s*:\\s*${courseCode}`, 'i') }).first();
  }

  getCourseHeader(courseCode: string): Locator {
    return this.getCourseTable(courseCode).locator('th').filter({ hasText: /Course\/Section/i }).first();
  }

  getAssessmentHeaders(courseCode: string): Locator {
    return this.getCourseTable(courseCode).locator('tr').nth(1).locator('td, th');
  }

  getAssessmentDetails(courseCode: string): Locator {
    return this.getCourseTable(courseCode).locator('tr').last().locator('td');
  }
}
