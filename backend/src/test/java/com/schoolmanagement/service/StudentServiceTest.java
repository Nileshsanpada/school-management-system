package com.schoolmanagement.service;

import com.schoolmanagement.dto.student.StudentResponse;
import com.schoolmanagement.entity.Student;
import com.schoolmanagement.repository.StudentRepository;
import com.schoolmanagement.mapper.StudentMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private StudentMapper studentMapper;

    @InjectMocks
    private StudentService studentService;

    @Test
    void getAllStudents_shouldReturnStudentList() {
        Student student1 = new Student();
        student1.setId(1L);
        Student student2 = new Student();
        student2.setId(2L);
        
        StudentResponse dto1 = StudentResponse.builder().id(1L).firstName("John").build();
        StudentResponse dto2 = StudentResponse.builder().id(2L).firstName("Jane").build();

        when(studentRepository.findAll()).thenReturn(Arrays.asList(student1, student2));
        when(studentMapper.toResponse(student1)).thenReturn(dto1);
        when(studentMapper.toResponse(student2)).thenReturn(dto2);

        List<StudentResponse> result = studentService.getAllStudents();

        assertEquals(2, result.size());
        verify(studentRepository, times(1)).findAll();
    }

    @Test
    void getStudentById_shouldReturnStudent_whenExists() {
        Long studentId = 1L;
        Student student = new Student();
        student.setId(studentId);
        
        StudentResponse dto = StudentResponse.builder().id(studentId).firstName("John").build();

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(studentMapper.toResponse(student)).thenReturn(dto);

        StudentResponse result = studentService.getStudentById(studentId);

        assertNotNull(result);
        assertEquals(studentId, result.getId());
        verify(studentRepository, times(1)).findById(studentId);
    }

    @Test
    void getStudentById_shouldThrowException_whenNotFound() {
        Long studentId = 1L;
        when(studentRepository.findById(studentId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> studentService.getStudentById(studentId));
        verify(studentRepository, times(1)).findById(studentId);
    }

    @Test
    void searchStudents_shouldReturnFilteredResults() {
        String query = "Aarav";
        Student student = new Student();
        student.setFirstName("Aarav");
        
        StudentResponse dto = StudentResponse.builder().id(1L).firstName("Aarav").build();

        when(studentRepository.searchByName(query)).thenReturn(Arrays.asList(student));
        when(studentMapper.toResponse(student)).thenReturn(dto);

        List<StudentResponse> result = studentService.searchStudents(query);

        assertEquals(1, result.size());
        assertEquals("Aarav", result.get(0).getFirstName());
        verify(studentRepository, times(1)).searchByName(query);
    }
}
