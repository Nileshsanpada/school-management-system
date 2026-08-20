package com.schoolmanagement.controller;

import com.schoolmanagement.dto.user.ProfileResponse;
import com.schoolmanagement.dto.user.ProfileUpdateRequest;
import com.schoolmanagement.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.getCurrentUserProfile(email));
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.updateCurrentUserProfile(email, request));
    }
}
