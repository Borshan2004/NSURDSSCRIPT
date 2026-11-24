import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { RdsExamMarksEntryCoursesPage } from './RdsExamMarksEntryCoursesPage';

export class RdsFacultyDashboardPage extends BasePage {
  readonly welcomeHeading: Locator;
  readonly gradeCalculationMenuLink: Locator;
  readonly examMarksEntrySubmenuLink: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeHeading = this.page.locator('.page-content h2, h2, .page-header h1, h1, .blue').first();
    this.gradeCalculationMenuLink = this.page.locator('a[href*="mycoursesnew"], #sidebar a.dropdown-toggle').filter({ hasText: /Grade Calculation/i }).first();
    this.examMarksEntrySubmenuLink = this.page.locator('a[href*="submenu=marks_entry"]').first();
  }

  async goto(): Promise<void> {
    await this.page.goto('faculty/faculty');
    await this.waitForReady();
  }

  async navigateToExamMarksEntry(): Promise<RdsExamMarksEntryCoursesPage> {
    await this.gradeCalculationMenuLink.click();
    await this.examMarksEntrySubmenuLink.click();
    await this.waitForReady();
    return new RdsExamMarksEntryCoursesPage(this.page);
  }
}

