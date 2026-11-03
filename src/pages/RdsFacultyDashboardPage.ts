import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { RdsExamMarksEntryCoursesPage } from './RdsExamMarksEntryCoursesPage';

export class RdsFacultyDashboardPage extends BasePage {
  readonly welcomeHeading: Locator;
  readonly gradeCalculationMenuLink: Locator;
  readonly examMarksEntrySubmenuLink: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeHeading = this.page.getByText(/Welcome\s+Ms\.\s+Silvia\s+Ahmed/i);
    this.gradeCalculationMenuLink = this.page.getByRole('link', { name: 'Grade Calculation & Submission (NEW)' });
    this.examMarksEntrySubmenuLink = this.page.getByRole('link', { name: '(1) Exam Marks Entry' });
  }

  async goto(): Promise<void> {
    await this.page.goto('http://10.102.11.254/rds/faculty/faculty');
    await this.waitForReady();
  }

  async navigateToExamMarksEntry(): Promise<RdsExamMarksEntryCoursesPage> {
    await this.gradeCalculationMenuLink.click();
    await this.examMarksEntrySubmenuLink.click();
    await this.waitForReady();
    return new RdsExamMarksEntryCoursesPage(this.page);
  }
}

