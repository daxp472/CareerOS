package com.careeros.dto.interviewexperience;

import java.time.Instant;
import java.time.LocalDateTime;

public record InterviewExperienceResponse(
        Long id,
        String companyName,
        String questionsAsked,
        String topicsCovered,
        String learnings,
        String notes,
        LocalDateTime interviewDate,
        Instant createdAt,
        Instant updatedAt) {
}
