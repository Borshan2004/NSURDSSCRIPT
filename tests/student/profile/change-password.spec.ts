import { test, expect, getAuthenticatedStudentPage } from '../../../src/fixtures/base';
import { Page } from '@playwright/test';
import { LandingPage } from '../../../src/pages/LandingPage';
import { ChangePasswordPage } from '../../../src/pages/ChangePasswordPage';
import testUsers from '../../data/test-users.json';

test.describe('Account Settings > Change Password', () => {
  test.describe.configure({ mode: 'serial' });
  let sharedPage: Page;
  let changePasswordPage: ChangePasswordPage;

  test.beforeAll(async ({ browser }) => {
    sharedPage = await getAuthenticatedStudentPage(browser);
    const landingPage = new LandingPage(sharedPage);
    await landingPage.goto();
    changePasswordPage = await landingPage.navigateToChangePassword();
  });

  test.afterAll(async () => {
    await sharedPage?.context()?.close();
  });

  test('1. Change Password Page Navigation & Form Controls @smoke @settings', async () => {
    await test.step('Verify navigation URL matches change_password route', async () => {
      await expect(sharedPage).toHaveURL(/common\/change_password/);
    });

    await test.step('Verify Change Password header is visible', async () => {
      await expect(changePasswordPage.pageTitle).toBeVisible();
    });

    await test.step('Verify password inputs and submit button are visible', async () => {
      await expect(changePasswordPage.currentPasswordInput).toBeVisible();
      await expect(changePasswordPage.newPasswordInput).toBeVisible();
      await expect(changePasswordPage.confirmNewPasswordInput).toBeVisible();
      await expect(changePasswordPage.changeButton).toBeVisible();
      await expect(changePasswordPage.changeButton).toBeEnabled();
    });

    await test.step('Verify password policy hint is visible', async () => {
      await expect(changePasswordPage.passwordHint).toBeVisible();
    });
  });

  test('2. Fill Passwords and Advance to Verification Code Modal @smoke @settings', async () => {
    await test.step('Fill Current Password, New Password, and Confirm New Password', async () => {
      await changePasswordPage.fillChangePasswordForm(
        testUsers.student.password,
        testUsers.student.newPassword,
        testUsers.student.newPassword
      );
    });

    await test.step('Click Change button to request verification code modal', async () => {
      await changePasswordPage.clickChange();
    });

    await test.step('Verify Get a verification code modal title and subtitle', async () => {
      await expect(changePasswordPage.modalTitle).toBeVisible();
      await expect(changePasswordPage.modalSubtitle).toBeVisible();
    });

    await test.step('Verify Email and SMS selection options are present', async () => {
      await expect(changePasswordPage.emailRadio).toBeVisible();
      await expect(changePasswordPage.emailRadio).toBeChecked();
      await expect(changePasswordPage.smsRadio).toBeVisible();
      await expect(changePasswordPage.smsRadio).not.toBeChecked();
    });

    await test.step('Verify Send Code and Cancel buttons are visible', async () => {
      await expect(changePasswordPage.sendCodeButton).toBeVisible();
      await expect(changePasswordPage.sendCodeButton).toBeEnabled();
      await expect(changePasswordPage.cancelButton).toBeVisible();
      await expect(changePasswordPage.cancelButton).toBeEnabled();
    });

    await test.step('Cancel modal without sending verification code (dry run)', async () => {
      await changePasswordPage.cancelVerification();
      await expect(changePasswordPage.modalTitle).not.toBeVisible();
    });
  });
});

