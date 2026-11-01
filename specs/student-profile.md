# Test Plan: NSU RDS Student Profile & Information Verification

**Target:** `http://10.102.11.254/rds/students/profile`  
**Seed:** `tests/seed.spec.ts`  
**Author:** Playwright Test Planner  
**Date:** 2026-11-01  

---

## 1. Overview
This test plan covers the **Student Profile** subsystem within the NSU RDS student portal. It validates user authentication, navigation via the top menu dropdown, tab switching between **General Information** and **Personal & Parent Information**, and verified data integrity of academic records, personal demographics, and parental contact details.

---

## 2. Preconditions & Test Data
- Test Server reachable at `http://10.102.11.254/rds/`.
- Active student test account:
  - **Username / Student ID:** `2421534` (Full ID: `2421534043`)
  - **Password:** `123`
- Student baseline record:
  - **Name:** `Md Rahat Hossain Molla`
  - **Department / Degree:** `Bachelor of Science in Electrical and Electronic Engineering` (`BS in EEE - 130 Credit Curriculum`)
  - **Status:** `Enrolled` | **CGPA:** `2.04` | **Credits Passed:** `30.00` | **Probation:** `0`
  - **Contact:** `01990927203` | `h.mdrahat87@gmail.com`

---

## 3. Scenarios

### Scenario 2.1 — Authentication & Navigation to Student Profile
- **Priority:** P0
- **Tags:** `@smoke` `@profile` `@navigation`
- **Preconditions:** Fresh browser session on `http://10.102.11.254/rds/`.
- **Steps:**
  1. Navigate to `http://10.102.11.254/rds/`.
  2. Enter `2421534` into `Username` and click `Next`.
  3. Enter `123` into `Password` and click `Login`.
  4. Wait for landing page `http://10.102.11.254/rds/students/landing` to load.
  5. Click the `Profile` dropdown menu toggle in the top navigation bar.
  6. Click `Student Information` from the submenu.
- **Assertions:**
  - URL matches `http://10.102.11.254/rds/students/profile\?token=.*`.
  - Page title equals `Online Portal | North South University`.
  - Top advisory alert displays: `*** For any kind of query about your profile information please contact with the registrar's office. ***`.
  - Both tabs `General Information` and `Personal & Parent Information` are visible.

---

### Scenario 2.2 — General Information & Academic Standing Verification
- **Priority:** P0
- **Tags:** `@smoke` `@profile` `@academic`
- **Preconditions:** User is on the `Student Information` page with `General Information` tab active (default).
- **Steps:**
  1. Observe the student avatar card on the left.
  2. Inspect the **General Info** column.
  3. Inspect the **Tentative Academic Information** column.
- **Assertions:**
  - Avatar card displays student ID badge `2421534043`.
  - Heading `General Info` is visible:
    - `Full Name:` equals `Md Rahat Hossain Molla`.
    - `Student ID:` contains `2421534`.
    - `Enrolled In:` equals `Bachelor of Science in Electrical and Electronic Engineering`.
    - `Curriculum Name:` equals `BS in EEE - 130 Credit Curriculum`.
    - `Entry Item:` equals `Summer 2024`.
  - Heading `Tentative Academic Information` is visible:
    - `Current Status:` equals `Enrolled`.
    - `Current CGPA:` matches regex `^\d\.\d{2}$` (value: `2.04`).
    - `Credit Passed:` matches regex `^\d+(\.\d{2})?$` (value: `30.00`).
    - `Probation:` equals `0`.

---

### Scenario 2.3 — Tab Switching & Personal Details Verification
- **Priority:** P1
- **Tags:** `@regression` `@profile` `@tabs`
- **Preconditions:** User is on the `Student Information` page.
- **Steps:**
  1. Click on the tab `Personal & Parent Information`.
- **Assertions:**
  - Tab `Personal & Parent Information` is marked active (`.active` class).
  - Column heading `Personal Information` is visible:
    - `Cell Phone:` equals `01990927203`.
    - `Personal Email:` equals `h.mdrahat87@gmail.com`.
    - `NID:` equals `2863979254`.
    - `Date of Birth:` equals `2002-06-27`.
    - `Sex:` equals `M`.
    - `Citizenship:` equals `Bangladeshi`.
    - `Mailing Address:` contains `Dhaka`.
  - Button `Edit Personal Information` (`#showOTPPanel`) is visible.

---

### Scenario 2.4 — Parent Information Display Verification
- **Priority:** P1
- **Tags:** `@regression` `@profile`
- **Preconditions:** `Personal & Parent Information` tab is active.
- **Steps:**
  1. Inspect the **Parent Information** column on the right side.
- **Assertions:**
  - `Father Name:` equals `Md Halim Uddin Molla`.
  - `Mother Name:` equals `Roksana Akter`.
  - `Phone:` equals `01914205910`.
  - `Mobile No:` equals `01914205910`.

---

### Scenario 2.5 — Edit Personal Information Trigger & OTP Verification Guard
- **Priority:** P2
- **Tags:** `@regression` `@profile` `@security`
- **Preconditions:** `Personal & Parent Information` tab is active.
- **Steps:**
  1. Click the `Edit Personal Information` button (`#showOTPPanel`).
- **Assertions:**
  - OTP verification section / modal displays prompt:
    `In order to change information verify by sending an authentication code, please select an option (Email or SMS):`.
  - Authentication options (Email / SMS radio or dropdown) become visible.
  - Form safeguards prevent unauthorized direct field mutation without OTP.

---

## 4. Not Covered (Out of Scope for This Plan)
- Actual SMS/Email gateway delivery of 2FA OTP codes (unless mock OTP test endpoint is provided).
- Document uploads (Birth Certificate / NID attachments) — scheduled for separate `student-documents.md` plan.
- Advising and Course Registration — covered under `course-advising.md`.
