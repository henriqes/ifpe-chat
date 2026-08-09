package com.ifpe.ifpe_chat.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.security.core.context.SecurityContextHolder;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;

public class JwtUtils {

	private static final String SECRET_KEY =
	        "IFPEChatSecureJwtSigningKey2026ForBackendApplication";

    private static final SecretKey KEY =
            Keys.hmacShaKeyFor(
                    SECRET_KEY.getBytes(StandardCharsets.UTF_8)
            );

    // 7 dias
    private static final long EXPIRATION_TIME =
            7 * 24 * 60 * 60 * 1000L;

    public static String generateToken(
            String username,
            String role) {

        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + EXPIRATION_TIME
                        )
                )
                .signWith(KEY)
                .compact();

    }

    public static Claims extractClaims(String token) {

        return Jwts.parser()
                .verifyWith(KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();

    }

    public static String extractUsername(String token) {

        return extractClaims(token).getSubject();

    }

    public static boolean isTokenValid(String token) {

        try {

            extractClaims(token);
            return true;

        } catch (JwtException | IllegalArgumentException e) {

            return false;

        }

    }

    public static String getAuthenticatedUsername() {

        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

    }

}