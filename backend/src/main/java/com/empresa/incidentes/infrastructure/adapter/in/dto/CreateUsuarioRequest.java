package com.empresa.incidentes.infrastructure.adapter.in.dto;

import com.empresa.incidentes.domain.model.UsuarioRol;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateUsuarioRequest(
        @NotBlank String username,
        @NotBlank String nombre,
        @NotNull UsuarioRol rol,
        @NotBlank String area
) {
}
