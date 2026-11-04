import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface AdvisingSlipData {
  studentName: string;
  studentId: string;
  degree: string;
  semester: string;
  tuitionTotal: string;
  totalAmount: string;
  amountInWords: string;
  courses: Array<{
    code: string;
    section?: string;
    credit: string;
    tuition: string;
  }>;
}

export class AdvisingSlipPage extends BasePage {
  // Page header & Form selectors (if navigated via printSlipIndex)
  readonly semesterSelect: Locator;
  readonly printSlipButton: Locator;

  // 4-Part Multi-Copy Document Headers
  readonly registrarsCopyHeader: Locator;
  readonly accountsCopyHeader: Locator;
  readonly banksCopyHeader: Locator;
  readonly studentsCopyHeader: Locator;

  // University Header
  readonly universityHeading: Locator;
  readonly studentRegistrationHeading: Locator;
  readonly registrationNumber: Locator;

  // Student Identity
  readonly studentNameText: Locator;
  readonly studentIdText: Locator;
  readonly degreeText: Locator;

  // Clearances
  readonly accountsClearance: Locator;
  readonly libraryClearance: Locator;

  // Financial Breakdown
  readonly tuitionTotalText: Locator;
  readonly studentActivityFee: Locator;
  readonly computerLabFee: Locator;
  readonly libraryFee: Locator;
  readonly scienceLabFee: Locator;
  readonly totalAmountText: Locator;
  readonly amountInWordsText: Locator;

  constructor(page: Page) {
    super(page);

    // Initial print slip index controls
    this.semesterSelect = this.page.locator('select[name="semester"]');
    this.printSlipButton = this.page.getByRole('button', { name: /view|submit|print/i });

    // Document Copy Headers
    this.registrarsCopyHeader = this.page.getByText("REGISTRAR'S OFFICE COPY");
    this.accountsCopyHeader = this.page.getByText("FINANCE & ACCOUNTS DEPARTMENT'S COPY");
    this.banksCopyHeader = this.page.getByText("BANK'S COPY");
    this.studentsCopyHeader = this.page.getByText("STUDENT'S COPY");

    // Header & Registrations
    this.universityHeading = this.page.getByText('North South University').first();
    this.studentRegistrationHeading = this.page.getByText(/Student Registration/i).first();
    this.registrationNumber = this.page.getByText(/Registration #:/i).first();

    // Student Details
    this.studentNameText = this.page.getByText(/Student Name:/i).first();
    this.studentIdText = this.page.getByText(/ID#/i).first();
    this.degreeText = this.page.getByText(/Degree:/i).first();

    // Clearances
    this.accountsClearance = this.page.getByText('NSU Accounts Clearance').first();
    this.libraryClearance = this.page.getByText('Library Clearance OK').first();

    // Financials
    this.tuitionTotalText = this.page.getByText(/Tuition Total:/i).first();
    this.studentActivityFee = this.page.getByText('Student Activity Fee').first();
    this.computerLabFee = this.page.getByText('Computer Lab Fee').first();
    this.libraryFee = this.page.getByText('Library Fee').first();
    this.scienceLabFee = this.page.getByText('Science Lab Fee').first();
    this.totalAmountText = this.page.getByText(/Total:\s*\d+/i).first();
    this.amountInWordsText = this.page.getByText(/Amount:\s*\d+.*\(.*\)/i).first();
  }

  async goto(): Promise<void> {
    await this.page.goto('http://10.102.11.254/rds/students/print_slip/printSlipIndex');
    await this.waitForReady();
  }

  getCourseRow(courseCode: string): Locator {
    return this.page.locator('tr, div').filter({ hasText: courseCode }).first();
  }
}
