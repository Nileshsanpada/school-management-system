package com.schoolmanagement.dto.attendance;

import com.fasterxml.jackson.annotation.JsonAlias;
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
public class AttendanceRequest {
    @NotNull
    private Long studentId;

    @NotNull
    @JsonAlias({"date", "attendanceDate"})
    private LocalDate attendanceDate;

    @NotBlank
    private String status;

    private String remarks;

    public void setDate(LocalDate date) {
        this.attendanceDate = date;
    }
}
