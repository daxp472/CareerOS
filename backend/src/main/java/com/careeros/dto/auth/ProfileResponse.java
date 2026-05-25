package com.careeros.dto.auth;

import com.careeros.domain.UserRole;
import java.time.Instant;
import java.time.LocalDate;

public record ProfileResponse(
        Long id,
        String fullName,
        String email,
        UserRole role,
        String phone,
        String department,
        Integer graduationYear,
        Double cgpa,
        String skillSummary,
        LocalDate dateOfBirth,
        Instant createdAt) {
}
