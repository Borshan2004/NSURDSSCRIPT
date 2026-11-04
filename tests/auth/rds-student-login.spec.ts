import { test, expect } from '../../src/fixtures/base';
import { RdsLoginPage } from '../../src/pages/RdsLoginPage';
import studentData from '../data/rds-student-data.json';

test.describe('NSU RDS Student Login', () => {
  test('authenticates student and verifies student dashboard @smoke @critical', async ({ page }) => {
    const loginPage = new RdsLoginPage(page);

    await test.step('Navigate to RDS login portal', async () => {
      await loginPage.goto();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.nextButton).toBeVisible();
    });

    let studentLandingPage: any;
    await test.step('Enter student credentials and log in', async () => {
      studentLandingPage = await loginPage.loginAsStudent(studentData.student);
    });

    await test.step('Verify landing on student dashboard', async () => {
      await expect(page).toHaveURL(/students\/landing/);
      await expect(studentLandingPage.welcomeHeading).toBeVisible();
      await expect(studentLandingPage.activityStatusHeading).toBeVisible();
      await expect(studentLandingPage.logoutLink).toBeVisible();

      // Refresh storageState so subsequent tests retain the active session
      await page.context().storageState({ path: 'playwright/.auth/student.json' });
    });
  });
});
