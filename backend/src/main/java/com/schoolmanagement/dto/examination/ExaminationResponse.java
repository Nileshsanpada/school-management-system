package com.schoolmanagement.dto.examination;

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
public class ExaminationResponse {
    private Long id;
    private String name;
    private LocalDate examDate;
    private String academicYearName;
    private String className;
}
