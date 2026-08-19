package com.schoolmanagement.dto.parent;

import com.schoolmanagement.dto.student.StudentResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private List<StudentResponse> children;
}
