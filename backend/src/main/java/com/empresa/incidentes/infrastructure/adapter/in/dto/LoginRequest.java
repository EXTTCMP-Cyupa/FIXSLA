package com.empresa.incidentes.infrastructure.adapter.in.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank String username,
        @NotBlank String password,
        String role
) {
}
