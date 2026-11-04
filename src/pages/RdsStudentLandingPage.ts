import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { RdsLoginPage } from './RdsLoginPage';
import { RdsCarParkingPage } from './RdsCarParkingPage';
import { RdsCreditStatusUpdatePage } from './RdsCreditStatusUpdatePage';
import { RdsCourseExclusionPage } from './RdsCourseExclusionPage';
import { RdsCourseInclusionPage } from './RdsCourseInclusionPage';
import { RdsForgotIdPage } from './RdsForgotIdPage';
import { RdsIdUnlockPage } from './RdsIdUnlockPage';
import { RdsLeavePage } from './RdsLeavePage';
import { RdsSemesterDropPage } from './RdsSemesterDropPage';
import { StudentProfilePage } from './StudentProfilePage';
import { ChangePasswordPage } from './ChangePasswordPage';
import { MajorDeclarationPage } from './MajorDeclarationPage';
import { AdvisingPage } from './AdvisingPage';
import { AdvisingSlipPage } from './AdvisingSlipPage';
import { PreAdvisingPage } from './PreAdvisingPage';

export class RdsStudentLandingPage extends BasePage {
  readonly welcomeHeading: Locator;
  readonly activityStatusHeading: Locator;
  readonly servicesMenuLink: Locator;
  readonly carParkingSubmenuLink: Locator;
  readonly creditStatusUpdateSubmenuLink: Locator;
  readonly courseExclusionSubmenuLink: Locator;
  readonly courseInclusionSubmenuLink: Locator;
  readonly forgotIdSubmenuLink: Locator;
  readonly idUnlockSubmenuLink: Locator;
  readonly leaveRequestSubmenuLink: Locator;
  readonly semesterDropSubmenuLink: Locator;
  readonly profileDropdown: Locator;
  readonly studentInfoLink: Locator;
  readonly changePasswordLink: Locator;
  readonly majorDeclarationLink: Locator;
  readonly advisingDropdown: Locator;
  readonly advisingWindowLink: Locator;
  readonly advisingSlipPrintLink: Locator;
  readonly preAdvisingLink: Locator;
  readonly userGreeting: Locator;
  readonly cgpaIndicator: Locator;
  readonly creditsIndicator: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeHeading = this.page.getByRole('heading', { name: /Welcome/i }).first();
    this.activityStatusHeading = this.page.getByRole('heading', { name: /Activity Status/i });
    this.servicesMenuLink = this.page.getByRole('link', { name: 'Services' });
    this.carParkingSubmenuLink = this.page.getByRole('link', { name: 'Car Parking' });
    this.creditStatusUpdateSubmenuLink = this.page.getByRole('link', { name: /credit.*non.*credit/i });
    this.courseExclusionSubmenuLink = this.page.getByRole('link', { name: 'Course Exclusion' });
    this.courseInclusionSubmenuLink = this.page.getByRole('link', { name: 'Course Inclusion' });
    this.forgotIdSubmenuLink = this.page.getByRole('link', { name: /forgot rfid|forgot id/i });
    this.idUnlockSubmenuLink = this.page.getByRole('link', { name: 'ID Unlock' });
    this.leaveRequestSubmenuLink = this.page.getByRole('link', { name: /leave request|application for leave/i });
    this.semesterDropSubmenuLink = this.page.getByRole('link', { name: 'Semester Drop' });
    this.profileDropdown = page.locator('a.dropdown-toggle').filter({ hasText: 'Profile' }).first();
    this.studentInfoLink = page.getByRole('link', { name: 'Student Information' });
    this.changePasswordLink = page.getByRole('link', { name: 'Change Password' });
    this.majorDeclarationLink = page.getByRole('link', { name: 'Major Declaration' });
    this.advisingDropdown = page.locator('a.dropdown-toggle').filter({ hasText: 'Advising' }).first();
    this.advisingWindowLink = page.getByRole('link', { name: 'Advising Window' });
    this.advisingSlipPrintLink = page.getByRole('link', { name: /advising slip print|print slip/i });
    this.preAdvisingLink = page.getByRole('link', { name: /^Pre-advising$/i });
    this.userGreeting = page.locator('h3, h4, .blue, .page-header').first();
    this.cgpaIndicator = page.locator('div:has-text("CGPA")').last();
    this.creditsIndicator = page.locator('div:has-text("Credits passed")').last();
    this.logoutLink = this.page.getByRole('link', { name: 'Logout' });
  }

  async goto(): Promise<void> {
    await this.page.goto('http://10.102.11.254/rds/students/landing');
    await this.waitForReady();

    // Auto-recover if session was invalidated or expired
    if (this.page.url().includes('/login') || this.page.url().endsWith('/rds/')) {
      const loginPage = new RdsLoginPage(this.page);
      await loginPage.loginAsStudent({ username: '2512560', password: '123' });
      await this.waitForReady();
    }
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

  async navigateToAdvisingSlipPrint(): Promise<AdvisingSlipPage> {
    await this.openAdvisingMenu();
    await this.advisingSlipPrintLink.click();
    await this.waitForReady();
    return new AdvisingSlipPage(this.page);
  }

  async navigateToPreAdvising(): Promise<PreAdvisingPage> {
    await this.openAdvisingMenu();
    await this.preAdvisingLink.click();
    await this.waitForReady();
    return new PreAdvisingPage(this.page);
  }

  async navigateToCarParking(): Promise<RdsCarParkingPage> {
    await this.servicesMenuLink.click();
    await this.carParkingSubmenuLink.click();
    await this.waitForReady();
    return new RdsCarParkingPage(this.page);
  }

  async navigateToCreditStatusUpdate(): Promise<RdsCreditStatusUpdatePage> {
    await this.servicesMenuLink.click();
    await this.creditStatusUpdateSubmenuLink.click();
    await this.waitForReady();
    return new RdsCreditStatusUpdatePage(this.page);
  }

  async navigateToCourseExclusion(): Promise<RdsCourseExclusionPage> {
    await this.servicesMenuLink.click();
    await this.courseExclusionSubmenuLink.click();
    await this.waitForReady();
    return new RdsCourseExclusionPage(this.page);
  }

  async navigateToCourseInclusion(): Promise<RdsCourseInclusionPage> {
    await this.servicesMenuLink.click();
    await this.courseInclusionSubmenuLink.click();
    await this.waitForReady();
    return new RdsCourseInclusionPage(this.page);
  }

  async navigateToForgotId(): Promise<RdsForgotIdPage> {
    await this.servicesMenuLink.click();
    await this.forgotIdSubmenuLink.click();
    await this.waitForReady();
    return new RdsForgotIdPage(this.page);
  }

  async navigateToIdUnlock(): Promise<RdsIdUnlockPage> {
    await this.servicesMenuLink.click();
    await this.idUnlockSubmenuLink.click();
    await this.waitForReady();
    return new RdsIdUnlockPage(this.page);
  }

  async navigateToLeave(): Promise<RdsLeavePage> {
    await this.servicesMenuLink.click();
    await this.leaveRequestSubmenuLink.click();
    await this.waitForReady();
    return new RdsLeavePage(this.page);
  }

  async navigateToSemesterDrop(): Promise<RdsSemesterDropPage> {
    await this.servicesMenuLink.click();
    await this.semesterDropSubmenuLink.click();
    await this.waitForReady();
    return new RdsSemesterDropPage(this.page);
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
    await this.waitForReady();
  }
}
