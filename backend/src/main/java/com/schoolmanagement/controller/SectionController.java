package com.schoolmanagement.controller;

import com.schoolmanagement.entity.Section;
import com.schoolmanagement.service.SectionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sections")
public class SectionController {

    private final SectionService sectionService;

    public SectionController(SectionService sectionService) {
        this.sectionService = sectionService;
    }

    @GetMapping
    public ResponseEntity<List<Section>> getAll() {
        return ResponseEntity.ok(sectionService.getAllSections());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Section> getById(@PathVariable Long id) {
        return ResponseEntity.ok(sectionService.getSectionById(id));
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<Section>> getByClassId(@PathVariable Long classId) {
        return ResponseEntity.ok(sectionService.getSectionsByClassId(classId));
    }

    @PostMapping
    public ResponseEntity<Section> create(@Valid @RequestBody com.schoolmanagement.dto.academic.SectionRequest request) {
        Section section = new Section();
        section.setName(request.getName());
        return ResponseEntity.ok(sectionService.createSection(section, request.getClassId(), request.getAcademicYearId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sectionService.deleteSection(id);
        return ResponseEntity.ok().build();
    }
}
