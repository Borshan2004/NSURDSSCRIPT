# Project Rules for AI Agents — NSU RDS Automation

You are working on end-to-end test automation for the **North South University (NSU) RDS Portal** (`http://10.102.11.254/rds/`).
Follow these rules for every code change, test plan, or test execution.

## Stack & Environment
- Target Environment: Local Intranet Test Server (`http://10.102.11.254/rds/`)
- Test Framework: Playwright with TypeScript (`@playwright/test`)
- Runtime: Node.js

## Folder Structure
- `src/pages/` — Page Object classes (one file per page, extends `BasePage`)
- `src/fixtures/` — Custom fixtures extending base test (`src/fixtures/base.ts`)
- `src/utils/` — Pure helpers (no test logic or assertions)
- `tests/` — Spec files (`.spec.ts`) mirroring portal feature areas
- `tests/data/` — Test credentials and data (JSON/TS)
- `specs/` — Planner outputs (numbered Markdown test plans)

## Coding Conventions
- **Always** import `test` and `expect` from `src/fixtures/base.ts`, never from `@playwright/test` directly.
- Use `test.describe` per feature area (e.g., `test.describe('RDS Authentication', ...)`).
- File naming: kebab-case (e.g., `login.spec.ts`, `course-advising.spec.ts`).
- Never put `expect()` assertions inside Page Objects. Page Objects encapsulate element locators and user actions; assertions belong in test specs.

## Locator Priority (Strict Hierarchy)
1. `getByRole` with accessible name (e.g., `page.getByRole('button', { name: 'Next' })`)
2. `getByLabel` for form fields (e.g., `page.getByLabel('Username')`)
3. `getByPlaceholder` (e.g., `page.getByPlaceholder('Enter your username')`)
4. `getByTestId` if test IDs exist
5. `getByText` only for genuinely static UI text
6. CSS / XPath selectors — only when accessible locators cannot match legacy HTML/Bootstrap classes.

## Assertion Rules
- Web-first assertions only (e.g., `await expect(locator).toBeVisible()`).
- Never use arbitrary `page.waitForTimeout()` sleeps.
- Never use `waitForSelector()` — leverage Playwright's automatic waiting and web-first assertions.
