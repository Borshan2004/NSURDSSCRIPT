import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ChangePasswordPage extends BasePage {
  readonly pageTitle: Locator;
  readonly changePasswordForm: Locator;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmNewPasswordInput: Locator;
  readonly changeButton: Locator;
  readonly passwordHint: Locator;

  // Verification Code Modal Elements
  readonly verificationModal: Locator;
  readonly modalTitle: Locator;
  readonly modalSubtitle: Locator;
  readonly emailRadio: Locator;
  readonly smsRadio: Locator;
  readonly sendCodeButton: Locator;
  readonly cancelButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);

    // Anchored to page-header or container rather than volatile text
    this.pageTitle = page.locator('.page-header h1, h1').first();
    this.changePasswordForm = page.locator('#change_password_form');

    // Form inputs and action buttons strictly mapped to unique DOM IDs
    this.currentPasswordInput = page.locator('#currentPassword');
    this.newPasswordInput = page.locator('#newPassword');
    this.confirmNewPasswordInput = page.locator('#confirmNewPassword');
    this.changeButton = page.locator('#change_password_form input[type="submit"], input[type="submit"][value="Change"]').first();
    this.passwordHint = page.locator('#change_password_form .middle').first();

    // Verification Modal anchored strictly to container ID #request-box
    this.verificationModal = page.locator('#request-box');
    this.modalTitle = page.locator('#request-box #request-box-label, #request-box .otp-title').first();
    this.modalSubtitle = page.locator('#request-box .otp-text').first();

    // Radio inputs targeting unique DOM IDs #otp_type1 and #otp_type2
    this.emailRadio = page.locator('#otp_type1, #request-box input[value="email"]').first();
    this.smsRadio = page.locator('#otp_type2, #request-box input[value="sms"]').first();

    // Modal action buttons mapped to unique DOM IDs and semantic attributes
    this.sendCodeButton = page.locator('#get_otp, button[name="get_otp"]').first();
    this.cancelButton = page.locator('#request-box .otp-cancel, #request-box button[data-dismiss="modal"].otp-cancel').first();
    this.closeButton = page.locator('#request-box button.close, #request-box [data-dismiss="modal"].close').first();
  }

  async goto(): Promise<void> {
    await this.page.goto('common/change_password');
    await this.waitForReady();
  }

  async fillCurrentPassword(password: string): Promise<void> {
    await this.currentPasswordInput.fill(password);
  }

  async fillNewPassword(password: string): Promise<void> {
    await this.newPasswordInput.fill(password);
  }

  async fillConfirmNewPassword(password: string): Promise<void> {
    await this.confirmNewPasswordInput.fill(password);
  }

  async fillChangePasswordForm(currentPass: string, newPass: string, confirmPass: string): Promise<void> {
    await this.fillCurrentPassword(currentPass);
    await this.fillNewPassword(newPass);
    await this.fillConfirmNewPassword(confirmPass);
  }

  async clickChange(): Promise<void> {
    await this.changeButton.click();
    await this.waitForReady();
  }

  async selectVerificationMethod(method: 'email' | 'sms'): Promise<void> {
    if (method === 'email') {
      await this.emailRadio.check({ force: true });
    } else {
      await this.smsRadio.check({ force: true });
    }
  }

  async cancelVerification(): Promise<void> {
    await this.cancelButton.click();
    await this.waitForReady();
  }
}
