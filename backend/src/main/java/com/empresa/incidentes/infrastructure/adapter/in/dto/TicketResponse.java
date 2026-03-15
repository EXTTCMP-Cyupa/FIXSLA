package com.empresa.incidentes.infrastructure.adapter.in.dto;

import com.empresa.incidentes.domain.model.TicketPriority;
import com.empresa.incidentes.domain.model.TicketStatus;

import java.time.Instant;
import java.util.UUID;

public record TicketResponse(
        UUID id,
        String codigo,
        String titulo,
        String descripcion,
        UUID solicitanteId,
        UUID tecnicoAsignadoId,
        UUID catalogoIncidenteId,
        TicketStatus estado,
        TicketPriority prioridad,
        Instant creadoEn,
        Instant actualizadoEn,
        Instant primeraRespuestaLimite,
        Instant resolucionLimite,
        Instant pendienteDesde,
        Long slaPausadoSegundos
) {
}
