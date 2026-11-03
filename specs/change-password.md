# Test Plan: NSU RDS Change Password & Verification Code Modal

**Target:** `http://10.102.11.254/rds/common/change_password`  
**Seed:** `tests/seed.spec.ts`  
**Date:** 2026-11-03  

---

## 1. Overview
This test plan covers the **Change Password** flow for authenticated students on the NSU RDS portal. It validates navigating to the Change Password screen via the Profile menu, form field display and inputs (Current Password, New Password, Confirm New Password), and advancing to the "Get a verification code" OTP modal without dispatching the verification code.

---

## 2. Preconditions & Test Data
- Test Server reachable at `http://10.102.11.254/rds/`.
- Active student test account:
  - **Username / Student ID:** `2421354`
  - **Current Password:** `123`
  - **New Password:** `M1fj2gm6` (Meets requirement: min 8 chars, letter, number, uppercase, no special chars)
  - **Confirm New Password:** `M1fj2gm6`

---

## 3. Scenarios

### Scenario 3.1 — Navigation to Change Password
- **Priority:** P0
- **Tags:** `@smoke` `@settings` `@change-password`
- **Steps:**
  1. Login with student account `2421354` / `123`.
  2. Open the `Profile` dropdown menu on the landing page.
  3. Click `Change Password`.
- **Assertions:**
  - URL matches `http://10.102.11.254/rds/common/change_password`.
  - Heading "Change Password" is visible.
  - Form fields for `Current Password`, `New Password`, `Confirm New Password` are visible.
  - "Change" submission button is visible.
  - Password criteria hint is displayed.

### Scenario 3.2 — Change Password Progression to Verification Code Modal
- **Priority:** P0
- **Tags:** `@smoke` `@change-password`
- **Steps:**
  1. Fill `Current Password` with `123`.
  2. Fill `New Password` with `M1fj2gm6`.
  3. Fill `Confirm New Password` with `M1fj2gm6`.
  4. Click "Change" button.
- **Assertions:**
  - Verification modal opens with title "Get a verification code".
  - Subtitle "Choose where to receive your one-time code." is visible.
  - Radio options "Email" and "SMS" are present (Email selected by default).
  - "Send code" action button is visible and active.
  - "Cancel" button is visible.
- **Cleanup Step:**
  - Click "Cancel" to dismiss the modal without triggering real OTP dispatch.
  - Verify modal closes.

