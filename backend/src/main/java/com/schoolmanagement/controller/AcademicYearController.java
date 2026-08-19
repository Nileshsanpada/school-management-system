package com.schoolmanagement.controller;

import com.schoolmanagement.entity.AcademicYear;
import com.schoolmanagement.service.AcademicYearService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic-years")
public class AcademicYearController {

    private final AcademicYearService academicYearService;

    public AcademicYearController(AcademicYearService academicYearService) {
        this.academicYearService = academicYearService;
    }

    @GetMapping
    public ResponseEntity<List<AcademicYear>> getAll() {
        return ResponseEntity.ok(academicYearService.getAllAcademicYears());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AcademicYear> getById(@PathVariable Long id) {
        return ResponseEntity.ok(academicYearService.getAcademicYearById(id));
    }

    @PostMapping
    public ResponseEntity<AcademicYear> create(@Valid @RequestBody AcademicYear academicYear) {
        return ResponseEntity.ok(academicYearService.createAcademicYear(academicYear));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AcademicYear> update(@PathVariable Long id, @Valid @RequestBody AcademicYear academicYear) {
        return ResponseEntity.ok(academicYearService.updateAcademicYear(id, academicYear));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        academicYearService.deleteAcademicYear(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/active")
    public ResponseEntity<AcademicYear> getActive() {
        return ResponseEntity.ok(academicYearService.getActiveAcademicYear());
    }
}
