import path from 'path';
import { test, expect } from '../../../src/fixtures/base';
import { RdsStudentLandingPage } from '../../../src/pages/RdsStudentLandingPage';
import idUnlockData from '../../data/id-unlock-data.json';
import studentData from '../../data/rds-student-data.json';

test.describe('NSU RDS Student ID Unlock Application', () => {
  test.use({ storageState: 'playwright/.auth/student.json' });

  test('navigates to ID Unlock under Services, fills and submits form, and verifies confirmation @smoke @critical', async ({
    page,
  }) => {
    test.slow();

    const studentLandingPage = new RdsStudentLandingPage(page);

    await test.step('Navigate to student dashboard', async () => {
      await studentLandingPage.goto(studentData.unlockIdStudent);
      await expect(page).toHaveURL(/students\/landing/);
      await expect(studentLandingPage.welcomeHeading).toBeVisible();
    });

    let idUnlockPage: any;
    let isFormAvailable = false;
    let isEnrolled = false;
    await test.step('Navigate to Services -> ID Unlock and verify view state', async () => {
      idUnlockPage = await studentLandingPage.navigateToIdUnlock();
      await expect(page).toHaveURL(/unlockId/);

      const statusBanner = idUnlockPage.pageHeading
        .or(idUnlockPage.pendingAlert)
        .or(idUnlockPage.enrolledAlert);
      await expect(statusBanner.first()).toBeVisible();
      const isPending = await idUnlockPage.pendingAlert.isVisible();
      isEnrolled = await idUnlockPage.enrolledAlert.isVisible();
      isFormAvailable = !isPending && !isEnrolled && (await idUnlockPage.submitButton.isVisible());
    });

    if (isFormAvailable) {
      await test.step('Select ID Unlock For option', async () => {
        await expect(idUnlockPage.unlockTypeSelect).toBeVisible();
        await idUnlockPage.selectUnlockType(idUnlockData.unlockType);
        await expect(idUnlockPage.unlockTypeSelect).toHaveValue(idUnlockData.unlockType);
      });

      await test.step('Fill Brief Description and upload signature', async () => {
        await idUnlockPage.fillDescription(idUnlockData.description);
        await expect(idUnlockPage.briefDescriptionInput).toHaveValue(idUnlockData.description);

        const absoluteSigPath = path.resolve(idUnlockData.signatureFile);
        await idUnlockPage.uploadSignature(absoluteSigPath);
        await expect(idUnlockPage.submitButton).toBeVisible();
      });

      await test.step('Submit form and verify confirmation banner', async () => {
        await idUnlockPage.submitForm();
        await expect(page).toHaveURL(/store_request/);
        await expect(idUnlockPage.confirmationMessage).toBeVisible();
      });
    } else if (isEnrolled) {
      await test.step('Verify already enrolled notification banner', async () => {
        await expect(idUnlockPage.enrolledAlert).toBeVisible();
      });
    } else {
      await test.step('Verify existing pending request banner', async () => {
        await expect(idUnlockPage.pendingAlert).toBeVisible();
      });
    }
  });
});
