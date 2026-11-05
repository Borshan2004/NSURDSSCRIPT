import { test, expect, getAuthenticatedStudentPage } from '../../../src/fixtures/base';
import { Page } from '@playwright/test';
import { RdsStudentLandingPage } from '../../../src/pages/RdsStudentLandingPage';
import { RdsGradeHistoryPage } from '../../../src/pages/RdsGradeHistoryPage';
import testUsers from '../../data/test-users.json';

test.describe('Grades > Grade History', () => {
  test.describe.configure({ mode: 'serial' });
  let sharedPage: Page;
  let landingPage: RdsStudentLandingPage;
  let gradeHistoryPage: RdsGradeHistoryPage;

  test.beforeAll(async ({ browser }) => {
    sharedPage = await getAuthenticatedStudentPage(browser);
    landingPage = new RdsStudentLandingPage(sharedPage);
    await landingPage.goto();
    gradeHistoryPage = await landingPage.navigateToGradeHistory();
  });

  test.afterAll(async () => {
    await sharedPage?.context()?.close();
  });

  test('1. Grade History Navigation & Header @smoke @grades', async () => {
    await test.step('Verify navigation to grade history route', async () => {
      await expect(sharedPage).toHaveURL(/students\/grade_history/);
    });

    await test.step('Verify grade history heading is displayed with student ID', async () => {
      await expect(gradeHistoryPage.pageHeading).toBeVisible();
      await expect(gradeHistoryPage.pageHeading).toContainText(testUsers.student.username);
    });
  });

  test('2. Student Summary Standing Validation @smoke @grades', async () => {
    await test.step('Verify summary table is visible', async () => {
      await expect(gradeHistoryPage.summaryTable).toBeVisible();
    });

    await test.step('Verify student full name matches registered credentials', async () => {
      await expect(gradeHistoryPage.studentNameCell).toContainText(testUsers.student.fullName);
    });

    await test.step('Verify completed credits and CGPA format', async () => {
      await expect(gradeHistoryPage.creditCompletedCell).toHaveText(testUsers.student.creditsPassed);
      await expect(gradeHistoryPage.cgpaCell).toHaveText(testUsers.student.cgpa);
    });
  });

  test('3. Grade History Table & Course Entries Validation @regression @grades', async () => {
    await test.step('Verify Waiver & Transfer headings are present', async () => {
      await expect(gradeHistoryPage.waiverHeading).toBeVisible();
      await expect(gradeHistoryPage.transferHeading).toBeVisible();
    });

    await test.step('Verify semester grade history table headers', async () => {
      await expect(gradeHistoryPage.gradeHistoryTable).toBeVisible();
      await expect(gradeHistoryPage.gradeHistoryTable).toContainText('Semester Name');
      await expect(gradeHistoryPage.gradeHistoryTable).toContainText('Course Code');
      await expect(gradeHistoryPage.gradeHistoryTable).toContainText('Course Grade');
      await expect(gradeHistoryPage.gradeHistoryTable).toContainText('Cr.Passed');
    });

    await test.step('Verify completed course entry in history table', async () => {
      const cseRow = gradeHistoryPage.getCourseRow('CSE115');
      await expect(cseRow).toBeVisible();
    });
  });

  test('4. Print Grade History Action Readiness @smoke @grades', async () => {
    await test.step('Verify Print Grade History button is visible and enabled', async () => {
      await expect(gradeHistoryPage.printGradesButton).toBeVisible();
      await expect(gradeHistoryPage.printGradesButton).toBeEnabled();
      await expect(gradeHistoryPage.printGradesButton).toHaveText(/Print Grade History/i);
    });
  });
});
