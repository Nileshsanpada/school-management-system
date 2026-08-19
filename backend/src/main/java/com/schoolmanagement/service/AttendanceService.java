package com.schoolmanagement.service;

import com.schoolmanagement.dto.attendance.AttendanceRequest;
import com.schoolmanagement.dto.attendance.AttendanceResponse;
import com.schoolmanagement.entity.Attendance;
import com.schoolmanagement.entity.Student;
import com.schoolmanagement.entity.enums.AttendanceStatus;
import com.schoolmanagement.repository.AttendanceRepository;
import com.schoolmanagement.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private static final Logger logger = LoggerFactory.getLogger(AttendanceService.class);

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    @Value("${attendance.minimum-percentage:75}")
    private int minimumPercentage;

    public AttendanceService(AttendanceRepository attendanceRepository, StudentRepository studentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    public AttendanceResponse markAttendance(AttendanceRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (attendanceRepository.existsByStudentIdAndAttendanceDate(request.getStudentId(), request.getAttendanceDate())) {
            throw new RuntimeException("Attendance already recorded for this student on this date");
        }

        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setAttendanceDate(request.getAttendanceDate());
        attendance.setStatus(AttendanceStatus.valueOf(request.getStatus().toUpperCase()));
        attendance.setRemarks(request.getRemarks());

        attendance = attendanceRepository.save(attendance);

        return mapToResponse(attendance);
    }

    public List<AttendanceResponse> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentId(studentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponse> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByAttendanceDate(date).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getAttendancePercentage(Long studentId) {
        long totalDays = attendanceRepository.countByStudentId(studentId);
        long presentDays = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.PRESENT);
        
        double percentage = totalDays > 0 ? (presentDays * 100.0 / totalDays) : 0;
        percentage = Math.round(percentage * 100.0) / 100.0;
        boolean lowAttendance = percentage < minimumPercentage;
        
        Map<String, Object> result = new HashMap<>();
        result.put("totalDays", totalDays);
        result.put("presentDays", presentDays);
        result.put("absentDays", totalDays - presentDays);
        result.put("percentage", percentage);
        result.put("lowAttendance", lowAttendance);
        result.put("minimumPercentage", minimumPercentage);
        return result;
    }

    public List<Map<String, Object>> getLowAttendanceStudents() {
        return studentRepository.findAll().stream()
                .map(student -> {
                    Map<String, Object> percentageData = getAttendancePercentage(student.getId());
                    if ((Boolean) percentageData.get("lowAttendance")) {
                        Map<String, Object> result = new HashMap<>(percentageData);
                        result.put("studentId", student.getId());
                        result.put("studentName", student.getFirstName() + " " + student.getLastName());
                        return result;
                    }
                    return null;
                })
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toList());
    }

    private AttendanceResponse mapToResponse(Attendance attendance) {
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .studentId(attendance.getStudent().getId())
                .studentName(attendance.getStudent().getFirstName() + " " + attendance.getStudent().getLastName())
                .attendanceDate(attendance.getAttendanceDate())
                .status(attendance.getStatus().name())
                .remarks(attendance.getRemarks())
                .build();
    }
}
