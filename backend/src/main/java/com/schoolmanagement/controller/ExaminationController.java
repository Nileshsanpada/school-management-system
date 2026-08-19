package com.schoolmanagement.controller;

import com.schoolmanagement.dto.examination.ExaminationRequest;
import com.schoolmanagement.dto.examination.ExaminationResponse;
import com.schoolmanagement.service.ExaminationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/examinations")
public class ExaminationController {

    private final ExaminationService examinationService;

    public ExaminationController(ExaminationService examinationService) {
        this.examinationService = examinationService;
    }

    @GetMapping
    public ResponseEntity<List<ExaminationResponse>> getAll() {
        return ResponseEntity.ok(examinationService.getAllExaminations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExaminationResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(examinationService.getExaminationById(id));
    }

    @PostMapping
    public ResponseEntity<ExaminationResponse> create(@Valid @RequestBody ExaminationRequest request) {
        return ResponseEntity.ok(examinationService.createExamination(request));
    }

    @GetMapping("/academic-year/{yearId}")
    public ResponseEntity<List<ExaminationResponse>> getByAcademicYear(@PathVariable Long yearId) {
        return ResponseEntity.ok(examinationService.getExaminationsByAcademicYear(yearId));
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<ExaminationResponse>> getByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(examinationService.getExaminationsByClass(classId));
    }
}
