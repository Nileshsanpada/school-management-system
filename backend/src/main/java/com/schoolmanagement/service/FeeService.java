package com.schoolmanagement.service;

import com.schoolmanagement.dto.fee.FeeRequest;
import com.schoolmanagement.dto.fee.FeeResponse;
import com.schoolmanagement.entity.AcademicYear;
import com.schoolmanagement.entity.Fee;
import com.schoolmanagement.entity.Student;
import com.schoolmanagement.entity.enums.FeeStatus;
import com.schoolmanagement.repository.AcademicYearRepository;
import com.schoolmanagement.repository.FeeRepository;
import com.schoolmanagement.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeeService {

    private static final Logger logger = LoggerFactory.getLogger(FeeService.class);

    private final FeeRepository feeRepository;
    private final StudentRepository studentRepository;
    private final AcademicYearRepository academicYearRepository;

    public FeeService(FeeRepository feeRepository, StudentRepository studentRepository, AcademicYearRepository academicYearRepository) {
        this.feeRepository = feeRepository;
        this.studentRepository = studentRepository;
        this.academicYearRepository = academicYearRepository;
    }

    public FeeResponse createFee(FeeRequest request) {
        Student student = studentRepository.findById(request.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found"));
        AcademicYear academicYear = academicYearRepository.findById(request.getAcademicYearId()).orElseThrow(() -> new RuntimeException("Academic Year not found"));

        Fee fee = new Fee();
        fee.setStudent(student);
        fee.setAcademicYear(academicYear);
        fee.setTotalAmount(request.getTotalAmount());
        fee.setAmountPaid(0.0);
        fee.setOutstandingAmount(request.getTotalAmount());
        fee.setStatus(FeeStatus.PENDING);
        fee.setDueDate(request.getDueDate());

        fee = feeRepository.save(fee);
        return mapToResponse(fee);
    }

    public List<FeeResponse> getFeesByStudent(Long studentId) {
        return feeRepository.findByStudentId(studentId).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public FeeResponse getFeeById(Long id) {
        Fee fee = feeRepository.findById(id).orElseThrow(() -> new RuntimeException("Fee not found"));
        return mapToResponse(fee);
    }

    public List<FeeResponse> getOverdueFees() {
        return feeRepository.findByStatus(FeeStatus.OVERDUE).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private FeeResponse mapToResponse(Fee fee) {
        return FeeResponse.builder()
                .id(fee.getId())
                .studentId(fee.getStudent().getId())
                .studentName(fee.getStudent().getFirstName() + " " + fee.getStudent().getLastName())
                .academicYearName(fee.getAcademicYear().getName())
                .totalAmount(fee.getTotalAmount())
                .amountPaid(fee.getAmountPaid())
                .outstandingAmount(fee.getOutstandingAmount())
                .status(fee.getStatus().name())
                .dueDate(fee.getDueDate())
                .build();
    }
}
