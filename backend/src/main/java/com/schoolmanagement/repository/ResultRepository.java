package com.schoolmanagement.repository;

import com.schoolmanagement.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByStudentId(Long studentId);
    List<Result> findByExaminationId(Long examinationId);
    List<Result> findByStudentIdAndExaminationId(Long studentId, Long examinationId);
    boolean existsByStudentIdAndExaminationIdAndSubjectId(Long studentId, Long examinationId, Long subjectId);
}
