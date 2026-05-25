package com.careeros.domain.entity;

import com.careeros.domain.UserRole;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(nullable = false, length = 120)
    private String fullName;

    @Column(nullable = false, unique = true, length = 160)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role = UserRole.STUDENT;

    @Column(length = 30)
    private String phone;

    @Column(length = 80)
    private String department;

    private Integer graduationYear;

    private Double cgpa;

    @Column(length = 250)
    private String skillSummary;

    private LocalDate dateOfBirth;

    private boolean enabled = true;
}
