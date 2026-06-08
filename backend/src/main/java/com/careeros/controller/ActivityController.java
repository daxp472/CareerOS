package com.careeros.controller;

import com.careeros.dto.ApiResponse;
import com.careeros.dto.activity.ActivityResponse;
import com.careeros.repository.ActivityLogRepository;
import com.careeros.mapper.CareerOsMapper;
import com.careeros.security.CurrentUserService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityLogRepository activityLogRepository;
    private final CareerOsMapper mapper;
    private final CurrentUserService currentUserService;

    @GetMapping
    public ApiResponse<List<ActivityResponse>> timeline() {
        return ApiResponse.success(activityLogRepository.findTop10ByUserIdOrderByCreatedAtDesc(currentUserService.userId()).stream().map(mapper::toActivityResponse).toList());
    }
}
