package com.schoolmanagement.util;

import com.schoolmanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Year;

@Component
public class StudentIdGenerator {

    @Autowired
    private StudentRepository studentRepository;

    public String generateStudentId() {
        int year = Year.now().getValue();
        long count = studentRepository.count();
        String studentId;
        do {
            count++;
            studentId = String.format("STU-%d-%04d", year, count);
        } while (studentRepository.existsByStudentId(studentId));
        return studentId;
    }
}
