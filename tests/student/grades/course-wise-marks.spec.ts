import { test, expect, getAuthenticatedStudentPage } from '../../../src/fixtures/base';
import { Page } from '@playwright/test';
import { RdsStudentLandingPage } from '../../../src/pages/RdsStudentLandingPage';
import { RdsCourseWiseMarksPage } from '../../../src/pages/RdsCourseWiseMarksPage';

test.describe('Grades > Course Wise Marks', () => {
  test.describe.configure({ mode: 'serial' });
  let sharedPage: Page;
  let landingPage: RdsStudentLandingPage;
  let marksPage: RdsCourseWiseMarksPage;

  test.beforeAll(async ({ browser }) => {
    sharedPage = await getAuthenticatedStudentPage(browser);
    landingPage = new RdsStudentLandingPage(sharedPage);
    await landingPage.goto();
    marksPage = await landingPage.navigateToCourseWiseMarks();
  });

  test.afterAll(async () => {
    await sharedPage?.context()?.close();
  });

  test('1. Course Wise Marks Navigation & Filter Controls @smoke @grades', async () => {
    await test.step('Verify navigation to course wise marks route', async () => {
      await expect(sharedPage).toHaveURL(/students\/grade_history\/exam_marks/);
    });

    await test.step('Verify default page heading is visible', async () => {
      await expect(marksPage.pageHeading).toBeVisible();
      await expect(marksPage.pageHeading).toContainText('Course Wise Marks');
    });

    await test.step('Verify semester filter dropdown and See Marks button are visible', async () => {
      await expect(marksPage.semesterSelect).toBeVisible();
      await expect(marksPage.seeMarksButton).toBeVisible();
      await expect(marksPage.seeMarksButton).toBeEnabled();
    });
  });

  test('2. Filter Marks by Target Semester @smoke @grades', async () => {
    await test.step('Select Summer 2026 semester and submit filter', async () => {
      await marksPage.selectSemester('Summer 2026');
    });

    await test.step('Verify heading updates dynamically with chosen semester', async () => {
      await expect(marksPage.pageHeading).toContainText('Course Wise Marks (Summer 2026)');
    });
  });

  test('3. Course Section Breakdown Structure @regression @grades', async () => {
    await test.step('Verify course tables are displayed for selected semester', async () => {
      const count = await marksPage.courseTables.count();
      expect(count).toBeGreaterThan(0);
    });

    await test.step('Verify course table header contains Course/Section formatting', async () => {
      const firstCourseHeader = marksPage.courseTables.first().locator('th').filter({ hasText: /Course\/Section/i });
      await expect(firstCourseHeader).toBeVisible();
      await expect(firstCourseHeader).toContainText(/Course\/Section\s*:/i);
    });
  });

  test('4. Assessment Scoring Breakdown & Topic Details @regression @grades', async () => {
    await test.step('Verify course section contains assessment components', async () => {
      const cseTable = marksPage.getCourseTable('CSE215');
      await expect(cseTable).toBeVisible();

      // Check assessment headers
      await expect(cseTable).toContainText(/Mid|Quiz|Final/i);
    });

    await test.step('Verify assessment card topic, score, and bounds information', async () => {
      const cseTable = marksPage.getCourseTable('CSE215');
      await expect(cseTable).toContainText(/Topic\s*:/i);
      await expect(cseTable).toContainText(/Highest\s*:/i);
      await expect(cseTable).toContainText(/Lowest\s*:/i);
    });
  });
});
