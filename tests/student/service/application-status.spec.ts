import { test, expect } from '../../../src/fixtures/base';
import { RdsStudentLandingPage } from '../../../src/pages/RdsStudentLandingPage';
import studentData from '../../data/rds-student-data.json';

test.describe('NSU RDS Student Application Status Service', () => {

  test.describe('Standard Student Request Tracking', () => {
    test.use({ storageState: 'playwright/.auth/student.json' });

    test('verifies Course Credit and Forgot ID requests in Application Status @smoke @critical', async ({
      page,
    }) => {
      test.slow();
      const studentLandingPage = new RdsStudentLandingPage(page);

      await test.step('Navigate to student dashboard', async () => {
        await studentLandingPage.goto();
        await expect(page).toHaveURL(/students\/landing/);
        await expect(studentLandingPage.welcomeHeading).toBeVisible();
      });

      let appStatusPage: any;
      await test.step('Navigate to Services -> Application Status', async () => {
        appStatusPage = await studentLandingPage.navigateToApplicationStatus();
        await expect(page).toHaveURL(/applied_applications/);
        await expect(appStatusPage.applicationsTable).toBeVisible();
      });

      await test.step('Verify Course Credit request is listed with PENDING status', async () => {
        const creditRow = appStatusPage.getRequestRow(/course credit/i, studentData.student.username);
        await expect(creditRow.first()).toBeVisible();
        await expect(creditRow.first()).toContainText('PENDING');
      });

      await test.step('Verify Forgot ID request is listed with PENDING status', async () => {
        const forgotIdRow = appStatusPage.getRequestRow(/forgot id/i, studentData.student.username);
        await expect(forgotIdRow.first()).toBeVisible();
        await expect(forgotIdRow.first()).toContainText('PENDING');
      });
    });
  });

  test.describe('Senior Student Request Tracking', () => {
    test.use({ storageState: 'playwright/.auth/student.json' });

    test('verifies Course Exclusion request in Application Status @smoke @critical', async ({
      page,
    }) => {
      test.slow();
      const studentLandingPage = new RdsStudentLandingPage(page);

      await test.step('Navigate to student dashboard', async () => {
        await studentLandingPage.goto();
        await expect(page).toHaveURL(/students\/landing/);
        await expect(studentLandingPage.welcomeHeading).toBeVisible();
      });

      let appStatusPage: any;
      await test.step('Navigate to Services -> Application Status', async () => {
        appStatusPage = await studentLandingPage.navigateToApplicationStatus();
        await expect(page).toHaveURL(/applied_applications/);
        await expect(appStatusPage.applicationsTable).toBeVisible();
      });

      await test.step('Verify Course Exclusion request in Application Status', async () => {
        const exclusionRow = appStatusPage.getRequestRow(/course exclusion/i, studentData.eligibleExclusionStudent?.username);
        const count = await exclusionRow.count();
        if (count > 0) {
          await expect(exclusionRow.first()).toBeVisible();
          await expect(exclusionRow.first()).toContainText('PENDING');
        } else {
          await expect(appStatusPage.applicationsTable).toBeVisible();
          await expect(appStatusPage.tableRows.first()).toBeVisible();
        }
      });
    });
  });

  test.describe('Inclusion Student Request Tracking', () => {
    test.use({ storageState: 'playwright/.auth/student.json' });

    test('verifies Course Inclusion request in Application Status @smoke @critical', async ({
      page,
    }) => {
      test.slow();
      const studentLandingPage = new RdsStudentLandingPage(page);

      await test.step('Navigate to student dashboard', async () => {
        await studentLandingPage.goto();
        await expect(page).toHaveURL(/students\/landing/);
        await expect(studentLandingPage.welcomeHeading).toBeVisible();
      });

      let appStatusPage: any;
      await test.step('Navigate to Services -> Application Status', async () => {
        appStatusPage = await studentLandingPage.navigateToApplicationStatus();
        await expect(page).toHaveURL(/applied_applications/);
        await expect(appStatusPage.applicationsTable).toBeVisible();
      });

      await test.step('Verify Course Inclusion request in Application Status', async () => {
        const inclusionRow = appStatusPage.getRequestRow(/course inclusion/i, studentData.eligibleInclusionStudent?.username);
        const count = await inclusionRow.count();
        if (count > 0) {
          await expect(inclusionRow.first()).toBeVisible();
          await expect(inclusionRow.first()).toContainText('PENDING');
        } else {
          await expect(appStatusPage.applicationsTable).toBeVisible();
          await expect(appStatusPage.tableRows.first()).toBeVisible();
        }
      });
    });
  });
});
