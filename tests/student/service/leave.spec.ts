import { test, expect } from '../../../src/fixtures/base';
import { RdsStudentLandingPage } from '../../../src/pages/RdsStudentLandingPage';
import leaveData from '../../data/leave-data.json';
import studentData from '../../data/rds-student-data.json';

test.describe('NSU RDS Student Application for Leave', () => {
  test.use({ storageState: 'playwright/.auth/student.json' });

  test('navigates to Leave Request under Services, fills and submits form, and verifies confirmation @smoke @critical', async ({
    page,
  }) => {
    test.slow();

    const studentLandingPage = new RdsStudentLandingPage(page);

    await test.step('Navigate to student dashboard', async () => {
      await studentLandingPage.goto(studentData.eligibleInclusionStudent);
      await expect(page).toHaveURL(/students\/landing/);
      await expect(studentLandingPage.welcomeHeading).toBeVisible();
    });

    let leavePage: any;
    let isFormAvailable = false;
    let isVerificationPending = false;
    await test.step('Navigate to Services -> Leave Request and verify view state', async () => {
      leavePage = await studentLandingPage.navigateToLeave();
      await expect(page).toHaveURL(/student_leave/);

      const statusBanner = leavePage.pageHeading
        .or(leavePage.pendingAlert)
        .or(leavePage.verificationAlert);
      await expect(statusBanner.first()).toBeVisible();
      const isPending = await leavePage.pendingAlert.isVisible();
      isVerificationPending = await leavePage.verificationAlert.isVisible();
      isFormAvailable = !isPending && !isVerificationPending && (await leavePage.submitButton.isVisible());
    });

    if (isFormAvailable) {
      await test.step('Fill leave dates and verify total days calculation', async () => {
        await expect(leavePage.leaveFromInput).toBeVisible();
        await leavePage.fillLeaveDates(leaveData.leaveFrom, leaveData.leaveTo);
        await expect(leavePage.leaveFromInput).toHaveValue(leaveData.leaveFrom);
        await expect(leavePage.leaveToInput).toHaveValue(leaveData.leaveTo);
        await expect(leavePage.totalDaysInput).toHaveValue(leaveData.expectedTotalDays);
      });

      await test.step('Fill Purpose of Leave', async () => {
        await leavePage.fillPurpose(leaveData.purpose);
        await expect(leavePage.purposeTextarea).toHaveValue(leaveData.purpose);
        await expect(leavePage.submitButton).toBeVisible();
      });

      await test.step('Submit form and verify confirmation banner', async () => {
        await leavePage.submitForm();
        await expect(page).toHaveURL(/store_request/);
        await expect(leavePage.confirmationMessage).toBeVisible();
      });
    } else if (isVerificationPending) {
      await test.step('Verify email/SMS verification required banner', async () => {
        await expect(leavePage.verificationAlert).toBeVisible();
      });
    } else {
      await test.step('Verify existing pending request banner', async () => {
        await expect(leavePage.pendingAlert).toBeVisible();
      });
    }
  });
});
