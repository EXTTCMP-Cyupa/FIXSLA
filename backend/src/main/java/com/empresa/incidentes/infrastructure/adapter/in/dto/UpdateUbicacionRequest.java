package com.empresa.incidentes.infrastructure.adapter.in.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateUbicacionRequest(
        @NotBlank String nombre,
        String descripcion,
        @NotNull Boolean activo
) {
}
