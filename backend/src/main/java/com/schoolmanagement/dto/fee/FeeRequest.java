package com.schoolmanagement.dto.fee;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FeeRequest {
    @NotNull
    private Long studentId;
    @NotNull
    private Long academicYearId;
    @NotNull
    @Positive
    private Double totalAmount;
    @NotNull
    private LocalDate dueDate;
}
