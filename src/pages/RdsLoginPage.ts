import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { RdsFacultyDashboardPage } from './RdsFacultyDashboardPage';
import { RdsStudentLandingPage } from './RdsStudentLandingPage';

export class RdsLoginPage extends BasePage {
  readonly brandLogo: Locator;
  readonly brandHeading: Locator;
  readonly usernameInput: Locator;
  readonly nextButton: Locator;
  readonly welcomeHeading: Locator;
  readonly usernameDisplay: Locator;
  readonly passwordInput: Locator;
  readonly twoFaInput: Locator;
  readonly loginButton: Locator;
  readonly takeoverYesButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly serverTime: Locator;

  constructor(page: Page) {
    super(page);

    // Brand and card headers (using stable class/tag structure rather than volatile copy)
    this.brandLogo = this.page.locator('.auth-brand__seal, [alt*="Portal home"]').first();
    this.brandHeading = this.page.locator('.auth-brand__title').or(this.page.getByRole('heading', { level: 1 })).first();

    // Step 1: Username & Next button (prioritize IDs and stable form attributes over text/placeholders)
    this.usernameInput = this.page.locator('#UserName, input[name="username"]').or(this.page.getByRole('textbox', { name: /username/i })).first();
    this.nextButton = this.page.locator('button[type="submit"][name="commit"], [data-auth-submit]').filter({ hasText: /next/i }).or(this.page.getByRole('button', { name: /^next$/i })).first();

    // Step 2: Welcome, Password, 2FA & Login (prioritize IDs #password, #login-submit-btn)
    this.welcomeHeading = this.page.locator('.auth-brand__title, .auth-help__title').first();
    this.usernameDisplay = this.page.locator('.auth-field__value, [title="Change Username"], .user-id, [data-user-id]').first();
    this.passwordInput = this.page.locator('#password, input[name="password"]').or(this.page.getByRole('textbox', { name: /password/i })).first();
    this.twoFaInput = this.page.locator('#twofa, input[name="twofa"], input[name="otp"]').first();
    this.loginButton = this.page.locator('#login-submit-btn, button[name="commit"][value="Login"]').or(this.page.getByRole('button', { name: /^login$/i })).first();
    this.takeoverYesButton = this.page.locator('#btnYes, button[name="btnYes"], [data-confirm-takeover]').or(this.page.getByRole('button', { name: /^Yes$/i })).first();

    // Footer & Auxiliary elements (prioritize route/data attributes)
    this.forgotPasswordLink = this.page.locator('a[href*="forgetPassword"]').or(this.page.getByRole('link', { name: /Forgot/i })).first();
    this.serverTime = this.page.locator('[data-auth-clock], .auth-meta__time, #txt').first();
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

    // If duplicate session takeover prompt appears (either via modal or confirmTakeover route)
    try {
      const reachedTakeover = await Promise.race([
        this.page.waitForURL(/confirmTakeover/, { timeout: 3000 }).then(() => true).catch(() => false),
        this.takeoverYesButton.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false),
      ]);

      if (reachedTakeover || this.page.url().includes('confirmTakeover') || (await this.takeoverYesButton.isVisible())) {
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
