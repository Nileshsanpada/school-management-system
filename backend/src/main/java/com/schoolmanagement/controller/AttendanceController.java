package com.schoolmanagement.controller;

import com.schoolmanagement.dto.attendance.AttendanceRequest;
import com.schoolmanagement.dto.attendance.AttendanceResponse;
import com.schoolmanagement.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping
    public ResponseEntity<List<AttendanceResponse>> getAttendance(
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long sectionId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) date = LocalDate.now();
        if (classId != null && sectionId != null) {
            return ResponseEntity.ok(attendanceService.getAttendanceByClassSectionDate(classId, sectionId, date));
        } else if (classId != null) {
            return ResponseEntity.ok(attendanceService.getAttendanceByClassAndDate(classId, date));
        }
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(date));
    }

    @PostMapping
    public ResponseEntity<AttendanceResponse> markAttendance(@Valid @RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.markOrUpdateAttendance(request));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AttendanceResponse>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStudent(studentId));
    }

    @GetMapping("/student/{studentId}/percentage")
    public ResponseEntity<Map<String, Object>> getPercentage(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getAttendancePercentage(studentId));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<AttendanceResponse>> getByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(date));
    }

    @GetMapping("/low-attendance")
    public ResponseEntity<List<Map<String, Object>>> getLowAttendanceStudents() {
        return ResponseEntity.ok(attendanceService.getLowAttendanceStudents());
    }
}
