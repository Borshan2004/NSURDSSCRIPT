# Team Collaboration Guide — NSU RDS Test Automation

Collaborative testing workflow between **Borshon Purification** and **Mahin** (`mahunn/RDS-Playwrite-Test`).

---

## 1. Architecture & Coding Conventions
- **Base Fixtures**: Always import `test` and `expect` from `src/fixtures/base.ts`. Never import directly from `@playwright/test`.
- **Page Objects**:
  - Extend `BasePage`.
  - Use `RdsStudentLandingPage` or `LandingPage` for navigation.
  - Never place `expect()` assertions inside Page Objects. Page Objects encapsulate element locators and user actions; assertions belong exclusively in test specs.
- **Locator Priority**:
  1. `getByRole` with accessible name
  2. `getByLabel` for form fields
  3. `getByPlaceholder`
  4. `getByTestId`
  5. `getByText` (for genuinely static UI text)
  6. CSS / XPath selectors (only when accessible locators cannot match legacy HTML/Bootstrap classes).
- **Assertions**: Web-first assertions only (`await expect(locator).toBeVisible()`). No arbitrary `waitForTimeout()` or `waitForSelector()`.

---

## 2. Credential & Session Safety
RDS allows only **ONE active session per student ID** at a time. Session collisions invalidate cookies.

### Account Allocations
- **Borshon's Accounts** (`tests/data/rds-student-data.json`):
  - Standard Services / Parking / Credit / Forgot ID: `2512560` (`playwright/.auth/student.json`)
  - Course Exclusion: `2231451` (`playwright/.auth/senior-student.json`)
  - Course Inclusion / Leave / Semester Drop: `2421226` (`playwright/.auth/inclusion-student.json`)
  - ID Unlock: `2425471` (`playwright/.auth/unlock-student.json`)
- **Mahin's Account** (`tests/data/test-users.json`):
  - Profile & Advising: `2421354` (`playwright/.auth/profile-student.json`)
  - **Never use student 2421354 for Borshon's service tests.**

---

## 3. Agentic Feature-Branch Workflow
1. Check out `main` and pull latest changes:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Create a descriptive feature branch:
   ```bash
   git checkout -b feature/borshon-<feature-name>
   ```
3. Implement Page Object in `src/pages/` and the spec in `tests/student/` or `tests/faculty/`.
4. Execute tests locally and verify 100% pass rate:
   ```bash
   npx playwright test <spec-file>
   ```
5. Commit using Conventional Commits (`feat(...)` or `fix(...)`).
6. Push to origin and open a PR for Mahin's review:
   ```bash
   git push -u origin feature/borshon-<feature-name>
   ```

