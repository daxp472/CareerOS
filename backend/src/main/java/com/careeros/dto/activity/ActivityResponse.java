package com.careeros.dto.activity;

import com.careeros.domain.ActivityType;
import java.time.Instant;

public record ActivityResponse(
        Long id,
        ActivityType activityType,
        String entityType,
        String entityId,
        String description,
        String metadata,
        Instant createdAt) {
}
