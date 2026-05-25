package com.careeros.dto.auth;

import com.careeros.domain.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterRequest(
        @NotBlank String fullName,
        @Email @NotBlank String email,
        @NotBlank String password,
        String phone,
        String department,
        Integer graduationYear,
        Double cgpa,
        String skillSummary,
        @NotNull UserRole role) {
}
