# Inspection & Test Report: NSU RDS Student Information Page

**Target Environment:** Local Intranet Test Server (`http://10.102.11.254/rds/`)  
**Page Route:** `/rds/students/profile?token=...`  
**Test Account ID:** `2421534` (Full ID: `2421534043`)  
**Execution Engine:** Playwright 1.50+ on Chromium  
**Date:** 2026-11-01  

> **Environment Isolation Confirmed:** All automated requests, DOM explorations, and tests run strictly against `http://10.102.11.254/rds/`. Zero calls are made to the live production server.

---

## 1. Executive Summary

The **Student Information** page is the central profile record within the NSU RDS portal. It presents a dual-tabbed layout dividing official university academic records from student demographics and parent emergency contacts. 

Automated tests in `tests/student/profile.spec.ts` against this page achieved a **100% pass rate** across all functional assertions (academic standing, tab transitions, contact records, and edit trigger guards).

---

## 2. Layout & Architecture Breakdown

### Top Notice & Breadcrumb Controls
- **Advisory Banner**: `<div class="alert alert-info">`
  - Exact Text: `*** For any kind of query about your profile information please contact with the registrar's office. ***`
- **Identity Badge**: Badged hyperlink linking to avatar modal showing `2421534043`.

---

## 3. Data Dictionary: Field Level Inventory

### Tab 1 — General Information

| Field Label | Rendered Value | Data Type / Format | Playwright Locator |
| :--- | :--- | :--- | :--- |
| **Full Name:** | `Md Rahat Hossain Molla` | String | `.profile-info-row:has-text("Full Name:") .profile-info-value` |
| **Student ID:** | `2421534 0 43` | String (space separated) | `.profile-info-row:has-text("Student ID:") .profile-info-value` |
| **Enrolled In:** | `Bachelor of Science in Electrical and Electronic Engineering` | String | `.profile-info-row:has-text("Enrolled In:") .profile-info-value` |
| **Curriculum Name:** | `BS in EEE - 130 Credit Curriculum` | String | `.profile-info-row:has-text("Curriculum Name:") .profile-info-value` |
| **Entry Item:** | `Summer 2024` | String (`Semester YYYY`) | `.profile-info-row:has-text("Entry Item:") .profile-info-value` |
| **Test Pas #:** | `2423736` | Numeric String | `.profile-info-row:has-text("Test Pas #:") .profile-info-value` |
| **Current Status:** | `Enrolled` | Status Enum | `.profile-info-row:has-text("Current Status:") .profile-info-value` |
| **Current CGPA:** | `2.04` | Decimal (`0.00` - `4.00`) | `.profile-info-row:has-text("Current CGPA:") .profile-info-value` |
| **Credit Passed:** | `30.00` | Decimal (`0.00` - `160.00`) | `.profile-info-row:has-text("Credit Passed:") .profile-info-value` |
| **Probation:** | `0` | Integer count | `.profile-info-row:has-text("Probation:") .profile-info-value` |
| **Major 1 / 2:** | `N/A` | String / Null | `.profile-info-row:has-text("Major 1:") .profile-info-value` |
| **Minor:** | `(empty)` | String / Null | `.profile-info-row:has-text("Minor:") .profile-info-value` |

---

### Tab 2 — Personal & Parent Information

| Category | Field Label | Rendered Value | Validation / Format Rule |
| :--- | :--- | :--- | :--- |
| **Personal** | **Cell Phone:** | `01990927203` | BD Mobile Format (`01XXXXXXXXX`) |
| **Personal** | **Personal Email:** | `h.mdrahat87@gmail.com` | Standard RFC 5322 Email Format |
| **Personal** | **NID:** | `2863979254` | 10 or 17 digit National ID |
| **Personal** | **Birth Reg No:** | *(empty)* | Optional 17 digit registration |
| **Personal** | **Date of Birth:** | `2002-06-27` | ISO Date Format (`YYYY-MM-DD`) |
| **Personal** | **Sex:** | `M` | Single Character Code (`M` / `F`) |
| **Personal** | **Citizenship:** | `Bangladeshi` | Country name |
| **Personal** | **Blood Group:** | *(empty)* | Optional medical record |
| **Personal** | **Mailing Address:** | `2B Bazar Road Dhaka Bangladesh , Dhaka - 1212` | Multiline String with Postal Code |
| **Parent** | **Father Name:** | `Md Halim Uddin Molla` | Primary parent name string |
| **Parent** | **Mother Name:** | `Roksana Akter` | Primary parent name string |
| **Parent** | **Guardian Name:** | *(empty)* | Optional designated legal guardian |
| **Parent** | **Parent Address:** | *(empty)* | Permanent residence address |
| **Parent** | **Phone / Mobile:** | `01914205910` | Parent emergency contact telephone |

---

## 4. Read / Write & Mutation Workflow Analysis

1. **Initial State:** Demographic records are rendered inside `.profile-info-value` divs (read-only text).
2. **Action Trigger:** Button `#showOTPPanel` with text `"Edit Personal Information"` is situated at the bottom-left of the Personal Information column.
3. **Guard Form (`#authform`):**
   - Displays radio options:
     - `Email`: Dispatches token to registered email (`h.mdrahat87@gmail.com`).
     - `SMS`: Dispatches token to masked phone (`017*****638`).
   - Submit Button: `name="commit"`, value `"Send Authentication Code"`.
   - Cancel Action: `Back` link resets form back to read-only profile state.
4. **2FA Configuration:** In accordance with your instructions, 2FA validation is treated as OFF / bypassed for automated regression.

---

## 5. Automated Test Coverage & Verification Metrics

All scenarios documented in `specs/student-profile.md` are executed in `tests/student/profile.spec.ts`:

- **Total Test Specs:** 6
- **Total Passing:** 6 (100%)
- **Total Duration:** 16.6 seconds
- **Browser Automation Mode:** Headless Chromium with parallel worker execution.
