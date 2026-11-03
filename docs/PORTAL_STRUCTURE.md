# NSU RDS Portal Structure & Test Automation Reference

**Target Server:** `http://10.102.11.254/rds/`  
**Generated Date:** 2026-11-03  
**Test Account:** `2421354` (`Sabiha Hossain Shifa`)  

> **Purpose:** This reference catalog allows developers and AI agents to look up existing RDS routes, page headings, input IDs, buttons, and alert messages locally without running ad-hoc exploratory browser sessions or burning token context.

## Table of Contents

- [Home](#home)
- [Profile](#profile)
- [Advising](#advising)
- [Grades](#grades)
- [Payments](#payments)
- [Attendance](#attendance)
- [Faculty Evaluation](#faculty-evaluation)
- [Degree](#degree)
- [Services](#services)
- [Course Drop](#course-drop)
- [SMS History](#sms-history)
- [Course Request](#course-request)

---

## Home

### Home
- **URL:** `http://10.102.11.254/rds/students/landing`
- **Heading:** `Welcome  Sabiha Hossain Shifa`
- **Page Title:** `Online Portal | North South University`
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)
- **Tables:**
  - Table 1: Activity | Semester | Status (5 rows)

## Profile

### Student Information
- **URL:** `http://10.102.11.254/rds/students/profile?token=qOzLP5olLbwca2IeW4wXLw%3D%3D`
- **Heading:** `In order to change information verify by sending an authentication code, please select an option (Email or SMS):`
- **Page Title:** `Online Portal | North South University`
- **Alerts/Notices:**
  - `*** For any kind of query about your profile information please contact with the registrar's office. ***`
  - `In order to change information verify by sending an authentication code, please select an option (Email or SMS): Email SMS Back`
  - `An authentication code has been sent to you. Please enter the authentication code below`
  - `***WARNING*** If you provide any fraudulent information, it must cause disciplinary action.`
- **Form Inputs:**
  - `radio`: `#radio1` (name: `choice`)
  - `radio`: `#radio2` (name: `choice`)
  - `text`: `#no-id` (name: `info`)
  - `text`: `#no-id` (name: `info`)
  - `submit`: `#no-id` (name: `commit`)
  - `text`: `#authcode` (name: `authcode`, placeholder: "Enter the authentication code")
  - `select`: `#no-id` (name: `bloodGroup`)
  - `number`: `#no-id` (name: `NID`)
  - `number`: `#no-id` (name: `birthReg`)
  - `submit`: `#no-id` (name: `none`)
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)
  - Button: `"Send Authentication Code"` (role: `button`)
  - Button: `"×"` (role: `button`)
  - Button: `"Update"` (role: `button`)
  - Button: `"Close"` (role: `button`)

### Change Password
- **URL:** `http://10.102.11.254/rds/common/change_password`
- **Heading:** `Change Password`
- **Page Title:** `Online Portal | North South University`
- **Form Inputs:**
  - `password`: `#currentPassword` (name: `currentPassword`, placeholder: "Password")
  - `password`: `#newPassword` (name: `newPassword`, placeholder: "Password")
  - `password`: `#confirmNewPassword` (name: `confirmNewPassword`, placeholder: "Password")
  - `text`: `#otp` (name: `otp`, placeholder: "OTP")
  - `submit`: `#no-id` (name: `none`)
  - `radio`: `#otp_type1` (name: `otp_choice`)
  - `radio`: `#otp_type2` (name: `otp_choice`)
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)
  - Button: `"Change"` (role: `button`)
  - Button: `"×"` (role: `button`)
  - Button: `"Send code"` (role: `button`, id: "#get_otp")
  - Button: `"Cancel"` (role: `button`)

### Major Declaration
- **URL:** `http://10.102.11.254/rds/students/major`
- **Page Title:** `Online Portal | North South University`
- **Alerts/Notices:**
  - `To declare your major, you need to complete 66 credits!!!`
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)

### Two FA
- **URL:** `http://10.102.11.254/rds/common/two_fa`
- **Heading:** `Two-Factor Authentication`
- **Page Title:** `Online Portal | North South University`
- **Alerts/Notices:**
  - `Authenticator app configured. Confirm with an email/SMS OTP to Enable Two-Factor Authentication.`
- **Form Inputs:**
  - `text`: `#totp_code` (name: `none`, placeholder: "123456")
  - `button`: `#verify_totp` (name: `none`)
  - `text`: `#otp` (name: `otp`, placeholder: "OTP")
  - `submit`: `#no-id` (name: `none`)
  - `radio`: `#otp_type1` (name: `otp_choice`)
  - `radio`: `#otp_type2` (name: `otp_choice`)
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)
  - Button: `"Copy"` (role: `button`)
  - Button: `"Verify"` (role: `button`, id: "#verify_totp")
  - Button: `"Enable Two FA"` (role: `button`)
  - Button: `"×"` (role: `button`)
  - Button: `"Send code"` (role: `button`, id: "#get_otp")
  - Button: `"Cancel"` (role: `button`)

## Advising

### Advising Window
- **URL:** `http://10.102.11.254/rds/students/advising`
- **Heading:** `Dropping is ALLOWED`
- **Page Title:** `Advising`
- **Form Inputs:**
  - `text`: `#searchText` (name: `searchText`)
  - `submit`: `#submit` (name: `none`)
  - `submit`: `#submit` (name: `none`)
- **Action Buttons:**
  - Button: `"Save"` (role: `button`, id: "#submit")
  - Button: `"Discard Changes"` (role: `button`, id: "#submit")
- **Tables:**
  - Table 1: Saved | Course | Credit | Time | Fees | Total: | 6 (credits) | 48500 (10 rows)
  - Table 2: Data Table (2981 rows)

### Advising Slip Print
- **URL:** `http://10.102.11.254/rds/students/print_slip/printSlipIndex`
- **Heading:** `Advising Slip Print`
- **Page Title:** `Online Portal | North South University`
- **Form Inputs:**
  - `select`: `#no-id` (name: `semester`)
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)

### Pre-advising
- **URL:** `http://10.102.11.254/rds/students/preadvising`
- **Page Title:** `Online Portal | North South University`
- **Alerts/Notices:**
  - `Your Faculty Evaluation is Incomplete. You can't preadvise`
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)

### Pre Advised Courses
- **URL:** `http://10.102.11.254/rds/students/preadvising/preAdvisingSlip`
- **Heading:** `Pre Advising Fall - 2026`
- **Page Title:** `Online Portal | North South University`
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)

## Grades

### Grade History
- **URL:** `http://10.102.11.254/rds/students/grade_history`
- **Heading:** `Grade History of 2421354`
- **Page Title:** `Online Portal | North South University`
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)
  - Button: `"Print Grade History"` (role: `button`, id: "#printGrades")
- **Tables:**
  - Table 1: Student Name | Credit Completed | CGPA (2 rows)
  - Table 2: Course Code | Course Credit | Course Title | Course Grade (1 rows)
  - Table 3: Course Code | Course Credit | Course Title (1 rows)
  - Table 4: Semester Name | Semester Year | Course Code | Section | Faculty Code | Faculty Name | Course Credit | Course Title | Course Grade | Cr.Count | Cr.Passed (35 rows)

### Course Wise Marks
- **URL:** `http://10.102.11.254/rds/students/grade_history/exam_marks`
- **Heading:** `Course Wise Marks (Fall 2025)`
- **Page Title:** `Online Portal | North South University`
- **Form Inputs:**
  - `select`: `#semesterCode` (name: `semesterCode`)
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)
  - Button: `"See Marks"` (role: `button`)
- **Tables:**
  - Table 1: Course/Section : ANT101.5 (2 rows)
  - Table 2: Course/Section : CSE173.8 (2 rows)
  - Table 3: Course/Section : EEE141.22 (2 rows)
  - Table 4: Course/Section : EEE141L.22 (2 rows)
  - Table 5: Course/Section : EEE154.6 (2 rows)
  - Table 6: Course/Section : ENG111.6 (2 rows)

## Payments

### Account Status
- **URL:** `http://10.102.11.254/rds/payments/payment`
- **Page Title:** `Online Portal | North South University`
- **Alerts/Notices:**
  - `Connection timed out.Please try again later`
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)

### Online Payment History
- **URL:** `http://10.102.11.254/rds/payments/payment/studentsPaymentDashboard`
- **Heading:** `No Online Payment
                                        History is Available`
- **Page Title:** `Online Portal | North South University`
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)

