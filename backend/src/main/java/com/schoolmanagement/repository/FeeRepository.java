package com.schoolmanagement.repository;

import com.schoolmanagement.entity.Fee;
import com.schoolmanagement.entity.enums.FeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeeRepository extends JpaRepository<Fee, Long> {
    List<Fee> findByStudentId(Long studentId);
    List<Fee> findByStatus(FeeStatus status);
    List<Fee> findByStudentIdAndAcademicYearId(Long studentId, Long academicYearId);
    
    @Query("SELECT COALESCE(SUM(f.totalAmount), 0) FROM Fee f")
    Double getTotalFees();
    
    @Query("SELECT COALESCE(SUM(f.amountPaid), 0) FROM Fee f")
    Double getTotalCollected();
    
    @Query("SELECT COALESCE(SUM(f.outstandingAmount), 0) FROM Fee f")
    Double getTotalOutstanding();
    
    long countByStatus(FeeStatus status);
}
