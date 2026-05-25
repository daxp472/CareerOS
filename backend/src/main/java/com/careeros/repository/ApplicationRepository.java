package com.careeros.repository;

import com.careeros.domain.entity.Application;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ApplicationRepository extends JpaRepository<Application, Long>, JpaSpecificationExecutor<Application> {

    List<Application> findTop5ByUserIdOrderByUpdatedAtDesc(Long userId);

    long countByUserIdAndStatusIn(Long userId, java.util.Collection<com.careeros.domain.ApplicationStatus> statuses);

    long countByUserId(Long userId);
}
