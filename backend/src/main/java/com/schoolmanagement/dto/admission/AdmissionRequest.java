package com.schoolmanagement.dto.admission;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdmissionRequest {
    @NotBlank
    private String studentName;
    private LocalDate dateOfBirth;
    private String gender;
    @NotBlank
    private String parentName;
    @NotBlank
    @Email
    private String parentEmail;
    @NotBlank
    private String parentPhone;
    private String previousSchool;
    private LocalDate enquiryDate;
}
