package com.careeros.domain.entity;

import com.careeros.domain.ApplicationStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "applications")
public class Application extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 140)
    private String companyName;

    @Column(nullable = false, length = 140)
    private String jobRole;

    private BigDecimal packageCtc;

    @Column(length = 120)
    private String location;

    private LocalDate applicationDate;

    private LocalDate deadlineDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(length = 60)
    private String resumeVersionUsed;

    @Column(length = 200)
    private String referralInformation;

    @Column(length = 1500)
    private String notes;

    @Column(length = 120)
    private String source;

    @OneToMany(mappedBy = "application")
    private List<Interview> interviews = new ArrayList<>();
}
