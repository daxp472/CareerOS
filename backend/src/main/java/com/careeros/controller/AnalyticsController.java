package com.careeros.controller;

import com.careeros.dto.ApiResponse;
import com.careeros.dto.analytics.AnalyticsResponse;
import com.careeros.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    public ApiResponse<AnalyticsResponse> analytics() {
        return ApiResponse.success(analyticsService.getAnalytics());
    }
}
