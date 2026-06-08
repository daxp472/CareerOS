package com.careeros.service;

import com.careeros.domain.ApplicationStatus;
import com.careeros.dto.analytics.AnalyticsResponse;
import com.careeros.domain.entity.Application;
import com.careeros.repository.ApplicationRepository;
import com.careeros.security.CurrentUserService;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ApplicationRepository applicationRepository;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public AnalyticsResponse getAnalytics() {
        List<Application> applications = applicationRepository.findAll((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("user").get("id"), currentUserService.userId()));
        Map<YearMonth, List<Application>> byMonth = applications.stream().collect(java.util.stream.Collectors.groupingBy(application -> YearMonth.from(application.getApplicationDate() == null ? java.time.LocalDate.now() : application.getApplicationDate())));
        List<AnalyticsResponse.MonthlySeries> series = byMonth.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> {
                    long offers = entry.getValue().stream().filter(app -> app.getStatus() == ApplicationStatus.OFFER_RECEIVED || app.getStatus() == ApplicationStatus.SELECTED).count();
                    long rejections = entry.getValue().stream().filter(app -> app.getStatus() == ApplicationStatus.REJECTED).count();
                    return new AnalyticsResponse.MonthlySeries(entry.getKey().format(DateTimeFormatter.ofPattern("MMM yyyy")), entry.getValue().size(), offers, rejections);
                })
                .toList();
        Map<String, Long> companyStats = new LinkedHashMap<>();
        applications.stream().collect(java.util.stream.Collectors.groupingBy(Application::getCompanyName, java.util.stream.Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .forEach(entry -> companyStats.put(entry.getKey(), entry.getValue()));
        long total = applications.size();
        long selected = applications.stream().filter(app -> app.getStatus() == ApplicationStatus.SELECTED || app.getStatus() == ApplicationStatus.OFFER_RECEIVED).count();
        long rejected = applications.stream().filter(app -> app.getStatus() == ApplicationStatus.REJECTED).count();
        double successRate = total == 0 ? 0 : (selected * 100.0 / total);
        double rejectionRate = total == 0 ? 0 : (rejected * 100.0 / total);
        double offerConversionRate = total == 0 ? 0 : (applications.stream().filter(app -> app.getStatus() == ApplicationStatus.OFFER_RECEIVED).count() * 100.0 / total);
        return new AnalyticsResponse(series, companyStats, round(successRate), round(rejectionRate), round(offerConversionRate));
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
