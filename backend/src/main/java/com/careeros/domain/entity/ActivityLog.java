package com.careeros.domain.entity;

import com.careeros.domain.ActivityType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "activity_logs")
public class ActivityLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ActivityType activityType = ActivityType.SYSTEM;

    @Column(nullable = false, length = 80)
    private String entityType;

    @Column(length = 80)
    private String entityId;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(length = 2000)
    private String metadata;
}
