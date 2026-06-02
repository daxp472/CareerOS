package com.careeros.service;

import com.careeros.domain.ActivityType;
import com.careeros.domain.entity.CareerGoal;
import com.careeros.dto.goal.GoalRequest;
import com.careeros.dto.goal.GoalResponse;
import com.careeros.exception.ResourceNotFoundException;
import com.careeros.repository.CareerGoalRepository;
import com.careeros.security.CurrentUserService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final CareerGoalRepository careerGoalRepository;
    private final CurrentUserService currentUserService;
    private final ActivityLogService activityLogService;

    @Transactional
    public GoalResponse create(GoalRequest request) {
        CareerGoal goal = new CareerGoal();
        apply(goal, request);
        goal.setUser(currentUserService.user());
        CareerGoal saved = careerGoalRepository.save(goal);
        activityLogService.record(saved.getUser(), ActivityType.GOAL, "Goal", String.valueOf(saved.getId()), "Goal created", saved.getTitle());
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<GoalResponse> list() {
        return careerGoalRepository.findByUserIdOrderByUpdatedAtDesc(currentUserService.userId()).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public GoalResponse get(Long id) {
        return toResponse(findOwned(id));
    }

    @Transactional
    public GoalResponse update(Long id, GoalRequest request) {
        CareerGoal goal = findOwned(id);
        apply(goal, request);
        return toResponse(careerGoalRepository.save(goal));
    }

    @Transactional
    public void delete(Long id) {
        careerGoalRepository.delete(findOwned(id));
    }

    private CareerGoal findOwned(Long id) {
        CareerGoal goal = careerGoalRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Goal not found"));
        if (!goal.getUser().getId().equals(currentUserService.userId()) && currentUserService.user().getRole() != com.careeros.domain.UserRole.ADMIN) {
            throw new ResourceNotFoundException("Goal not found");
        }
        return goal;
    }

    private void apply(CareerGoal goal, GoalRequest request) {
        goal.setTitle(request.title());
        goal.setDescription(request.description());
        goal.setStatus(request.status());
        goal.setProgressPercentage(request.progressPercentage() == null ? 0 : request.progressPercentage());
        goal.setTargetDate(request.targetDate());
    }

    private GoalResponse toResponse(CareerGoal goal) {
        return new GoalResponse(goal.getId(), goal.getTitle(), goal.getDescription(), goal.getStatus(), goal.getProgressPercentage(), goal.getTargetDate(), goal.getCreatedAt(), goal.getUpdatedAt());
    }
}
