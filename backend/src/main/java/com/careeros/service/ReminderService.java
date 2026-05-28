package com.careeros.service;

import com.careeros.domain.ActivityType;
import com.careeros.domain.ReminderStatus;
import com.careeros.domain.entity.Application;
import com.careeros.domain.entity.Reminder;
import com.careeros.domain.entity.User;
import com.careeros.dto.reminder.ReminderRequest;
import com.careeros.dto.reminder.ReminderResponse;
import com.careeros.exception.ResourceNotFoundException;
import com.careeros.mapper.CareerOsMapper;
import com.careeros.repository.ApplicationRepository;
import com.careeros.repository.ReminderRepository;
import com.careeros.security.CurrentUserService;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final ApplicationRepository applicationRepository;
    private final CurrentUserService currentUserService;
    private final CareerOsMapper mapper;
    private final ActivityLogService activityLogService;

    @Transactional
    public ReminderResponse create(ReminderRequest request) {
        User user = currentUserService.user();
        Reminder reminder = new Reminder();
        applyRequest(reminder, user, request);
        Reminder saved = reminderRepository.save(reminder);
        activityLogService.record(user, ActivityType.REMINDER, "Reminder", String.valueOf(saved.getId()), "Reminder created", saved.getTitle());
        return mapper.toReminderResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReminderResponse> upcoming(Long userId, LocalDateTime from, LocalDateTime to) {
        LocalDateTime start = from == null ? LocalDateTime.now() : from;
        LocalDateTime end = to == null ? start.plusDays(30) : to;
        return reminderRepository.findByUserIdAndDueDateBetweenOrderByDueDateAsc(userId, start, end).stream().map(mapper::toReminderResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ReminderResponse> all(Long userId) {
        return reminderRepository.findByUserIdOrderByDueDateAsc(userId).stream().map(mapper::toReminderResponse).toList();
    }

    @Transactional(readOnly = true)
    public ReminderResponse get(Long reminderId) {
        Reminder reminder = reminderRepository.findById(reminderId).orElseThrow(() -> new ResourceNotFoundException("Reminder not found"));
        ensureOwner(reminder.getUser().getId());
        return mapper.toReminderResponse(reminder);
    }

    @Transactional
    public ReminderResponse update(Long reminderId, ReminderRequest request) {
        Reminder reminder = reminderRepository.findById(reminderId).orElseThrow(() -> new ResourceNotFoundException("Reminder not found"));
        ensureOwner(reminder.getUser().getId());
        applyRequest(reminder, reminder.getUser(), request);
        Reminder saved = reminderRepository.save(reminder);
        activityLogService.record(saved.getUser(), ActivityType.REMINDER, "Reminder", String.valueOf(saved.getId()), "Reminder updated", saved.getTitle());
        return mapper.toReminderResponse(saved);
    }

    @Transactional
    public void delete(Long reminderId) {
        Reminder reminder = reminderRepository.findById(reminderId).orElseThrow(() -> new ResourceNotFoundException("Reminder not found"));
        ensureOwner(reminder.getUser().getId());
        reminderRepository.delete(reminder);
        activityLogService.record(reminder.getUser(), ActivityType.REMINDER, "Reminder", String.valueOf(reminderId), "Reminder deleted", reminder.getTitle());
    }

    @Transactional
    public ReminderResponse markComplete(Long reminderId) {
        Reminder reminder = reminderRepository.findById(reminderId).orElseThrow(() -> new ResourceNotFoundException("Reminder not found"));
        ensureOwner(reminder.getUser().getId());
        reminder.setStatus(ReminderStatus.COMPLETED);
        reminder.setCompletedAt(LocalDateTime.now());
        Reminder saved = reminderRepository.save(reminder);
        activityLogService.record(saved.getUser(), ActivityType.REMINDER, "Reminder", String.valueOf(saved.getId()), "Reminder completed", saved.getTitle());
        return mapper.toReminderResponse(saved);
    }

    private void applyRequest(Reminder reminder, User user, ReminderRequest request) {
        reminder.setUser(user);
        if (request.applicationId() != null) {
            Application application = applicationRepository.findById(request.applicationId()).orElseThrow(() -> new ResourceNotFoundException("Application not found"));
            ensureOwner(application);
            reminder.setApplication(application);
        } else {
            reminder.setApplication(null);
        }
        reminder.setTitle(request.title());
        reminder.setDescription(request.description());
        reminder.setReminderType(request.reminderType());
        reminder.setChannel(request.channel());
        reminder.setPriority(request.priority());
        reminder.setStatus(request.status());
        reminder.setDueDate(request.dueDate());
        if (request.status() == ReminderStatus.COMPLETED && reminder.getCompletedAt() == null) {
            reminder.setCompletedAt(LocalDateTime.now());
        }
    }

    private void ensureOwner(Application application) {
        if (!application.getUser().getId().equals(currentUserService.userId()) && currentUserService.user().getRole() != com.careeros.domain.UserRole.ADMIN) {
            throw new ResourceNotFoundException("Application not found");
        }
    }

    private void ensureOwner(Long userId) {
        if (!userId.equals(currentUserService.userId()) && currentUserService.user().getRole() != com.careeros.domain.UserRole.ADMIN) {
            throw new ResourceNotFoundException("Reminder not found");
        }
    }
}
