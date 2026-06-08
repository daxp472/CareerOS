package com.careeros.dto.questionbank;

import com.careeros.domain.QuestionDifficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CompanyQuestionRequest(
        @NotBlank String companyName,
        @NotBlank String question,
        String category,
        @NotNull QuestionDifficulty difficulty,
        String tags) {
}
