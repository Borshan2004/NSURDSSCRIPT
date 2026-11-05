import { test, expect, getAuthenticatedStudentPage } from '../../../src/fixtures/base';
import { Page } from '@playwright/test';
import { RdsStudentLandingPage } from '../../../src/pages/RdsStudentLandingPage';
import { PreAdvisedCoursesPage } from '../../../src/pages/PreAdvisedCoursesPage';

test.describe('Advising > Pre Advised Courses Slip Validation', () => {
  test.describe.configure({ mode: 'serial' });
  let sharedPage: Page;
  let landingPage: RdsStudentLandingPage;
  let preAdvisedCoursesPage: PreAdvisedCoursesPage;

  test.beforeAll(async ({ browser }) => {
    sharedPage = await getAuthenticatedStudentPage(browser);
    landingPage = new RdsStudentLandingPage(sharedPage);
    await landingPage.goto();
    preAdvisedCoursesPage = await landingPage.navigateToPreAdvisedCourses();
  });

  test.afterAll(async () => {
    await sharedPage?.context()?.close();
  });

  test('1. Pre Advised Courses Route Navigation @smoke @advising', async () => {
    await test.step('Verify navigation URL targets preAdvisingSlip route', async () => {
      await expect(sharedPage).toHaveURL(/preAdvisingSlip/);
    });

    await test.step('Verify academic semester banner is displayed', async () => {
      await expect(preAdvisedCoursesPage.pageHeading).toBeVisible();
    });
  });

  test('2. Chosen Courses or Not Pre-Advised Status Validation @smoke @advising', async () => {
    const hasChosenCourses = await preAdvisedCoursesPage.chosenCoursesHeading.isVisible();
    if (hasChosenCourses) {
      await test.step('Verify "Your chosen courses:" section heading', async () => {
        await expect(preAdvisedCoursesPage.chosenCoursesHeading).toBeVisible();
      });

      await test.step('Verify pre-advised courses table is rendered with correct headers', async () => {
        await expect(preAdvisedCoursesPage.coursesTable).toBeVisible();
        const headers = preAdvisedCoursesPage.tableHeaders;
        await expect(headers.nth(0)).toContainText('#');
        await expect(headers.nth(1)).toContainText('Course');
        await expect(headers.nth(2)).toContainText('Credit');
        await expect(headers.nth(3)).toContainText('Course Title');
        await expect(headers.nth(4)).toContainText('Date');
      });
    } else {
      await test.step('Verify "You Have not Pre-Advised" status notification is displayed', async () => {
        await expect(preAdvisedCoursesPage.notPreAdvisedHeading).toBeVisible();
      });
    }
  });

  test('3. Pre-Advised Course Records & Academic Data Integrity @regression @advising', async () => {
    const hasChosenCourses = await preAdvisedCoursesPage.chosenCoursesHeading.isVisible();
    if (!hasChosenCourses) {
      test.skip(!hasChosenCourses, 'Student has not pre-advised courses for the current semester');
      return;
    }

    await test.step('Verify at least one pre-advised course row exists in the slip', async () => {
      const rowCount = await preAdvisedCoursesPage.getCourseCount();
      expect(rowCount).toBeGreaterThanOrEqual(1);
    });

    await test.step('Verify course rows display valid course codes, credits, and date timestamps', async () => {
      const firstRow = preAdvisedCoursesPage.courseRows.first();
      await expect(firstRow).toBeVisible();

      const cells = firstRow.locator('td');
      // Index should be a number
      await expect(cells.nth(0)).toHaveText(/^\d+\.?$/);
      // Course code should be standard uppercase letter+number (e.g., EEE111, MAT125)
      await expect(cells.nth(1)).toHaveText(/^[A-Z]{3,4}\d{3}[A-Z]?$/);
      // Credit should be numeric format (e.g. 1.0, 3.0)
      await expect(cells.nth(2)).toHaveText(/^\d+\.\d$/);
      // Course title should have alphabetic text
      await expect(cells.nth(3)).toHaveText(/\w+/);
      // Date should match standard ISO/university datetime format (YYYY-MM-DD HH:MM:SS)
      await expect(cells.nth(4)).toHaveText(/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/);
    });
  });
});
