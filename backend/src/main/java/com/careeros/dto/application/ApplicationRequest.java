package com.careeros.dto.application;

import com.careeros.domain.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ApplicationRequest(
        @NotBlank String companyName,
        @NotBlank String jobRole,
        BigDecimal packageCtc,
        String location,
        LocalDate applicationDate,
        LocalDate deadlineDate,
        @NotNull ApplicationStatus status,
        String resumeVersionUsed,
        String referralInformation,
        String notes,
        String source) {
}
