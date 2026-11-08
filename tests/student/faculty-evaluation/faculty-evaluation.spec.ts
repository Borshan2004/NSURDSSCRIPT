import { test, expect } from '../../../src/fixtures/base';
import { RdsStudentLandingPage } from '../../../src/pages/RdsStudentLandingPage';

test.describe('Student Faculty Evaluation', () => {
  test.use({ storageState: 'playwright/.auth/student.json' });

  test('1. Faculty Evaluation Navigation & Schedule Window Alert @smoke @evaluation', async ({ page }) => {
    const studentLandingPage = new RdsStudentLandingPage(page);

    await test.step('Navigate to student dashboard', async () => {
      await studentLandingPage.goto();
      await expect(page).toHaveURL(/students\/landing/);
      await expect(studentLandingPage.welcomeHeading).toBeVisible();
    });

    let facultyEvalPage: any;
    await test.step('Navigate to Faculty Evaluation via navbar', async () => {
      facultyEvalPage = await studentLandingPage.navigateToFacultyEvaluation();
      await expect(page).toHaveURL(/FacultyEvaluation/);
      await expect(facultyEvalPage.pageHeading).toBeVisible();
    });

    await test.step('Verify evaluation schedule window notification alert', async () => {
      await expect(facultyEvalPage.evaluationNoticeAlert).toBeVisible();
      await expect(facultyEvalPage.evaluationNoticeAlert).toContainText(
        /Faculty evaluation\s*\(Fall 2026\)\s*for Regular student start from 01-Oct-2026 to 31-Oct-2026/i
      );
    });

    await test.step('Verify footer brand notice', async () => {
      await expect(facultyEvalPage.footerBrand).toBeVisible();
    });
  });
});
