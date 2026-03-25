package com.empresa.incidentes.infrastructure.adapter.in.dto;

import java.time.Instant;
import java.util.UUID;

public record UbicacionResponse(
        UUID id,
        String nombre,
        String descripcion,
        boolean activo,
        Instant creadoEn,
        Instant actualizadoEn
) {
}
