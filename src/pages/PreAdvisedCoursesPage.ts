import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface PreAdvisedCourseRecord {
  index: string;
  courseCode: string;
  credit: string;
  title: string;
  date: string;
}

export class PreAdvisedCoursesPage extends BasePage {
  readonly pageHeading: Locator;
  readonly chosenCoursesHeading: Locator;
  readonly notPreAdvisedHeading: Locator;
  readonly coursesTable: Locator;
  readonly tableHeaders: Locator;
  readonly courseRows: Locator;

  constructor(page: Page) {
    super(page);

    // Scope to semantic container and structural headers instead of volatile text
    this.pageHeading = this.page.locator('.page-header h1, h1').first();
    this.chosenCoursesHeading = this.page.locator('.page-content h4, .page-content h3').first();
    this.notPreAdvisedHeading = this.page.locator('.page-content h1[style*="red"], .page-content .col-xs-12 h1').first();
    this.coursesTable = this.page.locator('.page-content table').first();
    this.tableHeaders = this.coursesTable.locator('th');
    this.courseRows = this.coursesTable.locator('tbody tr');
  }

  async goto(): Promise<void> {
    await this.page.goto('students/preadvising/preAdvisingSlip');
    await this.waitForReady();
  }

  getCourseRow(courseCode: string): Locator {
    return this.courseRows.filter({ hasText: courseCode }).first();
  }

  async getCourseCount(): Promise<number> {
    return await this.courseRows.count();
  }

  async getCourseRecord(courseCode: string): Promise<PreAdvisedCourseRecord | null> {
    const row = this.getCourseRow(courseCode);
    if (!(await row.isVisible())) return null;

    const cells = row.locator('td');
    return {
      index: (await cells.nth(0).textContent())?.trim() ?? '',
      courseCode: (await cells.nth(1).textContent())?.trim() ?? '',
      credit: (await cells.nth(2).textContent())?.trim() ?? '',
      title: (await cells.nth(3).textContent())?.trim() ?? '',
      date: (await cells.nth(4).textContent())?.trim() ?? '',
    };
  }
}
