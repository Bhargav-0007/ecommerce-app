package com.appkhila.server.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${JWT_SECRET:appkhila-jwt-secret-key-minimum-32-chars-long!!}")
    private String secret;

    private static final long EXPIRY_MS = 7L * 24 * 60 * 60 * 1000;

    private SecretKey key() {
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(bytes);
    }

    public String generate(String email, String role) {
        return Jwts.builder()
            .subject(email)
            .claim("role", role)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + EXPIRY_MS))
            .signWith(key())
            .compact();
    }

    public String extractEmail(String token) {
        return parse(token).getPayload().getSubject();
    }

    public boolean isValid(String token) {
        try { parse(token); return true; } catch (Exception e) { return false; }
    }

    private Jws<Claims> parse(String token) {
        return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token);
    }
}
