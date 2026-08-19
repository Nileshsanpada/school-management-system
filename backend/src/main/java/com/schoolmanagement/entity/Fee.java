package com.schoolmanagement.entity;

import com.schoolmanagement.entity.enums.FeeStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "fees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Fee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @Column(nullable = false)
    private Double totalAmount;

    @Column(nullable = false)
    private Double amountPaid = 0.0;

    @Column(nullable = false)
    private Double outstandingAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FeeStatus status = FeeStatus.PENDING;

    @Column(nullable = false)
    private LocalDate dueDate;

    @OneToMany(mappedBy = "fee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Payment> payments;
}
