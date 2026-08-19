package com.schoolmanagement.controller;

import com.schoolmanagement.dto.admission.AdmissionRequest;
import com.schoolmanagement.dto.admission.AdmissionResponse;
import com.schoolmanagement.service.AdmissionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admissions")
public class AdmissionController {

    private final AdmissionService admissionService;

    public AdmissionController(AdmissionService admissionService) {
        this.admissionService = admissionService;
    }

    @GetMapping
    public ResponseEntity<List<AdmissionResponse>> getAllAdmissions() {
        return ResponseEntity.ok(admissionService.getAllAdmissions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdmissionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(admissionService.getAdmissionById(id));
    }

    @PostMapping
    public ResponseEntity<AdmissionResponse> create(@Valid @RequestBody AdmissionRequest request) {
        return ResponseEntity.ok(admissionService.createAdmission(request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AdmissionResponse> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(admissionService.updateAdmissionStatus(id, status));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<AdmissionResponse>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(admissionService.getAdmissionsByStatus(status));
    }
}
