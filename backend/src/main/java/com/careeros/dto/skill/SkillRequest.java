package com.careeros.dto.skill;

import com.careeros.domain.SkillCategory;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record SkillRequest(
        @NotNull SkillCategory category,
        @NotBlank String skillName,
        @Min(0) @Max(100) Integer progressPercentage,
        String notes,
        LocalDate targetDate) {
}
