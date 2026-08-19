package com.schoolmanagement.service;

import com.schoolmanagement.dto.parent.ParentResponse;
import com.schoolmanagement.dto.student.StudentResponse;
import com.schoolmanagement.entity.Parent;
import com.schoolmanagement.entity.Student;
import com.schoolmanagement.entity.User;
import com.schoolmanagement.mapper.StudentMapper;
import com.schoolmanagement.repository.ParentRepository;
import com.schoolmanagement.repository.StudentRepository;
import com.schoolmanagement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ParentService {

    private static final Logger logger = LoggerFactory.getLogger(ParentService.class);

    private final ParentRepository parentRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final StudentMapper studentMapper;

    public ParentService(ParentRepository parentRepository, StudentRepository studentRepository, UserRepository userRepository, StudentMapper studentMapper) {
        this.parentRepository = parentRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.studentMapper = studentMapper;
    }

    public ParentResponse getParentByUserId(Long userId) {
        Parent parent = parentRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found for ID: " + userId));
                    Parent newParent = new Parent();
                    newParent.setName(user.getName());
                    newParent.setEmail(user.getEmail());
                    newParent.setUser(user);
                    return parentRepository.save(newParent);
                });

        List<StudentResponse> children = studentRepository.findByParentId(parent.getId()).stream()
                .map(studentMapper::toResponse)
                .collect(Collectors.toList());

        return ParentResponse.builder()
                .id(parent.getId())
                .name(parent.getName())
                .email(parent.getEmail())
                .phone(parent.getPhone())
                .address(parent.getAddress())
                .children(children)
                .build();
    }

    public void verifyParentOwnership(Long userId, Long studentId) {
        Parent parent = parentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Parent not found"));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (student.getParent() == null || !student.getParent().getId().equals(parent.getId())) {
            throw new AccessDeniedException("You are not authorized to access this student's information");
        }
    }
}
