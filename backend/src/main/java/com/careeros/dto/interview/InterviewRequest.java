package com.careeros.dto.interview;

import com.careeros.domain.InterviewOutcome;
import com.careeros.domain.InterviewType;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record InterviewRequest(
        @NotNull Long applicationId,
        LocalDateTime interviewDate,
        Integer roundNumber,
        @NotNull InterviewType interviewType,
        @NotNull InterviewOutcome outcome,
        String feedbackNotes) {
}
