import { test, expect, getAuthenticatedStudentPage } from '../../../src/fixtures/base';
import { Page } from '@playwright/test';
import { LandingPage } from '../../../src/pages/LandingPage';
import { MajorDeclarationPage } from '../../../src/pages/MajorDeclarationPage';

test.describe('Profile > Major Declaration', () => {
  test.describe.configure({ mode: 'serial' });
  let sharedPage: Page;
  let majorPage: MajorDeclarationPage;

  test.beforeAll(async ({ browser }) => {
    sharedPage = await getAuthenticatedStudentPage(browser);
    const landingPage = new LandingPage(sharedPage);
    await landingPage.goto();
    majorPage = await landingPage.navigateToMajorDeclaration();
  });

  test.afterAll(async () => {
    await sharedPage?.context()?.close();
  });

  test('1. Major Declaration Navigation & Prerequisite Alert @smoke @major', async () => {
    await test.step('Verify URL matches students/major route', async () => {
      await expect(sharedPage).toHaveURL(/students\/major/);
    });

    await test.step('Verify 66 credits requirement alert is visible', async () => {
      await expect(majorPage.requirementAlert).toBeVisible();
      await expect(majorPage.requirementAlert).toContainText('To declare your major, you need to complete 66 credits!!!');
    });

    await test.step('Verify footer notice is visible', async () => {
      await expect(majorPage.footerBrand).toBeVisible();
    });
  });
});

