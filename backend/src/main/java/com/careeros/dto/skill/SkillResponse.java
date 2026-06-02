package com.careeros.dto.skill;

import com.careeros.domain.SkillCategory;
import java.time.Instant;
import java.time.LocalDate;

public record SkillResponse(
        Long id,
        SkillCategory category,
        String skillName,
        Integer progressPercentage,
        String notes,
        LocalDate targetDate,
        Instant createdAt,
        Instant updatedAt) {
}
