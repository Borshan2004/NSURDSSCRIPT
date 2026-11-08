import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RdsAttendancePage extends BasePage {
  // --- Attendance Landing ---
  readonly pageHeading: Locator;
  readonly semesterSelect: Locator;
  readonly courseListHeading: Locator;
  readonly coursesTable: Locator;
  readonly courseRows: Locator;

  // --- Course Attendance Detail View ---
  readonly detailHeading: Locator;
  readonly summaryStudentName: Locator;
  readonly summaryStudentId: Locator;
  readonly summaryCourseCode: Locator;
  readonly summaryFaculty: Locator;
  readonly summaryTotalLectures: Locator;
  readonly summaryAttended: Locator;
  readonly summaryConsecutiveMissing: Locator;
  readonly lectureTable: Locator;
  readonly lectureRows: Locator;
  readonly backButton: Locator;
  readonly printButton: Locator;

  constructor(page: Page) {
    super(page);

    // Landing Page locators
    this.pageHeading = this.page
      .getByRole('heading', { name: /Class Attendance/i })
      .or(this.page.getByText(/Class Attendance\s*-\s*\d+/i))
      .first();
    this.semesterSelect = this.page.locator('#semester');
    this.courseListHeading = this.page.getByText(/Course list for the sem[e]?ster/i);
    this.coursesTable = this.page.locator('#simple-table');
    this.courseRows = this.page.locator('#simple-table tbody tr');

    // Detail View locators
    this.detailHeading = this.page
      .getByRole('heading', { name: /Class Attendance/i })
      .or(this.page.getByText(/Class Attendance\s+\w+\s+\d+/i))
      .first();
    this.summaryStudentName = this.page.locator('tr:has-text("Student Name:"), div:has-text("Student Name:")').first();
    this.summaryStudentId = this.page.locator('tr:has-text("Student ID:"), div:has-text("Student ID:")').first();
    this.summaryCourseCode = this.page.locator('tr:has-text("CourseCode:"), div:has-text("CourseCode:")').first();
    this.summaryFaculty = this.page.locator('tr:has-text("Faculty:"), div:has-text("Faculty:")').first();
    this.summaryTotalLectures = this.page.locator('tr:has-text("Total Lecture Number:"), div:has-text("Total Lecture Number:")').first();
    this.summaryAttended = this.page.locator('tr:has-text("Lecture Attended:"), div:has-text("Lecture Attended:")').first();
    this.summaryConsecutiveMissing = this.page.locator('tr:has-text("Consecutive Missing:"), div:has-text("Consecutive Missing:")').first();
    this.lectureTable = this.page.locator('table').last();
    this.lectureRows = this.page.locator('table').last().locator('tbody tr');
    this.backButton = this.page.getByRole('link', { name: 'Back' });
    this.printButton = this.page.getByRole('button', { name: 'Print' }).or(this.page.locator('input[value="Print"]'));
  }

  async goto(): Promise<void> {
    await this.page.goto('attendance/attendance/studentAttendanceLanding');
    await this.waitForReady();
  }

  async selectSemester(semester: string): Promise<void> {
    await Promise.all([
      this.page.waitForURL(/studentAttendanceLanding/),
      this.semesterSelect.selectOption({ label: semester }),
    ]);
    await this.waitForReady();
  }

  async getSelectedSemester(): Promise<string> {
    return (await this.semesterSelect.locator('option:checked').innerText()).trim();
  }

  getCourseRow(courseCode: string): Locator {
    return this.courseRows.filter({
      has: this.page.locator('td:nth-child(1)', { hasText: new RegExp(`^\\s*${courseCode}\\s*$`) }),
    });
  }

  async clickCheckAttendance(courseCode: string): Promise<void> {
    const row = this.getCourseRow(courseCode);
    const checkBtn = row.getByRole('link', { name: /Check Attendance/i }).first();
    await Promise.all([
      this.page.waitForURL(/getCoursesAttendanceByStudentNumber/),
      checkBtn.click(),
    ]);
    await this.waitForReady();
  }

  async clickBack(): Promise<void> {
    await Promise.all([
      this.page.waitForURL(/studentAttendanceLanding/),
      this.backButton.click(),
    ]);
    await this.waitForReady();
  }
}
