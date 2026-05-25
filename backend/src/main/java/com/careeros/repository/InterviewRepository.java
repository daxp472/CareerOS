package com.careeros.repository;

import com.careeros.domain.entity.Interview;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findTop5ByApplicationUserIdOrderByInterviewDateAsc(Long userId);

    long countByApplicationUserId(Long userId);

    long countByApplicationUserIdAndInterviewDateAfter(Long userId, LocalDateTime dateTime);
}
