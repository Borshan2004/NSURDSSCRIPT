import { test, expect, getAuthenticatedStudentPage } from '../../src/fixtures/base';
import { Page } from '@playwright/test';
import { LandingPage } from '../../src/pages/LandingPage';
import { AdvisingPage } from '../../src/pages/AdvisingPage';
import testUsers from '../data/test-users.json';

test.describe('Advising > Advising Window', () => {
  test.describe.configure({ mode: 'serial' });
  let sharedPage: Page;
  let advisingPage: AdvisingPage;

  test.beforeAll(async ({ browser }) => {
    sharedPage = await getAuthenticatedStudentPage(browser);
    const landingPage = new LandingPage(sharedPage);
    await landingPage.goto();
    advisingPage = await landingPage.navigateToAdvising();
  });

  test.afterAll(async () => {
    await sharedPage?.context()?.close();
  });

  test('1. Advising Window Navigation & Portal Header @smoke @advising', async () => {
    await test.step('Verify URL matches students/advising route', async () => {
      await expect(sharedPage).toHaveURL(/students\/advising/);
    });

    await test.step('Verify system title, countdown timer, and logout link', async () => {
      await expect(advisingPage.systemHeading).toBeVisible();
      await expect(advisingPage.countdownTimer).toBeVisible();
      await expect(advisingPage.logoutLink).toBeVisible();
    });
  });

  test('2. Student Identity & CGPA Verification @smoke @advising', async () => {
    await test.step('Verify student name and ID in advising header', async () => {
      await expect(advisingPage.studentName).toContainText(testUsers.student.fullName);
      await expect(advisingPage.studentName).toContainText(testUsers.student.studentId);
    });

    await test.step('Verify CGPA matches student record', async () => {
      await expect(advisingPage.cgpaValue).toContainText(testUsers.student.cgpa);
    });
  });

  test('3. Course Taking Input & Form Controls @smoke @advising', async () => {
    await test.step('Verify course taking search field is visible and editable', async () => {
      await expect(advisingPage.courseInputField).toBeVisible();
      await expect(advisingPage.courseInputField).toBeEditable();
    });

    await test.step('Verify Save and Discard Changes buttons are present', async () => {
      await expect(advisingPage.saveButton).toBeVisible();
      await expect(advisingPage.discardButton).toBeVisible();
    });
  });

  test('4. Saved Courses Slip & Offerings Panels @smoke @advising', async () => {
    await test.step('Verify Saved Courses slip table and total credits summary', async () => {
      await expect(advisingPage.savedCoursesTable).toBeVisible();
      await expect(advisingPage.totalCreditsSummary).toBeVisible();
    });

    await test.step('Verify advising policies notice is displayed', async () => {
      await expect(advisingPage.advisingRules).toBeVisible();
      await expect(advisingPage.advisingRules).toContainText('Dropping is ALLOWED');
    });

    await test.step('Verify course offerings list panel is visible', async () => {
      await expect(advisingPage.courseOfferingsTable).toBeVisible();
    });
  });
});

