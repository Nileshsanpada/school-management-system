package com.schoolmanagement.repository;

import com.schoolmanagement.entity.Attendance;
import com.schoolmanagement.entity.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentId(Long studentId);
    List<Attendance> findByAttendanceDate(LocalDate date);
    List<Attendance> findByStudentIdAndAttendanceDateBetween(Long studentId, LocalDate start, LocalDate end);
    boolean existsByStudentIdAndAttendanceDate(Long studentId, LocalDate date);
    long countByStudentId(Long studentId);
    long countByStudentIdAndStatus(Long studentId, AttendanceStatus status);
    
    @Query("SELECT a FROM Attendance a WHERE a.student.currentClass.id = :classId AND a.attendanceDate = :date")
    List<Attendance> findByClassAndDate(@Param("classId") Long classId, @Param("date") LocalDate date);
}
