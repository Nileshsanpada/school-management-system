package com.schoolmanagement.repository;

import com.schoolmanagement.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findBySchoolClassId(Long classId);
    List<Section> findBySchoolClassIdAndAcademicYearId(Long classId, Long academicYearId);
    boolean existsByNameAndSchoolClassIdAndAcademicYearId(String name, Long classId, Long academicYearId);
}
