package com.careeros.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "interview_experiences")
public class InterviewExperience extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 140)
    private String companyName;

    @Column(length = 5000)
    private String questionsAsked;

    @Column(length = 3000)
    private String topicsCovered;

    @Column(length = 3000)
    private String learnings;

    @Column(length = 5000)
    private String notes;

    private LocalDateTime interviewDate;
}
