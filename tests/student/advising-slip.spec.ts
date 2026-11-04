import { test, expect, getAuthenticatedStudentPage } from '../../src/fixtures/base';
import { Page } from '@playwright/test';
import { RdsStudentLandingPage } from '../../src/pages/RdsStudentLandingPage';
import { AdvisingSlipPage } from '../../src/pages/AdvisingSlipPage';

test.describe('Advising > Advising Slip Print Validation', () => {
  test.describe.configure({ mode: 'serial' });
  let sharedPage: Page;
  let landingPage: RdsStudentLandingPage;
  let slipPage: AdvisingSlipPage;

  test.beforeAll(async ({ browser }) => {
    sharedPage = await getAuthenticatedStudentPage(browser);
    landingPage = new RdsStudentLandingPage(sharedPage);
    await landingPage.goto();
    slipPage = await landingPage.navigateToAdvisingSlipPrint();
  });

  test.afterAll(async () => {
    await sharedPage?.context()?.close();
  });

  test('1. Advising Slip Navigation & Page Readiness @smoke @advising', async () => {
    await test.step('Verify navigation to advising slip route', async () => {
      await expect(sharedPage).toHaveURL(/print_slip/);
    });

    await test.step('Verify university masthead heading is displayed', async () => {
      await expect(slipPage.universityHeading).toBeVisible();
    });
  });

  test('2. Multi-Copy Structure Validation (4 Departmental Copies) @smoke @advising', async () => {
    await test.step('Verify Registrar\'s Office Copy is present', async () => {
      await expect(slipPage.registrarsCopyHeader).toBeVisible();
    });

    await test.step('Verify Finance & Accounts Department\'s Copy is present', async () => {
      await expect(slipPage.accountsCopyHeader).toBeVisible();
    });

    await test.step('Verify Bank\'s Copy is present', async () => {
      await expect(slipPage.banksCopyHeader).toBeVisible();
    });

    await test.step('Verify Student\'s Copy is present', async () => {
      await expect(slipPage.studentsCopyHeader).toBeVisible();
    });
  });

  test('3. Student Identity & Clearance Validation @smoke @advising', async () => {
    await test.step('Verify student name, ID number, and degree format', async () => {
      await expect(slipPage.studentNameText).toBeVisible();
      await expect(slipPage.studentIdText).toBeVisible();
      await expect(slipPage.degreeText).toBeVisible();
    });

    await test.step('Verify registration tracking number is present', async () => {
      await expect(slipPage.registrationNumber).toBeVisible();
    });

    await test.step('Verify Accounts and Library clearance statuses', async () => {
      await expect(slipPage.accountsClearance).toBeVisible();
      await expect(slipPage.libraryClearance).toBeVisible();
    });
  });

  test('4. Financial Fees & Total Reconciliation Validation @regression @advising', async () => {
    await test.step('Verify tuition total and mandatory institutional fees', async () => {
      await expect(slipPage.tuitionTotalText).toBeVisible();
      await expect(slipPage.studentActivityFee).toBeVisible();
      await expect(slipPage.computerLabFee).toBeVisible();
      await expect(slipPage.libraryFee).toBeVisible();
    });

    await test.step('Verify total amount and amount written in words', async () => {
      await expect(slipPage.totalAmountText).toBeVisible();
      await expect(slipPage.amountInWordsText).toBeVisible();
    });
  });
});
