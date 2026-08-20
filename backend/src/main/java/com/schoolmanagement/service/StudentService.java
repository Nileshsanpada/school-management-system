package com.schoolmanagement.service;

import com.schoolmanagement.dto.student.StudentRequest;
import com.schoolmanagement.dto.student.StudentResponse;
import com.schoolmanagement.entity.*;
import com.schoolmanagement.mapper.StudentMapper;
import com.schoolmanagement.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class StudentService {

    private static final Logger logger = LoggerFactory.getLogger(StudentService.class);

    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;
    private final ClassRepository classRepository;
    private final SectionRepository sectionRepository;
    private final AcademicYearRepository academicYearRepository;
    private final ParentRepository parentRepository;
    private final StudentAcademicHistoryRepository studentAcademicHistoryRepository;

    public StudentService(StudentRepository studentRepository, StudentMapper studentMapper, ClassRepository classRepository, SectionRepository sectionRepository, AcademicYearRepository academicYearRepository, ParentRepository parentRepository, StudentAcademicHistoryRepository studentAcademicHistoryRepository) {
        this.studentRepository = studentRepository;
        this.studentMapper = studentMapper;
        this.classRepository = classRepository;
        this.sectionRepository = sectionRepository;
        this.academicYearRepository = academicYearRepository;
        this.parentRepository = parentRepository;
        this.studentAcademicHistoryRepository = studentAcademicHistoryRepository;
    }

    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll().stream().map(studentMapper::toResponse).collect(Collectors.toList());
    }

    public StudentResponse getStudentById(Long id) {
        return studentRepository.findById(id).map(studentMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Student not found for ID: " + id));
    }

    public StudentResponse getStudentByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId).map(studentMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Student not found for Student ID: " + studentId));
    }

    @Transactional
    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setEmail(request.getEmail());
        student.setPhone(request.getPhone());
        student.setAddress(request.getAddress());
        
        if (request.getClassId() != null) {
            student.setCurrentClass(classRepository.findById(request.getClassId()).orElse(null));
        }
        if (request.getSectionId() != null) {
            student.setCurrentSection(sectionRepository.findById(request.getSectionId()).orElse(null));
        }
        if (request.getAcademicYearId() != null) {
            student.setCurrentAcademicYear(academicYearRepository.findById(request.getAcademicYearId()).orElse(null));
        }
        
        student = studentRepository.save(student);
        return studentMapper.toResponse(student);
    }

    @Transactional
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    public List<StudentResponse> getStudentsByClass(Long classId) {
        return studentRepository.findByCurrentClassId(classId).stream().map(studentMapper::toResponse).collect(Collectors.toList());
    }

    public List<StudentResponse> getStudentsByClassAndSection(Long classId, Long sectionId) {
        return studentRepository.findByCurrentClassIdAndCurrentSectionId(classId, sectionId).stream().map(studentMapper::toResponse).collect(Collectors.toList());
    }

    public List<StudentResponse> searchStudents(String name) {
        return studentRepository.searchByName(name).stream().map(studentMapper::toResponse).collect(Collectors.toList());
    }

    public List<StudentAcademicHistory> getStudentAcademicHistory(Long studentId) {
        return studentAcademicHistoryRepository.findByStudentId(studentId);
    }
}
