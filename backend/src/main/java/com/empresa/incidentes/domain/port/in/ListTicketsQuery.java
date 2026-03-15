package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.TicketPriority;
import com.empresa.incidentes.domain.model.TicketStatus;
import java.util.UUID;

public record ListTicketsQuery(
        TicketStatus estado,
        TicketPriority prioridad,
        UUID solicitanteId,
        UUID tecnicoAsignadoId,
        UUID catalogoIncidenteId
) {
}
