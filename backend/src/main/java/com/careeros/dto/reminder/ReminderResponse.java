package com.careeros.dto.reminder;

import com.careeros.domain.ReminderChannel;
import com.careeros.domain.ReminderPriority;
import com.careeros.domain.ReminderStatus;
import com.careeros.domain.ReminderType;
import java.time.LocalDateTime;

public record ReminderResponse(
        Long id,
        String title,
        String description,
        ReminderType reminderType,
        ReminderChannel channel,
        ReminderPriority priority,
        ReminderStatus status,
        LocalDateTime dueDate,
        LocalDateTime completedAt,
        Long applicationId) {
}
