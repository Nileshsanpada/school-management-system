# 🏫 EduCore SMS - Comprehensive Project Documentation & Interview Guide

> **Full-Stack Java Enterprise School Management System**  
> *Developed with Java 18, Spring Boot 4.1, React 18, Vite 6, MySQL 8, Spring Security 7 & JWT*

---

## 📌 1. Project Overview & Elevator Pitch

**EduCore SMS** is an enterprise-grade School Management System architected to automate school administrative operations, faculty workflows, duplicate-safe daily attendance, automated exam grading, fee installment tracking, and parent engagement.

### 🌟 Dual-Portal Philosophy
1. **School Administration & Faculty Portal:** Used by School Staff (Admins & Teachers) to manage admissions, classes, sections, subjects, faculty, attendance, examinations, and billing.
2. **Parent Engagement Portal:** Used by Parents to monitor live attendance %, exam performance report cards, and fee receipts for their children with strict data isolation.

---

## 🛠️ 2. Technology Stack & Layered Architecture

| Layer | Technologies | Responsibilities |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 6, React Router DOM v6, Axios | Modern SPA, Theme Engine (Light/Dark mode), Glassmorphism UI, Responsive Dashboards |
| **Backend** | Java 18, Spring Boot 4.1.0, Maven | RESTful API services, Business Logic, Transaction Management, Auto-Grading Engine |
| **Database** | MySQL 8.0, Spring Data JPA, Hibernate 7, HikariCP | Relational schema, DDL validation, optimized JPA query methods, ACID compliance |
| **Security** | Spring Security 7, JWT (JJWT), BCrypt | Stateless token authentication, Role-Based Access Control (`ADMIN`, `TEACHER`, `PARENT`), CORS |

---

## 📦 3. Core Modules & Workflows

### 📝 Module 1: Admission Management Pipeline
- **Public Webform**: Unauthenticated users submit admission enquiries (`/api/admissions`).
- **Review Lifecycle**: Enquiries move through `NEW` ➡️ `UNDER_REVIEW` ➡️ `CONFIRMED` / `REJECTED`.
- **Auto-Onboarding**: Confirmation automatically triggers:
  1. `StudentIdGenerator` generating unique ID (e.g. `STU-2026-0001`).
  2. Creates Student record and links Class/Section.
  3. Automatically creates/associates Parent User account for portal access.

### 📅 Module 2: Academic Hierarchy
- **Master Setup**: `Academic Year` ➡️ `Class` ➡️ `Section` ➡️ `Subject` ➡️ `Teacher`.
- Enables multi-year record keeping and historical academic audits.

### 📋 Module 3: Duplicate-Safe Attendance & Defaulter Warnings
- **Daily Roster**: Teachers select Date, Class, Section and submit bulk statuses (`PRESENT`, `ABSENT`, `LATE`).
- **Duplicate Prevention**: Database composite unique constraint on `(student_id, attendance_date)`.
- **Low-Attendance Defaulter Warning (<75%)**: Automatic background calculation flags students whose cumulative attendance drops below the 75% statutory requirement on Executive Dashboards.

### ✍️ Module 4: Examinations & Auto-Grading Engine
- **Exam Master**: Mid-term and Final exams mapped to academic years and classes.
- **Marks Entry**: Teachers enter raw marks obtained against max marks.
- **Grading Logic**:
  - `≥ 90%` ➡️ **A+**
  - `≥ 80%` ➡️ **A**
  - `≥ 70%` ➡️ **B+**
  - `≥ 60%` ➡️ **B**
  - `≥ 50%` ➡️ **C**
  - `< 50%` ➡️ **F (Fail)**

### 💳 Module 5: Fee Structures & Multi-Installment Payments
- **Fee Invoices**: Invoiced by student and academic year with due dates.
- **Multi-Installment Collections**: Supports `UPI`, `CARD`, `CASH`, `NET_BANKING` with transaction references.
- **Lifecycle Statuses**:
  - `Amount Paid == Total` ➡️ **PAID**
  - `0 < Amount Paid < Total` ➡️ **PARTIAL**
  - `Amount Paid == 0 && DueDate < Today` ➡️ **OVERDUE**

### 👨‍👩‍👧 Module 6: Parent Portal with Child Data Isolation
- **Security Interceptor**: Validates parent's authenticated email via JWT ➡️ verifies `parent_id == student.parent_id`.
- **1 Parent ➡️ Multiple Children**: Single parent account can monitor multiple enrolled children.
- **Progress Views**: Live circular attendance gauge, subject-wise report cards, and fee receipts.

---

## 🎯 4. Top Interview Questions & Expert Answers

### Q1: "Walk me through your project architecture."
> *"EduCore SMS is built on a 3-tier enterprise architecture. The frontend is a React SPA with a custom Theme Engine supporting Light and Dark modes. The backend is a Spring Boot application using Java 18, following clean layered architecture: Controller ➡️ Service ➡️ DTO ➡️ Repository ➡️ Entity. Security is handled via Spring Security stateless JWT authentication with Role-Based Access Control (`ADMIN`, `TEACHER`, `PARENT`). Persistence is managed via Spring Data JPA and Hibernate against MySQL 8."*

### Q2: "Why did you create a Parent role instead of student logins?"
> *"In school education (K-12), students are minors while parents hold legal guardianship and financial responsibility for tuition fees. Designing a dedicated Parent entity with a 1-to-Many relationship allows a single parent with multiple children to manage progress and fee receipts for all their children from one unified login."*

### Q3: "How is child data isolated so parents can't see other students' data?"
> *"Every Parent API endpoint passes through `ParentController`, which resolves the parent's email from the validated Spring Security JWT context. The service layer executes `verifyParentOwnership(userId, studentId)`. If a parent attempts to access a student ID not linked to their account, the request is rejected with `403 Forbidden`."*

### Q4: "What technical challenges did you solve during development?"
> *"1. **Dynamic CORS Configuration:** Configured `allowedOriginPatterns('*')` so frontend instances on any dynamic port connect seamlessly.*  
> *2. **Jackson Circular Reference:** Placed `@JsonIgnore` on bidirectional relations to prevent infinite serialization loops.*  
> *3. **Safe Data Seeding:** Built an idempotent `DataInitializer` that checks for existing records before seeding, eliminating duplicate entry SQL exceptions.*  
> *4. **Theme Management:** Implemented CSS variables and a global `ThemeContext` providing instant, zero-re-render Light/Dark mode toggling."*
