package com.careeros.controller;

import com.careeros.dto.ApiResponse;
import com.careeros.dto.questionbank.CompanyQuestionRequest;
import com.careeros.dto.questionbank.CompanyQuestionResponse;
import com.careeros.service.CompanyQuestionService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/company-question-bank")
@RequiredArgsConstructor
public class CompanyQuestionBankController {

    private final CompanyQuestionService companyQuestionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CompanyQuestionResponse> create(@Valid @RequestBody CompanyQuestionRequest request) {
        return ApiResponse.success("Question saved", companyQuestionService.create(request));
    }

    @GetMapping
    public ApiResponse<List<CompanyQuestionResponse>> list(@RequestParam(required = false) String companyName) {
        return ApiResponse.success(companyQuestionService.list(companyName));
    }

    @GetMapping("/{id}")
    public ApiResponse<CompanyQuestionResponse> get(@PathVariable Long id) {
        return ApiResponse.success(companyQuestionService.get(id));
    }

    @PutMapping("/{id}")
    public ApiResponse<CompanyQuestionResponse> update(@PathVariable Long id, @Valid @RequestBody CompanyQuestionRequest request) {
        return ApiResponse.success("Question updated", companyQuestionService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        companyQuestionService.delete(id);
        return ApiResponse.success("Question deleted");
    }
}
