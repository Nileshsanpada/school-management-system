package com.schoolmanagement.repository;

import com.schoolmanagement.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByFeeStudentId(Long studentId);
    List<Payment> findByFeeId(Long feeId);
}
