import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdvisingPage extends BasePage {
  readonly systemHeading: Locator;
  readonly countdownTimer: Locator;
  readonly logoutLink: Locator;

  // Student Info Bar
  readonly studentName: Locator;
  readonly cgpaValue: Locator;

  // Course Taking Input & Form Controls
  readonly courseInputField: Locator;
  readonly saveButton: Locator;
  readonly discardButton: Locator;

  // Saved Courses & Offerings Tables
  readonly savedCoursesTable: Locator;
  readonly totalCreditsSummary: Locator;
  readonly advisingRules: Locator;
  readonly droppingPolicyNotice: Locator;
  readonly sectionChangePolicyNotice: Locator;
  readonly courseOfferingsTable: Locator;

  // Save Confirmation Dialog / Modal Elements
  readonly successMessageModal: Locator;
  readonly modalOkButton: Locator;

  // Drop Confirmation Modals (3-step flow from UI)
  readonly dropModal: Locator;
  readonly yesDropItButton: Locator;
  readonly pleaseConfirmModal: Locator;
  readonly confirmDropYesButton: Locator;
  readonly confirmationMessageModal: Locator;
  readonly confirmationOkButton: Locator;

  constructor(page: Page) {
    super(page);

    this.systemHeading = page.locator('#topbar, .topbar').or(page.getByText('North South University Online Advising System')).first();
    this.countdownTimer = page.locator('#clockBlock');
    this.logoutLink = page.locator('#topicons a').filter({ hasText: 'Log Out' });

    this.studentName = page.locator('#studentName').or(page.locator('.student-name, [data-student-id]')).first();
    this.cgpaValue = page.locator('#crcgpa').or(page.getByText(/CGPA:/i)).first();

    // Prioritize stable IDs and form attributes over placeholder or text
    this.courseInputField = page.locator('#searchText, input[name="searchText"]').first();
    this.saveButton = page.locator('input[onclick*="saveadvising"], #submit[value="Save"], input[value="Save"]').first();
    this.discardButton = page.locator('input[onclick*="discardadv"], #submit[value="Discard Changes"], input[value="Discard Changes"]').first();

    this.savedCoursesTable = page.locator('#advSlip table.slip, #advSlip table').first();
    this.totalCreditsSummary = page.locator('#advSlip tr:has-text("Total:"), #advSlip td:has-text("Total:")').first();
    this.advisingRules = page.locator('#noticebar, .body, div').filter({ hasText: /Dropping is ALLOWED/i }).first();
    this.droppingPolicyNotice = page.getByText(/Dropping is ALLOWED/i).first();
    this.sectionChangePolicyNotice = page.getByText(/Section change is ALLOWED/i).first();
    this.courseOfferingsTable = page.locator('#courseList, #offeredCourses table, table.courselist').first();

    this.successMessageModal = page
      .locator('.swal2-popup, #msgBox, .modal, .alert, [role="dialog"]')
      .filter({ hasText: /advising.*save.*success|saved successfully|successfully/i })
      .first();
    this.modalOkButton = page
      .locator('.swal2-confirm, button.swal2-confirm, input[value="OK"]')
      .or(page.getByRole('button', { name: /^OK$/i }))
      .first();

    // 1. "Drop this course?" -> "Yes, drop it!"
    this.dropModal = page
      .locator('.swal2-popup, [role="dialog"]')
      .filter({ hasText: /Drop this course\?/i })
      .first();
    this.yesDropItButton = page
      .locator('.swal2-confirm, button.swal2-confirm')
      .or(page.getByRole('button', { name: /Yes,\s*drop\s*it!/i }))
      .first();

    // 2. "Please Confirm" -> "Yes"
    this.pleaseConfirmModal = page
      .locator('.swal2-popup, [role="dialog"]')
      .filter({ hasText: /Please Confirm/i })
      .first();
    this.confirmDropYesButton = page
      .locator('.swal2-confirm, button.swal2-confirm')
      .or(page.getByRole('button', { name: /^Yes$/i }))
      .first();

    // 3. "Confirmation Message" -> "OK"
    this.confirmationMessageModal = page
      .locator('.swal2-popup, [role="dialog"]')
      .filter({ hasText: /Confirmation Message|Advising saved Successfully/i })
      .first();
    this.confirmationOkButton = page
      .locator('.swal2-confirm, button.swal2-confirm')
      .or(page.getByRole('button', { name: /^OK$/i }))
      .first();
  }

  async goto(): Promise<void> {
    await this.page.goto('students/advising');
    await this.waitForReady();
  }

  async searchCourse(courseCode: string): Promise<void> {
    await this.courseInputField.fill(courseCode);
    await this.waitForReady();
  }

  /**
   * Returns locator for a specific course offering item in the right panel (e.g. 'ACT201.1').
   * Prioritizes the DOM ID (`#clistACT2011`) so UI text or placeholder changes never affect locator stability.
   */
  getOfferingItem(courseWithSection: string): Locator {
    const clistId = `#clist${courseWithSection.replace('.', '')}`;
    const escaped = courseWithSection.replace('.', '\\.');
    return this.page
      .locator(clistId)
      .or(this.courseOfferingsTable.locator('tr, td, b').filter({ hasText: new RegExp(`\\b${escaped}\\b`) }))
      .or(this.page.locator('#courseList tr').filter({ hasText: new RegExp(`^\\s*${escaped}\\b`) }))
      .or(this.page.getByText(courseWithSection, { exact: true }))
      .first();
  }

  /**
   * Clicks on a course section from the offerings list to take/select it.
   */
  async selectOffering(courseWithSection: string): Promise<void> {
    const item = this.getOfferingItem(courseWithSection);
    await item.scrollIntoViewIfNeeded();
    await item.click();
    await this.waitForReady();
  }

  /**
   * Returns the table row representing a taken/advised course in the saved courses slip.
   */
  getSavedCourseRow(courseWithSection: string): Locator {
    const escaped = courseWithSection.replace('.', '\\.');
    return this.savedCoursesTable
      .locator('tr')
      .filter({ hasText: new RegExp(`\\b${escaped}\\b`) })
      .or(this.savedCoursesTable.locator('tr').filter({ hasText: courseWithSection }))
      .first();
  }

  /**
   * Returns the drop/delete button (red cross icon) for a taken course row.
   * Targets the exact onclick="removeCourse('CODE','SEC')" attribute for maximum resilience.
   */
  getDropButton(courseWithSection: string): Locator {
    const row = this.getSavedCourseRow(courseWithSection);
    const [code, sec] = courseWithSection.split('.');
    const specificRemoveBtn = code && sec ? row.locator(`img[onclick*="removeCourse"][onclick*="'${code}'"][onclick*="'${sec}'"]`) : null;

    return (specificRemoveBtn ? specificRemoveBtn.or(row.locator('img[src*="deletesmall"], img[onclick*="removeCourse"]')) : row.locator('img[src*="deletesmall"], img[onclick*="removeCourse"]'))
      .or(row.locator('img[src*="cross"], img[src*="del"], img[src*="drop"], img[src*="remove"], [title*="Drop"], [title*="Delete"]'))
      .or(row.locator('td').last().locator('a, button, input, img'))
      .or(row.locator('a, button').filter({ hasText: /x/i }))
      .first();
  }

  /**
   * Drops a course by clicking its delete/cross icon, then executes the 3-step confirmation popups:
   * 1. Clicks "Yes, drop it!" on "Drop this course?" modal
   * 2. Clicks "Yes" on "Please Confirm" modal ("All courses will be dropped...")
   * 3. Clicks "OK" on "Confirmation Message" modal ("Advising saved Successfully")
   */
  async dropSavedCourse(courseWithSection: string): Promise<void> {
    const dropBtn = this.getDropButton(courseWithSection);

    // Auto-accept any browser-native dialog if triggered
    const dialogHandler = (dialog: any) => {
      dialog.accept().catch(() => {});
    };
    this.page.on('dialog', dialogHandler);

    try {
      await dropBtn.click();

      // 1. Click "Yes, drop it!" on "Drop this course?" popup
      await this.yesDropItButton.waitFor({ state: 'visible', timeout: 10000 });
      await this.yesDropItButton.click();

      // 2. Click "Yes" on "Please Confirm" popup ("All courses will be dropped...")
      try {
        await this.confirmDropYesButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.confirmDropYesButton.click();
      } catch {
        // Continue if intermediate modal is not triggered
      }

      // 3. Click "OK" on "Confirmation Message" popup ("Advising saved Successfully")
      try {
        await this.confirmationOkButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.confirmationOkButton.click();
      } catch {
        // In case dismissed or handled
      }
    } finally {
      this.page.off('dialog', dialogHandler);
    }

    await this.waitForReady();
  }

  /**
   * Clicks Discard Changes to revert unsaved course selections.
   */
  async clickDiscard(): Promise<void> {
    await this.discardButton.click();
    await this.waitForReady();
  }

  /**
   * Clicks Save button to confirm course advising selections.
   * Automatically accepts any confirmation/success dialog if prompted.
   */
  async clickSave(): Promise<void> {
    const dialogPromise = this.page
      .waitForEvent('dialog', { timeout: 2000 })
      .then(async (d) => {
        await d.accept();
      })
      .catch(() => {});

    await this.saveButton.click();
    await dialogPromise;
    await this.waitForReady();
  }

  /**
   * Clicks Save button and explicitly waits until the "advising save successfully" message arrives
   * (handles both native browser alert and DOM modal), verifies/captures the message,
   * clicks OK, and confirms completion.
   */
  async clickSaveAndWaitForSuccess(timeoutMs = 30000): Promise<string> {
    let capturedMessage = '';

    // 1. Prepare promise to catch native window.alert / window.confirm
    const dialogPromise = this.page
      .waitForEvent('dialog', { timeout: timeoutMs })
      .then(async (dialog) => {
        capturedMessage = dialog.message();
        await dialog.accept(); // Clicks OK button on browser dialog
        return capturedMessage;
      })
      .catch(() => null);

    // 2. Prepare promise to catch DOM modal / alert dialog
    const domModalPromise = this.successMessageModal
      .waitFor({ state: 'visible', timeout: timeoutMs })
      .then(async () => {
        const text = await this.successMessageModal.innerText();
        if (await this.modalOkButton.isVisible()) {
          await this.modalOkButton.click(); // Clicks OK button in DOM modal
        }
        return text;
      })
      .catch(() => null);

    // 3. Click Save button
    await this.saveButton.click();

    // 4. Wait until EITHER native dialog OR DOM modal message appears
    const result = await Promise.race([dialogPromise, domModalPromise]);
    capturedMessage = result || capturedMessage;

    await this.waitForReady();
    return capturedMessage;
  }

  /**
   * Alias for clickSaveAndWaitForSuccess.
   */
  async clickSaveAndConfirm(timeoutMs = 30000): Promise<string> {
    return this.clickSaveAndWaitForSuccess(timeoutMs);
  }
}
