package com.careeros.domain.entity;

import com.careeros.domain.QuestionDifficulty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "company_questions")
public class CompanyQuestion extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 140)
    private String companyName;

    @Column(nullable = false, length = 2000)
    private String question;

    @Column(length = 120)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private QuestionDifficulty difficulty = QuestionDifficulty.MEDIUM;

    @Column(length = 400)
    private String tags;
}
