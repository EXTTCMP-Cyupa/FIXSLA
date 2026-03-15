package com.empresa.incidentes.domain.port.in;

import java.util.UUID;

public record AddTicketNoteCommand(
        UUID ticketId,
        String nota,
        String actorUsername,
        String actorRol
) {
}
