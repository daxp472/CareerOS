package com.careeros.controller;

import com.careeros.domain.UserRole;
import com.careeros.dto.ApiResponse;
import com.careeros.dto.activity.ActivityResponse;
import com.careeros.dto.admin.PlatformStatsResponse;
import com.careeros.dto.user.UserSummaryResponse;
import com.careeros.repository.ActivityLogRepository;
import com.careeros.service.AdminService;
import com.careeros.mapper.CareerOsMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final ActivityLogRepository activityLogRepository;
    private final CareerOsMapper mapper;

    @GetMapping("/users")
    public ApiResponse<List<UserSummaryResponse>> users() {
        return ApiResponse.success(adminService.users());
    }

    @GetMapping("/stats")
    public ApiResponse<PlatformStatsResponse> stats() {
        return ApiResponse.success(adminService.stats());
    }

    @PatchMapping("/users/{id}/enabled")
    public ApiResponse<UserSummaryResponse> toggleEnabled(@PathVariable Long id, @RequestParam boolean enabled) {
        return ApiResponse.success("User status updated", adminService.toggleEnabled(id, enabled));
    }

    @PatchMapping("/users/{id}/role")
    public ApiResponse<UserSummaryResponse> updateRole(@PathVariable Long id, @RequestParam UserRole role) {
        return ApiResponse.success("User role updated", adminService.updateRole(id, role));
    }

    @GetMapping("/activities")
    public ApiResponse<List<ActivityResponse>> activities() {
        return ApiResponse.success(activityLogRepository.findTop50ByOrderByCreatedAtDesc().stream().map(mapper::toActivityResponse).toList());
    }
}
