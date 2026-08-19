package com.schoolmanagement.dto.result;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String examinationName;
    private String subjectName;
    private Double marksObtained;
    private Double maximumMarks;
    private Double percentage;
    private String grade;
}
