package com.careeros.dto.admin;

public record PlatformStatsResponse(
        long totalUsers,
        long studentUsers,
        long adminUsers,
        long totalApplications,
        long totalInterviews,
        long totalResumes,
        long totalReminders,
        long totalActivities) {
}
