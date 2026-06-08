package com.careeros.dto.questionbank;

import com.careeros.domain.QuestionDifficulty;
import java.time.Instant;

public record CompanyQuestionResponse(
        Long id,
        String companyName,
        String question,
        String category,
        QuestionDifficulty difficulty,
        String tags,
        Instant createdAt,
        Instant updatedAt) {
}
