package com.careeros.service;

import com.careeros.domain.ApplicationStatus;
import com.careeros.dto.dashboard.DashboardResponse;
import com.careeros.mapper.CareerOsMapper;
import com.careeros.repository.ActivityLogRepository;
import com.careeros.repository.ApplicationRepository;
import com.careeros.repository.InterviewRepository;
import com.careeros.repository.ReminderRepository;
import com.careeros.security.CurrentUserService;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ApplicationService applicationService;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final ReminderRepository reminderRepository;
    private final ActivityLogRepository activityLogRepository;
    private final CurrentUserService currentUserService;
    private final CareerOsMapper mapper;

    @Transactional(readOnly = true)
    public DashboardResponse summary() {
        Long userId = currentUserService.userId();
        long totalApplications = applicationService.countByUser(userId);
        long pendingApplications = applicationService.countByUserAndStatusIn(userId, List.of(ApplicationStatus.APPLIED, ApplicationStatus.OA_SCHEDULED, ApplicationStatus.OA_CLEARED, ApplicationStatus.INTERVIEW_SCHEDULED, ApplicationStatus.HR_ROUND));
        long interviewScheduled = applicationService.countByUserAndStatusIn(userId, List.of(ApplicationStatus.INTERVIEW_SCHEDULED, ApplicationStatus.HR_ROUND));
        long offersReceived = applicationService.countByUserAndStatusIn(userId, List.of(ApplicationStatus.OFFER_RECEIVED, ApplicationStatus.SELECTED));
        long rejectedApplications = applicationService.countByUserAndStatusIn(userId, List.of(ApplicationStatus.REJECTED));
        var upcomingDeadlines = reminderRepository.findByUserIdAndDueDateBetweenOrderByDueDateAsc(userId, LocalDateTime.now(), LocalDateTime.now().plusDays(14)).stream().map(mapper::toReminderResponse).toList();
        var recentActivities = activityLogRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId).stream().map(mapper::toActivityResponse).toList();
        var recentApplications = applicationService.recent(userId);
        return new DashboardResponse(totalApplications, pendingApplications, interviewScheduled, offersReceived, rejectedApplications, upcomingDeadlines, recentActivities, recentApplications);
    }
}
