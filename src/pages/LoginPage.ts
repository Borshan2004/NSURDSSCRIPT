import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Step 1: Username & Portal Elements
  readonly brandLogo: Locator;
  readonly brandHeading: Locator;
  readonly brandSubtitle: Locator;
  readonly usernameInput: Locator;
  readonly nextButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly serverTime: Locator;

  // Step 2: Password & Authentication Elements
  readonly welcomeHeading: Locator;
  readonly usernameDisplay: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmitButton: Locator;
  readonly sessionOverrideYesButton: Locator;

  constructor(page: Page) {
    super(page);

    // Brand and card headers (using stable class/tag structure rather than volatile copy)
    this.brandLogo = page.locator('.auth-brand__seal, [alt*="Portal home"]').first();
    this.brandHeading = page.locator('.auth-brand__title').or(page.getByRole('heading', { level: 1 })).first();
    this.brandSubtitle = page.locator('.auth-brand__subtitle').first();

    // Step 1: Username & Next button (prioritize IDs and stable form attributes over text/placeholders)
    this.usernameInput = page.locator('#UserName, input[name="username"]').or(page.getByRole('textbox', { name: /username/i })).first();
    this.nextButton = page.locator('button[type="submit"][name="commit"], [data-auth-submit]').filter({ hasText: /next/i }).or(page.getByRole('button', { name: /^next$/i })).first();

    // Step 2: Password, Username Display & Login Submit (prioritize IDs #password, #login-submit-btn)
    this.welcomeHeading = page.locator('.auth-brand__title, .auth-help__title').first();
    this.usernameDisplay = page.locator('.auth-field__value, [title="Change Username"], .user-id, [data-user-id]').first();
    this.passwordInput = page.locator('#password, input[name="password"]').or(page.getByRole('textbox', { name: /password/i })).first();
    this.loginSubmitButton = page.locator('#login-submit-btn, button[name="commit"][value="Login"]').or(page.getByRole('button', { name: /^login$/i })).first();

    // Footer & Auxiliary elements (prioritize route/data attributes)
    this.forgotPasswordLink = page.locator('a[href*="forgetPassword"]').or(page.getByRole('link', { name: /Forgot/i })).first();
    this.serverTime = page.locator('[data-auth-clock], .auth-meta__time, #txt').first();

    // Session takeover (prioritize ID/attributes)
    this.sessionOverrideYesButton = page.locator('#btnYes, button[name="btnYes"], [data-confirm-takeover]').or(page.getByRole('button', { name: /^Yes$/i })).first();
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

  /**
   * Completes the 2-step login flow:
   * 1. Enters username -> clicks Next
   * 2. Waits for password input on Step 2
   * 3. Enters password -> clicks Login
   * 4. Handles session takeover if prompted
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.clickNext();
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.fillPassword(password);
    await this.clickLogin();

    try {
      const reachedTakeover = await Promise.race([
        this.page.waitForURL(/confirmTakeover/, { timeout: 3000 }).then(() => true).catch(() => false),
        this.sessionOverrideYesButton.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false),
      ]);

      if (reachedTakeover || this.page.url().includes('confirmTakeover') || (await this.sessionOverrideYesButton.isVisible())) {
        await this.sessionOverrideYesButton.click();
        await this.waitForReady();
      }
    } catch {
      // Continue if no session override prompt appears
    }
  }
}
