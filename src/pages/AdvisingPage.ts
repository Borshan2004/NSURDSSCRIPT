import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdvisingPage extends BasePage {
  readonly systemHeading: Locator;
  readonly countdownTimer: Locator;
  readonly logoutLink: Locator;

  // Student Info Bar
  readonly studentName: Locator;
  readonly cgpaValue: Locator;

  // Course Taking Input & Form Controls
  readonly courseInputField: Locator;
  readonly saveButton: Locator;
  readonly discardButton: Locator;

  // Saved Courses & Offerings Tables
  readonly savedCoursesTable: Locator;
  readonly totalCreditsSummary: Locator;
  readonly advisingRules: Locator;
  readonly courseOfferingsTable: Locator;

  constructor(page: Page) {
    super(page);

    this.systemHeading = page.getByText('North South University Online Advising System');
    this.countdownTimer = page.locator('#clockBlock');
    this.logoutLink = page.locator('#topicons a').filter({ hasText: 'Log Out' });

    this.studentName = page.locator('#studentName');
    this.cgpaValue = page.locator('#crcgpa');

    this.courseInputField = page.locator('#searchText');
    this.saveButton = page.locator('input[value="Save"], button:has-text("Save")').first();
    this.discardButton = page.locator('input[value="Discard Changes"], button:has-text("Discard Changes")').first();

    this.savedCoursesTable = page.locator('table').first();
    this.totalCreditsSummary = page.locator('tr:has-text("Total:"), td:has-text("Total:")').first();
    this.advisingRules = page.locator('.body, div').filter({ hasText: /Dropping is ALLOWED/i }).first();
    this.courseOfferingsTable = page.locator('table').last();
  }

  async goto(): Promise<void> {
    await this.page.goto('students/advising');
    await this.waitForReady();
  }

  async searchCourse(courseCode: string): Promise<void> {
    await this.courseInputField.fill(courseCode);
  }
}
