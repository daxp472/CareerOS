package com.careeros.dto.goal;

import com.careeros.domain.GoalStatus;
import java.time.Instant;
import java.time.LocalDate;

public record GoalResponse(
        Long id,
        String title,
        String description,
        GoalStatus status,
        Integer progressPercentage,
        LocalDate targetDate,
        Instant createdAt,
        Instant updatedAt) {
}
