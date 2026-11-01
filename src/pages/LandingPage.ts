import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { StudentProfilePage } from './StudentProfilePage';

export class LandingPage extends BasePage {
  readonly profileDropdown: Locator;
  readonly studentInfoLink: Locator;
  readonly userGreeting: Locator;
  readonly cgpaIndicator: Locator;
  readonly creditsIndicator: Locator;

  constructor(page: Page) {
    super(page);
    this.profileDropdown = page.locator('a.dropdown-toggle').filter({ hasText: 'Profile' }).first();
    this.studentInfoLink = page.getByRole('link', { name: 'Student Information' });
    this.userGreeting = page.locator('h3, h4, .blue, .page-header').first();
    this.cgpaIndicator = page.locator('div:has-text("CGPA")').last();
    this.creditsIndicator = page.locator('div:has-text("Credits passed")').last();
  }

  async goto(): Promise<void> {
    await this.page.goto('students/landing');
    await this.waitForReady();
  }

  async openProfileMenu(): Promise<void> {
    await this.profileDropdown.click();
  }

  async navigateToStudentProfile(): Promise<StudentProfilePage> {
    await this.openProfileMenu();
    await this.studentInfoLink.click();
    await this.waitForReady();
    return new StudentProfilePage(this.page);
  }
}
