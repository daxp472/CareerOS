package com.careeros.repository;

import com.careeros.domain.entity.Reminder;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    List<Reminder> findByUserIdOrderByDueDateAsc(Long userId);

    List<Reminder> findByUserIdAndDueDateBetweenOrderByDueDateAsc(Long userId, LocalDateTime from, LocalDateTime to);

    List<Reminder> findTop10ByUserIdAndStatusOrderByDueDateAsc(Long userId, com.careeros.domain.ReminderStatus status);
}
