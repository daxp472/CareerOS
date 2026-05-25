package com.careeros.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(String frontendUrl, String uploadDir, Jwt jwt) {

    public record Jwt(String secret, long expirationMinutes) {
    }
}
