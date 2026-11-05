import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RdsApplicationStatusPage extends BasePage {
  readonly applicationsTable: Locator;
  readonly tableRows: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.applicationsTable = this.page.locator('#other_re_table');
    this.tableRows = this.page.locator('#other_re_table tbody tr');
    this.searchInput = this.page.locator('#other_re_table_filter input, input[type="search"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('bpm/applied_applications');
    await this.waitForReady();
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  getRequestRowByType(requestType: string | RegExp): Locator {
    return this.tableRows.filter({
      has: this.page.locator('td:nth-child(4)'),
      hasText: requestType,
    });
  }

  getRequestRow(requestType: string | RegExp, applicantId?: string): Locator {
    let rowLocator = this.tableRows.filter({
      has: this.page.locator('td:nth-child(4)'),
      hasText: requestType,
    });
    if (applicantId) {
      rowLocator = rowLocator.filter({
        has: this.page.locator('td:nth-child(5)'),
        hasText: applicantId,
      });
    }
    return rowLocator;
  }
}

