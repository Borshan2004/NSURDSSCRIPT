import { test, expect } from '../../src/fixtures/base';
import { LoginPage } from '../../src/pages/LoginPage';
import { LandingPage } from '../../src/pages/LandingPage';
import { StudentProfilePage } from '../../src/pages/StudentProfilePage';
import testUsers from '../data/test-users.json';

test.describe('Profile > Student Information', () => {
  let profilePage: StudentProfilePage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.student.username, testUsers.student.password);

    const landingPage = new LandingPage(page);
    profilePage = await landingPage.navigateToStudentProfile();
  });

  test('1. Student Information Navigation @smoke @profile', async ({ page }) => {
    await test.step('Check URL matches students/profile route', async () => {
      await expect(page).toHaveURL(/students\/profile/);
    });

    await test.step('Check registrar query notice alert is visible', async () => {
      await expect(profilePage.noticeBanner).toBeVisible();
    });

    await test.step('Check General Information tab is present', async () => {
      await expect(profilePage.generalInfoTab).toBeVisible();
    });

    await test.step('Check Personal & Parent Information tab is present', async () => {
      await expect(profilePage.personalParentInfoTab).toBeVisible();
    });
  });

  test('2. General Information @smoke @profile', async () => {
    await test.step('Full Name: ' + testUsers.student.fullName, async () => {
      await expect(profilePage.fullNameValue).toHaveText(testUsers.student.fullName);
    });

    await test.step('Student ID: ' + testUsers.student.username, async () => {
      await expect(profilePage.studentIdValue).toContainText(testUsers.student.username);
    });

    await test.step('Enrolled Degree: ' + testUsers.student.department, async () => {
      await expect(profilePage.enrolledDegreeValue).toHaveText(testUsers.student.department);
    });

    await test.step('Curriculum Name: ' + testUsers.student.curriculum, async () => {
      await expect(profilePage.curriculumValue).toHaveText(testUsers.student.curriculum);
    });

    await test.step('Current Status: ' + testUsers.student.status, async () => {
      await expect(profilePage.currentStatusValue).toHaveText(testUsers.student.status);
    });

    await test.step('Current CGPA: ' + testUsers.student.cgpa, async () => {
      await expect(profilePage.cgpaValue).toHaveText(testUsers.student.cgpa);
    });

    await test.step('Credit Passed: ' + testUsers.student.creditsPassed, async () => {
      await expect(profilePage.creditsPassedValue).toHaveText(testUsers.student.creditsPassed);
    });

    await test.step('Probation: 0', async () => {
      await expect(profilePage.probationValue).toHaveText('0');
    });
  });

  test('3. Personal & Parent Information @regression @profile', async () => {
    await test.step('Switch to Personal & Parent Information tab', async () => {
      await profilePage.switchToPersonalAndParentInfo();
    });

    await test.step('Cell Phone: ' + testUsers.student.cellPhone, async () => {
      await expect(profilePage.cellPhoneValue).toHaveText(testUsers.student.cellPhone);
    });

    await test.step('Personal Email: ' + testUsers.student.email, async () => {
      await expect(profilePage.personalEmailValue).toHaveText(testUsers.student.email);
    });

    await test.step('Father Name: ' + testUsers.student.fatherName, async () => {
      await expect(profilePage.fatherNameValue).toHaveText(testUsers.student.fatherName);
    });

    await test.step('Mother Name: ' + testUsers.student.motherName, async () => {
      await expect(profilePage.motherNameValue).toHaveText(testUsers.student.motherName);
    });

    await test.step('Edit Personal Information button is present', async () => {
      await expect(profilePage.editPersonalInfoButton).toBeVisible();
    });
  });
});
