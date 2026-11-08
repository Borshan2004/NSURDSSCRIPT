import { test, expect } from '../../../src/fixtures/base';
import { RdsStudentLandingPage } from '../../../src/pages/RdsStudentLandingPage';
import { RdsAttendancePage } from '../../../src/pages/RdsAttendancePage';

test.describe('Student Attendance Records', () => {
  test.use({ storageState: 'playwright/.auth/student.json' });

  test('1. Class Attendance Landing & Semester Selection @smoke @attendance', async ({ page }) => {
    const studentLandingPage = new RdsStudentLandingPage(page);

    await test.step('Navigate to student dashboard', async () => {
      await studentLandingPage.goto();
      await expect(page).toHaveURL(/students\/landing/);
      await expect(studentLandingPage.welcomeHeading).toBeVisible();
    });

    let attendancePage: RdsAttendancePage;
    await test.step('Navigate to Attendance via navbar', async () => {
      attendancePage = await studentLandingPage.navigateToAttendance();
      await expect(page).toHaveURL(/studentAttendanceLanding/);
      await expect(attendancePage.pageHeading).toBeVisible();
      await expect(attendancePage.pageHeading).toContainText(/Class Attendance/i);
    });

    await test.step('Verify semester dropdown is visible and contains expected semesters', async () => {
      await expect(attendancePage.semesterSelect).toBeVisible();
      const options = await attendancePage.semesterSelect.locator('option').allInnerTexts();
      expect(options).toContain('Summer 2026');
      expect(options).toContain('Fall 2026');
    });

    await test.step('Select Summer 2026 semester and verify course list header', async () => {
      await attendancePage.selectSemester('Summer 2026');
      await expect(page).toHaveURL(/studentAttendanceLanding/);
      await expect(attendancePage.courseListHeading).toBeVisible();
      await expect(attendancePage.courseListHeading).toContainText(/Course list for the sem[e]?ster : Summer 2026/i);
    });
  });

  test('2. Course Enrolled Attendance Table Structure @smoke @attendance', async ({ page }) => {
    const attendancePage = new RdsAttendancePage(page);

    await test.step('Navigate to attendance landing and select Summer 2026', async () => {
      await attendancePage.goto();
      await attendancePage.selectSemester('Summer 2026');
      await expect(attendancePage.coursesTable).toBeVisible();
    });

    await test.step('Verify course table columns and enrolled course entries', async () => {
      const headers = await attendancePage.coursesTable.locator('thead th').allInnerTexts();
      expect(headers.join(' ')).toMatch(/Course Code/i);
      expect(headers.join(' ')).toMatch(/Section/i);
      expect(headers.join(' ')).toMatch(/Course Title/i);
      expect(headers.join(' ')).toMatch(/Faculty/i);

      const rowsCount = await attendancePage.courseRows.count();
      expect(rowsCount).toBeGreaterThan(0);

      // Verify each course row has a Check Attendance action button
      const checkBtn = attendancePage.courseRows.first().getByRole('link', { name: /Check Attendance/i });
      await expect(checkBtn).toBeVisible();
    });
  });

  test('3. Course Attendance Details Breakdown & Lecture Logs @regression @attendance', async ({ page }) => {
    const attendancePage = new RdsAttendancePage(page);

    await test.step('Navigate to attendance landing and select Summer 2026', async () => {
      await attendancePage.goto();
      await attendancePage.selectSemester('Summer 2026');
      await expect(attendancePage.coursesTable).toBeVisible();
    });

    await test.step('Click Check Attendance for the first course', async () => {
      const firstCourseCode = (await attendancePage.courseRows.first().locator('td:nth-child(1)').innerText()).trim();
      expect(firstCourseCode).toBeTruthy();

      await attendancePage.clickCheckAttendance(firstCourseCode);
      await expect(page).toHaveURL(/getCoursesAttendanceByStudentNumber/);
    });

    await test.step('Verify Class Attendance detail page header and summary details', async () => {
      await expect(attendancePage.detailHeading).toBeVisible();
      await expect(attendancePage.detailHeading).toContainText(/Class Attendance/i);

      await expect(attendancePage.summaryStudentName).toBeVisible();
      await expect(attendancePage.summaryStudentId).toBeVisible();
      await expect(attendancePage.summaryCourseCode).toBeVisible();
      await expect(attendancePage.summaryFaculty).toBeVisible();
      await expect(attendancePage.summaryTotalLectures).toBeVisible();
      await expect(attendancePage.summaryAttended).toBeVisible();
      await expect(attendancePage.summaryConsecutiveMissing).toBeVisible();
    });

    await test.step('Verify lecture logs table structure and badges', async () => {
      await expect(attendancePage.lectureTable).toBeVisible();
      const lectureHeaders = await attendancePage.lectureTable.locator('thead th, tr:first-child th').allInnerTexts();
      expect(lectureHeaders.join(' ')).toMatch(/Lecture No/i);
      expect(lectureHeaders.join(' ')).toMatch(/Lecture Date/i);
      expect(lectureHeaders.join(' ')).toMatch(/Attended/i);

      const lectureCount = await attendancePage.lectureRows.count();
      expect(lectureCount).toBeGreaterThan(0);

      // Verify at least one status badge (YES or NO) is present in the table
      const firstLectureStatus = attendancePage.lectureRows.first().locator('td:nth-child(3)');
      await expect(firstLectureStatus).toBeVisible();
      const statusText = await firstLectureStatus.innerText();
      expect(['YES', 'NO']).toContain(statusText.trim());
    });

    await test.step('Verify Print and Back buttons are available', async () => {
      await expect(attendancePage.printButton).toBeVisible();
      await expect(attendancePage.backButton).toBeVisible();
    });
  });

  test('4. Detail View Navigation Back to Course List @smoke @attendance', async ({ page }) => {
    const attendancePage = new RdsAttendancePage(page);

    await test.step('Navigate to course attendance details directly', async () => {
      await attendancePage.goto();
      await attendancePage.selectSemester('Summer 2026');
      const firstCourseCode = (await attendancePage.courseRows.first().locator('td:nth-child(1)').innerText()).trim();
      await attendancePage.clickCheckAttendance(firstCourseCode);
      await expect(page).toHaveURL(/getCoursesAttendanceByStudentNumber/);
    });

    await test.step('Click Back button and verify navigation back to course list landing', async () => {
      await attendancePage.clickBack();
      await expect(page).toHaveURL(/studentAttendanceLanding/);
      await expect(attendancePage.pageHeading).toBeVisible();
      await expect(attendancePage.coursesTable).toBeVisible();
    });
  });
});
