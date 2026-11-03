import { test, expect } from '../../src/fixtures/base';
import { RdsLoginPage } from '../../src/pages/RdsLoginPage';
import data from '../data/rds-faculty-data.json';

test.describe('NSU RDS Faculty Exam Marks Entry', () => {
  test('authenticates, navigates to Fall 2026 CSE215 marks entry, populates student marks, and proceeds @smoke @critical', async ({
    page,
  }) => {
    // Extended timeout to accommodate batch entry across 39 student rows and multiple modal confirmations
    test.slow();

    const loginPage = new RdsLoginPage(page);

    await test.step('Login to RDS faculty portal', async () => {
      await loginPage.goto();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.nextButton).toBeVisible();
    });

    let dashboardPage: any;
    await test.step('Submit faculty credentials and verify dashboard', async () => {
      dashboardPage = await loginPage.loginAs(data.faculty);
      await expect(dashboardPage.welcomeHeading).toBeVisible();
    });

    let coursesPage: any;
    await test.step('Navigate to Exam Marks Entry page', async () => {
      coursesPage = await dashboardPage.navigateToExamMarksEntry();
      await expect(coursesPage.pageHeading).toBeVisible();
      await expect(page).toHaveURL(/submenu=marks_entry/);
    });

    let gradePrepPage: any;
    await test.step('Select Fall 2026 semester and open CSE215 Section 5', async () => {
      await coursesPage.selectSemester(data.course.semester);
      const cseRow = coursesPage.getCourseRow(data.course.courseCode, data.course.section);
      await expect(cseRow).toBeVisible();
      gradePrepPage = await coursesPage.openExamMarksEntryForCourse(
        data.course.courseCode,
        data.course.section
      );
      await expect(page).toHaveURL(
        new RegExp(
          `gradePreparation/${data.course.semesterCode}/${data.course.courseCode}/${data.course.section}`
        )
      );
    });

    await test.step('Ensure exam category exists and fill marks for all students', async () => {
      await gradePrepPage.addExamCategoryIfMissing(data.exam);
      await expect(gradePrepPage.studentMarksInputs.first()).toBeVisible();
      const studentCount = await gradePrepPage.fillAllStudentMarks(data.exam.studentMark);
      expect(studentCount).toBeGreaterThan(0);
      await expect(gradePrepPage.studentMarksInputs.first()).toHaveValue(data.exam.studentMark);
    });

    let gradeConfigPage: any;
    await test.step('Save student marks and proceed to Grade Configuration', async () => {
      await gradePrepPage.saveMarks();
      gradeConfigPage = await gradePrepPage.proceedToNext();
      await expect(page).toHaveURL(
        new RegExp(
          `gradeConfig/${data.course.semesterCode}/${data.course.courseCode}/${data.course.section}`
        )
      );
      await expect(gradeConfigPage.pageHeading).toBeVisible();
    });
  });
});

