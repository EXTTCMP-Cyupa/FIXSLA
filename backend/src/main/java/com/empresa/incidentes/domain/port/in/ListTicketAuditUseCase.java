package com.empresa.incidentes.domain.port.in;

import com.empresa.incidentes.domain.model.TicketAudit;
import reactor.core.publisher.Flux;

import java.util.UUID;

public interface ListTicketAuditUseCase {

    Flux<TicketAudit> handle(UUID ticketId);
}
