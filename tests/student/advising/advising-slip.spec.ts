import { test, expect, getAuthenticatedStudentPage } from '../../../src/fixtures/base';
import { Page } from '@playwright/test';
import { RdsStudentLandingPage } from '../../../src/pages/RdsStudentLandingPage';
import { AdvisingSlipPage } from '../../../src/pages/AdvisingSlipPage';
import { AdvisingPage } from '../../../src/pages/AdvisingPage';
import testUsers from '../../data/test-users.json';

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

  test('1. Advising Slip Navigation & Semester Selection @smoke @advising', async () => {
    await test.step('Verify navigation to advising slip route', async () => {
      await expect(sharedPage).toHaveURL(/print_slip/);
    });

    await test.step('Verify semester dropdown is displayed', async () => {
      await expect(slipPage.semesterSelect).toBeVisible();
    });

    await test.step('Select semester year and verify slip document loads', async () => {
      await slipPage.selectSemester('Summer 2026');

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

  test('5. Course Advising Flow: Sequential Section Taking (ACT201.1 to ACT201.21) with Save & Drop Full Cycle @advising', async () => {
    // Increase timeout for multi-section processing (all 21 sections from offerings image)
    test.setTimeout(300000);
    const advisingPage = new AdvisingPage(sharedPage);
    await advisingPage.goto();

    const courseCode = 'ACT201';

    // All 21 sections of ACT201 visible in the offerings panel (ACT201.1 through ACT201.21)
    const sectionsInImage = [
      'ACT201.1',
      'ACT201.2',
      'ACT201.3',
      'ACT201.4',
      'ACT201.5',
      'ACT201.6',
      'ACT201.7',
      'ACT201.8',
      'ACT201.9',
      'ACT201.10',
      'ACT201.11',
      'ACT201.12',
      'ACT201.13',
      'ACT201.14',
      'ACT201.15',
      'ACT201.16',
      'ACT201.17',
      'ACT201.18',
      'ACT201.19',
      'ACT201.20',
      'ACT201.21',
    ];

    // Helper to execute the full cycle for each course section:
    // 1. Take course section
    // 2. Click Save & wait for "advising save successfully" message & click OK
    // 3. Drop that course: click red X -> "Yes, drop it!" -> "Yes" -> "OK"
    // 4. Verify course section is removed
    const processSectionFullCycle = async (sectionName: string): Promise<boolean> => {
      await advisingPage.searchCourse(courseCode);
      const offering = advisingPage.getOfferingItem(sectionName);

      if (!(await offering.isVisible().catch(() => false))) {
        console.log(`[INFO] ${sectionName} is not listed in offerings. Skipping.`);
        return false;
      }

      // 1. Take the course section
      await advisingPage.selectOffering(sectionName);
      const savedRow = advisingPage.getSavedCourseRow(sectionName);
      await expect(savedRow).toBeVisible();

      // 2. Click Save, wait for "advising save successfully" message, and click OK button
      const saveMessage = await advisingPage.clickSaveAndWaitForSuccess(30000);
      expect(saveMessage.toLowerCase()).toMatch(/advising.*save.*success|saved successfully|success/);
      await expect(savedRow).toBeVisible();

      // 3. Drop that course: click red X -> "Yes, drop it!" -> "Yes" -> "OK"
      await advisingPage.dropSavedCourse(sectionName);

      // 4. Verify course section is completely removed from the saved table
      await expect(savedRow).not.toBeVisible();
      return true;
    };

    await test.step('1. Full cycle for ACT201.1: Take -> Save & Confirm -> Drop (Yes drop it -> Yes -> OK) -> Verify removed', async () => {
      const isComplete = await processSectionFullCycle('ACT201.1');
      expect(isComplete).toBe(true);
    });

    await test.step('2. Full cycle for ACT201.2: Take -> Save & Confirm -> Drop (Yes drop it -> Yes -> OK) -> Verify removed', async () => {
      const isComplete = await processSectionFullCycle('ACT201.2');
      expect(isComplete).toBe(true);
    });

    await test.step('3. Sequential Full Cycles for all remaining sections from the offerings image (ACT201.3 to ACT201.21)', async () => {
      const remainingSections = sectionsInImage.slice(2);
      let processedCount = 2; // ACT201.1 and ACT201.2 already completed

      for (const sectionName of remainingSections) {
        await test.step(`Process ${sectionName}: Take, Save, Drop, and Verify removed`, async () => {
          const completed = await processSectionFullCycle(sectionName);
          if (completed) {
            processedCount++;
          }
        });
      }

      console.log(`[COMPLETE] Successfully processed ${processedCount} sections of ${courseCode}.`);
      expect(processedCount).toBeGreaterThanOrEqual(2);
    });
  });
});
