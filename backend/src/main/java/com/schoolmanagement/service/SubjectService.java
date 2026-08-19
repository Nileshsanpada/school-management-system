package com.schoolmanagement.service;

import com.schoolmanagement.entity.Subject;
import com.schoolmanagement.repository.SubjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    private static final Logger logger = LoggerFactory.getLogger(SubjectService.class);

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public Subject getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));
    }

    public Subject createSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    public Subject updateSubject(Long id, Subject updated) {
        Subject existing = getSubjectById(id);
        existing.setName(updated.getName());
        existing.setCode(updated.getCode());
        return subjectRepository.save(existing);
    }

    public void deleteSubject(Long id) {
        Subject existing = getSubjectById(id);
        subjectRepository.delete(existing);
    }
}
