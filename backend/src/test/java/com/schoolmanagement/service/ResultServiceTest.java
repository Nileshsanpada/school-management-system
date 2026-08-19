package com.schoolmanagement.service;

import com.schoolmanagement.dto.result.ResultRequest;
import com.schoolmanagement.dto.result.ResultResponse;
import com.schoolmanagement.entity.Examination;
import com.schoolmanagement.entity.Result;
import com.schoolmanagement.entity.Student;
import com.schoolmanagement.entity.Subject;
import com.schoolmanagement.repository.ExaminationRepository;
import com.schoolmanagement.repository.ResultRepository;
import com.schoolmanagement.repository.StudentRepository;
import com.schoolmanagement.repository.SubjectRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResultServiceTest {

    @Mock
    private ResultRepository resultRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private ExaminationRepository examinationRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @InjectMocks
    private ResultService resultService;

    @Test
    void createResult_shouldSaveResult() {
        Long studentId = 1L;
        Long examId = 1L;
        Long subjectId = 1L;
        
        Student student = new Student(); student.setId(studentId); student.setFirstName("John"); student.setLastName("Doe");
        Examination exam = new Examination(); exam.setId(examId); exam.setName("Mid Term");
        Subject subject = new Subject(); subject.setId(subjectId); subject.setName("Math");
        
        Result result = new Result();
        result.setId(1L);
        result.setStudent(student);
        result.setExamination(exam);
        result.setSubject(subject);
        result.setMarksObtained(85.0);
        result.setMaximumMarks(100.0);
        result.setGrade("A");
        
        ResultRequest request = new ResultRequest();
        request.setStudentId(studentId);
        request.setExaminationId(examId);
        request.setSubjectId(subjectId);
        request.setMarksObtained(85.0);
        request.setMaximumMarks(100.0);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(examinationRepository.findById(examId)).thenReturn(Optional.of(exam));
        when(subjectRepository.findById(subjectId)).thenReturn(Optional.of(subject));
        when(resultRepository.existsByStudentIdAndExaminationIdAndSubjectId(studentId, examId, subjectId)).thenReturn(false);
        when(resultRepository.save(any(Result.class))).thenReturn(result);

        ResultResponse savedResult = resultService.createResult(request);

        assertNotNull(savedResult);
        assertEquals("A", savedResult.getGrade());
        verify(resultRepository, times(1)).save(any(Result.class));
    }

    @Test
    void createResult_shouldThrowException_whenDuplicate() {
        Long studentId = 1L, examId = 1L, subjectId = 1L;
        
        ResultRequest request = new ResultRequest();
        request.setStudentId(studentId);
        request.setExaminationId(examId);
        request.setSubjectId(subjectId);
        request.setMarksObtained(85.0);
        request.setMaximumMarks(100.0);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(new Student()));
        when(examinationRepository.findById(examId)).thenReturn(Optional.of(new Examination()));
        when(subjectRepository.findById(subjectId)).thenReturn(Optional.of(new Subject()));
        when(resultRepository.existsByStudentIdAndExaminationIdAndSubjectId(studentId, examId, subjectId)).thenReturn(true);

        assertThrows(RuntimeException.class, () -> resultService.createResult(request));
        verify(resultRepository, never()).save(any(Result.class));
    }

    @Test
    void createResult_shouldThrowException_whenMarksExceedMaximum() {
        Long studentId = 1L, examId = 1L, subjectId = 1L;
        
        ResultRequest request = new ResultRequest();
        request.setStudentId(studentId);
        request.setExaminationId(examId);
        request.setSubjectId(subjectId);
        request.setMarksObtained(105.0);
        request.setMaximumMarks(100.0);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(new Student()));
        when(examinationRepository.findById(examId)).thenReturn(Optional.of(new Examination()));
        when(subjectRepository.findById(subjectId)).thenReturn(Optional.of(new Subject()));
        when(resultRepository.existsByStudentIdAndExaminationIdAndSubjectId(studentId, examId, subjectId)).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> resultService.createResult(request));
        verify(resultRepository, never()).save(any(Result.class));
    }
}
