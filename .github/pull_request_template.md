## Description of Changes
<!-- Briefly summarize the page objects, specs, or fixes included in this PR -->

## Feature / Area Tested
- [ ] Student Profile / Settings / Advising
- [ ] Student Services (Parking, Exclusion, Inclusion, Credit Status, RFID, ID Unlock, Leave, Drop)
- [ ] Faculty Exam Marks Entry
- [ ] Authentication / Session Handling

## QA Pre-Merge Checklist
- [ ] Ran the specific test locally: `npm run <test:script>` or `npx playwright test <path>`
- [ ] Ran full test suite locally: `npx playwright test` (all tests passing)
- [ ] Followed Page Object Model (locators in `src/pages/`, assertions in `tests/`)
- [ ] Used designated student ID to avoid concurrent session conflicts
- [ ] No hardcoded passwords in test specs (uses `tests/data/`)

