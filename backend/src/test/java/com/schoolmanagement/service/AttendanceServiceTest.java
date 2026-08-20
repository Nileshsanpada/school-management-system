package com.schoolmanagement.service;

import com.schoolmanagement.dto.attendance.AttendanceRequest;
import com.schoolmanagement.dto.attendance.AttendanceResponse;
import com.schoolmanagement.entity.Attendance;
import com.schoolmanagement.entity.Student;
import com.schoolmanagement.entity.enums.AttendanceStatus;
import com.schoolmanagement.repository.AttendanceRepository;
import com.schoolmanagement.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceTest {

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private AttendanceService attendanceService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(attendanceService, "minimumPercentage", 75);
    }

    @Test
    void markAttendance_shouldSaveAttendance() {
        Long studentId = 1L;
        LocalDate date = LocalDate.now();
        
        AttendanceRequest request = new AttendanceRequest();
        request.setStudentId(studentId);
        request.setAttendanceDate(date);
        request.setStatus("PRESENT");
        request.setRemarks("On time");

        Student student = new Student();
        student.setId(studentId);
        student.setFirstName("John");
        student.setLastName("Doe");
        
        Attendance attendance = new Attendance();
        attendance.setId(1L);
        attendance.setStudent(student);
        attendance.setAttendanceDate(date);
        attendance.setStatus(AttendanceStatus.PRESENT);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(attendanceRepository.findByStudentIdAndAttendanceDate(studentId, date)).thenReturn(Optional.empty());
        when(attendanceRepository.save(any(Attendance.class))).thenReturn(attendance);

        AttendanceResponse result = attendanceService.markAttendance(request);

        assertNotNull(result);
        assertEquals("PRESENT", result.getStatus());
        verify(attendanceRepository, times(1)).save(any(Attendance.class));
    }

    @Test
    void markAttendance_shouldUpdateAttendance_whenExisting() {
        Long studentId = 1L;
        LocalDate date = LocalDate.now();
        
        AttendanceRequest request = new AttendanceRequest();
        request.setStudentId(studentId);
        request.setAttendanceDate(date);
        request.setStatus("LATE");
        request.setRemarks("Traffic");

        Student student = new Student();
        student.setId(studentId);
        student.setFirstName("John");
        student.setLastName("Doe");

        Attendance existingAttendance = new Attendance();
        existingAttendance.setId(1L);
        existingAttendance.setStudent(student);
        existingAttendance.setAttendanceDate(date);
        existingAttendance.setStatus(AttendanceStatus.PRESENT);

        Attendance updatedAttendance = new Attendance();
        updatedAttendance.setId(1L);
        updatedAttendance.setStudent(student);
        updatedAttendance.setAttendanceDate(date);
        updatedAttendance.setStatus(AttendanceStatus.LATE);
        updatedAttendance.setRemarks("Traffic");

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(attendanceRepository.findByStudentIdAndAttendanceDate(studentId, date)).thenReturn(Optional.of(existingAttendance));
        when(attendanceRepository.save(any(Attendance.class))).thenReturn(updatedAttendance);

        AttendanceResponse result = attendanceService.markAttendance(request);

        assertNotNull(result);
        assertEquals("LATE", result.getStatus());
        verify(attendanceRepository, times(1)).save(any(Attendance.class));
    }

    @Test
    void getAttendancePercentage_shouldCalculateCorrectly() {
        Long studentId = 1L;
        
        when(attendanceRepository.countByStudentId(studentId)).thenReturn(20L);
        when(attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.PRESENT)).thenReturn(15L);

        Map<String, Object> result = attendanceService.getAttendancePercentage(studentId);

        assertNotNull(result);
        assertEquals(75.0, result.get("percentage"));
        assertEquals(false, result.get("lowAttendance"));
    }
}
