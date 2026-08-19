package com.schoolmanagement.repository;

import com.schoolmanagement.entity.StudentAcademicHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentAcademicHistoryRepository extends JpaRepository<StudentAcademicHistory, Long> {
    List<StudentAcademicHistory> findByStudentId(Long studentId);
    List<StudentAcademicHistory> findByStudentIdAndAcademicYearId(Long studentId, Long academicYearId);
}
