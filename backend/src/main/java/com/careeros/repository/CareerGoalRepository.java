package com.careeros.repository;

import com.careeros.domain.entity.CareerGoal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerGoalRepository extends JpaRepository<CareerGoal, Long> {

    List<CareerGoal> findByUserIdOrderByUpdatedAtDesc(Long userId);
}
