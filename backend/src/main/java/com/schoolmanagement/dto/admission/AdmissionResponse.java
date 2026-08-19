package com.schoolmanagement.dto.admission;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdmissionResponse {
    private Long id;
    private String applicationNumber;
    private String studentName;
    private LocalDate dateOfBirth;
    private String gender;
    private String parentName;
    private String parentEmail;
    private String parentPhone;
    private String previousSchool;
    private LocalDate enquiryDate;
    private String status;
    private LocalDateTime createdAt;
}
