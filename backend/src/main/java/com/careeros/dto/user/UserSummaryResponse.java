package com.careeros.dto.user;

import com.careeros.domain.UserRole;
import java.time.Instant;

public record UserSummaryResponse(
        Long id,
        String fullName,
        String email,
        UserRole role,
        String department,
        Integer graduationYear,
        boolean enabled,
        Instant createdAt) {
}
