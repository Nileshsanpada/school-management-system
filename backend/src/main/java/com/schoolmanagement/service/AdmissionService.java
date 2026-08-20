package com.schoolmanagement.service;

import com.schoolmanagement.dto.admission.AdmissionRequest;
import com.schoolmanagement.dto.admission.AdmissionResponse;
import com.schoolmanagement.entity.*;
import com.schoolmanagement.entity.enums.AdmissionStatus;
import com.schoolmanagement.entity.enums.Gender;
import com.schoolmanagement.entity.enums.Role;
import com.schoolmanagement.entity.enums.StudentStatus;
import com.schoolmanagement.mapper.AdmissionMapper;
import com.schoolmanagement.repository.*;
import com.schoolmanagement.util.StudentIdGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AdmissionService {

    private static final Logger logger = LoggerFactory.getLogger(AdmissionService.class);

    private final AdmissionRepository admissionRepository;
    private final StudentRepository studentRepository;
    private final AdmissionMapper admissionMapper;
    private final StudentIdGenerator studentIdGenerator;
    private final AcademicYearRepository academicYearRepository;
    private final ParentRepository parentRepository;
    private final UserRepository userRepository;
    private final StudentAcademicHistoryRepository studentAcademicHistoryRepository;
    private final ClassRepository classRepository;
    private final SectionRepository sectionRepository;
    private final PasswordEncoder passwordEncoder;

    public AdmissionService(AdmissionRepository admissionRepository, StudentRepository studentRepository, 
                            AdmissionMapper admissionMapper, StudentIdGenerator studentIdGenerator, 
                            AcademicYearRepository academicYearRepository, ParentRepository parentRepository, 
                            UserRepository userRepository, StudentAcademicHistoryRepository studentAcademicHistoryRepository, 
                            ClassRepository classRepository, SectionRepository sectionRepository,
                            PasswordEncoder passwordEncoder) {
        this.admissionRepository = admissionRepository;
        this.studentRepository = studentRepository;
        this.admissionMapper = admissionMapper;
        this.studentIdGenerator = studentIdGenerator;
        this.academicYearRepository = academicYearRepository;
        this.parentRepository = parentRepository;
        this.userRepository = userRepository;
        this.studentAcademicHistoryRepository = studentAcademicHistoryRepository;
        this.classRepository = classRepository;
        this.sectionRepository = sectionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<AdmissionResponse> getAllAdmissions() {
        return admissionRepository.findAll().stream()
                .map(admissionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public AdmissionResponse getAdmissionById(Long id) {
        Admission admission = admissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admission application not found for ID: " + id));
        return admissionMapper.toResponse(admission);
    }

    @Transactional
    public AdmissionResponse createAdmission(AdmissionRequest request) {
        Admission admission = admissionMapper.toEntity(request);
        admission.setApplicationNumber("APP-" + System.currentTimeMillis());
        admission.setStatus(AdmissionStatus.NEW);
        admission = admissionRepository.save(admission);
        return admissionMapper.toResponse(admission);
    }

    @Transactional
    public AdmissionResponse updateAdmissionStatus(Long id, String statusStr) {
        Admission admission = admissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admission application not found for ID: " + id));
        
        AdmissionStatus targetStatus;
        try {
            targetStatus = AdmissionStatus.valueOf(statusStr.trim().toUpperCase());
        } catch (Exception e) {
            targetStatus = AdmissionStatus.CONFIRMED;
        }
        
        if (targetStatus == AdmissionStatus.CONFIRMED && admission.getStatus() != AdmissionStatus.CONFIRMED) {
            if (studentRepository.existsByAdmissionId(id)) {
                logger.info("Student already exists for admission ID: {}", id);
            } else {
                String studentId = studentIdGenerator.generateStudentId();
                
                Student student = new Student();
                String rawName = (admission.getStudentName() != null && !admission.getStudentName().isBlank()) 
                        ? admission.getStudentName().trim() 
                        : "Student";
                String[] names = rawName.split("\\s+", 2);
                student.setFirstName(names[0]);
                student.setLastName(names.length > 1 ? names[1] : "");
                student.setDateOfBirth(admission.getDateOfBirth() != null ? admission.getDateOfBirth() : LocalDate.of(2012, 1, 1));
                student.setGender(admission.getGender() != null ? admission.getGender() : Gender.MALE);
                student.setAdmission(admission);
                student.setAdmissionDate(LocalDate.now());
                student.setStatus(StudentStatus.ACTIVE);
                student.setStudentId(studentId);
                
                // Get or create active academic year
                AcademicYear activeYear = academicYearRepository.findByActiveTrue()
                        .or(() -> academicYearRepository.findAll().stream().findFirst())
                        .orElseGet(() -> {
                            AcademicYear newYear = new AcademicYear();
                            newYear.setName("2026-2027");
                            newYear.setStartDate(LocalDate.of(2026, 4, 1));
                            newYear.setEndDate(LocalDate.of(2027, 3, 31));
                            newYear.setActive(true);
                            return academicYearRepository.save(newYear);
                        });
                student.setCurrentAcademicYear(activeYear);
                
                // Default class assignment if available
                SchoolClass defaultClass = classRepository.findAll().stream().findFirst().orElse(null);
                if (defaultClass != null) {
                    student.setCurrentClass(defaultClass);
                    Section defaultSection = sectionRepository.findBySchoolClassId(defaultClass.getId()).stream().findFirst().orElse(null);
                    student.setCurrentSection(defaultSection);
                }
                
                // Parent mapping
                final String pEmail = (admission.getParentEmail() != null && !admission.getParentEmail().isBlank()) 
                        ? admission.getParentEmail().trim().toLowerCase() 
                        : ("parent." + studentId.toLowerCase().replace("-", "") + "@school.com");
                final String pName = (admission.getParentName() != null && !admission.getParentName().isBlank()) 
                        ? admission.getParentName().trim() 
                        : (student.getFirstName() + " Parent");
                final String pPhone = (admission.getParentPhone() != null && !admission.getParentPhone().isBlank()) 
                        ? admission.getParentPhone().trim() 
                        : "9876543210";

                Parent parent = parentRepository.findByEmail(pEmail)
                        .or(() -> userRepository.findByEmail(pEmail).flatMap(u -> parentRepository.findByUserId(u.getId())))
                        .orElseGet(() -> {
                            User user = userRepository.findByEmail(pEmail).orElseGet(() -> {
                                User newUser = new User();
                                newUser.setName(pName);
                                newUser.setEmail(pEmail);
                                newUser.setPassword(passwordEncoder.encode("password123"));
                                newUser.setRole(Role.PARENT);
                                return userRepository.save(newUser);
                            });
                            
                            Parent newParent = new Parent();
                            newParent.setName(pName);
                            newParent.setEmail(pEmail);
                            newParent.setPhone(pPhone);
                            newParent.setUser(user);
                            return parentRepository.save(newParent);
                        });
                
                student.setParent(parent);
                student = studentRepository.save(student);
                
                StudentAcademicHistory history = new StudentAcademicHistory();
                history.setStudent(student);
                history.setAcademicYear(activeYear);
                studentAcademicHistoryRepository.save(history);
                
                logger.info("Successfully created student: {} and linked to parent: {}", studentId, pEmail);
            }
        }
        
        admission.setStatus(targetStatus);
        admission = admissionRepository.save(admission);
        return admissionMapper.toResponse(admission);
    }

    public List<AdmissionResponse> getAdmissionsByStatus(String statusStr) {
        AdmissionStatus status = AdmissionStatus.valueOf(statusStr.toUpperCase());
        return admissionRepository.findByStatus(status).stream()
                .map(admissionMapper::toResponse)
                .collect(Collectors.toList());
    }
}
