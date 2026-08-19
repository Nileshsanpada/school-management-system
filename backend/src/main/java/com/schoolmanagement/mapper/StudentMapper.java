package com.schoolmanagement.mapper;

import com.schoolmanagement.dto.student.StudentResponse;
import com.schoolmanagement.entity.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {

    public StudentResponse toResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .studentId(student.getStudentId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .dateOfBirth(student.getDateOfBirth())
                .gender(student.getGender() != null ? student.getGender().name() : null)
                .email(student.getEmail())
                .phone(student.getPhone())
                .address(student.getAddress())
                .admissionDate(student.getAdmissionDate())
                .status(student.getStatus() != null ? student.getStatus().name() : null)
                .className(student.getCurrentClass() != null ? student.getCurrentClass().getName() : null)
                .sectionName(student.getCurrentSection() != null ? student.getCurrentSection().getName() : null)
                .academicYearName(student.getCurrentAcademicYear() != null ? student.getCurrentAcademicYear().getName() : null)
                .parentName(student.getParent() != null ? student.getParent().getName() : null)
                .createdAt(student.getCreatedAt())
                .build();
    }
}
