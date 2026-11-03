import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class StudentProfilePage extends BasePage {
  readonly generalInfoTab: Locator;
  readonly personalParentInfoTab: Locator;
  readonly noticeBanner: Locator;
  readonly studentBadge: Locator;

  // General Information Fields
  readonly fullNameValue: Locator;
  readonly studentIdValue: Locator;
  readonly enrolledDegreeValue: Locator;
  readonly curriculumValue: Locator;
  readonly currentStatusValue: Locator;
  readonly cgpaValue: Locator;
  readonly creditsPassedValue: Locator;
  readonly probationValue: Locator;

  // Personal & Parent Information Fields
  readonly cellPhoneValue: Locator;
  readonly personalEmailValue: Locator;
  readonly nidValue: Locator;
  readonly dateOfBirthValue: Locator;
  readonly fatherNameValue: Locator;
  readonly motherNameValue: Locator;
  readonly editPersonalInfoButton: Locator;

  constructor(page: Page) {
    super(page);
    this.generalInfoTab = page.locator('.nav-tabs a').filter({ hasText: 'General Information' });
    this.personalParentInfoTab = page.locator('.nav-tabs a').filter({ hasText: 'Personal & Parent Information' });
    this.noticeBanner = page.locator('div:has-text("For any kind of query about your profile information")').first();
    this.studentBadge = page.locator('.profile-user-info, .profile-contact-info, .profile-picture, a[href="#"]').first();

    // Field value locators bound by row header
    this.fullNameValue = page.locator('.profile-info-row:has(.profile-info-name:has-text("Full Name:")) .profile-info-value');
    this.studentIdValue = page.locator('.profile-info-row:has(.profile-info-name:has-text("Student ID:")) .profile-info-value').first();
    this.enrolledDegreeValue = page.locator('.profile-info-row:has(.profile-info-name:has-text("Enrolled In:")) .profile-info-value');
    this.curriculumValue = page.locator('.profile-info-row:has(.profile-info-name:has-text("Curriculum Name:")) .profile-info-value');
    this.currentStatusValue = page.locator('.profile-info-row:has(.profile-info-name:has-text("Current Status:")) .profile-info-value');
    this.cgpaValue = page.locator('.profile-info-row:has(.profile-info-name:has-text("Current CGPA:")) .profile-info-value');
    this.creditsPassedValue = page.locator('.profile-info-row:has(.profile-info-name:has-text("Credit Passed:")) .profile-info-value');
    this.probationValue = page.locator('.profile-info-row:has(.profile-info-name:has-text("Probation:")) .profile-info-value');

    this.cellPhoneValue = page.locator('.profile-info-row:has(.profile-info-name:has-text("Cell Phone:")) .profile-info-value');
    this.personalEmailValue = page.locator('.profile-info-row:has(.profile-info-name:has-text("Personal Email:")) .profile-info-value');
    this.nidValue = page.locator('.profile-info-row:has(.profile-info-name:has-text("NID:")) .profile-info-value');
    this.dateOfBirthValue = page.locator('.profile-info-row:has(.profile-info-name:has-text("Date of Birth:")) .profile-info-value');
    this.fatherNameValue = page.locator('.profile-info-row:has(.profile-info-name:has-text("Father Name:")) .profile-info-value');
    this.motherNameValue = page.locator('.profile-info-row:has(.profile-info-name:has-text("Mother Name:")) .profile-info-value');
    this.editPersonalInfoButton = page.locator('#showOTPPanel');
  }

  async goto(): Promise<void> {
    await this.page.goto('students/profile');
    await this.waitForReady();
  }

  async switchToGeneralInfo(): Promise<void> {
    await this.generalInfoTab.click();
  }

  async switchToPersonalAndParentInfo(): Promise<void> {
    await this.personalParentInfoTab.click();
  }
}
