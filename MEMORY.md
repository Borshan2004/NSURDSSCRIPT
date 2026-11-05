# RDS Automation Memory Bank

> **Quick-Reference Single Source of Truth** for AI Agents and Developers working on NSU RDS Automation.
> Consult this file first before analyzing codebase files.

---

## 1. System & Environment
- **Live Portal Base URL:** `http://10.102.11.254/rds_live_php84/`
- **Framework:** Playwright (`@playwright/test`) + TypeScript
- **Test Runner Config:** `playwright.config.ts` (Workers: 1, setup dependency: `tests/auth.setup.ts`)
- **CI / GitHub Actions:** Auto-runs on push/PR disabled in `.github/workflows/playwright.yml` (intranet IP `10.102.11.254` unreachable by GitHub cloud runners). Manual run only via `workflow_dispatch`.

---

## 2. Test Users & Credentials
| Role / Persona | Username | Password | Purpose / Data |
|---|---|---|---|
| **Default Profile Student** | `2421354` | `123` | Student Profile, Grade History (40 Cr, CGPA 1.79), Course Marks, Advising Slip |
| **Standard Student** | `2512560` | `123` | Talha Jubayer Efti (Pre-advising, Advising Window) |
| **Eligible Exclusion Student** | `2112874` | `123` | Course Exclusion (passed >= 100 cr) |
| **Eligible Inclusion Student** | `2212984` | `123` | Course Inclusion, Leave Request, Semester Drop |
| **ID Unlock Student** | `2011000` | `123` | ID Unlock test cases |
| **Faculty** | `johndoe` | `password` | Faculty Dashboard & grading |

---

## 3. Storage State Paths
All stored in `playwright/.auth/`:
- `profile-student.json`: User `2421354` (Used for Profile, Grades, Advising Slip)
- `student.json`: User `2512560` (Default Playwright student project)
- `senior-student.json`: User `2112874`
- `inclusion-student.json`: User `2212984`
- `leave-student.json`: User `2212984`
- `semester-drop-student.json`: User `2212984`
- `unlock-student.json`: User `2011000`

---

## 4. Test Directory Architecture
Tests are grouped under `tests/student/` mirroring RDS portal menus:
```
tests/student/
├── profile/             # Profile, Change Password, Major Declaration
├── advising/            # Advising Window, Advising Slip, Pre-advising, Pre-advised Courses
├── grades/              # Grade History, Course Wise Marks
├── service/             # Car Parking, Credit Status, Inclusion, Exclusion, Unlock, Leave, Drop, Waiver, Writing Center, App Status
├── home/                # Home dashboard
├── payments/            # Tuition & fee payments
├── attendance/          # Student attendance records
├── faculty-evaluation/  # Course/faculty evaluations
├── degree/              # Degree audit & graduation
├── course-drop/         # Course drop requests
├── sms-history/         # SMS logs
├── course-request/      # Manual course add requests
├── user-guides/         # RDS manuals
└── logout/              # Session logout
```

---

## 5. Page Objects Index (`src/pages/`)
| Page Object | Corresponding Route | Primary Purpose |
|---|---|---|
| `BasePage.ts` | Shared base | `waitForReady()`, `page` wrapper |
| `RdsLoginPage.ts` / `LoginPage.ts` | `/` | Two-step student/faculty login with session takeover |
| `RdsStudentLandingPage.ts` | `students/landing` | Main navbar menu navigation for all student portals |
| `StudentProfilePage.ts` | `students/profile` | Personal info, contact details, academic standing |
| `ChangePasswordPage.ts` | `students/change_password` | Password change form |
| `MajorDeclarationPage.ts`| `students/major_declaration`| Major/minor declaration |
| `AdvisingPage.ts` | `students/advising` | Advising window course selection |
| `AdvisingSlipPage.ts` | `students/advising/print_slip`| Semester selector & 4-copy advising slip |
| `PreAdvisingPage.ts` | `students/preadvising` | Quiz questionnaire & course selection |
| `PreAdvisedCoursesPage.ts`| `students/preadvising/preAdvisingSlip` | Chosen pre-advised courses slip |
| `RdsGradeHistoryPage.ts` | `students/grade_history` | Summary (CGPA/Credits), Waiver, Transfer, Semester Grade tables, Print button |
| `RdsCourseWiseMarksPage.ts`| `students/grade_history/exam_marks` | Semester dropdown filter, See Marks button, Course/Section tables & breakdown |
| `Rds*ServicePage.ts` | `students/services/*` | Parking, Credit Status, Inclusions, Drop, Leave, Waiver, etc. |

---

## 6. Strict Rules & Conventions
1. **Imports:** Always import `test` and `expect` from `src/fixtures/base` (relative path like `../../../src/fixtures/base`), NEVER directly from `@playwright/test`.
2. **Page Objects:** Element locators and actions only. **NO `expect()` inside Page Objects.**
3. **Locators Hierarchy:**
   1. `getByRole` with accessible name
   2. `getByLabel`
   3. `getByPlaceholder`
   4. `getByTestId`
   5. `getByText` for static text
   6. CSS/XPath only when accessible locators cannot match legacy markup.
4. **Assertions:** Web-first assertions only (`await expect(locator).toBeVisible()`). No arbitrary `page.waitForTimeout()` sleeps.

---

## 7. Common Test Commands & Reports
- `npm run test:grades` — Run all grade tests
- `npm run test:grade-history` — Grade history spec
- `npm run test:course-marks` — Course wise marks spec
- `npm run test:profile` — Student profile suite
- `npm run test:slip` — Advising slip suite
- `npm run report` — Serve native Playwright HTML report (`playwright-report/index.html`)
- Standalone HTML Report: `playwright-report/report.html` (double-clickable directly on `file://` without server)
- `npm run test:preadvising` — Pre-advising suite
- `npx tsc --noEmit` — TypeScript typecheck

