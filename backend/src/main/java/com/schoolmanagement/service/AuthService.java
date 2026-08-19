package com.schoolmanagement.service;

import com.schoolmanagement.dto.auth.LoginRequest;
import com.schoolmanagement.dto.auth.LoginResponse;
import com.schoolmanagement.dto.auth.RegisterRequest;
import com.schoolmanagement.entity.Parent;
import com.schoolmanagement.entity.User;
import com.schoolmanagement.entity.enums.Role;
import com.schoolmanagement.exception.DuplicateResourceException;
import com.schoolmanagement.exception.ResourceNotFoundException;
import com.schoolmanagement.repository.ParentRepository;
import com.schoolmanagement.repository.UserRepository;
import com.schoolmanagement.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final ParentRepository parentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       ParentRepository parentRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.parentRepository = parentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        logger.info("User logged in: {}", user.getEmail());

        return LoginResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public String register(RegisterRequest request) {
        String sanitizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(sanitizedEmail)) {
            throw new DuplicateResourceException("Email already exists: " + sanitizedEmail);
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(sanitizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        if (request.getRole() == Role.PARENT) {
            Parent parent = new Parent();
            parent.setName(savedUser.getName());
            parent.setEmail(savedUser.getEmail());
            parent.setUser(savedUser);
            parentRepository.save(parent);
        }

        logger.info("User registered: {}", sanitizedEmail);

        return "User registered successfully";
    }
}
