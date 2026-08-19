# Database Design Document

## 1. Overview
The School Management System database is relational, designed for MySQL 8.x. It features strong normalization, referential integrity through foreign keys, and unique constraints to prevent data duplication.

## 2. Tables

### `users`
Purpose: Stores application login credentials and roles.
- `id` (PK, BIGINT)
- `name` (VARCHAR)
- `email` (VARCHAR, UK)
- `password` (VARCHAR) - BCrypt hashed
- `role` (VARCHAR)
- `created_at` (TIMESTAMP)

### `admissions`
Purpose: Tracks student admission applications before they become students.
- `id` (PK, BIGINT)
- `application_number` (VARCHAR, UK)
- Status defaults to 'NEW'

### `academic_years`
Purpose: Master table for academic sessions.
- `id` (PK, BIGINT)
- `name` (VARCHAR, UK) - e.g., "2026-2027"
- `active` (BOOLEAN) - Indicates current year

### `school_classes`
Purpose: Master table for standard classes (e.g., Class 1, Class 2).
- `id` (PK, BIGINT)
- `name` (VARCHAR, UK)

### `sections`
Purpose: Defines sections within a class for a specific academic year.
- `id` (PK, BIGINT)
- `name` (VARCHAR)
- `class_id` (FK)
- `academic_year_id` (FK)
- **Constraint**: Unique on (name, class_id, academic_year_id)

### `subjects`
Purpose: Master list of subjects taught.
- `id` (PK, BIGINT)
- `code` (VARCHAR, UK)
- `name` (VARCHAR)

### `teachers`
Purpose: Staff information.
- `id` (PK, BIGINT)
- `employee_id` (VARCHAR, UK)

### `teacher_subject_class`
Purpose: Mapping table for teaching assignments.
- Maps Teacher -> Subject -> Class -> Academic Year.
- **Constraint**: Unique combination to prevent duplicate assignments.

### `parents`
Purpose: Parent profiles.
- `id` (PK, BIGINT)
- `user_id` (FK, UK) - Links to login credentials

### `students`
Purpose: Active student profiles.
- `id` (PK, BIGINT)
- `student_id` (VARCHAR, UK) - System generated
- `admission_id` (FK, UK) - 1:1 link to origin admission
- `parent_id` (FK)
- `current_class_id`, `current_section_id`, `current_academic_year_id` (FKs)

### `attendance`
Purpose: Daily attendance logs.
- `id` (PK, BIGINT)
- `student_id` (FK)
- `attendance_date` (DATE)
- **Constraint**: Unique (student_id, attendance_date)

### `examinations`
Purpose: Exam schedules.
- `id` (PK, BIGINT)
- `name` (VARCHAR)
- `exam_date` (DATE)
- `class_id`, `academic_year_id` (FKs)

### `results`
Purpose: Student marks for exams.
- `id` (PK, BIGINT)
- `student_id`, `examination_id`, `subject_id` (FKs)
- **Constraint**: Unique (student_id, examination_id, subject_id)

### `fees`
Purpose: Student fee records per year.
- `id` (PK, BIGINT)
- `student_id`, `academic_year_id` (FKs)
- `total_amount`, `amount_paid`, `outstanding_amount` (DOUBLE)

### `payments`
Purpose: Individual payment transactions.
- `id` (PK, BIGINT)
- `fee_id` (FK)
- `amount` (DOUBLE)

### `student_academic_history`
Purpose: Historical record of classes completed by a student.
- `id` (PK, BIGINT)
- `student_id`, `academic_year_id`, `class_id` (FKs)

## 3. Unique Constraints Strategy
- **Natural Keys**: Used for `employee_id`, `student_id`, `email`, `subject_code` to prevent data entry errors.
- **Composite Unique Keys**: Prevent duplicate business records:
  - Attendance: A student can only have one attendance record per day.
  - Results: A student can only have one result per exam per subject.
  - Sections: Only one "Section A" per Class per Year.

## 4. Indexing Strategy
Indexes added on frequently queried foreign keys and search fields to improve read performance:
- `idx_students_class`: Fast lookup of students by class.
- `idx_attendance_date`: Fast reporting for daily attendance.
- `idx_fees_status`: Quick dashboard query for pending payments.
