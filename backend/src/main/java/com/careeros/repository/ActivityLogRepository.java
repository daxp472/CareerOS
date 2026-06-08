package com.careeros.repository;

import com.careeros.domain.entity.ActivityLog;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);

    List<ActivityLog> findTop50ByOrderByCreatedAtDesc();
}
