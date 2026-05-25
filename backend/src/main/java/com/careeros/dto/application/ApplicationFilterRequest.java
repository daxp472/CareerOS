package com.careeros.dto.application;

import com.careeros.domain.ApplicationStatus;
import java.time.LocalDate;

public record ApplicationFilterRequest(
        String search,
        ApplicationStatus status,
        String companyName,
        LocalDate fromDate,
        LocalDate toDate) {
}
