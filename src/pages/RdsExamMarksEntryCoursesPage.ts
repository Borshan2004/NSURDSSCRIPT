import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { RdsGradePreparationPage } from './RdsGradePreparationPage';

export class RdsExamMarksEntryCoursesPage extends BasePage {
  readonly pageHeading: Locator;
  readonly semesterDropdown: Locator;
  readonly coursesTable: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = this.page.getByText('Exam Marks Entry', { exact: true }).first();
    this.semesterDropdown = this.page.getByRole('combobox');
    this.coursesTable = this.page.getByRole('table');
  }

  async goto(): Promise<void> {
    await this.page.goto('http://10.102.11.254/rds/faculty/faculty/mycoursesnew?submenu=marks_entry');
    await this.waitForReady();
  }

  async selectSemester(semesterLabel: string): Promise<void> {
    await Promise.all([
      this.page.waitForURL(/mycoursesnew\/\d+/).catch(() => {}),
      this.semesterDropdown.selectOption({ label: semesterLabel }),
    ]);
    await this.waitForReady();
  }

  getCourseRow(courseCode: string, section: string): Locator {
    return this.page
      .getByRole('row')
      .filter({ has: this.page.getByRole('cell', { name: courseCode, exact: true }) })
      .filter({ has: this.page.getByRole('cell', { name: section, exact: true }) });
  }

  async openExamMarksEntryForCourse(courseCode: string, section: string): Promise<RdsGradePreparationPage> {
    const row = this.getCourseRow(courseCode, section);
    const marksEntryLink = row.getByRole('link', { name: 'Exam Marks Entry' });
    await marksEntryLink.click();
    await this.waitForReady();
    return new RdsGradePreparationPage(this.page);
  }
}

