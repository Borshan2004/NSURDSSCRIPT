# NSU RDS Playwright Test Automation

Autonomous end-to-end test automation suite for the **North South University (NSU) RDS Portal** using **Playwright**, **TypeScript**, and **Google Antigravity AI Agents** (*Planner, Generator, Healer*).

---

## 🎯 Target Environment

* **Target URL:** `http://10.102.11.254/rds/` (Local Intranet Test Server)
* **Framework:** Playwright Test (`@playwright/test`)
* **Language:** TypeScript
* **Design Pattern:** Page Object Model (POM) + Web-First Auto-Waiting Assertions

---

## 📁 Repository Structure

```text
RDS-Playwrite-Test/
├── .agents/
│   ├── mcp_config.json                 # Antigravity Playwright MCP configuration
│   └── skills/                         # Antigravity native AI Agent skills
│       ├── playwright-planner/SKILL.md  # Autonomous DOM explorer & test plan creator
│       ├── playwright-generator/SKILL.md# Converts test plans to TypeScript POM specs
│       └── playwright-healer/SKILL.md   # Diagnoses & fixes broken tests without weakening assertions
├── specs/
│   ├── rds-login.md                    # Authentication & validation test plan
│   ├── student-profile.md              # Student profile & academic record test plan
│   └── reports/
│       └── student-info-report.md      # Detailed field-level inspection & verification report
├── src/
│   ├── fixtures/
│   │   └── base.ts                     # Extended Playwright test fixture
│   └── pages/
│       ├── BasePage.ts                 # Abstract POM base class
│       ├── LoginPage.ts                # Multi-step preLogin Page Object
│       ├── LandingPage.ts              # Student dashboard & navigation Page Object
│       └── StudentProfilePage.ts       # Dual-tabbed Student Profile Page Object
├── tests/
│   ├── auth/
│   │   └── login-validation.spec.ts    # Login form validation & password recovery navigation
│   ├── student/
│   │   └── profile.spec.ts             # Student profile verification (General & Personal Info)
│   ├── data/
│   │   └── test-users.json             # Centralized student test credentials & baseline records
│   └── seed.spec.ts                    # Baseline smoke test
├── AGENTS.md / GEMINI.md               # Strict locator hierarchy & agent rules
├── mcp_config.json                     # Playwright MCP server configuration
├── playwright.config.ts                # Playwright configuration (dual reporters, Chromium)
└── package.json                        # Scripts & dependencies
```

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js** (v18+)
* **npm**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/mahunn/RDS-Playwrite-Test.git
cd RDS-Playwrite-Test

# Install dependencies
npm install

# Install Playwright browser binaries
npx playwright install chromium
```

---

## 🧪 Running Tests & Reports

| Command | Action |
| :--- | :--- |
| `npm run test:report` | Runs all tests and **instantly serves the HTML report** in your browser |
| `npm run test:profile` | Runs only the Student Profile test suite (`profile.spec.ts`) |
| `npm run test:headed` | Runs with a **visible Chromium browser window** |
| `npm run test:ui` | Opens the **Playwright interactive desktop UI** |
| `npm run report` | Opens the **HTML report** of the most recent test run |

---

## 📋 Reporting Format

Tests are structured hierarchically using Playwright's `test.step()` to mirror formal QA tracking:

```text
▼ Profile > Student Information
  ▼ 1. Student Information Navigation (PASSED)
  ▼ 2. General Information (PASSED)
    ✓ Full Name: Md Rahat Hossain Molla
    ✓ Student ID: 2421534
    ✓ Enrolled Degree: Bachelor of Science in Electrical and Electronic Engineering
    ✓ Curriculum Name: BS in EEE - 130 Credit Curriculum
    ✓ Current Status: Enrolled
    ✓ Current CGPA: 2.04
    ✓ Credit Passed: 30.00
    ✓ Probation: 0
  ▼ 3. Personal & Parent Information (PASSED)
    ✓ Switch to Personal & Parent Information tab
    ✓ Cell Phone: 01990927203
    ✓ Personal Email: h.mdrahat87@gmail.com
    ✓ Father Name: Md Halim Uddin Molla
    ✓ Mother Name: Roksana Akter
    ✓ Edit Personal Information button is present
```

---

## 🔒 Safety Notice

All automation is strictly bound to the local intranet server `http://10.102.11.254/rds/`. No write or regression actions are executed against live production RDS.
