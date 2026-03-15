package com.empresa.incidentes.infrastructure.adapter.in.dto;

import com.empresa.incidentes.domain.model.TicketAuditAction;
import com.empresa.incidentes.domain.model.UsuarioRol;

import java.time.Instant;
import java.util.UUID;

public record TicketAuditResponse(
        UUID id,
        UUID ticketId,
        TicketAuditAction accion,
        String detalle,
        String actorUsername,
        UsuarioRol actorRol,
        Instant fecha
) {
}
