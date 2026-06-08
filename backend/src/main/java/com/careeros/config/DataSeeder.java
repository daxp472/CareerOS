package com.careeros.config;

import com.careeros.domain.UserRole;
import com.careeros.domain.entity.User;
import com.careeros.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail("admin@careeros.app")) {
            return;
        }
        User admin = new User();
        admin.setFullName("CareerOS Admin");
        admin.setEmail("admin@careeros.app");
        admin.setPasswordHash(passwordEncoder.encode("Admin@12345"));
        admin.setRole(UserRole.ADMIN);
        admin.setEnabled(true);
        userRepository.save(admin);
    }
}
