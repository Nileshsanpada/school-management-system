package com.schoolmanagement.controller;

import com.schoolmanagement.dto.fee.FeeRequest;
import com.schoolmanagement.dto.fee.FeeResponse;
import com.schoolmanagement.service.FeeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
public class FeeController {

    private final FeeService feeService;

    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }

    @GetMapping
    public ResponseEntity<List<FeeResponse>> getAll() {
        return ResponseEntity.ok(feeService.getAllFees());
    }

    @PostMapping
    public ResponseEntity<FeeResponse> create(@Valid @RequestBody FeeRequest request) {
        return ResponseEntity.ok(feeService.createFee(request));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<FeeResponse>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(feeService.getFeesByStudent(studentId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(feeService.getFeeById(id));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<FeeResponse>> getOverdue() {
        return ResponseEntity.ok(feeService.getOverdueFees());
    }
}
