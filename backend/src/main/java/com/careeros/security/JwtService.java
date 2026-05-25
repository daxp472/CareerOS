package com.careeros.security;

import com.careeros.config.AppProperties;
import com.careeros.domain.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import javax.crypto.SecretKey;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final AppProperties properties;
    private final SecretKey key;

    public JwtService(AppProperties properties) {
        this.properties = properties;
        byte[] rawSecret = properties.jwt().secret().getBytes(StandardCharsets.UTF_8);
        if (rawSecret.length >= 32) {
            this.key = Keys.hmacShaKeyFor(rawSecret);
        } else {
            this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(ensureBase64(properties.jwt().secret())));
        }
    }

    public String generateToken(UserDetails userDetails, Long userId, UserRole role) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(properties.jwt().expirationMinutes() * 60);
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .claims(Map.of("userId", userId, "role", role.name()))
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        return extractUsername(token).equals(userDetails.getUsername()) && extractClaims(token).getExpiration().after(new Date());
    }

    public Long extractUserId(String token) {
        Object value = extractClaims(token).get("userId");
        return value instanceof Number number ? number.longValue() : Long.valueOf(value.toString());
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private String ensureBase64(String secret) {
        return java.util.Base64.getEncoder().encodeToString(secret.getBytes(StandardCharsets.UTF_8));
    }
}
