package com.careeros.controller;

import com.careeros.dto.ApiResponse;
import com.careeros.dto.interview.InterviewRequest;
import com.careeros.dto.interview.InterviewResponse;
import com.careeros.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<InterviewResponse> create(@Valid @RequestBody InterviewRequest request) {
        return ApiResponse.success("Interview added", interviewService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<InterviewResponse> update(@PathVariable Long id, @Valid @RequestBody InterviewRequest request) {
        return ApiResponse.success("Interview updated", interviewService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        interviewService.delete(id);
        return ApiResponse.success("Interview deleted");
    }
}
