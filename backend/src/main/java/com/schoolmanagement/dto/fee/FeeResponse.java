package com.schoolmanagement.dto.fee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String academicYearName;
    private Double totalAmount;
    private Double amountPaid;
    private Double outstandingAmount;
    private String status;
    private LocalDate dueDate;
}
