package com.careeros.service;

import com.careeros.domain.ActivityType;
import com.careeros.domain.entity.InterviewExperience;
import com.careeros.dto.interviewexperience.InterviewExperienceRequest;
import com.careeros.dto.interviewexperience.InterviewExperienceResponse;
import com.careeros.exception.ResourceNotFoundException;
import com.careeros.repository.InterviewExperienceRepository;
import com.careeros.security.CurrentUserService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InterviewExperienceService {

    private final InterviewExperienceRepository interviewExperienceRepository;
    private final CurrentUserService currentUserService;
    private final ActivityLogService activityLogService;

    @Transactional
    public InterviewExperienceResponse create(InterviewExperienceRequest request) {
        InterviewExperience experience = new InterviewExperience();
        apply(experience, request);
        experience.setUser(currentUserService.user());
        InterviewExperience saved = interviewExperienceRepository.save(experience);
        activityLogService.record(saved.getUser(), ActivityType.INTERVIEW_EXPERIENCE, "InterviewExperience", String.valueOf(saved.getId()), "Interview experience saved", saved.getCompanyName());
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<InterviewExperienceResponse> list() {
        return interviewExperienceRepository.findByUserIdOrderByInterviewDateDescCreatedAtDesc(currentUserService.userId()).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public InterviewExperienceResponse get(Long id) {
        return toResponse(findOwned(id));
    }

    @Transactional
    public InterviewExperienceResponse update(Long id, InterviewExperienceRequest request) {
        InterviewExperience experience = findOwned(id);
        apply(experience, request);
        return toResponse(interviewExperienceRepository.save(experience));
    }

    @Transactional
    public void delete(Long id) {
        interviewExperienceRepository.delete(findOwned(id));
    }

    private InterviewExperience findOwned(Long id) {
        InterviewExperience experience = interviewExperienceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Interview experience not found"));
        if (!experience.getUser().getId().equals(currentUserService.userId()) && currentUserService.user().getRole() != com.careeros.domain.UserRole.ADMIN) {
            throw new ResourceNotFoundException("Interview experience not found");
        }
        return experience;
    }

    private void apply(InterviewExperience experience, InterviewExperienceRequest request) {
        experience.setCompanyName(request.companyName());
        experience.setQuestionsAsked(request.questionsAsked());
        experience.setTopicsCovered(request.topicsCovered());
        experience.setLearnings(request.learnings());
        experience.setNotes(request.notes());
        experience.setInterviewDate(request.interviewDate());
    }

    private InterviewExperienceResponse toResponse(InterviewExperience experience) {
        return new InterviewExperienceResponse(experience.getId(), experience.getCompanyName(), experience.getQuestionsAsked(), experience.getTopicsCovered(), experience.getLearnings(), experience.getNotes(), experience.getInterviewDate(), experience.getCreatedAt(), experience.getUpdatedAt());
    }
}
