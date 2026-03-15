package com.empresa.incidentes.infrastructure.adapter.in.dto;

import com.empresa.incidentes.domain.model.UsuarioRol;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record UsuarioResponse(
        UUID id,
        String username,
        String nombre,
        UsuarioRol rol,
        String area,
        List<UUID> catalogoIds,
        boolean activo,
        Instant creadoEn,
        Instant actualizadoEn
) {
}
