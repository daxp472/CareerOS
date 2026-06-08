package com.careeros.repository;

import com.careeros.domain.entity.CompanyQuestion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyQuestionRepository extends JpaRepository<CompanyQuestion, Long> {

    List<CompanyQuestion> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<CompanyQuestion> findByUserIdAndCompanyNameContainingIgnoreCaseOrderByCreatedAtDesc(Long userId, String companyName);
}
