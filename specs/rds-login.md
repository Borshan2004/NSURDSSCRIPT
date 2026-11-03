# Test Plan: NSU RDS Authentication (Local Server)

**Target:** `http://10.102.11.254/rds/`  
**Seed:** `tests/seed.spec.ts`  
**Date:** 2026-11-01  

## Overview
This test plan covers the initial sign-in phase of the NSU RDS (Resource/Registration Management System) portal hosted on the local intranet environment. The authentication flow uses a multi-step login (`preLogin`) where the user first provides their username before advancing to credentials/captcha verification.

## Preconditions
- Target server is reachable at `http://10.102.11.254/rds/`.
- Seed test `tests/seed.spec.ts` passes, confirming accessibility of the portal header, username input, and "Next" action button.

## Scenarios

### Scenario 1.1 — Login Portal Baseline Load
- **Priority:** P0
- **Tags:** @smoke @baseline
- **Steps:**
  1. Navigate to `http://10.102.11.254/rds/`.
- **Assertions:**
  - Page title matches `NSU Portal | North South University`.
  - Heading displaying "RDS Portal" is visible.
  - Username input field with placeholder "Enter your username" is visible and empty.
  - "Next" submit button is visible and active.
  - "Forgot your password?" link is visible.
  - Current server time indicator is displayed.

### Scenario 1.2 — Validation on Empty Username Submission
- **Priority:** P1
- **Tags:** @regression @validation
- **Steps:**
  1. Navigate to `http://10.102.11.254/rds/`.
  2. Leave the Username input field blank.
  3. Attempt to submit the form by clicking "Next".
- **Assertions:**
  - Browser HTML5 constraint validation triggers (`required` attribute on input).
  - Page does not navigate away from `http://10.102.11.254/rds/`.

### Scenario 1.3 — Valid Username Pre-Login Progression
- **Priority:** P0
- **Tags:** @smoke
- **Steps:**
  1. Navigate to `http://10.102.11.254/rds/`.
  2. Enter valid NSU portal username.
  3. Click "Next".
- **Assertions:**
  - System transitions to password/challenge step or displays corresponding authentication prompt.

### Scenario 1.4 — Navigation to Forgot Password
- **Priority:** P2
- **Tags:** @navigation
- **Steps:**
  1. Navigate to `http://10.102.11.254/rds/`.
  2. Click "Forgot your password?".
- **Assertions:**
  - Target URL navigates to `http://10.102.11.254/rds/common/forgetPassword`.

