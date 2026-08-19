package com.schoolmanagement.dto.academic;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SectionRequest {
    @NotBlank
    private String name;

    @NotNull
    private Long classId;

    @NotNull
    private Long academicYearId;
}
