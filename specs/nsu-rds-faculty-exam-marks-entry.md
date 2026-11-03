# Test Plan: NSU RDS Faculty Exam Marks Entry (CSE215)

**Target:** http://10.102.11.254/rds/  
**Feature:** Faculty Exam Marks Entry & Grade Preparation  
**Semester:** Fall 2026 (Semester Code: 263)  
**Course:** CSE215 Section 5  
**Date:** 2026-10-27  

## Overview
This test plan validates the end-to-end faculty workflow for entering student exam marks on the NSU RDS portal. The flow covers faculty login with credential verification, sidebar navigation to Grade Calculation & Submission, semester selection, course and section identification, exam marks entry into the student grade table, saving changes through confirmation dialogs, and progressing to the Grade Configuration phase.

## Preconditions
- The NSU RDS application server is active and reachable at `http://10.102.11.254/rds/`.
- Faculty user `sva` exists with password `123` and has access to Fall 2026 course `CSE215` Section 5.
- Fall 2026 course list contains enrolled students under CSE215 Section 5.

## Scenarios

### Scenario 1.1 — Full Faculty Exam Marks Entry and Progression
- **Priority:** P0
- **Tags:** `@smoke` `@critical`
- **Preconditions:** Faculty user is unauthenticated on the portal login page.
- **Steps:**
  1. Navigate to `http://10.102.11.254/rds/` — expected: Login page loads with the Username input field and Next button.
  2. Enter faculty username `sva` and click "Next" — expected: Password input field appears.
  3. Enter password `123` and click "Login" — expected: Portal authenticates and navigates to the Faculty Dashboard.
  4. Verify the dashboard displays the welcome message "Welcome Ms. Silvia Ahmed".
  5. Expand the "Grade Calculation & Submission (NEW)" sidebar menu and click "(1) Exam Marks Entry" — expected: URL contains `/faculty/mycoursesnew?submenu=marks_entry` and the heading "Exam Marks Entry" is visible.
  6. Select "Fall 2026" from the semester dropdown — expected: Course table updates to display courses for Fall 2026 (including CSE215).
  7. Locate the row for `CSE215` Section `5` and click "Exam Marks Entry" in the Grade Status column — expected: Navigates to `/rds/faculty/gradePrep/gradePreparation/263/CSE215/5`.
  8. If no exam column exists, select "Quiz", fill exam date `2026-10-27`, topic `Automated QA Test Quiz`, total marks `20`, and click "Add".
  9. In the student marks table, populate mark `18` into all student input fields.
  10. Click "Save" (or "Update"), and confirm the SweetAlert modal by clicking "Yes" — expected: Marks are persisted.
  11. Click the "Next" link — expected: Page transitions to `/rds/faculty/gradePrep/gradeConfig/263/CSE215/5` displaying "Grade Configuration".
- **Assertions:**
  - Dashboard confirms logged-in faculty name `Welcome Ms. Silvia Ahmed`.
  - Exam Marks Entry page heading is visible.
  - Grade Preparation page URL matches `/gradePreparation/263/CSE215/5`.
  - Student marks inputs reflect the filled score (`18`).
  - Next page URL matches `/gradeConfig/263/CSE215/5` with "Grade Configuration" heading visible.

## Edge Cases Considered
- Two-step authentication flow (username entry followed by dynamic password input).
- Course matching disambiguation between `CSE215` and `CSE215L` (strict cell value matching).
- Handling both initial "Save" and subsequent "Update" button states.
- Handling SweetAlert2 confirmation dialog on submit.
- Multi-row batch input population across all student rows without using forbidden timeouts.

