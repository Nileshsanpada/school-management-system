-- Users
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@school.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN'),
('John Smith', 'john.teacher@school.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TEACHER'),
('Jane Doe', 'jane.teacher@school.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TEACHER'),
('Ramesh Sharma', 'parent1@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'PARENT'),
('Suresh Patel', 'parent2@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'PARENT');

-- Academic Years
INSERT INTO academic_years (name, start_date, end_date, active) VALUES 
('2025-2026', '2025-04-01', '2026-03-31', FALSE),
('2026-2027', '2026-04-01', '2027-03-31', TRUE);

-- School Classes
INSERT INTO school_classes (name) VALUES 
('Class 1'), ('Class 2'), ('Class 3'), ('Class 4'), ('Class 5'), 
('Class 6'), ('Class 7'), ('Class 8'), ('Class 9'), ('Class 10'), 
('Class 11'), ('Class 12');

-- Sections (for 2026-2027 year, which is id 2)
INSERT INTO sections (name, class_id, academic_year_id) VALUES 
('A', 10, 2), ('B', 10, 2), 
('A', 11, 2), 
('A', 12, 2);

-- Subjects
INSERT INTO subjects (name, code) VALUES 
('Mathematics', 'MAT101'), 
('Science', 'SCI101'), 
('English', 'ENG101'), 
('History', 'HIS101'), 
('Physics', 'PHY101');

-- Teachers
INSERT INTO teachers (employee_id, name, email, phone, qualification) VALUES 
('EMP-001', 'John Smith', 'john.teacher@school.com', '9876543210', 'M.Sc Mathematics'),
('EMP-002', 'Jane Doe', 'jane.teacher@school.com', '9876543211', 'M.A English');

-- Parents
INSERT INTO parents (name, email, phone, address, user_id) VALUES 
('Ramesh Sharma', 'parent1@email.com', '9988776655', '123 MG Road, Bangalore', 4),
('Suresh Patel', 'parent2@email.com', '9988776644', '456 SG Highway, Ahmedabad', 5);

-- Admissions
INSERT INTO admissions (application_number, student_name, date_of_birth, gender, parent_name, parent_email, parent_phone, previous_school, enquiry_date, status) VALUES 
('APP-2026-001', 'Aarav Sharma', '2010-05-15', 'Male', 'Ramesh Sharma', 'parent1@email.com', '9988776655', 'DPS', '2026-01-10', 'CONFIRMED'),
('APP-2026-002', 'Priya Patel', '2010-08-20', 'Female', 'Suresh Patel', 'parent2@email.com', '9988776644', 'NPS', '2026-01-12', 'CONFIRMED'),
('APP-2026-003', 'Rohan Gupta', '2010-11-05', 'Male', 'Rajesh Gupta', 'rajesh@email.com', '9988776633', 'KV', '2026-01-15', 'CONFIRMED'),
('APP-2026-004', 'Ananya Singh', '2011-02-28', 'Female', 'Vikram Singh', 'vikram@email.com', '9988776622', 'DPS', '2026-02-01', 'NEW'),
('APP-2026-005', 'Arjun Kumar', '2011-06-10', 'Male', 'Anil Kumar', 'anil@email.com', '9988776611', 'NPS', '2026-02-05', 'NEW');

-- Students
INSERT INTO students (student_id, first_name, last_name, date_of_birth, gender, email, phone, address, admission_id, current_academic_year_id, current_class_id, current_section_id, parent_id, admission_date, status) VALUES 
('STU-2026-0001', 'Aarav', 'Sharma', '2010-05-15', 'Male', 'aarav@student.com', '9988776655', '123 MG Road, Bangalore', 1, 2, 10, 1, 1, '2026-03-01', 'ACTIVE'),
('STU-2026-0002', 'Priya', 'Patel', '2010-08-20', 'Female', 'priya@student.com', '9988776644', '456 SG Highway, Ahmedabad', 2, 2, 10, 1, 2, '2026-03-02', 'ACTIVE'),
('STU-2026-0003', 'Rohan', 'Gupta', '2010-11-05', 'Male', 'rohan@student.com', '9988776633', '789 Park Street, Kolkata', 3, 2, 10, 2, NULL, '2026-03-05', 'ACTIVE'),
('STU-2026-0004', 'Ishita', 'Verma', '2010-12-12', 'Female', 'ishita@student.com', '9988776622', 'Lane 4, Delhi', NULL, 2, 10, 2, NULL, '2025-04-01', 'ACTIVE'),
('STU-2026-0005', 'Karan', 'Mehta', '2011-01-20', 'Male', 'karan@student.com', '9988776611', 'Sector 15, Chandigarh', NULL, 2, 10, 1, NULL, '2025-04-01', 'ACTIVE'),
('STU-2026-0006', 'Sneha', 'Reddy', '2009-07-15', 'Female', 'sneha@student.com', '9988776600', 'Banjara Hills, Hyderabad', NULL, 2, 11, 3, NULL, '2024-04-01', 'ACTIVE'),
('STU-2026-0007', 'Vikram', 'Joshi', '2009-09-25', 'Male', 'vikram@student.com', '9988776599', 'FC Road, Pune', NULL, 2, 11, 3, NULL, '2024-04-01', 'ACTIVE'),
('STU-2026-0008', 'Pooja', 'Nair', '2008-04-10', 'Female', 'pooja@student.com', '9988776588', 'MG Road, Kochi', NULL, 2, 12, 4, NULL, '2023-04-01', 'ACTIVE'),
('STU-2026-0009', 'Rahul', 'Desai', '2008-06-05', 'Male', 'rahul@student.com', '9988776577', 'Navrangpura, Ahmedabad', NULL, 2, 12, 4, NULL, '2023-04-01', 'ACTIVE'),
('STU-2026-0010', 'Neha', 'Kapoor', '2010-02-14', 'Female', 'neha@student.com', '9988776566', 'Juhu, Mumbai', NULL, 2, 10, 2, NULL, '2025-04-01', 'ACTIVE');

-- Teacher Subject Class Mapping
INSERT INTO teacher_subject_class (teacher_id, subject_id, class_id, academic_year_id) VALUES 
(1, 1, 10, 2), (1, 1, 11, 2), (1, 1, 12, 2),
(2, 3, 10, 2), (2, 3, 11, 2);

-- Attendance (for Class 10, section A students - id 1, 2, 5)
INSERT INTO attendance (student_id, attendance_date, status, remarks) VALUES 
(1, '2026-04-15', 'PRESENT', ''),
(2, '2026-04-15', 'PRESENT', ''),
(5, '2026-04-15', 'ABSENT', 'Sick'),
(1, '2026-04-16', 'PRESENT', ''),
(2, '2026-04-16', 'PRESENT', ''),
(5, '2026-04-16', 'PRESENT', ''),
(1, '2026-04-17', 'PRESENT', ''),
(2, '2026-04-17', 'ABSENT', 'Family function'),
(5, '2026-04-17', 'PRESENT', '');

-- Examinations
INSERT INTO examinations (name, exam_date, academic_year_id, class_id) VALUES 
('Unit Test 1', '2026-07-15', 2, 10),
('Mid Term', '2026-09-20', 2, 10);

-- Results (for Unit Test 1)
INSERT INTO results (student_id, examination_id, subject_id, marks_obtained, maximum_marks, grade) VALUES 
(1, 1, 1, 45, 50, 'A'), (1, 1, 2, 40, 50, 'A'), (1, 1, 3, 38, 50, 'B'),
(2, 1, 1, 48, 50, 'A'), (2, 1, 2, 42, 50, 'A'), (2, 1, 3, 45, 50, 'A'),
(3, 1, 1, 35, 50, 'B'), (3, 1, 2, 30, 50, 'C'), (3, 1, 3, 40, 50, 'A'),
(4, 1, 1, 50, 50, 'A'), (4, 1, 2, 49, 50, 'A'), (4, 1, 3, 47, 50, 'A'),
(5, 1, 1, 20, 50, 'D'), (5, 1, 2, 25, 50, 'C'), (5, 1, 3, 30, 50, 'C');

-- Fees
INSERT INTO fees (student_id, academic_year_id, total_amount, amount_paid, outstanding_amount, status, due_date) VALUES 
(1, 2, 50000, 50000, 0, 'PAID', '2026-05-01'),
(2, 2, 50000, 25000, 25000, 'PARTIAL', '2026-05-01'),
(3, 2, 50000, 0, 50000, 'PENDING', '2026-05-01'),
(4, 2, 50000, 50000, 0, 'PAID', '2026-05-01'),
(5, 2, 50000, 10000, 40000, 'PARTIAL', '2026-05-01'),
(6, 2, 60000, 60000, 0, 'PAID', '2026-05-01'),
(7, 2, 60000, 30000, 30000, 'PARTIAL', '2026-05-01'),
(8, 2, 65000, 0, 65000, 'PENDING', '2026-05-01'),
(9, 2, 65000, 65000, 0, 'PAID', '2026-05-01'),
(10, 2, 50000, 20000, 30000, 'PARTIAL', '2026-05-01');

-- Payments
INSERT INTO payments (fee_id, amount, payment_date, payment_method, transaction_reference) VALUES 
(1, 50000, '2026-04-10', 'ONLINE', 'TXN123456789'),
(2, 25000, '2026-04-12', 'CASH', 'RCPT001'),
(4, 50000, '2026-04-15', 'CHEQUE', 'CHQ987654'),
(5, 10000, '2026-04-20', 'ONLINE', 'TXN234567890'),
(6, 60000, '2026-04-25', 'ONLINE', 'TXN345678901'),
(7, 30000, '2026-04-26', 'ONLINE', 'TXN456789012'),
(9, 65000, '2026-04-28', 'CHEQUE', 'CHQ123456'),
(10, 20000, '2026-04-30', 'CASH', 'RCPT002');

-- Student Academic History
INSERT INTO student_academic_history (student_id, academic_year_id, class_id, section_id, roll_number) VALUES 
(1, 2, 10, 1, '10A-01'),
(2, 2, 10, 1, '10A-02'),
(3, 2, 10, 2, '10B-01'),
(4, 2, 10, 2, '10B-02'),
(5, 2, 10, 1, '10A-03'),
(6, 2, 11, 3, '11A-01'),
(7, 2, 11, 3, '11A-02'),
(8, 2, 12, 4, '12A-01'),
(9, 2, 12, 4, '12A-02'),
(10, 2, 10, 2, '10B-03');
