import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { StudentProfilePage } from './StudentProfilePage';
import { ChangePasswordPage } from './ChangePasswordPage';
import { MajorDeclarationPage } from './MajorDeclarationPage';
import { AdvisingPage } from './AdvisingPage';

export class LandingPage extends BasePage {
  readonly profileDropdown: Locator;
  readonly studentInfoLink: Locator;
  readonly changePasswordLink: Locator;
  readonly majorDeclarationLink: Locator;
  readonly advisingDropdown: Locator;
  readonly advisingWindowLink: Locator;
  readonly userGreeting: Locator;
  readonly cgpaIndicator: Locator;
  readonly creditsIndicator: Locator;

  constructor(page: Page) {
    super(page);
    this.profileDropdown = page.locator('a.dropdown-toggle').filter({ hasText: 'Profile' }).first();
    this.studentInfoLink = page.getByRole('link', { name: 'Student Information' });
    this.changePasswordLink = page.getByRole('link', { name: 'Change Password' });
    this.majorDeclarationLink = page.getByRole('link', { name: 'Major Declaration' });
    this.advisingDropdown = page.locator('a.dropdown-toggle').filter({ hasText: 'Advising' }).first();
    this.advisingWindowLink = page.getByRole('link', { name: 'Advising Window' });
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

  async navigateToChangePassword(): Promise<ChangePasswordPage> {
    await this.openProfileMenu();
    await this.changePasswordLink.click();
    await this.waitForReady();
    return new ChangePasswordPage(this.page);
  }

  async navigateToMajorDeclaration(): Promise<MajorDeclarationPage> {
    await this.openProfileMenu();
    await this.majorDeclarationLink.click();
    await this.waitForReady();
    return new MajorDeclarationPage(this.page);
  }

  async openAdvisingMenu(): Promise<void> {
    await this.advisingDropdown.click();
  }

  async navigateToAdvising(): Promise<AdvisingPage> {
    await this.openAdvisingMenu();
    await this.advisingWindowLink.click();
    await this.waitForReady();
    return new AdvisingPage(this.page);
  }
}
