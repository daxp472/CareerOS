package com.careeros.dto.dashboard;

import com.careeros.dto.activity.ActivityResponse;
import com.careeros.dto.application.ApplicationResponse;
import com.careeros.dto.reminder.ReminderResponse;
import java.util.List;

public record DashboardResponse(
        long totalApplications,
        long pendingApplications,
        long interviewScheduled,
        long offersReceived,
        long rejectedApplications,
        List<ReminderResponse> upcomingDeadlines,
        List<ActivityResponse> recentActivities,
        List<ApplicationResponse> recentApplications) {
}
