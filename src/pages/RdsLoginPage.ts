import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { RdsFacultyDashboardPage } from './RdsFacultyDashboardPage';
import { RdsStudentLandingPage } from './RdsStudentLandingPage';

export class RdsLoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly nextButton: Locator;
  readonly passwordInput: Locator;
  readonly twoFaInput: Locator;
  readonly loginButton: Locator;
  readonly takeoverYesButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.page.getByRole('textbox', { name: /enter your username/i });
    this.nextButton = this.page.getByRole('button', { name: 'Next' });
    this.passwordInput = this.page.getByPlaceholder(/enter your password/i);
    this.twoFaInput = this.page.getByPlaceholder(/enter authentication code/i);
    this.loginButton = this.page.getByRole('button', { name: 'Login' });
    this.takeoverYesButton = this.page.getByRole('button', { name: 'Yes' });
  }

  async goto(): Promise<void> {
    await this.page.goto('');
    await this.waitForReady();
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.nextButton.click();
    await this.passwordInput.waitFor({ state: 'visible' });
  }

  async enterPasswordAndSubmit(password: string, twofaCode?: string): Promise<void> {
    await this.passwordInput.fill(password);
    if (twofaCode !== undefined && (await this.twoFaInput.isVisible())) {
      await this.twoFaInput.fill(twofaCode);
    }
    await this.loginButton.click();
    await this.waitForReady();

    // If already logged in on another device/browser, confirm session takeover
    try {
      if (await this.takeoverYesButton.isVisible({ timeout: 2000 })) {
        await this.takeoverYesButton.click();
        await this.waitForReady();
      }
    } catch {
      // Continue if no takeover prompt appears
    }
  }

  async loginAsFaculty(user: { username: string; password: string }): Promise<RdsFacultyDashboardPage> {
    await this.enterUsername(user.username);
    await this.enterPasswordAndSubmit(user.password);
    return new RdsFacultyDashboardPage(this.page);
  }

  async loginAsStudent(user: {
    username: string;
    password: string;
    twofaCode?: string;
  }): Promise<RdsStudentLandingPage> {
    await this.enterUsername(user.username);
    await this.enterPasswordAndSubmit(user.password, user.twofaCode);
    return new RdsStudentLandingPage(this.page);
  }

  async loginAs(user: { username: string; password: string }): Promise<RdsFacultyDashboardPage> {
    return this.loginAsFaculty(user);
  }
}
