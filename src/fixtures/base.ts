import { test as base, expect, Browser, BrowserContext, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { LoginPage } from '../pages/LoginPage';
import { RdsStudentLandingPage } from '../pages/RdsStudentLandingPage';
import testUsers from '../../tests/data/test-users.json';

const authDir = path.join(__dirname, '../../playwright/.auth');
const studentAuthFile = path.join(authDir, 'profile-student.json');

/**
 * Ensures an authenticated student session is cached in storageState.
 * If cached session is expired or absent, performs login and saves state.
 */
export async function getAuthenticatedStudentContext(browser: Browser): Promise<BrowserContext> {
  if (fs.existsSync(studentAuthFile)) {
    const context = await browser.newContext({ storageState: studentAuthFile });
    const probePage = await context.newPage();
    await probePage.goto('http://10.102.11.254/rds/students/landing');
    await probePage.waitForLoadState('domcontentloaded');

    if (!probePage.url().includes('/login') && !probePage.url().endsWith('/rds/')) {
      await probePage.close();
      return context;
    }
    // Session expired or invalidated, re-authenticate
    await probePage.close();
    await context.close();
  }

  // Perform fresh login and save storage state
  fs.mkdirSync(authDir, { recursive: true });
  const freshContext = await browser.newContext();
  const loginPageContext = await freshContext.newPage();
  const loginPage = new LoginPage(loginPageContext);
  await loginPage.goto();
  await loginPage.login(testUsers.student.username, testUsers.student.password);
  await loginPageContext.waitForURL(/students\/landing/);
  await freshContext.storageState({ path: studentAuthFile });
  await loginPageContext.close();
  return freshContext;
}

/**
 * Creates and returns an authenticated student page using cached session.
 */
export async function getAuthenticatedStudentPage(browser: Browser): Promise<Page> {
  const context = await getAuthenticatedStudentContext(browser);
  return context.newPage();
}

export const test = base.extend<{
  authenticatedPage: Page;
  studentLandingPage: RdsStudentLandingPage;
}>({
  authenticatedPage: async ({ browser }, use) => {
    const page = await getAuthenticatedStudentPage(browser);
    await use(page);
    await page.context().close();
  },
  studentLandingPage: async ({ page }, use) => {
    const landing = new RdsStudentLandingPage(page);
    await landing.goto();
    await use(landing);
  },
});

export { expect };
