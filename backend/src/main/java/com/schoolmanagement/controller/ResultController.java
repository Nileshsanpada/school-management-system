package com.schoolmanagement.controller;

import com.schoolmanagement.dto.result.ResultRequest;
import com.schoolmanagement.dto.result.ResultResponse;
import com.schoolmanagement.service.ResultService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @GetMapping
    public ResponseEntity<List<ResultResponse>> getAll() {
        return ResponseEntity.ok(resultService.getAllResults());
    }

    @PostMapping
    public ResponseEntity<ResultResponse> create(@Valid @RequestBody ResultRequest request) {
        return ResponseEntity.ok(resultService.createResult(request));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ResultResponse>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(resultService.getResultsByStudent(studentId));
    }

    @GetMapping("/examination/{examinationId}")
    public ResponseEntity<List<ResultResponse>> getByExamination(@PathVariable Long examinationId) {
        return ResponseEntity.ok(resultService.getResultsByExamination(examinationId));
    }

    @GetMapping("/student/{studentId}/examination/{examinationId}")
    public ResponseEntity<List<ResultResponse>> getByStudentAndExam(@PathVariable Long studentId, @PathVariable Long examinationId) {
        return ResponseEntity.ok(resultService.getResultsByStudentAndExamination(studentId, examinationId));
    }
}
