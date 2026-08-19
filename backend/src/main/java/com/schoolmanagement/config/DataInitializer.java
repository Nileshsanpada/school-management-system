package com.schoolmanagement.config;

import com.schoolmanagement.entity.*;
import com.schoolmanagement.entity.enums.*;
import com.schoolmanagement.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final AcademicYearRepository academicYearRepository;
    private final ClassRepository classRepository;
    private final SectionRepository sectionRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;
    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final ExaminationRepository examinationRepository;
    private final ResultRepository resultRepository;
    private final FeeRepository feeRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, AcademicYearRepository academicYearRepository,
                           ClassRepository classRepository, SectionRepository sectionRepository,
                           SubjectRepository subjectRepository, TeacherRepository teacherRepository,
                           ParentRepository parentRepository, StudentRepository studentRepository,
                           AttendanceRepository attendanceRepository, ExaminationRepository examinationRepository,
                           ResultRepository resultRepository, FeeRepository feeRepository,
                           PaymentRepository paymentRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.academicYearRepository = academicYearRepository;
        this.classRepository = classRepository;
        this.sectionRepository = sectionRepository;
        this.subjectRepository = subjectRepository;
        this.teacherRepository = teacherRepository;
        this.parentRepository = parentRepository;
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
        this.examinationRepository = examinationRepository;
        this.resultRepository = resultRepository;
        this.feeRepository = feeRepository;
        this.paymentRepository = paymentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            logger.info("Initializing demo seed data...");

            // 1. Admin User
            User adminUser = userRepository.findByEmail("admin@school.com").orElseGet(() -> {
                User u = new User();
                u.setName("Principal Rajesh Verma");
                u.setEmail("admin@school.com");
                u.setPassword(passwordEncoder.encode("admin123"));
                u.setRole(Role.ADMIN);
                u.setCreatedAt(LocalDateTime.now());
                return userRepository.save(u);
            });

            // 2. Teacher User
            User teacherUser = userRepository.findByEmail("teacher@school.com").orElseGet(() -> {
                User u = new User();
                u.setName("Mr. Vikram Sharma");
                u.setEmail("teacher@school.com");
                u.setPassword(passwordEncoder.encode("teacher123"));
                u.setRole(Role.TEACHER);
                u.setCreatedAt(LocalDateTime.now());
                return userRepository.save(u);
            });

            // 3. Parent User
            User parentUser = userRepository.findByEmail("parent@school.com").orElseGet(() -> {
                User u = new User();
                u.setName("Mr. Suresh Sharma");
                u.setEmail("parent@school.com");
                u.setPassword(passwordEncoder.encode("parent123"));
                u.setRole(Role.PARENT);
                u.setCreatedAt(LocalDateTime.now());
                return userRepository.save(u);
            });

            // 4. Academic Year
            AcademicYear year = academicYearRepository.findByName("2026-2027").orElseGet(() -> {
                AcademicYear y = new AcademicYear();
                y.setName("2026-2027");
                y.setStartDate(LocalDate.of(2026, 4, 1));
                y.setEndDate(LocalDate.of(2027, 3, 31));
                y.setActive(true);
                return academicYearRepository.save(y);
            });

            // 5. Classes
            SchoolClass class10 = classRepository.findByName("Class 10").orElseGet(() -> {
                SchoolClass c = new SchoolClass();
                c.setName("Class 10");
                return classRepository.save(c);
            });

            classRepository.findByName("Class 9").orElseGet(() -> {
                SchoolClass c = new SchoolClass();
                c.setName("Class 9");
                return classRepository.save(c);
            });

            // 6. Section
            final SchoolClass c10Final = class10;
            final AcademicYear yrFinal = year;
            Section secA = sectionRepository.findBySchoolClassId(class10.getId()).stream().findFirst().orElseGet(() -> {
                Section s = new Section();
                s.setName("A");
                s.setSchoolClass(c10Final);
                s.setAcademicYear(yrFinal);
                return sectionRepository.save(s);
            });

            // 7. Subjects
            Subject math = subjectRepository.findByCode("MATH101").orElseGet(() -> {
                Subject s = new Subject();
                s.setName("Mathematics");
                s.setCode("MATH101");
                return subjectRepository.save(s);
            });

            Subject sci = subjectRepository.findByCode("SCI102").orElseGet(() -> {
                Subject s = new Subject();
                s.setName("Science");
                s.setCode("SCI102");
                return subjectRepository.save(s);
            });

            subjectRepository.findByCode("ENG103").orElseGet(() -> {
                Subject s = new Subject();
                s.setName("English");
                s.setCode("ENG103");
                return subjectRepository.save(s);
            });

            // 8. Teacher Record
            teacherRepository.findByEmployeeId("EMP-101").orElseGet(() -> {
                Teacher t = new Teacher();
                t.setName("Mr. Vikram Sharma");
                t.setEmployeeId("EMP-101");
                t.setEmail("teacher@school.com");
                t.setPhone("9876543210");
                t.setQualification("M.Sc. Mathematics, B.Ed");
                return teacherRepository.save(t);
            });

            // 9. Parent Record
            final User pUserFinal = parentUser;
            Parent parent = parentRepository.findByEmail("parent@school.com").orElseGet(() -> {
                Parent p = new Parent();
                p.setName("Mr. Suresh Sharma");
                p.setEmail("parent@school.com");
                p.setPhone("9876500000");
                p.setAddress("123 Green Park, New Delhi");
                p.setUser(pUserFinal);
                return parentRepository.save(p);
            });

            // 10. Student Record
            final Parent parentFinal = parent;
            final Section secAFinal = secA;
            Student student1 = studentRepository.findByStudentId("STU-2026-0001").orElseGet(() -> {
                Student s = new Student();
                s.setStudentId("STU-2026-0001");
                s.setFirstName("Aarav");
                s.setLastName("Sharma");
                s.setEmail("aarav.sharma@school.com");
                s.setPhone("9876500001");
                s.setGender(Gender.MALE);
                s.setDateOfBirth(LocalDate.of(2010, 5, 15));
                s.setStatus(StudentStatus.ACTIVE);
                s.setCurrentClass(c10Final);
                s.setCurrentSection(secAFinal);
                s.setCurrentAcademicYear(yrFinal);
                s.setParent(parentFinal);
                s.setAdmissionDate(LocalDate.of(2026, 4, 1));
                return studentRepository.save(s);
            });

            studentRepository.findByStudentId("STU-2026-0002").orElseGet(() -> {
                Student s = new Student();
                s.setStudentId("STU-2026-0002");
                s.setFirstName("Riya");
                s.setLastName("Patel");
                s.setEmail("riya.patel@school.com");
                s.setPhone("9876500002");
                s.setGender(Gender.FEMALE);
                s.setDateOfBirth(LocalDate.of(2010, 8, 22));
                s.setStatus(StudentStatus.ACTIVE);
                s.setCurrentClass(c10Final);
                s.setCurrentSection(secAFinal);
                s.setCurrentAcademicYear(yrFinal);
                s.setAdmissionDate(LocalDate.of(2026, 4, 1));
                return studentRepository.save(s);
            });

            // 11. Attendance
            if (!attendanceRepository.existsByStudentIdAndAttendanceDate(student1.getId(), LocalDate.now())) {
                Attendance att1 = new Attendance();
                att1.setStudent(student1);
                att1.setAttendanceDate(LocalDate.now());
                att1.setStatus(AttendanceStatus.PRESENT);
                att1.setRemarks("Present on time");
                attendanceRepository.save(att1);
            }

            // 12. Examination & Results
            Examination exam = examinationRepository.findBySchoolClassId(class10.getId()).stream().findFirst().orElseGet(() -> {
                Examination e = new Examination();
                e.setName("Mid-Term Examination 2026");
                e.setExamDate(LocalDate.now());
                e.setSchoolClass(c10Final);
                e.setAcademicYear(yrFinal);
                return examinationRepository.save(e);
            });

            final Examination examFinal = exam;
            final Subject mathFinal = math;
            final Subject sciFinal = sci;

            if (resultRepository.findByStudentIdAndExaminationId(student1.getId(), exam.getId()).isEmpty()) {
                Result res1 = new Result();
                res1.setExamination(examFinal);
                res1.setStudent(student1);
                res1.setSubject(mathFinal);
                res1.setMarksObtained(95.0);
                res1.setMaximumMarks(100.0);
                res1.setGrade("A+");
                resultRepository.save(res1);

                Result res2 = new Result();
                res2.setExamination(examFinal);
                res2.setStudent(student1);
                res2.setSubject(sciFinal);
                res2.setMarksObtained(88.0);
                res2.setMaximumMarks(100.0);
                res2.setGrade("A");
                resultRepository.save(res2);
            }

            // 13. Fees & Payments
            if (feeRepository.findByStudentId(student1.getId()).isEmpty()) {
                Fee fee1 = new Fee();
                fee1.setStudent(student1);
                fee1.setAcademicYear(yrFinal);
                fee1.setTotalAmount(30000.0);
                fee1.setAmountPaid(30000.0);
                fee1.setOutstandingAmount(0.0);
                fee1.setStatus(FeeStatus.PAID);
                fee1.setDueDate(LocalDate.of(2026, 9, 30));
                fee1 = feeRepository.save(fee1);

                Payment pay1 = new Payment();
                pay1.setFee(fee1);
                pay1.setAmount(30000.0);
                pay1.setPaymentMethod(PaymentMethod.UPI);
                pay1.setPaymentDate(LocalDate.now());
                pay1.setTransactionReference("UPI-TXN-987654");
                paymentRepository.save(pay1);
            }

            logger.info("Demo users and complete records seeded successfully!");
        } catch (Exception ex) {
            logger.warn("DataInitializer notice: {}", ex.getMessage());
        }
    }
}
