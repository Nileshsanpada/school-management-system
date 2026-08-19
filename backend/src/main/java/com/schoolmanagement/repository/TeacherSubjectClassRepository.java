package com.schoolmanagement.repository;

import com.schoolmanagement.entity.TeacherSubjectClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeacherSubjectClassRepository extends JpaRepository<TeacherSubjectClass, Long> {
    List<TeacherSubjectClass> findByTeacherId(Long teacherId);
    List<TeacherSubjectClass> findBySchoolClassIdAndAcademicYearId(Long classId, Long academicYearId);
    boolean existsByTeacherIdAndSubjectIdAndSchoolClassIdAndAcademicYearId(Long teacherId, Long subjectId, Long classId, Long academicYearId);
}
