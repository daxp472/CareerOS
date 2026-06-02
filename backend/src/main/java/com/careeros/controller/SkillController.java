package com.careeros.controller;

import com.careeros.dto.ApiResponse;
import com.careeros.dto.skill.SkillRequest;
import com.careeros.dto.skill.SkillResponse;
import com.careeros.service.SkillService;
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
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<SkillResponse> create(@Valid @RequestBody SkillRequest request) {
        return ApiResponse.success("Skill saved", skillService.create(request));
    }

    @GetMapping
    public ApiResponse<List<SkillResponse>> list() {
        return ApiResponse.success(skillService.list());
    }

    @GetMapping("/{id}")
    public ApiResponse<SkillResponse> get(@PathVariable Long id) {
        return ApiResponse.success(skillService.get(id));
    }

    @PutMapping("/{id}")
    public ApiResponse<SkillResponse> update(@PathVariable Long id, @Valid @RequestBody SkillRequest request) {
        return ApiResponse.success("Skill updated", skillService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        skillService.delete(id);
        return ApiResponse.success("Skill deleted");
    }
}
