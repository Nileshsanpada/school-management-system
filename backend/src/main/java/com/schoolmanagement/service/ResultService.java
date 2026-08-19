package com.schoolmanagement.service;

import com.schoolmanagement.dto.result.ResultRequest;
import com.schoolmanagement.dto.result.ResultResponse;
import com.schoolmanagement.entity.Examination;
import com.schoolmanagement.entity.Result;
import com.schoolmanagement.entity.Student;
import com.schoolmanagement.entity.Subject;
import com.schoolmanagement.repository.ExaminationRepository;
import com.schoolmanagement.repository.ResultRepository;
import com.schoolmanagement.repository.StudentRepository;
import com.schoolmanagement.repository.SubjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResultService {

    private static final Logger logger = LoggerFactory.getLogger(ResultService.class);

    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final ExaminationRepository examinationRepository;
    private final SubjectRepository subjectRepository;

    public ResultService(ResultRepository resultRepository, StudentRepository studentRepository, ExaminationRepository examinationRepository, SubjectRepository subjectRepository) {
        this.resultRepository = resultRepository;
        this.studentRepository = studentRepository;
        this.examinationRepository = examinationRepository;
        this.subjectRepository = subjectRepository;
    }

    public ResultResponse createResult(ResultRequest request) {
        Student student = studentRepository.findById(request.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found"));
        Examination examination = examinationRepository.findById(request.getExaminationId()).orElseThrow(() -> new RuntimeException("Examination not found"));
        Subject subject = subjectRepository.findById(request.getSubjectId()).orElseThrow(() -> new RuntimeException("Subject not found"));

        if (resultRepository.existsByStudentIdAndExaminationIdAndSubjectId(request.getStudentId(), request.getExaminationId(), request.getSubjectId())) {
            throw new RuntimeException("Result already exists for this student, examination, and subject");
        }

        if (request.getMarksObtained() > request.getMaximumMarks()) {
            throw new IllegalArgumentException("Marks obtained cannot be greater than maximum marks");
        }

        Result result = new Result();
        result.setStudent(student);
        result.setExamination(examination);
        result.setSubject(subject);
        result.setMarksObtained(request.getMarksObtained());
        result.setMaximumMarks(request.getMaximumMarks());
        result.setGrade(calculateGrade(request.getMarksObtained(), request.getMaximumMarks()));

        result = resultRepository.save(result);
        return mapToResponse(result);
    }

    public List<ResultResponse> getResultsByStudent(Long studentId) {
        return resultRepository.findByStudentId(studentId).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ResultResponse> getResultsByExamination(Long examinationId) {
        return resultRepository.findByExaminationId(examinationId).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ResultResponse> getResultsByStudentAndExamination(Long studentId, Long examinationId) {
        return resultRepository.findByStudentIdAndExaminationId(studentId, examinationId).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private String calculateGrade(double marks, double maxMarks) {
        double percentage = (marks / maxMarks) * 100;
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B";
        if (percentage >= 60) return "C";
        if (percentage >= 50) return "D";
        return "F";
    }

    private ResultResponse mapToResponse(Result result) {
        double percentage = (result.getMarksObtained() / result.getMaximumMarks()) * 100;
        return ResultResponse.builder()
                .id(result.getId())
                .studentId(result.getStudent().getId())
                .studentName(result.getStudent().getFirstName() + " " + result.getStudent().getLastName())
                .examinationName(result.getExamination().getName())
                .subjectName(result.getSubject().getName())
                .marksObtained(result.getMarksObtained())
                .maximumMarks(result.getMaximumMarks())
                .percentage(Math.round(percentage * 100.0) / 100.0)
                .grade(result.getGrade())
                .build();
    }
}
