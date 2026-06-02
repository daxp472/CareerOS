package com.careeros.domain.entity;

import com.careeros.domain.SkillCategory;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "skill_progress")
public class SkillProgress extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private SkillCategory category = SkillCategory.OTHER;

    @Column(nullable = false, length = 120)
    private String skillName;

    @Column(nullable = false)
    private Integer progressPercentage = 0;

    @Column(length = 1000)
    private String notes;

    private LocalDate targetDate;
}
