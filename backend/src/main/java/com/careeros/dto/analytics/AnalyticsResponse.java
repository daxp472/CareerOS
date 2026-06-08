package com.careeros.dto.analytics;

import java.util.List;
import java.util.Map;

public record AnalyticsResponse(
        List<MonthlySeries> applicationsPerMonth,
        Map<String, Long> companyWiseStatistics,
        double successRate,
        double rejectionRate,
        double offerConversionRate) {

    public record MonthlySeries(String month, long applications, long offers, long rejections) {
    }
}
