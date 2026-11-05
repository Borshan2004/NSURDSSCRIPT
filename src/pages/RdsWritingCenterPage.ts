import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RdsWritingCenterPage extends BasePage {
  readonly pageHeading: Locator;
  readonly appointmentDateInput: Locator;
  readonly activeCalendarDays: Locator;
  readonly slotSelect: Locator;
  readonly submitButton: Locator;
  readonly successAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = this.page.getByRole('heading', { name: /Appointment for NSU Writing Center/i });
    this.appointmentDateInput = this.page.locator('#selected_date');
    this.activeCalendarDays = this.page.locator('.xdsoft_calendar td:not(.xdsoft_disabled)');
    this.slotSelect = this.page.locator('#slot');
    this.submitButton = this.page.getByRole('button', { name: 'Submit' });
    this.successAlert = this.page.locator('.alert, .alert-success, .alert-info');
  }

  async goto(): Promise<void> {
    await this.page.goto('bookings/writing-centers');
    await this.waitForReady();
  }

  async selectFirstAvailableDate(): Promise<string> {
    await this.appointmentDateInput.click();
    const firstDay = this.activeCalendarDays.first();
    await firstDay.click();
    await this.slotSelect.locator('option:nth-child(2)').waitFor({ state: 'attached' });
    return this.appointmentDateInput.inputValue();
  }

  async selectFirstAvailableSlot(): Promise<string> {
    await this.slotSelect.selectOption({ index: 1 });
    return this.slotSelect.inputValue();
  }

  async selectCourse(courseName: string): Promise<void> {
    const radio = this.page.locator(`input[name="course_name"][value="${courseName}"]`);
    await radio.check();
  }

  async selectAssignmentType(assignmentType: string): Promise<void> {
    const radio = this.page.locator(`input[name="help_required"][value="${assignmentType}"]`);
    await radio.check();
  }

  async submitBooking(): Promise<void> {
    await this.submitButton.click();
    await this.waitForReady();
  }
}

