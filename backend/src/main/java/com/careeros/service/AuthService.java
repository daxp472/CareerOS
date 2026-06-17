package com.careeros.service;

import com.careeros.domain.ActivityType;
import com.careeros.domain.UserRole;
import com.careeros.domain.entity.PasswordResetToken;
import com.careeros.domain.entity.User;
import com.careeros.dto.auth.AuthResponse;
import com.careeros.dto.auth.ForgotPasswordRequest;
import com.careeros.dto.auth.LoginRequest;
import com.careeros.dto.auth.ProfileResponse;
import com.careeros.dto.auth.RegisterRequest;
import com.careeros.dto.auth.ResetPasswordRequest;
import com.careeros.dto.auth.UpdateProfileRequest;
import com.careeros.exception.BadRequestException;
import com.careeros.exception.ResourceNotFoundException;
import com.careeros.mapper.CareerOsMapper;
import com.careeros.repository.PasswordResetTokenRepository;
import com.careeros.repository.UserRepository;
import com.careeros.security.CareerOsUserDetailsService.CareerOsPrincipal;
import com.careeros.security.JwtService;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CareerOsMapper mapper;
    private final ActivityLogService activityLogService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email already registered");
        }

        if (request.role() == UserRole.ADMIN) {
            throw new BadRequestException("Registering as ADMIN is not permitted");
        }

        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(request.email().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(UserRole.STUDENT);
        user.setPhone(request.phone());
        user.setDepartment(request.department());
        user.setGraduationYear(request.graduationYear());
        user.setCgpa(request.cgpa());
        user.setSkillSummary(request.skillSummary());
        user.setEnabled(true);
        User saved = userRepository.save(user);
        activityLogService.record(saved, ActivityType.AUTH, "User", String.valueOf(saved.getId()), "User registered", saved.getEmail());
        String token = jwtService.generateToken(new CareerOsPrincipal(saved), saved.getId(), saved.getRole());
        return toAuthResponse(saved, token);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password()));
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String token = jwtService.generateToken(new CareerOsPrincipal(user), user.getId(), user.getRole());
        activityLogService.record(user, ActivityType.AUTH, "User", String.valueOf(user.getId()), "User logged in", user.getEmail());
        return toAuthResponse(user, token);
    }

    @Transactional
    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String token = UUID.randomUUID().toString().replace("-", "");
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setUser(user);
        passwordResetToken.setToken(token);
        passwordResetToken.setExpiresAt(Instant.now().plusSeconds(30 * 60));
        passwordResetTokenRepository.save(passwordResetToken);
        activityLogService.record(user, ActivityType.AUTH, "PasswordReset", token, "Password reset requested", user.getEmail());
        return token;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token = passwordResetTokenRepository.findByToken(request.token())
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));
        if (token.getUsedAt() != null || token.getExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException("Reset token expired or already used");
        }
        User user = token.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        token.setUsedAt(Instant.now());
        passwordResetTokenRepository.save(token);
        activityLogService.record(user, ActivityType.AUTH, "PasswordReset", String.valueOf(user.getId()), "Password reset completed", null);
    }

    @Transactional(readOnly = true)
    public ProfileResponse profile(Long userId) {
        return mapper.toProfileResponse(userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found")));
    }

    @Transactional
    public ProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setFullName(request.fullName());
        user.setPhone(request.phone());
        user.setDepartment(request.department());
        user.setGraduationYear(request.graduationYear());
        user.setCgpa(request.cgpa());
        user.setSkillSummary(request.skillSummary());
        if (request.dateOfBirth() != null && !request.dateOfBirth().isBlank()) {
            try {
                user.setDateOfBirth(LocalDate.parse(request.dateOfBirth()));
            } catch (DateTimeParseException exception) {
                throw new BadRequestException("Invalid dateOfBirth format. Use yyyy-MM-dd");
            }
        }
        User saved = userRepository.save(user);
        activityLogService.record(saved, ActivityType.AUTH, "User", String.valueOf(saved.getId()), "Profile updated", null);
        return mapper.toProfileResponse(saved);
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return new AuthResponse(token, "Bearer", user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }
}
