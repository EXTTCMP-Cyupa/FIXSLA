package com.empresa.incidentes.infrastructure.adapter.in.dto;

public record LoginResponse(
        String accessToken,
        String tokenType,
        long expiresIn,
        String username,
        String role
) {
}
