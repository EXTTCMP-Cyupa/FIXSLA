package com.empresa.incidentes.infrastructure.adapter.in.dto;

import com.empresa.incidentes.domain.model.TicketPriority;

import java.time.Instant;
import java.util.UUID;

public record CatalogoIncidenteResponse(
        UUID id,
        String nombre,
        String descripcion,
        TicketPriority prioridadPorDefecto,
        boolean activo,
        Instant creadoEn,
        Instant actualizadoEn
) {
}
