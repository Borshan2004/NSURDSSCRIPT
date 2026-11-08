import { test, expect } from '../../../src/fixtures/base';
import { LandingPage } from '../../../src/pages/LandingPage';

test.describe('Profile > Major Declaration', () => {
  test('1. Major Declaration Navigation & Prerequisite Alert @smoke @major', async ({ page }) => {
    const landingPage = new LandingPage(page);

    await test.step('Navigate to student dashboard', async () => {
      await landingPage.goto();
      await expect(page).toHaveURL(/students\/landing/);
      await expect(landingPage.welcomeHeading).toBeVisible();
    });

    let majorPage: any;
    await test.step('Navigate to Profile -> Major Declaration', async () => {
      majorPage = await landingPage.navigateToMajorDeclaration();
      await expect(page).toHaveURL(/students\/major/);
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
