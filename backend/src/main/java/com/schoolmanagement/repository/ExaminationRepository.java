package com.schoolmanagement.repository;

import com.schoolmanagement.entity.Examination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExaminationRepository extends JpaRepository<Examination, Long> {
    List<Examination> findByAcademicYearId(Long academicYearId);
    List<Examination> findBySchoolClassId(Long classId);
}
