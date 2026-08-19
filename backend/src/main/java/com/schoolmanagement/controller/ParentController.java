package com.schoolmanagement.controller;

import com.schoolmanagement.dto.attendance.AttendanceResponse;
import com.schoolmanagement.dto.fee.FeeResponse;
import com.schoolmanagement.dto.parent.ParentResponse;
import com.schoolmanagement.dto.result.ResultResponse;
import com.schoolmanagement.entity.User;
import com.schoolmanagement.repository.UserRepository;
import com.schoolmanagement.service.AttendanceService;
import com.schoolmanagement.service.FeeService;
import com.schoolmanagement.service.ParentService;
import com.schoolmanagement.service.ResultService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/parent")
public class ParentController {

    private final ParentService parentService;
    private final AttendanceService attendanceService;
    private final ResultService resultService;
    private final FeeService feeService;
    private final UserRepository userRepository;

    public ParentController(ParentService parentService, AttendanceService attendanceService, 
                            ResultService resultService, FeeService feeService, UserRepository userRepository) {
        this.parentService = parentService;
        this.attendanceService = attendanceService;
        this.resultService = resultService;
        this.feeService = feeService;
        this.userRepository = userRepository;
    }

    private User getLoggedInUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/profile")
    public ResponseEntity<ParentResponse> getProfile() {
        User user = getLoggedInUser();
        return ResponseEntity.ok(parentService.getParentByUserId(user.getId()));
    }

    @GetMapping("/child/{studentId}/attendance")
    public ResponseEntity<List<AttendanceResponse>> getChildAttendance(@PathVariable Long studentId) {
        User user = getLoggedInUser();
        parentService.verifyParentOwnership(user.getId(), studentId);
        return ResponseEntity.ok(attendanceService.getAttendanceByStudent(studentId));
    }

    @GetMapping("/child/{studentId}/attendance/percentage")
    public ResponseEntity<Map<String, Object>> getChildAttendancePercentage(@PathVariable Long studentId) {
        User user = getLoggedInUser();
        parentService.verifyParentOwnership(user.getId(), studentId);
        return ResponseEntity.ok(attendanceService.getAttendancePercentage(studentId));
    }

    @GetMapping("/child/{studentId}/results")
    public ResponseEntity<List<ResultResponse>> getChildResults(@PathVariable Long studentId) {
        User user = getLoggedInUser();
        parentService.verifyParentOwnership(user.getId(), studentId);
        return ResponseEntity.ok(resultService.getResultsByStudent(studentId));
    }

    @GetMapping("/child/{studentId}/fees")
    public ResponseEntity<List<FeeResponse>> getChildFees(@PathVariable Long studentId) {
        User user = getLoggedInUser();
        parentService.verifyParentOwnership(user.getId(), studentId);
        return ResponseEntity.ok(feeService.getFeesByStudent(studentId));
    }
}
