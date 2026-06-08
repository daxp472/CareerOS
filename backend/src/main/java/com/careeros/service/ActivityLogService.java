package com.careeros.service;

import com.careeros.domain.ActivityType;
import com.careeros.domain.entity.ActivityLog;
import com.careeros.domain.entity.User;
import com.careeros.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    @Transactional
    public void record(User user, ActivityType activityType, String entityType, String entityId, String description, String metadata) {
        ActivityLog activityLog = new ActivityLog();
        activityLog.setUser(user);
        activityLog.setActivityType(activityType);
        activityLog.setEntityType(entityType);
        activityLog.setEntityId(entityId);
        activityLog.setDescription(description);
        activityLog.setMetadata(metadata);
        activityLogRepository.save(activityLog);
    }
}
