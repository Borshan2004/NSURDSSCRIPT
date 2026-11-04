import fs from 'fs';
import path from 'path';
import { test as setup } from '../src/fixtures/base';
import { RdsLoginPage } from '../src/pages/RdsLoginPage';
import studentData from './data/rds-student-data.json';
import testUsers from './data/test-users.json';

const authDir = path.resolve('playwright/.auth');

setup('authenticate student sessions globally', async ({ browser }) => {
  setup.slow();

  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // 1. Authenticate standard student (2512560) in an isolated context
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();
  const loginPage1 = new RdsLoginPage(page1);
  await loginPage1.goto();
  await loginPage1.loginAsStudent(studentData.student);
  await context1.storageState({ path: path.join(authDir, 'student.json') });
  await context1.close();

  // 2. Authenticate senior student (2231451) in an isolated context
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  const loginPage2 = new RdsLoginPage(page2);
  await loginPage2.goto();
  await loginPage2.loginAsStudent(studentData.eligibleExclusionStudent);
  await context2.storageState({ path: path.join(authDir, 'senior-student.json') });
  await context2.close();

  // 3. Authenticate student 2421226 (inclusion, leave, semester-drop) in an isolated context
  const context3 = await browser.newContext();
  const page3 = await context3.newPage();
  const loginPage3 = new RdsLoginPage(page3);
  await loginPage3.goto();
  await loginPage3.loginAsStudent(studentData.eligibleInclusionStudent);
  await context3.storageState({ path: path.join(authDir, 'inclusion-student.json') });
  await context3.storageState({ path: path.join(authDir, 'leave-student.json') });
  await context3.storageState({ path: path.join(authDir, 'semester-drop-student.json') });
  await context3.close();

  // 4. Authenticate unlock ID student (2425471) in an isolated context
  const context4 = await browser.newContext();
  const page4 = await context4.newPage();
  const loginPage4 = new RdsLoginPage(page4);
  await loginPage4.goto();
  await loginPage4.loginAsStudent(studentData.unlockIdStudent);
  await context4.storageState({ path: path.join(authDir, 'unlock-student.json') });
  await context4.close();

  // 5. Authenticate profile & advising student (2421354) in an isolated context
  const context5 = await browser.newContext();
  const page5 = await context5.newPage();
  const loginPage5 = new RdsLoginPage(page5);
  await loginPage5.goto();
  await loginPage5.loginAsStudent({ username: testUsers.student.username, password: testUsers.student.password });
  await context5.storageState({ path: path.join(authDir, 'profile-student.json') });
  await context5.close();
});
