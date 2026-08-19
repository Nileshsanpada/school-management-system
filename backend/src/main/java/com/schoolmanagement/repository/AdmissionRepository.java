package com.schoolmanagement.repository;

import com.schoolmanagement.entity.Admission;
import com.schoolmanagement.entity.enums.AdmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdmissionRepository extends JpaRepository<Admission, Long> {
    Optional<Admission> findByApplicationNumber(String applicationNumber);
    boolean existsByApplicationNumber(String applicationNumber);
    List<Admission> findByStatus(AdmissionStatus status);
    long countByStatus(AdmissionStatus status);
}
