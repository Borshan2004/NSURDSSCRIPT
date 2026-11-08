import fs from 'fs';
import path from 'path';
import { test as setup } from '../src/fixtures/base';
import { Browser } from '@playwright/test';
import { RdsLoginPage } from '../src/pages/RdsLoginPage';
import { BASE_URL } from '../src/utils/config';
import testUsers from './data/test-users.json';

const authDir = path.resolve('playwright/.auth');
const MAX_SESSION_AGE_MS = 5 * 60 * 1000; // 5 minutes

const authCopies = [
  'profile-student.json',
  'senior-student.json',
  'inclusion-student.json',
  'leave-student.json',
  'semester-drop-student.json',
  'unlock-student.json',
];

async function ensureSingleStudentAuthenticated(
  browser: Browser,
  user: { username: string; password: string }
): Promise<void> {
  const mainAuthPath = path.join(authDir, 'student.json');

  if (fs.existsSync(mainAuthPath)) {
    try {
      const stats = fs.statSync(mainAuthPath);
      const isFresh = Date.now() - stats.mtimeMs < MAX_SESSION_AGE_MS;

      if (isFresh) {
        const probeContext = await browser.newContext({
          storageState: mainAuthPath,
          baseURL: BASE_URL,
        });
        const probePage = await probeContext.newPage();
        await probePage.goto('students/landing', { timeout: 10000 });
        await probePage.waitForLoadState('domcontentloaded');

        if (probePage.url().includes('students/landing')) {
          await probePage.close();
          await probeContext.close();

          for (const copyName of authCopies) {
            fs.copyFileSync(mainAuthPath, path.join(authDir, copyName));
          }
          return;
        }
        await probePage.close();
        await probeContext.close();
      }
    } catch {
      // Fall through to login
    }
  }

  // Perform single fresh login
  const context = await browser.newContext({ baseURL: BASE_URL });
  const page = await context.newPage();
  const loginPage = new RdsLoginPage(page);
  await loginPage.goto();
  await loginPage.loginAsStudent(user);
  await context.storageState({ path: mainAuthPath });
  await context.close();

  for (const copyName of authCopies) {
    fs.copyFileSync(mainAuthPath, path.join(authDir, copyName));
  }
}

setup('authenticate student session globally', async ({ browser }) => {
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Single login with unified student account (2421354)
  await ensureSingleStudentAuthenticated(browser, {
    username: testUsers.student.username,
    password: testUsers.student.password,
  });
});
