package com.careeros.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(
        @NotBlank String fullName,
        String phone,
        String department,
        Integer graduationYear,
        Double cgpa,
        String skillSummary,
        String dateOfBirth) {
}
