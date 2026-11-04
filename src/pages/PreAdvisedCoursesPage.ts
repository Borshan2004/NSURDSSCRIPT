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
  readonly coursesTable: Locator;
  readonly tableHeaders: Locator;
  readonly courseRows: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = this.page.getByText(/Pre Advising.*202\d/i).first();
    this.chosenCoursesHeading = this.page.getByText(/Your chosen courses:/i).first();
    this.coursesTable = this.page.locator('table').filter({ hasText: /Course Title/i }).first();
    this.tableHeaders = this.coursesTable.locator('th');
    this.courseRows = this.coursesTable.locator('tbody tr');
  }

  async goto(): Promise<void> {
    await this.page.goto('http://10.102.11.254/rds/students/preadvising/preAdvisingSlip');
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
