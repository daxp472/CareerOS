package com.careeros.dto.interview;

import com.careeros.domain.InterviewOutcome;
import com.careeros.domain.InterviewType;
import java.time.Instant;
import java.time.LocalDateTime;

public record InterviewResponse(
        Long id,
        Long applicationId,
        LocalDateTime interviewDate,
        Integer roundNumber,
        InterviewType interviewType,
        InterviewOutcome outcome,
        String feedbackNotes,
        Instant createdAt) {
}
