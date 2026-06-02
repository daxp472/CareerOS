package com.careeros.service;

import com.careeros.domain.ActivityType;
import com.careeros.domain.entity.SkillProgress;
import com.careeros.dto.skill.SkillRequest;
import com.careeros.dto.skill.SkillResponse;
import com.careeros.exception.ResourceNotFoundException;
import com.careeros.repository.SkillProgressRepository;
import com.careeros.security.CurrentUserService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillProgressRepository skillProgressRepository;
    private final CurrentUserService currentUserService;
    private final ActivityLogService activityLogService;

    @Transactional
    public SkillResponse create(SkillRequest request) {
        SkillProgress skill = new SkillProgress();
        apply(skill, request);
        skill.setUser(currentUserService.user());
        SkillProgress saved = skillProgressRepository.save(skill);
        activityLogService.record(saved.getUser(), ActivityType.SKILL, "Skill", String.valueOf(saved.getId()), "Skill created", saved.getSkillName());
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<SkillResponse> list() {
        return skillProgressRepository.findByUserIdOrderByUpdatedAtDesc(currentUserService.userId()).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public SkillResponse get(Long id) {
        SkillProgress skill = findOwned(id);
        return toResponse(skill);
    }

    @Transactional
    public SkillResponse update(Long id, SkillRequest request) {
        SkillProgress skill = findOwned(id);
        apply(skill, request);
        return toResponse(skillProgressRepository.save(skill));
    }

    @Transactional
    public void delete(Long id) {
        SkillProgress skill = findOwned(id);
        skillProgressRepository.delete(skill);
    }

    private SkillProgress findOwned(Long id) {
        SkillProgress skill = skillProgressRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
        if (!skill.getUser().getId().equals(currentUserService.userId()) && currentUserService.user().getRole() != com.careeros.domain.UserRole.ADMIN) {
            throw new ResourceNotFoundException("Skill not found");
        }
        return skill;
    }

    private void apply(SkillProgress skill, SkillRequest request) {
        skill.setCategory(request.category());
        skill.setSkillName(request.skillName());
        skill.setProgressPercentage(request.progressPercentage() == null ? 0 : request.progressPercentage());
        skill.setNotes(request.notes());
        skill.setTargetDate(request.targetDate());
    }

    private SkillResponse toResponse(SkillProgress skill) {
        return new SkillResponse(skill.getId(), skill.getCategory(), skill.getSkillName(), skill.getProgressPercentage(), skill.getNotes(), skill.getTargetDate(), skill.getCreatedAt(), skill.getUpdatedAt());
    }
}
