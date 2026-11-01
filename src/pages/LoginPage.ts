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

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByLabel('Username');
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.brandHeading = page.getByRole('heading', { name: 'RDS Portal' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot your password?' });
    this.serverTime = page.locator('#txt');
    this.passwordInput = page.locator('#rds-password');
    this.loginSubmitButton = page.locator('#login-submit-btn');
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
  }
}
