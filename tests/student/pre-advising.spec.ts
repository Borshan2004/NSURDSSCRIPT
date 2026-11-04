import { test, expect, getAuthenticatedStudentPage } from '../../src/fixtures/base';
import { Page } from '@playwright/test';
import { RdsStudentLandingPage } from '../../src/pages/RdsStudentLandingPage';
import { PreAdvisingPage } from '../../src/pages/PreAdvisingPage';

test.describe('Advising > Pre-Advising & Academic Probation Quiz', () => {
  test.describe.configure({ mode: 'serial' });
  let sharedPage: Page;
  let landingPage: RdsStudentLandingPage;
  let preAdvisingPage: PreAdvisingPage;

  test.beforeAll(async ({ browser }) => {
    sharedPage = await getAuthenticatedStudentPage(browser);
    landingPage = new RdsStudentLandingPage(sharedPage);
    await landingPage.goto();
    preAdvisingPage = await landingPage.navigateToPreAdvising();
  });

  test.afterAll(async () => {
    await sharedPage?.context()?.close();
  });

  test('1. Pre-Advising Navigation & Route Verification @smoke @advising', async () => {
    await test.step('Verify navigation URL targets students/preadvising', async () => {
      await expect(sharedPage).toHaveURL(/students\/preadvising/);
    });
  });

  test('2. Academic Probation Guidelines Quiz Modal Check @smoke @advising', async () => {
    const isQuizOpen = await preAdvisingPage.isQuizModalVisible();

    if (isQuizOpen) {
      await test.step('Verify Academic Probation Guidelines modal header & notice', async () => {
        await expect(preAdvisingPage.modalHeading).toBeVisible();
        await expect(preAdvisingPage.modalNotice).toBeVisible();
      });

      await test.step('Verify Question 1 options and Next button', async () => {
        await expect(preAdvisingPage.optionA).toBeVisible();
        await expect(preAdvisingPage.optionB).toBeVisible();
        await expect(preAdvisingPage.nextButton).toBeVisible();
        await expect(preAdvisingPage.nextButton).toBeEnabled();
      });

      await test.step('Answer Question 1 (A. 2.00) and click Next', async () => {
        await preAdvisingPage.answerQuestionAndNext('A');
      });
    } else {
      await test.step('Verify user is cleared past quiz or sees view state', async () => {
        const isHeaderOrAlert = preAdvisingPage.pageHeading.or(preAdvisingPage.incompleteEvaluationAlert);
        await expect(isHeaderOrAlert.first()).toBeVisible();
      });
    }
  });

  test('3. Pre-Advising Limits & Course Selection Controls @regression @advising', async () => {
    const isHeadingVisible = await preAdvisingPage.pageHeading.isVisible();

    if (isHeadingVisible) {
      await test.step('Verify maximum allowed course and credit badges', async () => {
        await expect(preAdvisingPage.maxAllowedCoursesBadge).toBeVisible();
        await expect(preAdvisingPage.maxAllowedCreditsBadge).toBeVisible();
      });

      await test.step('Verify course selection dropdown and priority controls', async () => {
        await expect(preAdvisingPage.courseSelect).toBeVisible();
        await expect(preAdvisingPage.priorityInput).toBeVisible();
        await expect(preAdvisingPage.addButton).toBeVisible();
      });

      await test.step('Verify chosen courses table header and structure', async () => {
        await expect(preAdvisingPage.chosenCoursesHeading).toBeVisible();
        await expect(preAdvisingPage.chosenCoursesTable).toBeVisible();
      });
    } else {
      await test.step('Verify evaluation prerequisite notice is displayed', async () => {
        await expect(preAdvisingPage.incompleteEvaluationAlert).toBeVisible();
      });
    }
  });
});