## Attendance

### Attendance
- **URL:** `http://10.102.11.254/rds/attendance/attendance/studentAttendanceLanding`
- **Heading:** `Class Attendance - 2421354 (Sabiha Hossain Shifa)`
- **Page Title:** `Online Portal | North South University`
- **Form Inputs:**
  - `select`: `#semester` (name: `semester`)
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)

## Faculty Evaluation

### Faculty Evaluation
- **URL:** `http://10.102.11.254/rds/students/FacultyEvaluation`
- **Page Title:** `Online Portal | North South University`
- **Alerts/Notices:**
  - `Faculty evaluation(Fall 2026) for Regular student start from 01-Oct-2026 to 31-Oct-2026`
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)

## Degree

### Academic Progress
- **URL:** `http://10.102.11.254/rds/students/courseAnalysis/viewAnalysis`

## Services

### Academic Documents
- **URL:** `http://10.102.11.254/rds/payments/payment/studentsDocumentsDashboard`

### Car Parking
- **URL:** `http://10.102.11.254/rds/common/service/carParkingRequestDashboard`

### Credit/Non Credit Status Update
- **URL:** `http://10.102.11.254/rds/bpm/CreditNonCreditStatusUpdate`
- **Page Title:** `Online Portal | North South University`
- **Form Inputs:**
  - `radio`: `#purpose` (name: `purpose`)
  - `radio`: `#purpose` (name: `purpose`)
  - `select`: `#courses` (name: `courses[]`)
  - `search`: `#no-id` (name: `none`, placeholder: "You can select multiple courses")
  - `file`: `#signature` (name: `signature`)
  - `file`: `#file-upload` (name: `files[]`)
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)
  - Button: `"Submit"` (role: `button`, id: "#submit_btn")

