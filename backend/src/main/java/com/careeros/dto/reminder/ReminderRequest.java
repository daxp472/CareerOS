package com.careeros.dto.reminder;

import com.careeros.domain.ReminderChannel;
import com.careeros.domain.ReminderPriority;
import com.careeros.domain.ReminderStatus;
import com.careeros.domain.ReminderType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record ReminderRequest(
        Long applicationId,
        @NotBlank String title,
        String description,
        @NotNull ReminderType reminderType,
        @NotNull ReminderChannel channel,
        @NotNull ReminderPriority priority,
        @NotNull ReminderStatus status,
        LocalDateTime dueDate) {
}
