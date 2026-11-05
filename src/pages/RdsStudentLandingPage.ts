import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { RdsCarParkingPage } from './RdsCarParkingPage';
import { RdsCreditStatusUpdatePage } from './RdsCreditStatusUpdatePage';
import { RdsCourseExclusionPage } from './RdsCourseExclusionPage';
import { RdsCourseInclusionPage } from './RdsCourseInclusionPage';
import { RdsForgotIdPage } from './RdsForgotIdPage';
import { RdsIdUnlockPage } from './RdsIdUnlockPage';
import { RdsLeavePage } from './RdsLeavePage';
import { RdsSemesterDropPage } from './RdsSemesterDropPage';
import { RdsWaiverCoursePage } from './RdsWaiverCoursePage';
import { RdsWritingCenterPage } from './RdsWritingCenterPage';
import { RdsApplicationStatusPage } from './RdsApplicationStatusPage';

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
  readonly waiverCourseSubmenuLink: Locator;
  readonly writingCenterSubmenuLink: Locator;
  readonly applicationStatusSubmenuLink: Locator;
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
    this.waiverCourseSubmenuLink = this.page.getByRole('link', { name: 'Waiver Course Issue' });
    this.writingCenterSubmenuLink = this.page.getByRole('link', { name: 'NSU Writing Center' });
    this.applicationStatusSubmenuLink = this.page.getByRole('link', { name: 'Application Status' });
    this.logoutLink = this.page.getByRole('link', { name: 'Logout' });
  }

  async goto(): Promise<void> {
    await this.page.goto('students/landing');
    await this.waitForReady();
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

  async navigateToWaiverCourse(): Promise<RdsWaiverCoursePage> {
    await this.servicesMenuLink.click();
    await this.waiverCourseSubmenuLink.click();
    await this.waitForReady();
    return new RdsWaiverCoursePage(this.page);
  }

  async navigateToWritingCenter(): Promise<RdsWritingCenterPage> {
    await this.servicesMenuLink.click();
    await this.writingCenterSubmenuLink.click();
    await this.waitForReady();
    return new RdsWritingCenterPage(this.page);
  }

  async navigateToApplicationStatus(): Promise<RdsApplicationStatusPage> {
    await this.servicesMenuLink.click();
    await this.applicationStatusSubmenuLink.click();
    await this.waitForReady();
    return new RdsApplicationStatusPage(this.page);
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
    await this.waitForReady();
  }
}
