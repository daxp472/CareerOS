package com.careeros.domain.entity;

import com.careeros.domain.InterviewOutcome;
import com.careeros.domain.InterviewType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "interviews")
public class Interview extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    private LocalDateTime interviewDate;

    private Integer roundNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private InterviewType interviewType = InterviewType.TECHNICAL;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InterviewOutcome outcome = InterviewOutcome.PENDING;

    @Column(length = 2000)
    private String feedbackNotes;
}
