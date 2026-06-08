package com.careeros.dto.interviewexperience;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public record InterviewExperienceRequest(
        @NotBlank String companyName,
        String questionsAsked,
        String topicsCovered,
        String learnings,
        String notes,
        LocalDateTime interviewDate) {
}
