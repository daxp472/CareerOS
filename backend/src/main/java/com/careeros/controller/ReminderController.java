package com.careeros.controller;

import com.careeros.dto.ApiResponse;
import com.careeros.dto.reminder.ReminderRequest;
import com.careeros.dto.reminder.ReminderResponse;
import com.careeros.security.CurrentUserService;
import com.careeros.service.ReminderService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;
    private final CurrentUserService currentUserService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ReminderResponse> create(@Valid @RequestBody ReminderRequest request) {
        return ApiResponse.success("Reminder created", reminderService.create(request));
    }

    @GetMapping("/{id}")
    public ApiResponse<ReminderResponse> get(@PathVariable Long id) {
        return ApiResponse.success(reminderService.get(id));
    }

    @PutMapping("/{id}")
    public ApiResponse<ReminderResponse> update(@PathVariable Long id, @Valid @RequestBody ReminderRequest request) {
        return ApiResponse.success("Reminder updated", reminderService.update(id, request));
    }

    @PutMapping("/{id}/complete")
    public ApiResponse<ReminderResponse> complete(@PathVariable Long id) {
        return ApiResponse.success("Reminder completed", reminderService.markComplete(id));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        reminderService.delete(id);
        return ApiResponse.success("Reminder deleted");
    }

    @GetMapping
    public ApiResponse<List<ReminderResponse>> all() {
        return ApiResponse.success(reminderService.all(currentUserService.userId()));
    }

    @GetMapping("/upcoming")
    public ApiResponse<List<ReminderResponse>> upcoming(@RequestParam(required = false) LocalDateTime from, @RequestParam(required = false) LocalDateTime to) {
        return ApiResponse.success(reminderService.upcoming(currentUserService.userId(), from, to));
    }
}
