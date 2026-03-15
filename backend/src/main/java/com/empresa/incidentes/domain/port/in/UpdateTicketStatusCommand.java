package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.TicketStatus;
import java.util.UUID;

public record UpdateTicketStatusCommand(
        UUID ticketId,
        TicketStatus nextStatus,
        UUID tecnicoAsignadoId
) {
}
