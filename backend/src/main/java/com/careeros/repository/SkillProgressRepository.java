package com.careeros.repository;

import com.careeros.domain.entity.SkillProgress;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillProgressRepository extends JpaRepository<SkillProgress, Long> {

    List<SkillProgress> findByUserIdOrderByUpdatedAtDesc(Long userId);
}
