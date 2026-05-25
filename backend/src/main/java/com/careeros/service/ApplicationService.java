package com.careeros.service;

import com.careeros.domain.ActivityType;
import com.careeros.domain.ApplicationStatus;
import com.careeros.domain.entity.Application;
import com.careeros.domain.entity.User;
import com.careeros.dto.application.ApplicationFilterRequest;
import com.careeros.dto.application.ApplicationRequest;
import com.careeros.dto.application.ApplicationResponse;
import com.careeros.exception.ResourceNotFoundException;
import com.careeros.mapper.CareerOsMapper;
import com.careeros.repository.ApplicationRepository;
import com.careeros.repository.InterviewRepository;
import com.careeros.security.CurrentUserService;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final CurrentUserService currentUserService;
    private final CareerOsMapper mapper;
    private final ActivityLogService activityLogService;

    @Transactional
    public ApplicationResponse create(ApplicationRequest request) {
        User user = currentUserService.user();
        Application application = new Application();
        mapRequest(application, request);
        application.setUser(user);
        Application saved = applicationRepository.save(application);
        activityLogService.record(user, ActivityType.APPLICATION, "Application", String.valueOf(saved.getId()), "Application created for " + saved.getCompanyName(), saved.getStatus().name());
        return mapper.toApplicationResponse(saved);
    }

    @Transactional(readOnly = true)
    public ApplicationResponse get(Long id) {
        Application application = applicationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        ensureOwner(application);
        return mapper.toApplicationResponse(application);
    }

    @Transactional(readOnly = true)
    public Page<ApplicationResponse> list(ApplicationFilterRequest filter, Pageable pageable) {
        Long userId = currentUserService.userId();
        Specification<Application> specification = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get("user").get("id"), userId));
            if (filter != null) {
                if (filter.search() != null && !filter.search().isBlank()) {
                    String like = "%" + filter.search().toLowerCase() + "%";
                    predicates.add(criteriaBuilder.or(
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("companyName")), like),
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("jobRole")), like),
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("notes")), like)));
                }
                if (filter.status() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("status"), filter.status()));
                }
                if (filter.companyName() != null && !filter.companyName().isBlank()) {
                    predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("companyName")), "%" + filter.companyName().toLowerCase() + "%"));
                }
                if (filter.fromDate() != null) {
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("applicationDate"), filter.fromDate()));
                }
                if (filter.toDate() != null) {
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("applicationDate"), filter.toDate()));
                }
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        return applicationRepository.findAll(specification, pageable).map(mapper::toApplicationResponse);
    }

    @Transactional
    public ApplicationResponse update(Long id, ApplicationRequest request) {
        Application application = applicationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        ensureOwner(application);
        mapRequest(application, request);
        Application saved = applicationRepository.save(application);
        activityLogService.record(saved.getUser(), ActivityType.APPLICATION, "Application", String.valueOf(saved.getId()), "Application updated", saved.getStatus().name());
        return mapper.toApplicationResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        Application application = applicationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        ensureOwner(application);
        applicationRepository.delete(application);
        activityLogService.record(application.getUser(), ActivityType.APPLICATION, "Application", String.valueOf(id), "Application deleted", application.getCompanyName());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> recent(Long userId) {
        return applicationRepository.findTop5ByUserIdOrderByUpdatedAtDesc(userId).stream().map(mapper::toApplicationResponse).toList();
    }

    @Transactional(readOnly = true)
    public long countByUserAndStatusIn(Long userId, List<ApplicationStatus> statuses) {
        return applicationRepository.countByUserIdAndStatusIn(userId, statuses);
    }

    @Transactional(readOnly = true)
    public long countByUser(Long userId) {
        return applicationRepository.countByUserId(userId);
    }

    private void ensureOwner(Application application) {
        if (!application.getUser().getId().equals(currentUserService.userId()) && currentUserService.user().getRole() != com.careeros.domain.UserRole.ADMIN) {
            throw new ResourceNotFoundException("Application not found");
        }
    }

    private void mapRequest(Application application, ApplicationRequest request) {
        application.setCompanyName(request.companyName());
        application.setJobRole(request.jobRole());
        application.setPackageCtc(request.packageCtc());
        application.setLocation(request.location());
        application.setApplicationDate(request.applicationDate());
        application.setDeadlineDate(request.deadlineDate());
        application.setStatus(request.status() == null ? ApplicationStatus.APPLIED : request.status());
        application.setResumeVersionUsed(request.resumeVersionUsed());
        application.setReferralInformation(request.referralInformation());
        application.setNotes(request.notes());
        application.setSource(request.source());
    }
}
