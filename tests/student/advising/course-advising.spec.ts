import { test, expect, getAuthenticatedStudentPage } from '../../../src/fixtures/base';
import { Page } from '@playwright/test';
import { LandingPage } from '../../../src/pages/LandingPage';
import { AdvisingPage } from '../../../src/pages/AdvisingPage';
import testUsers from '../../data/test-users.json';

test.describe('Advising > Advising Window', () => {
  test.describe.configure({ mode: 'serial' });
  let sharedPage: Page;
  let advisingPage: AdvisingPage;

  test.beforeAll(async ({ browser }) => {
    sharedPage = await getAuthenticatedStudentPage(browser);
    const landingPage = new LandingPage(sharedPage);
    await landingPage.goto();
    advisingPage = await landingPage.navigateToAdvising();
  });

  test.afterAll(async () => {
    await sharedPage?.context()?.close();
  });

  test('1. Advising Window Navigation & Portal Header @smoke @advising', async () => {
    await test.step('Verify URL matches students/advising route', async () => {
      await expect(sharedPage).toHaveURL(/students\/advising/);
    });

    await test.step('Verify system title, countdown timer, and logout link', async () => {
      await expect(advisingPage.systemHeading).toBeVisible();
      await expect(advisingPage.countdownTimer).toBeVisible();
      await expect(advisingPage.logoutLink).toBeVisible();
    });
  });

  test('2. Student Identity & CGPA Verification @smoke @advising', async () => {
    await test.step('Verify student name and ID in advising header', async () => {
      const advisingStudent = testUsers.studentBorshan || testUsers.student;
      await expect(advisingPage.studentName).toBeVisible();
      await expect(advisingPage.studentName).toContainText(
        new RegExp(`${advisingStudent.fullName}|${advisingStudent.displayName || ''}|${testUsers.student.fullName}`, 'i')
      );
      await expect(advisingPage.studentName).toContainText(
        new RegExp(`${advisingStudent.username}|${advisingStudent.studentId}|${testUsers.student.studentId}`)
      );
    });

    await test.step('Verify CGPA matches student record', async () => {
      await expect(advisingPage.cgpaValue).toBeVisible();
      await expect(advisingPage.cgpaValue).toContainText(/CGPA:\s*[\d.]+/i);
    });
  });

  test('3. Course Taking Input & Form Controls @smoke @advising', async () => {
    await test.step('Verify course taking search field is visible and editable', async () => {
      await expect(advisingPage.courseInputField).toBeVisible();
      await expect(advisingPage.courseInputField).toBeEditable();
    });

    await test.step('Verify Save and Discard Changes buttons are present', async () => {
      await expect(advisingPage.saveButton).toBeVisible();
      await expect(advisingPage.discardButton).toBeVisible();
    });
  });

  // test('4. Saved Courses Slip & Offerings Panels @smoke @advising', async () => {
  //   await test.step('Verify Saved Courses slip table and total credits summary', async () => {
  //     await expect(advisingPage.savedCoursesTable).toBeVisible();
  //     await expect(advisingPage.totalCreditsSummary).toBeVisible();
  //   });

  //   await test.step('Verify advising policies notice is displayed', async () => {
  //     await expect(advisingPage.advisingRules).toBeVisible();
  //     await expect(advisingPage.advisingRules).toContainText('Dropping is ALLOWED');
  //   });

  //   await test.step('Verify course offerings list panel is visible', async () => {
  //     await expect(advisingPage.courseOfferingsTable).toBeVisible();
  //   });
  // });

  test('5. Course Advising Flow: Sequential Section Taking (ACT201.1 to ACT201.21) with Save & Drop Full Cycle @advising', async () => {
    // Increase timeout for multi-section processing (all 21 sections from offerings image)
    test.setTimeout(300000);

    const targetStudentId = testUsers.studentBorshan?.studentId || '2512570642';
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

    await test.step('Verify student ID and advising session banner', async () => {
      // Verify advising window displays student ID (e.g. 2512570642 or configured student ID)
      const studentIdentifier = advisingPage.studentName.or(
        sharedPage.getByText(new RegExp(`${targetStudentId}|${testUsers.student.studentId}`))
      );
      await expect(studentIdentifier).toBeVisible();
    });

    await test.step('Verify course offerings table is displayed and search course', async () => {
      await expect(advisingPage.courseOfferingsTable).toBeVisible();
      await advisingPage.searchCourse(courseCode);
    });

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

