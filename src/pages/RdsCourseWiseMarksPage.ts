import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RdsCourseWiseMarksPage extends BasePage {
  readonly pageHeading: Locator;
  readonly semesterSelect: Locator;
  readonly seeMarksButton: Locator;
  readonly courseTables: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = this.page.locator('.page-content h2, h2').first();
    this.semesterSelect = this.page.locator('#semesterCode, select[name="semesterCode"]');
    this.seeMarksButton = this.page.locator('.form-inline button, form[action*="exam_marks"] button, button:has(.glyphicon-eye-open)').first();
    this.courseTables = this.page.locator('.page-content table').filter({ hasText: /Course\/Section/i });
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
