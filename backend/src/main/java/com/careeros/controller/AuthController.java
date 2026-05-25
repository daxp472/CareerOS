package com.careeros.controller;

import com.careeros.dto.ApiResponse;
import com.careeros.dto.auth.AuthResponse;
import com.careeros.dto.auth.ForgotPasswordRequest;
import com.careeros.dto.auth.LoginRequest;
import com.careeros.dto.auth.ProfileResponse;
import com.careeros.dto.auth.RegisterRequest;
import com.careeros.dto.auth.ResetPasswordRequest;
import com.careeros.dto.auth.UpdateProfileRequest;
import com.careeros.security.CurrentUserService;
import com.careeros.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CurrentUserService currentUserService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success("Account created", authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success("Login successful", authService.login(request));
    }

    @PostMapping("/forgot-password")
    public ApiResponse<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ApiResponse.success("Reset token generated", authService.forgotPassword(request));
    }

    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ApiResponse.success("Password reset successful");
    }

    @GetMapping("/me")
    public ApiResponse<ProfileResponse> me() {
        return ApiResponse.success(authService.profile(currentUserService.userId()));
    }

    @PatchMapping("/me")
    public ApiResponse<ProfileResponse> updateMe(@Valid @RequestBody UpdateProfileRequest request) {
        return ApiResponse.success("Profile updated", authService.updateProfile(currentUserService.userId(), request));
    }
}
