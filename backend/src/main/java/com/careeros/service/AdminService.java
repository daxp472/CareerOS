package com.careeros.service;

import com.careeros.domain.UserRole;
import com.careeros.domain.entity.User;
import com.careeros.dto.admin.PlatformStatsResponse;
import com.careeros.dto.user.UserSummaryResponse;
import com.careeros.exception.ResourceNotFoundException;
import com.careeros.repository.ActivityLogRepository;
import com.careeros.repository.ApplicationRepository;
import com.careeros.repository.InterviewRepository;
import com.careeros.repository.ReminderRepository;
import com.careeros.repository.ResumeRepository;
import com.careeros.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final ResumeRepository resumeRepository;
    private final ReminderRepository reminderRepository;
    private final ActivityLogRepository activityLogRepository;

    @Transactional(readOnly = true)
    public List<UserSummaryResponse> users() {
        return userRepository.findAll().stream().map(user -> new UserSummaryResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole(), user.getDepartment(), user.getGraduationYear(), user.isEnabled(), user.getCreatedAt())).toList();
    }

    @Transactional(readOnly = true)
    public PlatformStatsResponse stats() {
        long totalUsers = userRepository.count();
        long studentUsers = userRepository.findAll().stream().filter(user -> user.getRole() == UserRole.STUDENT).count();
        long adminUsers = userRepository.findAll().stream().filter(user -> user.getRole() == UserRole.ADMIN).count();
        return new PlatformStatsResponse(totalUsers, studentUsers, adminUsers, applicationRepository.count(), interviewRepository.count(), resumeRepository.count(), reminderRepository.count(), activityLogRepository.count());
    }

    @Transactional
    public UserSummaryResponse toggleEnabled(Long userId, boolean enabled) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setEnabled(enabled);
        return toSummary(userRepository.save(user));
    }

    @Transactional
    public UserSummaryResponse updateRole(Long userId, UserRole role) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(role);
        return toSummary(userRepository.save(user));
    }

    private UserSummaryResponse toSummary(User user) {
        return new UserSummaryResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole(), user.getDepartment(), user.getGraduationYear(), user.isEnabled(), user.getCreatedAt());
    }
}
