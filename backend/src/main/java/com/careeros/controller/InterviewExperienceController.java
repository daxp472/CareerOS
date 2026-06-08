package com.careeros.controller;

import com.careeros.dto.ApiResponse;
import com.careeros.dto.interviewexperience.InterviewExperienceRequest;
import com.careeros.dto.interviewexperience.InterviewExperienceResponse;
import com.careeros.service.InterviewExperienceService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/api/interview-experiences")
@RequiredArgsConstructor
public class InterviewExperienceController {

    private final InterviewExperienceService interviewExperienceService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<InterviewExperienceResponse> create(@Valid @RequestBody InterviewExperienceRequest request) {
        return ApiResponse.success("Interview experience saved", interviewExperienceService.create(request));
    }

    @GetMapping
    public ApiResponse<List<InterviewExperienceResponse>> list() {
        return ApiResponse.success(interviewExperienceService.list());
    }

    @GetMapping("/{id}")
    public ApiResponse<InterviewExperienceResponse> get(@PathVariable Long id) {
        return ApiResponse.success(interviewExperienceService.get(id));
    }

    @PutMapping("/{id}")
    public ApiResponse<InterviewExperienceResponse> update(@PathVariable Long id, @Valid @RequestBody InterviewExperienceRequest request) {
        return ApiResponse.success("Interview experience updated", interviewExperienceService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        interviewExperienceService.delete(id);
        return ApiResponse.success("Interview experience deleted");
    }
}
