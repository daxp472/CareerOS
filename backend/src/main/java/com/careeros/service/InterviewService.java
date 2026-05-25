package com.careeros.service;

import com.careeros.domain.ActivityType;
import com.careeros.domain.entity.Application;
import com.careeros.domain.entity.Interview;
import com.careeros.domain.entity.User;
import com.careeros.dto.interview.InterviewRequest;
import com.careeros.dto.interview.InterviewResponse;
import com.careeros.exception.ResourceNotFoundException;
import com.careeros.repository.ApplicationRepository;
import com.careeros.repository.InterviewRepository;
import com.careeros.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final CurrentUserService currentUserService;
    private final ActivityLogService activityLogService;

    @Transactional
    public InterviewResponse create(InterviewRequest request) {
        Application application = applicationRepository.findById(request.applicationId()).orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        ensureOwner(application);
        Interview interview = new Interview();
        mapRequest(interview, request);
        interview.setApplication(application);
        Interview saved = interviewRepository.save(interview);
        activityLogService.record(currentUserService.user(), ActivityType.INTERVIEW, "Interview", String.valueOf(saved.getId()), "Interview scheduled", saved.getInterviewType().name());
        return toResponse(saved);
    }

    @Transactional
    public InterviewResponse update(Long id, InterviewRequest request) {
        Interview interview = interviewRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
        ensureOwner(interview.getApplication());
        mapRequest(interview, request);
        return toResponse(interviewRepository.save(interview));
    }

    @Transactional
    public void delete(Long id) {
        Interview interview = interviewRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
        ensureOwner(interview.getApplication());
        interviewRepository.delete(interview);
    }

    private void mapRequest(Interview interview, InterviewRequest request) {
        interview.setInterviewDate(request.interviewDate());
        interview.setRoundNumber(request.roundNumber());
        interview.setInterviewType(request.interviewType());
        interview.setOutcome(request.outcome());
        interview.setFeedbackNotes(request.feedbackNotes());
    }

    private InterviewResponse toResponse(Interview interview) {
        return new InterviewResponse(interview.getId(), interview.getApplication().getId(), interview.getInterviewDate(), interview.getRoundNumber(), interview.getInterviewType(), interview.getOutcome(), interview.getFeedbackNotes(), interview.getCreatedAt());
    }

    private void ensureOwner(Application application) {
        if (!application.getUser().getId().equals(currentUserService.userId()) && currentUserService.user().getRole() != com.careeros.domain.UserRole.ADMIN) {
            throw new ResourceNotFoundException("Application not found");
        }
    }
}