### Course Exclusion
- **URL:** `http://10.102.11.254/rds/bpm/CourseExclusion`
- **Page Title:** `Online Portal | North South University`
- **Alerts/Notices:**
  - `It is not possible for you to request a course exclusion. Certain credit requirements exist.`
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)

### Course Inclusion
- **URL:** `http://10.102.11.254/rds/bpm/CourseInclusion`
- **Page Title:** `Online Portal | North South University`
- **Alerts/Notices:**
  - `It is not possible for you to request a course Inclusion. Certain credit requirements exist.`
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)

### Forgot RFID
- **URL:** `http://10.102.11.254/rds/bpm/forgotId`
- **Heading:** `Application for Forgot RFID`
- **Page Title:** `Online Portal | North South University`
- **Form Inputs:**
  - `text`: `#no-id` (name: `none`)
  - `text`: `#no-id` (name: `none`)
  - `text`: `#no-id` (name: `none`)
  - `select`: `#id_type` (name: `id_type`)
  - `textarea`: `#purpose` (name: `purpose`)
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)
  - Button: `"View Important Rules"` (role: `button`)
  - Button: `"×"` (role: `button`)
  - Button: `"Ok"` (role: `button`)
  - Button: `"Submit"` (role: `button`, id: "#submit_btn")

### ID Unlock
- **URL:** `http://10.102.11.254/rds/bpm/unlockId`
- **Page Title:** `Online Portal | North South University`
- **Alerts/Notices:**
  - `Since you are already Enrolled, there is no need for you to apply for an ID unblock.`
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)

