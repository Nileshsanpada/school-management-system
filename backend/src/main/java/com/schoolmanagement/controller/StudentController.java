package com.schoolmanagement.controller;

import com.schoolmanagement.dto.student.StudentRequest;
import com.schoolmanagement.dto.student.StudentResponse;
import com.schoolmanagement.entity.StudentAcademicHistory;
import com.schoolmanagement.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<List<StudentResponse>> getAll() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @GetMapping("/student-id/{studentId}")
    public ResponseEntity<StudentResponse> getByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(studentService.getStudentByStudentId(studentId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponse> update(@PathVariable Long id, @Valid @RequestBody StudentRequest request) {
        return ResponseEntity.ok(studentService.updateStudent(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<StudentResponse>> getByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(studentService.getStudentsByClass(classId));
    }

    @GetMapping("/class/{classId}/section/{sectionId}")
    public ResponseEntity<List<StudentResponse>> getByClassAndSection(@PathVariable Long classId, @PathVariable Long sectionId) {
        return ResponseEntity.ok(studentService.getStudentsByClassAndSection(classId, sectionId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<StudentResponse>> search(@RequestParam String name) {
        return ResponseEntity.ok(studentService.searchStudents(name));
    }

    @GetMapping("/{id}/academic-history")
    public ResponseEntity<List<StudentAcademicHistory>> getAcademicHistory(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentAcademicHistory(id));
    }
}
