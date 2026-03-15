package com.empresa.incidentes.domain.model;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public record TicketAudit(
        UUID id,
        UUID ticketId,
        TicketAuditAction accion,
        String detalle,
        String actorUsername,
        UsuarioRol actorRol,
        Instant fecha
) {

    public TicketAudit {
        id = Objects.requireNonNull(id, "El id de auditoría es obligatorio");
        ticketId = Objects.requireNonNull(ticketId, "El ticket es obligatorio");
        accion = Objects.requireNonNull(accion, "La acción es obligatoria");
        detalle = Objects.requireNonNull(detalle, "El detalle es obligatorio").trim();
        actorUsername = Objects.requireNonNull(actorUsername, "El actor es obligatorio").trim().toLowerCase();
        actorRol = Objects.requireNonNull(actorRol, "El rol del actor es obligatorio");
        fecha = Objects.requireNonNull(fecha, "La fecha es obligatoria");
    }

    public static TicketAudit create(
            UUID ticketId,
            TicketAuditAction accion,
            String detalle,
            String actorUsername,
            UsuarioRol actorRol,
            Instant fecha
    ) {
        return new TicketAudit(
                UUID.randomUUID(),
                ticketId,
                accion,
                detalle,
                actorUsername,
                actorRol,
                fecha
        );
    }

    public static TicketAudit reconstruct(
            UUID id,
            UUID ticketId,
            TicketAuditAction accion,
            String detalle,
            String actorUsername,
            UsuarioRol actorRol,
            Instant fecha
    ) {
        return new TicketAudit(id, ticketId, accion, detalle, actorUsername, actorRol, fecha);
    }
}
