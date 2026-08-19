package com.schoolmanagement.entity;

import com.schoolmanagement.entity.enums.AdmissionStatus;
import com.schoolmanagement.entity.enums.Gender;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "admissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Admission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String applicationNumber;

    @Column(nullable = false)
    private String studentName;

    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(nullable = false)
    private String parentName;

    @Column(nullable = false)
    private String parentEmail;

    @Column(nullable = false)
    private String parentPhone;

    private String previousSchool;

    @Column(nullable = false)
    private LocalDate enquiryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdmissionStatus status = AdmissionStatus.NEW;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
