package com.empresa.incidentes.domain.port.in;

import java.util.UUID;

public record AssignTicketTechnicianCommand(
        UUID ticketId,
        UUID tecnicoAsignadoId,
        String actorUsername,
        String actorRol
) {
}
