import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ChangePasswordPage extends BasePage {
  readonly pageTitle: Locator;
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

    this.pageTitle = page.getByRole('heading', { name: 'Change Password' });
    this.currentPasswordInput = page.locator('#currentPassword');
    this.newPasswordInput = page.locator('#newPassword');
    this.confirmNewPasswordInput = page.locator('#confirmNewPassword');
    this.changeButton = page.getByRole('button', { name: 'Change' });
    this.passwordHint = page.locator('span.middle, span:has-text("minimum 8 characters")').first();

    // Verification Modal (matches role="document" or .modal.in)
    this.verificationModal = page.locator('.modal-dialog[role="document"], .modal:visible');
    this.modalTitle = page.getByRole('heading', { name: 'Get a verification code' });
    this.modalSubtitle = page.getByText('Choose where to receive your one-time code.');
    this.emailRadio = page.getByRole('radio', { name: 'Email' });
    this.smsRadio = page.getByRole('radio', { name: 'SMS' });
    this.sendCodeButton = page.getByRole('button', { name: 'Send code' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.closeButton = page.getByRole('button', { name: 'Close' });
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
  }

  async selectVerificationMethod(method: 'email' | 'sms'): Promise<void> {
    if (method === 'email') {
      await this.emailRadio.check();
    } else {
      await this.smsRadio.check();
    }
  }

  async cancelVerification(): Promise<void> {
    await this.cancelButton.click();
  }
}
