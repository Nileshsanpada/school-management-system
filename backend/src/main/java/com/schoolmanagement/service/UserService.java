package com.schoolmanagement.service;

import com.schoolmanagement.dto.user.ProfileResponse;
import com.schoolmanagement.dto.user.ProfileUpdateRequest;
import com.schoolmanagement.entity.Parent;
import com.schoolmanagement.entity.Teacher;
import com.schoolmanagement.entity.User;
import com.schoolmanagement.entity.enums.Role;
import com.schoolmanagement.repository.ParentRepository;
import com.schoolmanagement.repository.TeacherRepository;
import com.schoolmanagement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    private final UserRepository userRepository;
    private final ParentRepository parentRepository;
    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, ParentRepository parentRepository, 
                       TeacherRepository teacherRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.parentRepository = parentRepository;
        this.teacherRepository = teacherRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ProfileResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        final Long userId = user.getId();
        String phone = "";
        String address = "";
        String qualification = "";
        String employeeId = "";

        if (user.getRole() == Role.PARENT) {
            Optional<Parent> parentOpt = parentRepository.findByEmail(email)
                    .or(() -> parentRepository.findByUserId(userId));
            if (parentOpt.isPresent()) {
                Parent p = parentOpt.get();
                phone = p.getPhone() != null ? p.getPhone() : "";
                address = p.getAddress() != null ? p.getAddress() : "";
            }
        } else if (user.getRole() == Role.TEACHER) {
            Optional<Teacher> teacherOpt = teacherRepository.findByEmail(email);
            if (teacherOpt.isPresent()) {
                Teacher t = teacherOpt.get();
                phone = t.getPhone() != null ? t.getPhone() : "";
                qualification = t.getQualification() != null ? t.getQualification() : "";
                employeeId = t.getEmployeeId() != null ? t.getEmployeeId() : "";
            }
        }

        String createdAtStr = user.getCreatedAt() != null ? user.getCreatedAt().format(DATE_FORMATTER) : "N/A";

        return ProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .phone(phone)
                .address(address)
                .qualification(qualification)
                .employeeId(employeeId)
                .createdAt(createdAtStr)
                .build();
    }

    @Transactional
    public ProfileResponse updateCurrentUserProfile(String email, ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        // 1. Update basic user details
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
        }

        // 2. Handle password change if requested
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                throw new RuntimeException("Current password is required to change password.");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("Current password is incorrect.");
            }
            if (request.getNewPassword().length() < 6) {
                throw new RuntimeException("New password must be at least 6 characters long.");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword().trim()));
            logger.info("Password successfully changed for user: {}", email);
        }

        user = userRepository.save(user);
        final Long userId = user.getId();
        final String updatedName = user.getName();

        // 3. Update role-specific entity
        if (user.getRole() == Role.PARENT) {
            Optional<Parent> parentOpt = parentRepository.findByEmail(email)
                    .or(() -> parentRepository.findByUserId(userId));
            if (parentOpt.isPresent()) {
                Parent p = parentOpt.get();
                p.setName(updatedName);
                if (request.getPhone() != null) p.setPhone(request.getPhone().trim());
                if (request.getAddress() != null) p.setAddress(request.getAddress().trim());
                parentRepository.save(p);
            }
        } else if (user.getRole() == Role.TEACHER) {
            Optional<Teacher> teacherOpt = teacherRepository.findByEmail(email);
            if (teacherOpt.isPresent()) {
                Teacher t = teacherOpt.get();
                t.setName(updatedName);
                if (request.getPhone() != null) t.setPhone(request.getPhone().trim());
                if (request.getQualification() != null) t.setQualification(request.getQualification().trim());
                teacherRepository.save(t);
            }
        }

        return getCurrentUserProfile(email);
    }
}
