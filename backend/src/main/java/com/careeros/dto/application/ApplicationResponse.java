package com.careeros.dto.application;

import com.careeros.domain.ApplicationStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record ApplicationResponse(
        Long id,
        String companyName,
        String jobRole,
        BigDecimal packageCtc,
        String location,
        LocalDate applicationDate,
        LocalDate deadlineDate,
        ApplicationStatus status,
        String resumeVersionUsed,
        String referralInformation,
        String notes,
        String source,
        Instant createdAt,
        Instant updatedAt,
        List<InterviewSummary> interviews) {

    public record InterviewSummary(Long id, Integer roundNumber, String interviewType, String outcome, Instant interviewDate) {
    }
}
