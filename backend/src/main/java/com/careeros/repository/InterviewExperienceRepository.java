package com.careeros.repository;

import com.careeros.domain.entity.InterviewExperience;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewExperienceRepository extends JpaRepository<InterviewExperience, Long> {

    List<InterviewExperience> findByUserIdOrderByInterviewDateDescCreatedAtDesc(Long userId);
}
