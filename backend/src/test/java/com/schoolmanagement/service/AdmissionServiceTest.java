package com.schoolmanagement.service;

import com.schoolmanagement.dto.admission.AdmissionRequest;
import com.schoolmanagement.dto.admission.AdmissionResponse;
import com.schoolmanagement.entity.AcademicYear;
import com.schoolmanagement.entity.Admission;
import com.schoolmanagement.entity.Parent;
import com.schoolmanagement.entity.Student;
import com.schoolmanagement.entity.User;
import com.schoolmanagement.entity.enums.AdmissionStatus;
import com.schoolmanagement.entity.enums.Gender;
import com.schoolmanagement.repository.*;
import com.schoolmanagement.mapper.AdmissionMapper;
import com.schoolmanagement.util.StudentIdGenerator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdmissionServiceTest {

    @Mock private AdmissionRepository admissionRepository;
    @Mock private StudentRepository studentRepository;
    @Mock private AdmissionMapper admissionMapper;
    @Mock private StudentIdGenerator studentIdGenerator;
    @Mock private AcademicYearRepository academicYearRepository;
    @Mock private ParentRepository parentRepository;
    @Mock private UserRepository userRepository;
    @Mock private StudentAcademicHistoryRepository studentAcademicHistoryRepository;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdmissionService admissionService;

    @Test
    void createAdmission_shouldSaveAndReturnResponse() {
        AdmissionRequest request = new AdmissionRequest();
        request.setStudentName("Test Student");
        request.setParentEmail("parent@test.com");
        
        Admission admission = new Admission();
        admission.setStudentName("Test Student");
        
        Admission savedAdmission = new Admission();
        savedAdmission.setId(1L);
        savedAdmission.setApplicationNumber("APP-12345");
        
        AdmissionResponse response = AdmissionResponse.builder()
                .id(1L)
                .applicationNumber("APP-12345")
                .studentName("Test Student")
                .build();

        when(admissionMapper.toEntity(request)).thenReturn(admission);
        when(admissionRepository.save(any(Admission.class))).thenReturn(savedAdmission);
        when(admissionMapper.toResponse(savedAdmission)).thenReturn(response);

        AdmissionResponse result = admissionService.createAdmission(request);

        assertNotNull(result);
        assertEquals("APP-12345", result.getApplicationNumber());
        verify(admissionRepository, times(1)).save(any(Admission.class));
    }

    @Test
    void updateStatus_toConfirmed_shouldCreateStudent() {
        Long admissionId = 1L;
        Admission admission = new Admission();
        admission.setId(admissionId);
        admission.setStatus(AdmissionStatus.NEW);
        admission.setStudentName("John Doe");
        admission.setParentEmail("parent@example.com");
        admission.setParentName("Parent Doe");
        admission.setParentPhone("1234567890");
        admission.setDateOfBirth(LocalDate.of(2010, 1, 1));
        admission.setGender(Gender.MALE);

        AcademicYear activeYear = new AcademicYear();
        activeYear.setId(1L);
        activeYear.setName("2026-2027");

        when(admissionRepository.findById(admissionId)).thenReturn(Optional.of(admission));
        when(studentRepository.existsByAdmissionId(admissionId)).thenReturn(false);
        when(studentIdGenerator.generateStudentId()).thenReturn("STU-2026-0001");
        when(academicYearRepository.findByActiveTrue()).thenReturn(Optional.of(activeYear));
        when(parentRepository.findByEmail("parent@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);
        when(parentRepository.save(any(Parent.class))).thenAnswer(i -> i.getArguments()[0]);
        when(studentRepository.save(any(Student.class))).thenAnswer(i -> i.getArguments()[0]);
        when(admissionRepository.save(any(Admission.class))).thenReturn(admission);
        when(admissionMapper.toResponse(admission)).thenReturn(AdmissionResponse.builder().id(1L).status("CONFIRMED").build());

        AdmissionResponse result = admissionService.updateAdmissionStatus(admissionId, "CONFIRMED");

        assertNotNull(result);
        verify(studentRepository, times(1)).save(any(Student.class));
        verify(admissionRepository, times(1)).save(admission);
    }

    @Test
    void updateStatus_toConfirmed_shouldThrowIfStudentAlreadyExists() {
        Long admissionId = 1L;
        Admission admission = new Admission();
        admission.setId(admissionId);
        admission.setStatus(AdmissionStatus.NEW);
        
        when(admissionRepository.findById(admissionId)).thenReturn(Optional.of(admission));
        when(studentRepository.existsByAdmissionId(admissionId)).thenReturn(true);

        assertThrows(RuntimeException.class, () -> admissionService.updateAdmissionStatus(admissionId, "CONFIRMED"));
        verify(studentRepository, never()).save(any(Student.class));
    }
}
