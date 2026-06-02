package com.careeros.dto.goal;

import com.careeros.domain.GoalStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record GoalRequest(
        @NotBlank String title,
        String description,
        @NotNull GoalStatus status,
        @Min(0) @Max(100) Integer progressPercentage,
        LocalDate targetDate) {
}
