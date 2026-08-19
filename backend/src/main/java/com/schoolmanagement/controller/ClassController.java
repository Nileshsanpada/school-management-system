package com.schoolmanagement.controller;

import com.schoolmanagement.entity.SchoolClass;
import com.schoolmanagement.service.ClassService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    private final ClassService classService;

    public ClassController(ClassService classService) {
        this.classService = classService;
    }

    @GetMapping
    public ResponseEntity<List<SchoolClass>> getAll() {
        return ResponseEntity.ok(classService.getAllClasses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchoolClass> getById(@PathVariable Long id) {
        return ResponseEntity.ok(classService.getClassById(id));
    }

    @PostMapping
    public ResponseEntity<SchoolClass> create(@Valid @RequestBody SchoolClass schoolClass) {
        return ResponseEntity.ok(classService.createClass(schoolClass));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SchoolClass> update(@PathVariable Long id, @Valid @RequestBody SchoolClass schoolClass) {
        return ResponseEntity.ok(classService.updateClass(id, schoolClass));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        classService.deleteClass(id);
        return ResponseEntity.ok().build();
    }
}
