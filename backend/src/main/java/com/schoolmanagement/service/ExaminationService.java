package com.schoolmanagement.service;

import com.schoolmanagement.dto.examination.ExaminationRequest;
import com.schoolmanagement.dto.examination.ExaminationResponse;
import com.schoolmanagement.entity.AcademicYear;
import com.schoolmanagement.entity.Examination;
import com.schoolmanagement.entity.SchoolClass;
import com.schoolmanagement.repository.AcademicYearRepository;
import com.schoolmanagement.repository.ClassRepository;
import com.schoolmanagement.repository.ExaminationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ExaminationService {

    private static final Logger logger = LoggerFactory.getLogger(ExaminationService.class);

    private final ExaminationRepository examinationRepository;
    private final AcademicYearRepository academicYearRepository;
    private final ClassRepository classRepository;

    public ExaminationService(ExaminationRepository examinationRepository, AcademicYearRepository academicYearRepository, ClassRepository classRepository) {
        this.examinationRepository = examinationRepository;
        this.academicYearRepository = academicYearRepository;
        this.classRepository = classRepository;
    }

    public List<ExaminationResponse> getAllExaminations() {
        return examinationRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ExaminationResponse getExaminationById(Long id) {
        Examination examination = examinationRepository.findById(id).orElseThrow(() -> new RuntimeException("Examination not found"));
        return mapToResponse(examination);
    }

    @Transactional
    public ExaminationResponse createExamination(ExaminationRequest request) {
        AcademicYear academicYear = academicYearRepository.findById(request.getAcademicYearId()).orElseThrow(() -> new RuntimeException("Academic Year not found"));
        SchoolClass schoolClass = classRepository.findById(request.getClassId()).orElseThrow(() -> new RuntimeException("Class not found"));

        Examination examination = new Examination();
        examination.setName(request.getName());
        examination.setExamDate(request.getExamDate());
        examination.setAcademicYear(academicYear);
        examination.setSchoolClass(schoolClass);

        return mapToResponse(examinationRepository.save(examination));
    }

    public List<ExaminationResponse> getExaminationsByAcademicYear(Long yearId) {
        return examinationRepository.findByAcademicYearId(yearId).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ExaminationResponse> getExaminationsByClass(Long classId) {
        return examinationRepository.findBySchoolClassId(classId).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private ExaminationResponse mapToResponse(Examination examination) {
        String academicYearName = examination.getAcademicYear() != null ? examination.getAcademicYear().getName() : "";
        String className = examination.getSchoolClass() != null ? examination.getSchoolClass().getName() : "";
        return ExaminationResponse.builder()
                .id(examination.getId())
                .name(examination.getName())
                .examDate(examination.getExamDate())
                .academicYearName(academicYearName)
                .className(className)
                .build();
    }
}
