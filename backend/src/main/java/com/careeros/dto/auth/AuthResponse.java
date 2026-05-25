package com.careeros.dto.auth;

import com.careeros.domain.UserRole;

public record AuthResponse(
        String token,
        String tokenType,
        Long userId,
        String fullName,
        String email,
        UserRole role) {
}
