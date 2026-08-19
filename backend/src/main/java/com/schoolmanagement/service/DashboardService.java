package com.schoolmanagement.service;

import com.schoolmanagement.entity.enums.AdmissionStatus;
import com.schoolmanagement.entity.enums.FeeStatus;
import com.schoolmanagement.repository.AdmissionRepository;
import com.schoolmanagement.repository.AttendanceRepository;
import com.schoolmanagement.repository.FeeRepository;
import com.schoolmanagement.repository.StudentRepository;
import com.schoolmanagement.repository.TeacherRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final AdmissionRepository admissionRepository;
    private final AttendanceRepository attendanceRepository;
    private final FeeRepository feeRepository;
    private final AttendanceService attendanceService;

    public DashboardService(StudentRepository studentRepository, TeacherRepository teacherRepository, AdmissionRepository admissionRepository, AttendanceRepository attendanceRepository, FeeRepository feeRepository, AttendanceService attendanceService) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.admissionRepository = admissionRepository;
        this.attendanceRepository = attendanceRepository;
        this.feeRepository = feeRepository;
        this.attendanceService = attendanceService;
    }

    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalStudents", studentRepository.count());
        summary.put("totalTeachers", teacherRepository.count());
        summary.put("totalAdmissions", admissionRepository.count());
        summary.put("pendingAdmissions", admissionRepository.countByStatus(AdmissionStatus.NEW));
        summary.put("confirmedAdmissions", admissionRepository.countByStatus(AdmissionStatus.CONFIRMED));
        summary.put("todayAttendance", attendanceRepository.findByAttendanceDate(LocalDate.now()).size());
        
        Double totalFees = feeRepository.getTotalFees();
        summary.put("totalFees", totalFees != null ? totalFees : 0.0);
        
        Double totalCollected = feeRepository.getTotalCollected();
        summary.put("totalCollected", totalCollected != null ? totalCollected : 0.0);
        
        Double totalOutstanding = feeRepository.getTotalOutstanding();
        summary.put("totalOutstanding", totalOutstanding != null ? totalOutstanding : 0.0);
        
        summary.put("overdueCount", feeRepository.countByStatus(FeeStatus.OVERDUE));
        summary.put("lowAttendanceStudents", attendanceService.getLowAttendanceStudents());
        
        return summary;
    }
}
