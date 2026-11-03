# Test Plan: NSU RDS Course Advising Window

**Target:** `http://10.102.11.254/rds/students/advising`  
**Seed:** `tests/seed.spec.ts`  
**Date:** 2026-11-03  

---

## 1. Overview
This test plan covers the **Online Advising System** (`students/advising`) on the NSU RDS portal. It verifies navigating to the advising window via the top navigation `Advising` dropdown menu, verifying the student's identity and CGPA banner, checking course taking search/input controls and action buttons (`Save`, `Discard Changes`), and confirming the presence of the saved courses slip table and course offering list.

---

## 2. Preconditions & Test Data
- Test Server reachable at `http://10.102.11.254/rds/`.
- Active student test account:
  - **Username / Student ID:** `2421354` (Full ID: `2421354642`)
  - **Student Name:** `Sabiha Hossain Shifa`
  - **CGPA:** `1.79`

---

## 3. Scenarios

### Scenario 5.1 — Navigation to Advising Window via Top Menu
- **Priority:** P0
- **Tags:** `@smoke` `@advising`
- **Steps:**
  1. Authenticate with student account `2421354`.
  2. Open the `Advising` dropdown menu from the top navigation bar.
  3. Click `Advising Window`.
- **Assertions:**
  - Destination URL matches `http://10.102.11.254/rds/students/advising`.
  - System header `North South University Online Advising System` is visible.
  - Active session countdown timer and Log Out link are displayed.

### Scenario 5.2 — Student Information & CGPA Banner Verification
- **Priority:** P0
- **Tags:** `@smoke` `@advising`
- **Assertions:**
  - Student name banner displays student name `Sabiha Hossain Shifa` and ID `2421354642`.
  - CGPA indicator displays `CGPA: 1.79`.

### Scenario 5.3 — Course Taking Input & Advising Controls
- **Priority:** P0
- **Tags:** `@smoke` `@advising`
- **Assertions:**
  - Course taking search field (`#searchText`) is visible and editable.
  - Action buttons `Save` and `Discard Changes` are present and accessible.

### Scenario 5.4 — Saved Courses Slip & Course Offerings Panels
- **Priority:** P1
- **Tags:** `@smoke` `@advising`
- **Assertions:**
  - Saved Courses table is displayed with columns (`Saved`, `Course`, `Credit`, `Time`, `Fees`).
  - Total credit and fee summary rows are visible.
  - Advising policy guidelines (`Dropping is ALLOWED`, `Section change is ALLOWED`) are displayed.
  - Course offerings section table on the right panel is populated.

