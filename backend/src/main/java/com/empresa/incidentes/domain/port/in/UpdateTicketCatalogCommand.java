package com.empresa.incidentes.domain.port.in;

import java.util.UUID;

public record UpdateTicketCatalogCommand(
        UUID ticketId,
        UUID catalogoIncidenteId,
        String actorUsername,
        String actorRol
) {
}
