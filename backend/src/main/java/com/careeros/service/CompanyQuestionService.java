package com.careeros.service;

import com.careeros.domain.ActivityType;
import com.careeros.domain.entity.CompanyQuestion;
import com.careeros.dto.questionbank.CompanyQuestionRequest;
import com.careeros.dto.questionbank.CompanyQuestionResponse;
import com.careeros.exception.ResourceNotFoundException;
import com.careeros.repository.CompanyQuestionRepository;
import com.careeros.security.CurrentUserService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanyQuestionService {

    private final CompanyQuestionRepository companyQuestionRepository;
    private final CurrentUserService currentUserService;
    private final ActivityLogService activityLogService;

    @Transactional
    public CompanyQuestionResponse create(CompanyQuestionRequest request) {
        CompanyQuestion item = new CompanyQuestion();
        apply(item, request);
        item.setUser(currentUserService.user());
        CompanyQuestion saved = companyQuestionRepository.save(item);
        activityLogService.record(saved.getUser(), ActivityType.QUESTION_BANK, "Question", String.valueOf(saved.getId()), "Question saved", saved.getCompanyName());
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CompanyQuestionResponse> list(String companyName) {
        return (companyName == null || companyName.isBlank()
                ? companyQuestionRepository.findByUserIdOrderByCreatedAtDesc(currentUserService.userId())
                : companyQuestionRepository.findByUserIdAndCompanyNameContainingIgnoreCaseOrderByCreatedAtDesc(currentUserService.userId(), companyName)).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CompanyQuestionResponse get(Long id) {
        return toResponse(findOwned(id));
    }

    @Transactional
    public CompanyQuestionResponse update(Long id, CompanyQuestionRequest request) {
        CompanyQuestion item = findOwned(id);
        apply(item, request);
        return toResponse(companyQuestionRepository.save(item));
    }

    @Transactional
    public void delete(Long id) {
        companyQuestionRepository.delete(findOwned(id));
    }

    private CompanyQuestion findOwned(Long id) {
        CompanyQuestion item = companyQuestionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        if (!item.getUser().getId().equals(currentUserService.userId()) && currentUserService.user().getRole() != com.careeros.domain.UserRole.ADMIN) {
            throw new ResourceNotFoundException("Question not found");
        }
        return item;
    }

    private void apply(CompanyQuestion item, CompanyQuestionRequest request) {
        item.setCompanyName(request.companyName());
        item.setQuestion(request.question());
        item.setCategory(request.category());
        item.setDifficulty(request.difficulty());
        item.setTags(request.tags());
    }

    private CompanyQuestionResponse toResponse(CompanyQuestion item) {
        return new CompanyQuestionResponse(item.getId(), item.getCompanyName(), item.getQuestion(), item.getCategory(), item.getDifficulty(), item.getTags(), item.getCreatedAt(), item.getUpdatedAt());
    }
}
