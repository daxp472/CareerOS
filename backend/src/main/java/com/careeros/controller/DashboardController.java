package com.careeros.controller;

import com.careeros.dto.ApiResponse;
import com.careeros.dto.dashboard.DashboardResponse;
import com.careeros.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ApiResponse<DashboardResponse> summary() {
        return ApiResponse.success(dashboardService.summary());
    }
}