### Leave Request
- **URL:** `http://10.102.11.254/rds/bpm/student_leave`
- **Heading:** `Your document verification (2421354 6  42)  is not completed yet. Please contact with registrar office.`

### Resource Center Payment
- **URL:** `http://10.102.11.254/rds/payments/payment/resourceCenterDashboard`
- **Page Title:** `Online Portal | North South University`
- **Alerts/Notices:**
  - `Connection timed out.Please try again later`
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)

### RFID Card & Ribbon
- **URL:** `http://10.102.11.254/rds/payments/payment/rfidCardRibbonDashboard`
- **Page Title:** `Online Portal | North South University`
- **Alerts/Notices:**
  - `Connection timed out.Please try again later`
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)

### Semester Drop
- **URL:** `http://10.102.11.254/rds/bpm/semesterDrop`
- **Page Title:** `Online Portal | North South University`
- **Form Inputs:**
  - `select`: `#semester` (name: `semester`)
  - `select`: `#drop_type` (name: `drop_type`)
  - `textarea`: `#purpose` (name: `purpose`)
  - `file`: `#signature` (name: `signature`)
  - `file`: `#file-upload` (name: `files[]`)
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)
  - Button: `"Submit"` (role: `button`, id: "#submit_btn")

### Waiver Course Issue
- **URL:** `http://10.102.11.254/rds/bpm/studentGeneralRequest`
- **Page Title:** `Online Portal | North South University`
- **Form Inputs:**
  - `select`: `#type` (name: `type`)
  - `textarea`: `#purpose` (name: `purpose`)
  - `file`: `#signature` (name: `signature`)
  - `file`: `#file-upload` (name: `files[]`)
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)
  - Button: `"Submit"` (role: `button`)

### NSU Writing Center
- **URL:** `http://10.102.11.254/rds/bookings/writing-centers`
- **Heading:** `Appointment for NSU Writing Center`
- **Page Title:** `Online Portal | North South University`
- **Form Inputs:**
  - `text`: `#selected_date` (name: `selected_date`)
  - `select`: `#slot` (name: `start_time`)
  - `radio`: `#no-id` (name: `course_name`)
  - `radio`: `#no-id` (name: `course_name`)
  - `radio`: `#no-id` (name: `course_name`)
  - `radio`: `#no-id` (name: `course_name`)
  - `radio`: `#no-id` (name: `course_name`)
  - `text`: `#other_course_name` (name: `other_course_name`)
  - `radio`: `#no-id` (name: `help_required`)
  - `radio`: `#no-id` (name: `help_required`)
  - `radio`: `#no-id` (name: `help_required`)
  - `radio`: `#no-id` (name: `help_required`)
  - `radio`: `#no-id` (name: `help_required`)
  - `text`: `#other_help` (name: `other_help`)
- **Action Buttons:**
  - Button: `"Toggle sidebar"` (role: `button`)
  - Button: `"Submit"` (role: `button`)
  - Button: `"null"` (role: `button`)
  - Button: `"null"` (role: `button`)
  - Button: `"null"` (role: `button`)
  - Button: `"Save Selected"` (role: `button`)
  - Button: `"null"` (role: `button`)
  - Button: `"null"` (role: `button`)
- **Tables:**
  - Table 1: Date | Time | Course | Topic (2 rows)
  - Table 2: Sun | Mon | Tue | Wed | Thu | Fri | Sat (6 rows)

### Application Status
- **URL:** `http://10.102.11.254/rds/bpm/applied_applications`

## Course Drop

### Course Drop
- **URL:** `http://10.102.11.254/rds/students/billing/CourseDropLanding`

## SMS History

### SMS History
- **URL:** `http://10.102.11.254/rds/students/sms_history`

## Course Request

### Course Request
- **URL:** `http://10.102.11.254/rds/common/feedback/RequestCourse`

