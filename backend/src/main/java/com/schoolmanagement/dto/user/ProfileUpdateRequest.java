package com.schoolmanagement.dto.user;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    @NotBlank(message = "Name cannot be blank")
    private String name;

    private String phone;
    private String address;
    private String qualification;

    private String currentPassword;
    private String newPassword;
}
