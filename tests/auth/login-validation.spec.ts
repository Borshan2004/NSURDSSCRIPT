import { test, expect } from '../../src/fixtures/base';
import { LoginPage } from '../../src/pages/LoginPage';

test.describe('RDS Authentication Validation & Navigation', () => {
  test('empty username triggers required field constraint @validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Click Next with empty username
    await loginPage.clickNext();

    // Verify HTML5 required validation is triggered on username field
    const isRequired = await loginPage.usernameInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing
    );
    expect(isRequired).toBe(true);

    // Verify URL does not navigate away
    await expect(page).toHaveURL(/10\.102\.11\.254\/rds/);
  });

  test('navigates to forgot password page @navigation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.forgotPasswordLink.click();
    await page.waitForLoadState('domcontentloaded');

    // Verify destination URL
    await expect(page).toHaveURL(/forgetPassword/);
  });
});
