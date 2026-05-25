package com.careeros.controller;

import com.careeros.dto.ApiResponse;
import com.careeros.dto.application.ApplicationFilterRequest;
import com.careeros.dto.application.ApplicationRequest;
import com.careeros.dto.application.ApplicationResponse;
import com.careeros.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ApplicationResponse> create(@Valid @RequestBody ApplicationRequest request) {
        return ApiResponse.success("Application created", applicationService.create(request));
    }

    @GetMapping
    public ApiResponse<Page<ApplicationResponse>> list(ApplicationFilterRequest filter, @PageableDefault(size = 20, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ApiResponse.success(applicationService.list(filter, pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<ApplicationResponse> get(@PathVariable Long id) {
        return ApiResponse.success(applicationService.get(id));
    }

    @PutMapping("/{id}")
    public ApiResponse<ApplicationResponse> update(@PathVariable Long id, @Valid @RequestBody ApplicationRequest request) {
        return ApiResponse.success("Application updated", applicationService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        applicationService.delete(id);
        return ApiResponse.success("Application deleted");
    }
}
