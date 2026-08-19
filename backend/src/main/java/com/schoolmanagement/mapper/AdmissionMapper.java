package com.schoolmanagement.mapper;

import com.schoolmanagement.dto.admission.AdmissionRequest;
import com.schoolmanagement.dto.admission.AdmissionResponse;
import com.schoolmanagement.entity.Admission;
import com.schoolmanagement.entity.enums.AdmissionStatus;
import com.schoolmanagement.entity.enums.Gender;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class AdmissionMapper {

    public Admission toEntity(AdmissionRequest request) {
        Admission admission = new Admission();
        admission.setStudentName(request.getStudentName());
        admission.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) {
            admission.setGender(Gender.valueOf(request.getGender().toUpperCase()));
        }
        admission.setParentName(request.getParentName());
        admission.setParentEmail(request.getParentEmail());
        admission.setParentPhone(request.getParentPhone());
        admission.setPreviousSchool(request.getPreviousSchool());
        admission.setEnquiryDate(request.getEnquiryDate() != null ? request.getEnquiryDate() : LocalDate.now());
        admission.setStatus(AdmissionStatus.NEW);
        return admission;
    }

    public AdmissionResponse toResponse(Admission admission) {
        return AdmissionResponse.builder()
                .id(admission.getId())
                .applicationNumber(admission.getApplicationNumber())
                .studentName(admission.getStudentName())
                .dateOfBirth(admission.getDateOfBirth())
                .gender(admission.getGender() != null ? admission.getGender().name() : null)
                .parentName(admission.getParentName())
                .parentEmail(admission.getParentEmail())
                .parentPhone(admission.getParentPhone())
                .previousSchool(admission.getPreviousSchool())
                .enquiryDate(admission.getEnquiryDate())
                .status(admission.getStatus() != null ? admission.getStatus().name() : null)
                .createdAt(admission.getCreatedAt())
                .build();
    }
}
