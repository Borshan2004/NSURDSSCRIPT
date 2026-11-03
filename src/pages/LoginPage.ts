import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly nextButton: Locator;
  readonly brandHeading: Locator;
  readonly forgotPasswordLink: Locator;
  readonly serverTime: Locator;

  readonly passwordInput: Locator;
  readonly loginSubmitButton: Locator;
  readonly sessionOverrideYesButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Please enter your username');
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.brandHeading = page.getByRole('heading', { name: 'RDS' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot your password?' });
    this.serverTime = page.locator('#txt');
    this.passwordInput = page.getByPlaceholder('Please enter your password');
    this.loginSubmitButton = page.getByRole('button', { name: 'Login' });
    this.sessionOverrideYesButton = page.getByRole('button', { name: 'Yes' });
  }

  async goto(): Promise<void> {
    await this.page.goto('');
    await this.waitForReady();
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
    await this.waitForReady();
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginSubmitButton.click();
    await this.waitForReady();
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.clickNext();
    await this.fillPassword(password);
    await this.clickLogin();

    if (await this.sessionOverrideYesButton.isVisible()) {
      await this.sessionOverrideYesButton.click();
      await this.waitForReady();
    }
  }
}
