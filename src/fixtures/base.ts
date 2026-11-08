import { test as base, expect, Browser, BrowserContext, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { RdsLoginPage } from '../pages/RdsLoginPage';
import { RdsStudentLandingPage } from '../pages/RdsStudentLandingPage';
import { BASE_URL } from '../utils/config';
import testUsers from '../../tests/data/test-users.json';

const authDir = path.join(__dirname, '../../playwright/.auth');
const studentAuthFile = path.join(authDir, 'student.json');

/**
 * Returns an authenticated student browser context using the cached single-account session.
 */
export async function getAuthenticatedStudentContext(browser: Browser): Promise<BrowserContext> {
  if (fs.existsSync(studentAuthFile)) {
    return browser.newContext({ storageState: studentAuthFile, baseURL: BASE_URL });
  }

  // Fallback: Perform fresh single login if auth.setup has not run
  fs.mkdirSync(authDir, { recursive: true });
  const freshContext = await browser.newContext({ baseURL: BASE_URL });
  const loginPageContext = await freshContext.newPage();
  const loginPage = new RdsLoginPage(loginPageContext);
  await loginPage.goto();
  await loginPage.loginAsStudent({
    username: testUsers.student.username,
    password: testUsers.student.password,
  });
  await freshContext.storageState({ path: studentAuthFile });
  await loginPageContext.close();
  return freshContext;
}

/**
 * Creates and returns a single authenticated student page using the cached session.
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
  studentLandingPage: async ({ authenticatedPage }, use) => {
    const landingPage = new RdsStudentLandingPage(authenticatedPage);
    await landingPage.goto();
    await use(landingPage);
  },
});

export { expect };
