package com.careeros.controller;

import com.careeros.dto.ApiResponse;
import com.careeros.dto.goal.GoalRequest;
import com.careeros.dto.goal.GoalResponse;
import com.careeros.service.GoalService;
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
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<GoalResponse> create(@Valid @RequestBody GoalRequest request) {
        return ApiResponse.success("Goal saved", goalService.create(request));
    }

    @GetMapping
    public ApiResponse<List<GoalResponse>> list() {
        return ApiResponse.success(goalService.list());
    }

    @GetMapping("/{id}")
    public ApiResponse<GoalResponse> get(@PathVariable Long id) {
        return ApiResponse.success(goalService.get(id));
    }

    @PutMapping("/{id}")
    public ApiResponse<GoalResponse> update(@PathVariable Long id, @Valid @RequestBody GoalRequest request) {
        return ApiResponse.success("Goal updated", goalService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        goalService.delete(id);
        return ApiResponse.success("Goal deleted");
    }
}
