package com.schoolmanagement.dto.examination;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExaminationRequest {
    @NotBlank
    private String name;
    @NotNull
    private LocalDate examDate;
    @NotNull
    private Long academicYearId;
    @NotNull
    private Long classId;
}
