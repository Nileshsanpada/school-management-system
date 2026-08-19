package com.schoolmanagement.service;

import com.schoolmanagement.dto.admission.AdmissionRequest;
import com.schoolmanagement.dto.admission.AdmissionResponse;
import com.schoolmanagement.entity.*;
import com.schoolmanagement.entity.enums.AdmissionStatus;
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
    private final PasswordEncoder passwordEncoder;

    public AdmissionService(AdmissionRepository admissionRepository, StudentRepository studentRepository, 
                            AdmissionMapper admissionMapper, StudentIdGenerator studentIdGenerator, 
                            AcademicYearRepository academicYearRepository, ParentRepository parentRepository, 
                            UserRepository userRepository, StudentAcademicHistoryRepository studentAcademicHistoryRepository, 
                            PasswordEncoder passwordEncoder) {
        this.admissionRepository = admissionRepository;
        this.studentRepository = studentRepository;
        this.admissionMapper = admissionMapper;
        this.studentIdGenerator = studentIdGenerator;
        this.academicYearRepository = academicYearRepository;
        this.parentRepository = parentRepository;
        this.userRepository = userRepository;
        this.studentAcademicHistoryRepository = studentAcademicHistoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<AdmissionResponse> getAllAdmissions() {
        return admissionRepository.findAll().stream()
                .map(admissionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public AdmissionResponse getAdmissionById(Long id) {
        Admission admission = admissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admission not found"));
        return admissionMapper.toResponse(admission);
    }

    @Transactional
    public AdmissionResponse createAdmission(AdmissionRequest request) {
        Admission admission = admissionMapper.toEntity(request);
        admission.setApplicationNumber("APP-" + System.currentTimeMillis());
        admission = admissionRepository.save(admission);
        return admissionMapper.toResponse(admission);
    }

    @Transactional
    public AdmissionResponse updateAdmissionStatus(Long id, String statusStr) {
        Admission admission = admissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admission not found"));
        
        AdmissionStatus status = AdmissionStatus.valueOf(statusStr.toUpperCase());
        
        if (status == AdmissionStatus.CONFIRMED && admission.getStatus() != AdmissionStatus.CONFIRMED) {
            if (studentRepository.existsByAdmissionId(id)) {
                throw new RuntimeException("Student already created for this admission");
            }
            
            String studentId = studentIdGenerator.generateStudentId();
            
            Student student = new Student();
            String[] names = admission.getStudentName().split(" ", 2);
            student.setFirstName(names[0]);
            student.setLastName(names.length > 1 ? names[1] : "");
            student.setDateOfBirth(admission.getDateOfBirth());
            student.setGender(admission.getGender());
            student.setAdmission(admission);
            student.setAdmissionDate(LocalDate.now());
            student.setStatus(StudentStatus.ACTIVE);
            student.setStudentId(studentId);
            
            AcademicYear activeYear = academicYearRepository.findByActiveTrue()
                    .orElseThrow(() -> new RuntimeException("No active academic year found"));
            student.setCurrentAcademicYear(activeYear);
            
            final String pEmail = admission.getParentEmail();
            final String pName = admission.getParentName();
            final String pPhone = admission.getParentPhone();

            Parent parent = parentRepository.findByEmail(pEmail).orElse(null);
            if (parent == null) {
                User user = userRepository.findByEmail(pEmail).orElseGet(() -> {
                    User newUser = new User();
                    newUser.setName(pName);
                    newUser.setEmail(pEmail);
                    newUser.setPassword(passwordEncoder.encode("password123"));
                    newUser.setRole(Role.PARENT);
                    return userRepository.save(newUser);
                });
                
                parent = new Parent();
                parent.setName(pName);
                parent.setEmail(pEmail);
                parent.setPhone(pPhone);
                parent.setUser(user);
                parent = parentRepository.save(parent);
            }
            
            student.setParent(parent);
            student = studentRepository.save(student);
            
            StudentAcademicHistory history = new StudentAcademicHistory();
            history.setStudent(student);
            history.setAcademicYear(activeYear);
            studentAcademicHistoryRepository.save(history);
            
            logger.info("Student created from admission: {}", studentId);
        }
        
        admission.setStatus(status);
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
