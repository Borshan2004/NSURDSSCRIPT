# Test Plan: NSU RDS Major Declaration

**Target:** `http://10.102.11.254/rds/students/major`  
**Seed:** `tests/seed.spec.ts`  
**Date:** 2026-11-03  

---

## 1. Overview
This test plan covers the **Major Declaration** subsystem in the NSU RDS student portal. When a student attempts to declare their major, the system validates whether they have met the institutional credit prerequisite (66 completed credits). For accounts under 66 credits (such as test student `2421354` with 40.00 credits passed), an advisory warning banner is rendered.

---

## 2. Preconditions & Test Data
- Test Server reachable at `http://10.102.11.254/rds/`.
- Active student test account:
  - **Username / Student ID:** `2421354`
  - **Credits Passed:** `40.00` (< 66 credits)
- Major Declaration Requirement:
  - Minimum prerequisite: `66 credits`
  - Requirement alert: `"To declare your major, you need to complete 66 credits!!!"`

---

## 3. Scenarios

### Scenario 4.1 — Navigation to Major Declaration via Profile Menu
- **Priority:** P0
- **Tags:** `@smoke` `@major` `@profile`
- **Steps:**
  1. Authenticate with student account `2421354`.
  2. From landing page, open `Profile` dropdown menu.
  3. Click `Major Declaration`.
- **Assertions:**
  - URL navigates to `http://10.102.11.254/rds/students/major`.
  - Alert banner displaying `To declare your major, you need to complete 66 credits!!!` is visible.
  - Footer notice `Developed & Maintained By Office of IT, NSU.` is present.

