package com.empresa.incidentes.infrastructure.adapter.in.dto;

import com.empresa.incidentes.domain.model.UsuarioRol;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record UpdateUsuarioRequest(
        @NotBlank String nombre,
        @NotNull UsuarioRol rol,
        @NotBlank String area,
        String numeroContacto,
        @NotNull Boolean activo,
        List<UUID> catalogoIds
) {
}
