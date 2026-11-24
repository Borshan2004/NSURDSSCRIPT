import * as path from 'path';
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
import { PreAdvisedCoursesPage } from './PreAdvisedCoursesPage';
import { RdsWaiverCoursePage } from './RdsWaiverCoursePage';
import { RdsWritingCenterPage } from './RdsWritingCenterPage';
import { RdsApplicationStatusPage } from './RdsApplicationStatusPage';
import { RdsSmsHistoryPage } from './RdsSmsHistoryPage';
import { RdsCourseRequestPage } from './RdsCourseRequestPage';
import { RdsGradeHistoryPage } from './RdsGradeHistoryPage';
import { RdsCourseWiseMarksPage } from './RdsCourseWiseMarksPage';
import { RdsAttendancePage } from './RdsAttendancePage';
import { RdsFacultyEvaluationPage } from './RdsFacultyEvaluationPage';
import studentData from '../../tests/data/rds-student-data.json';

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
  readonly smsHistorySubmenuLink: Locator;
  readonly courseRequestSubmenuLink: Locator;

  readonly profileDropdown: Locator;
  readonly studentInfoLink: Locator;
  readonly changePasswordLink: Locator;
  readonly majorDeclarationLink: Locator;

  readonly advisingDropdown: Locator;
  readonly advisingWindowLink: Locator;
  readonly advisingSlipPrintLink: Locator;
  readonly preAdvisingLink: Locator;
  readonly preAdvisedCoursesLink: Locator;

  readonly gradesDropdown: Locator;
  readonly gradeHistorySubmenuLink: Locator;
  readonly courseWiseMarksSubmenuLink: Locator;
  readonly attendanceMenuLink: Locator;
  readonly facultyEvaluationMenuLink: Locator;

  readonly userGreeting: Locator;
  readonly cgpaIndicator: Locator;
  readonly creditsIndicator: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeHeading = this.page.locator('.page-content h2, h2, .page-header h1, h1, .blue').first();
    this.activityStatusHeading = this.page.locator('.page-content h3, .page-content h4, h3, h4').first();
    this.servicesMenuLink = this.page.locator('#sidebar li').filter({ hasText: 'Services' }).locator('> a.dropdown-toggle').or(this.page.getByRole('link', { name: 'Services' })).first();
    this.carParkingSubmenuLink = this.page.locator('a[href*="carParkingRequestDashboard"]').first();
    this.creditStatusUpdateSubmenuLink = this.page.locator('a[href*="CreditNonCreditStatusUpdate"]').first();
    this.courseExclusionSubmenuLink = this.page.locator('a[href*="CourseExclusion"]').first();
    this.courseInclusionSubmenuLink = this.page.locator('a[href*="CourseInclusion"]').first();
    this.forgotIdSubmenuLink = this.page.locator('a[href*="forgotId"]').first();
    this.idUnlockSubmenuLink = this.page.locator('a[href*="unlockId"]').first();
    this.leaveRequestSubmenuLink = this.page.locator('a[href*="student_leave"]').first();
    this.semesterDropSubmenuLink = this.page.locator('a[href*="semesterDrop"]').first();
    this.waiverCourseSubmenuLink = this.page.locator('a[href*="studentGeneralRequest"]').first();
    this.writingCenterSubmenuLink = this.page.locator('a[href*="writing-center"], a[href*="WritingCenter"]').first();
    this.applicationStatusSubmenuLink = this.page.locator('a[href*="applied_applications"]').first();
    this.smsHistorySubmenuLink = this.page.locator('a[href*="students/sms_history"]').first();
    this.courseRequestSubmenuLink = this.page.locator('a[href*="common/feedback/RequestCourse"]').first();

    this.profileDropdown = this.page.locator('#sidebar li').filter({ hasText: 'Profile' }).locator('> a.dropdown-toggle').or(this.page.locator('a.dropdown-toggle').filter({ hasText: 'Profile' })).first();
    this.studentInfoLink = this.page.locator('a[href*="students/profile"]').first();
    this.changePasswordLink = this.page.locator('a[href*="change_password"]').first();
    this.majorDeclarationLink = this.page.locator('a[href*="major_declaration"]').first();

    this.advisingDropdown = this.page.locator('#sidebar li').filter({ hasText: 'Advising' }).locator('> a.dropdown-toggle').or(this.page.locator('a.dropdown-toggle').filter({ hasText: 'Advising' })).first();
    this.advisingWindowLink = this.page.locator('a[href*="students/advising"]').first();
    this.advisingSlipPrintLink = this.page.locator('a[href*="printSlipIndex"]').first();
    this.preAdvisingLink = this.page.locator('a[href*="students/pre_advising"]').first();
    this.preAdvisedCoursesLink = this.page.locator('a[href*="students/pre_advised_courses"]').first();

    this.gradesDropdown = this.page.locator('#sidebar li').filter({ hasText: 'Grades' }).locator('> a.dropdown-toggle').or(this.page.locator('a.dropdown-toggle').filter({ hasText: 'Grades' })).first();
    this.gradeHistorySubmenuLink = this.page.locator('a[href*="students/grade_history"]').first();
    this.courseWiseMarksSubmenuLink = this.page.locator('a[href*="exam_marks"]').first();
    this.attendanceMenuLink = this.page.locator('a[href*="studentAttendanceLanding"]').first();
    this.facultyEvaluationMenuLink = this.page.locator('a[href*="faculty_evaluation"]').first();

    this.userGreeting = page.locator('h3, h4, .blue, .page-header').first();
    this.cgpaIndicator = page.locator('#crcgpa, div:has-text("CGPA")').first();
    this.creditsIndicator = page.locator('div:has-text("Credits passed")').first();
    this.logoutLink = this.page.locator('a[href*="logout"]').first();
  }

  async goto(user?: { username: string; password: string; twofaCode?: string }): Promise<void> {
    await this.page.goto('students/landing');
    await this.waitForReady();

    // If redirected to login due to session timeout or server-side invalidation
    if (!this.page.url().includes('students/landing')) {
      const userToLogin = user || studentData.student;
      const loginPage = new RdsLoginPage(this.page);
      await loginPage.loginAsStudent(userToLogin);
      await this.waitForReady();

      try {
        let authFileName = 'student.json';
        if (userToLogin.username === studentData.eligibleExclusionStudent.username) {
          authFileName = 'senior-student.json';
        } else if (userToLogin.username === studentData.eligibleInclusionStudent.username) {
          authFileName = 'inclusion-student.json';
        } else if (userToLogin.username === studentData.unlockIdStudent.username) {
          authFileName = 'unlock-student.json';
        }
        const authPath = path.resolve('playwright/.auth', authFileName);
        await this.page.context().storageState({ path: authPath });
      } catch {
        // storageState sync is best effort
      }
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

  async navigateToPreAdvisedCourses(): Promise<PreAdvisedCoursesPage> {
    await this.openAdvisingMenu();
    await this.preAdvisedCoursesLink.click();
    await this.waitForReady();
    return new PreAdvisedCoursesPage(this.page);
  }

  async openGradesMenu(): Promise<void> {
    await this.gradesDropdown.click();
  }

  async navigateToGradeHistory(): Promise<RdsGradeHistoryPage> {
    await this.openGradesMenu();
    await Promise.all([
      this.page.waitForURL(/grade_history/, { timeout: 10000 }),
      this.gradeHistorySubmenuLink.click({ force: true }),
    ]);
    await this.waitForReady();
    return new RdsGradeHistoryPage(this.page);
  }

  async navigateToCourseWiseMarks(): Promise<RdsCourseWiseMarksPage> {
    await this.openGradesMenu();
    await Promise.all([
      this.page.waitForURL(/exam_marks/, { timeout: 10000 }),
      this.courseWiseMarksSubmenuLink.click({ force: true }),
    ]);
    await this.waitForReady();
    return new RdsCourseWiseMarksPage(this.page);
  }

  private async ensureSubmenuOpen(menuToggle: Locator, submenuLink: Locator): Promise<void> {
    if (!(await submenuLink.isVisible())) {
      await menuToggle.click();
      await submenuLink.waitFor({ state: 'visible', timeout: 3000 }).catch(async () => {
        await menuToggle.click().catch(() => {});
      });
    }
  }

  async navigateToCarParking(): Promise<RdsCarParkingPage> {
    await this.ensureSubmenuOpen(this.servicesMenuLink, this.carParkingSubmenuLink);
    await this.carParkingSubmenuLink.click();
    await this.waitForReady();
    return new RdsCarParkingPage(this.page);
  }

  async navigateToCreditStatusUpdate(): Promise<RdsCreditStatusUpdatePage> {
    await this.ensureSubmenuOpen(this.servicesMenuLink, this.creditStatusUpdateSubmenuLink);
    await this.creditStatusUpdateSubmenuLink.click();
    await this.waitForReady();
    return new RdsCreditStatusUpdatePage(this.page);
  }

  async navigateToCourseExclusion(): Promise<RdsCourseExclusionPage> {
    await this.ensureSubmenuOpen(this.servicesMenuLink, this.courseExclusionSubmenuLink);
    await this.courseExclusionSubmenuLink.click();
    await this.waitForReady();
    return new RdsCourseExclusionPage(this.page);
  }

  async navigateToCourseInclusion(): Promise<RdsCourseInclusionPage> {
    await this.ensureSubmenuOpen(this.servicesMenuLink, this.courseInclusionSubmenuLink);
    await this.courseInclusionSubmenuLink.click();
    await this.waitForReady();
    return new RdsCourseInclusionPage(this.page);
  }

  async navigateToForgotId(): Promise<RdsForgotIdPage> {
    await this.ensureSubmenuOpen(this.servicesMenuLink, this.forgotIdSubmenuLink);
    await this.forgotIdSubmenuLink.click();
    await this.waitForReady();
    return new RdsForgotIdPage(this.page);
  }

  async navigateToIdUnlock(): Promise<RdsIdUnlockPage> {
    await this.ensureSubmenuOpen(this.servicesMenuLink, this.idUnlockSubmenuLink);
    await this.idUnlockSubmenuLink.click();
    await this.waitForReady();
    return new RdsIdUnlockPage(this.page);
  }

  async navigateToLeave(): Promise<RdsLeavePage> {
    await this.ensureSubmenuOpen(this.servicesMenuLink, this.leaveRequestSubmenuLink);
    await this.leaveRequestSubmenuLink.click();
    await this.waitForReady();
    return new RdsLeavePage(this.page);
  }

  async navigateToSemesterDrop(): Promise<RdsSemesterDropPage> {
    await this.ensureSubmenuOpen(this.servicesMenuLink, this.semesterDropSubmenuLink);
    await this.semesterDropSubmenuLink.click();
    await this.waitForReady();
    return new RdsSemesterDropPage(this.page);
  }

  async navigateToWaiverCourse(): Promise<RdsWaiverCoursePage> {
    await this.ensureSubmenuOpen(this.servicesMenuLink, this.waiverCourseSubmenuLink);
    await this.waiverCourseSubmenuLink.click({ force: true });
    await this.waitForReady();
    return new RdsWaiverCoursePage(this.page);
  }

  async navigateToWritingCenter(): Promise<RdsWritingCenterPage> {
    await this.ensureSubmenuOpen(this.servicesMenuLink, this.writingCenterSubmenuLink);
    await Promise.all([
      this.page.waitForURL(/writing-centers/, { timeout: 10000 }).catch(async () => {
        await this.page.goto('bookings/writing-centers');
      }),
      this.writingCenterSubmenuLink.click({ force: true }),
    ]);
    await this.waitForReady();
    return new RdsWritingCenterPage(this.page);
  }

  async navigateToApplicationStatus(): Promise<RdsApplicationStatusPage> {
    await this.ensureSubmenuOpen(this.servicesMenuLink, this.applicationStatusSubmenuLink);
    await Promise.all([
      this.page.waitForURL(/applied_applications/, { timeout: 5000 }).catch(async () => {
        await this.page.goto('bpm/applied_applications');
      }),
      this.applicationStatusSubmenuLink.click({ force: true }),
    ]);
    await this.waitForReady();
    return new RdsApplicationStatusPage(this.page);
  }

  async navigateToSmsHistory(): Promise<RdsSmsHistoryPage> {
    await this.ensureSubmenuOpen(this.servicesMenuLink, this.smsHistorySubmenuLink);
    await this.smsHistorySubmenuLink.click({ force: true });
    await this.waitForReady();
    return new RdsSmsHistoryPage(this.page);
  }

  async navigateToCourseRequest(): Promise<RdsCourseRequestPage> {
    await this.ensureSubmenuOpen(this.servicesMenuLink, this.courseRequestSubmenuLink);
    await this.courseRequestSubmenuLink.click({ force: true });
    await this.waitForReady();
    return new RdsCourseRequestPage(this.page);
  }

  async navigateToAttendance(): Promise<RdsAttendancePage> {
    await Promise.all([
      this.page.waitForURL(/studentAttendanceLanding/, { timeout: 10000 }),
      this.attendanceMenuLink.click(),
    ]);
    await this.waitForReady();
    return new RdsAttendancePage(this.page);
  }

  async navigateToFacultyEvaluation(): Promise<RdsFacultyEvaluationPage> {
    await Promise.all([
      this.page.waitForURL(/FacultyEvaluation/, { timeout: 10000 }),
      this.facultyEvaluationMenuLink.click(),
    ]);
    await this.waitForReady();
    return new RdsFacultyEvaluationPage(this.page);
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
    await this.waitForReady();
  }
}
