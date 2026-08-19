package com.schoolmanagement.dto.result;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResultRequest {
    @NotNull
    private Long studentId;
    @NotNull
    private Long examinationId;
    @NotNull
    private Long subjectId;
    @NotNull
    @PositiveOrZero
    private Double marksObtained;
    @NotNull
    @Positive
    private Double maximumMarks;
}
