package com.careeros.mapper;

import com.careeros.domain.entity.ActivityLog;
import com.careeros.domain.entity.Application;
import com.careeros.domain.entity.Interview;
import com.careeros.domain.entity.Reminder;
import com.careeros.domain.entity.Resume;
import com.careeros.domain.entity.User;
import com.careeros.dto.activity.ActivityResponse;
import com.careeros.dto.application.ApplicationResponse;
import com.careeros.dto.auth.ProfileResponse;
import com.careeros.dto.reminder.ReminderResponse;
import com.careeros.dto.resume.ResumeResponse;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class CareerOsMapper {

    public ProfileResponse toProfileResponse(User user) {
        return new ProfileResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole(), user.getPhone(), user.getDepartment(), user.getGraduationYear(), user.getCgpa(), user.getSkillSummary(), user.getDateOfBirth(), user.getCreatedAt());
    }

    public ApplicationResponse toApplicationResponse(Application application) {
        List<ApplicationResponse.InterviewSummary> interviews = application.getInterviews() == null ? List.of() : application.getInterviews().stream()
                .map(this::toInterviewSummary)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        return new ApplicationResponse(application.getId(), application.getCompanyName(), application.getJobRole(), application.getPackageCtc(), application.getLocation(), application.getApplicationDate(), application.getDeadlineDate(), application.getStatus(), application.getResumeVersionUsed(), application.getReferralInformation(), application.getNotes(), application.getSource(), application.getCreatedAt(), application.getUpdatedAt(), interviews);
    }

    public ApplicationResponse.InterviewSummary toInterviewSummary(Interview interview) {
        if (interview == null) {
            return null;
        }
        return new ApplicationResponse.InterviewSummary(interview.getId(), interview.getRoundNumber(), interview.getInterviewType().name(), interview.getOutcome().name(), interview.getInterviewDate() == null ? null : interview.getInterviewDate().toInstant(java.time.ZoneOffset.UTC));
    }

    public ReminderResponse toReminderResponse(Reminder reminder) {
        return new ReminderResponse(reminder.getId(), reminder.getTitle(), reminder.getDescription(), reminder.getReminderType(), reminder.getChannel(), reminder.getPriority(), reminder.getStatus(), reminder.getDueDate(), reminder.getCompletedAt(), reminder.getApplication() == null ? null : reminder.getApplication().getId());
    }

    public ActivityResponse toActivityResponse(ActivityLog activityLog) {
        return new ActivityResponse(activityLog.getId(), activityLog.getActivityType(), activityLog.getEntityType(), activityLog.getEntityId(), activityLog.getDescription(), activityLog.getMetadata(), activityLog.getCreatedAt());
    }

    public ResumeResponse toResumeResponse(Resume resume) {
        return new ResumeResponse(resume.getId(), resume.getOriginalFilename(), resume.getStoredFilename(), resume.getFilePath(), resume.getFileSize(), resume.getContentType(), resume.getVersionLabel(), resume.isDefaultResume(), resume.getCreatedAt());
    }
}
